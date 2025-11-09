# pip install sentence-transformers psycopg2-binary rapidfuzz flashtext python-dateutil
# pgvector extension should be enabled in your Postgres
# CREATE EXTENSION IF NOT EXISTS vector;

# matcher.py
from __future__ import annotations
import os
import math
import json
import uuid
import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from datetime import date, datetime
from dateutil.relativedelta import relativedelta

import psycopg2
import psycopg2.extras
from sentence_transformers import SentenceTransformer
from flashtext import KeywordProcessor
from rapidfuzz import process, fuzz

# ----------------------------
# Config
# ----------------------------
PG_DSN = os.getenv("PG_DSN", "dbname=research_app user=postgres password=postgres host=localhost port=5432")
EMBEDDING_DIM = 384  # MiniLM-L6-v2
ANN_LISTS = 100      # IVF lists for pgvector index (DB-side)
DEFAULT_K_ANN = 200
DEFAULT_K_BM25 = 100

# Weights for the scalar target (tune via grid search later)
W_ACCEPT = 0.35
W_PERF   = 0.45
W_FIT    = 0.20

# ----------------------------
# Models & taxonomy
# ----------------------------
# Load once per process
_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Minimal example taxonomy. Replace with your JSON file/path or DB table.
# Each canonical key has synonyms for cheap, interpretable matching.
SKILL_TAXONOMY = {
    "python": ["py", "python3"],
    "pytorch": ["torch", "pytorch lightning", "torchscript"],
    "tensorflow": ["tf", "keras"],
    "signal processing": ["dsp", "fourier", "spectral analysis"],
    "machine learning": ["ml", "supervised learning", "unsupervised learning"],
    "data analysis": ["pandas", "numpy", "data wrangling"],
    "computer vision": ["cv", "opencv", "image processing"],
    "nlp": ["natural language processing", "text mining"],
    "graph neural networks": ["gnn", "graph nets"],
    "matlab": [],
    "c++": ["cpp"],
    "latex": [],
}

_kw = KeywordProcessor(case_sensitive=False)
for canonical, synonyms in SKILL_TAXONOMY.items():
    _kw.add_keyword(canonical, canonical)
    for s in synonyms:
        _kw.add_keyword(s, canonical)

# ----------------------------
# Data classes (for clarity)
# ----------------------------
@dataclass
class Student:
    id: uuid.UUID
    headline: str
    summary: str
    courses: List[str]
    skills_text: str
    skills: List[str]            # normalized canonical skills
    gpa_norm: Optional[float]    # 0..1 dept-normalized
    reliability: Optional[float] # 0..1 (on-time, response latency, etc.)
    hrs_per_week: int
    avail_start: Optional[date]
    avail_end: Optional[date]

@dataclass
class Project:
    id: uuid.UUID
    title: str
    description: str
    required_skills: List[str]   # canonical names
    hrs_per_week: int
    start_date: Optional[date]
    end_date: Optional[date]
    capacity: int

# ----------------------------
# Utility functions
# ----------------------------
def embed_text(text: str) -> np.ndarray:
    vec = _model.encode(text or "", normalize_embeddings=True)
    return np.asarray(vec, dtype=np.float32)

def to_pgvector(vec: np.ndarray) -> str:
    return "[" + ",".join(f"{float(x):.6f}" for x in vec.tolist()) + "]"

def normalize_skills_from_text(text: str, max_fuzzy: int = 2) -> List[str]:
    """Dictionary match first, then fuzzy fallback for near-misses."""
    hits = set(_kw.extract_keywords(text or ""))

    # Fuzzy: try to map rare phrases (shortlist best 1) to a canonical skill
    # Keep it conservative to avoid wrong mappings.
    tokens = set((text or "").lower().split())
    canon_keys = list(SKILL_TAXONOMY.keys())
    for tok in list(tokens)[:max_fuzzy]:
        match, score, _ = process.extractOne(tok, canon_keys, scorer=fuzz.partial_ratio)
        if score >= 92:
            hits.add(match)

    return sorted(hits)

def build_student_blob(student: Student) -> str:
    parts = [
        student.headline or "",
        f"Courses: {', '.join(student.courses or [])}",
        f"Skills: {', '.join(student.skills or [])}",
        student.summary or "",
    ]
    return "\n".join([p for p in parts if p])

def build_project_blob(project: Project) -> str:
    req = ", ".join(project.required_skills or [])
    parts = [
        project.title or "",
        project.description or "",
        f"#required: {req}" if req else "",
        f"Hours: {project.hrs_per_week}/week",
    ]
    return "\n".join([p for p in parts if p])

def cosine_from_distance(dist: float) -> float:
    # pgvector returns cosine *distance* in <=>; similarity = 1 - distance
    return 1.0 - float(dist)

def availability_overlap(
    s_start: Optional[date], s_end: Optional[date],
    p_start: Optional[date], p_end: Optional[date],
    s_hrs: int, p_hrs: int
) -> float:
    """0..1 overlap across dates + hours/week."""
    # Date overlap
    def to_interval(a: Optional[date], b: Optional[date]) -> Tuple[date, date]:
        # If missing, assume very wide bounds
        if a is None:
            a = date.today() - relativedelta(years=1)
        if b is None:
            b = date.today() + relativedelta(years=2)
        if a > b:
            a, b = b, a
        return a, b

    s0, s1 = to_interval(s_start, s_end)
    p0, p1 = to_interval(p_start, p_end)
    left = max(s0, p0)
    right = min(s1, p1)
    if right <= left:
        date_overlap = 0.0
    else:
        total = (max(s1, p1) - min(s0, p0)).days + 1
        inter = (right - left).days + 1
        date_overlap = max(0.0, min(1.0, inter / max(1, total)))

    # Hours overlap (closer weekly loads are better)
    if s_hrs <= 0 or p_hrs <= 0:
        hrs = 0.0
    else:
        diff = abs(s_hrs - p_hrs)
        hrs = max(0.0, 1.0 - diff / max(s_hrs, p_hrs))

    # Combine (weighted)
    return 0.6 * date_overlap + 0.4 * hrs

def student_potential(gpa_norm: Optional[float], reliability: Optional[float]) -> float:
    g = gpa_norm if gpa_norm is not None else 0.5
    r = reliability if reliability is not None else 0.5
    # Slightly reward consistency
    return 0.6 * g + 0.4 * r

# ----------------------------
# DB helpers
# ----------------------------
def _conn():
    return psycopg2.connect(PG_DSN)

def ensure_indexes():
    """Run once after creating tables to ensure ANN / BM25 performance."""
    sqls = [
        # Vector ops + IVF lists index (tune lists with your data scale)
        "CREATE EXTENSION IF NOT EXISTS vector;",
        "CREATE INDEX IF NOT EXISTS idx_projects_embedding ON projects USING ivfflat (embedding vector_cosine_ops) WITH (lists = %s);",
        "CREATE INDEX IF NOT EXISTS idx_students_embedding ON students USING ivfflat (embedding vector_cosine_ops) WITH (lists = %s);",
        # Text search indexes (for BM25)
        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS tsv tsvector;",
        "CREATE INDEX IF NOT EXISTS idx_projects_tsv ON projects USING GIN(tsv);",
        "ALTER TABLE students ADD COLUMN IF NOT EXISTS tsv tsvector;",
        "CREATE INDEX IF NOT EXISTS idx_students_tsv ON students USING GIN(tsv);",
        # Helpful skill indexes
        "CREATE INDEX IF NOT EXISTS idx_projects_required_skills ON projects USING GIN(required_skills);",
        "CREATE INDEX IF NOT EXISTS idx_students_skills ON students USING GIN(skills);",
    ]
    with _conn() as cx:
        with cx.cursor() as cur:
            cur.execute(sqls[0])
            cur.execute(sqls[1], (ANN_LISTS,))
            cur.execute(sqls[2], (ANN_LISTS,))
            cur.execute(sqls[3])
            cur.execute(sqls[4])
            cur.execute(sqls[5])
            cur.execute(sqls[6])
            cur.execute(sqls[7])
            cur.execute(sqls[8])

def upsert_student_embedding(student_id: uuid.UUID):
    """Read structured text from DB, compute embedding, update row."""
    with _conn() as cx:
        cx.set_session(autocommit=True)
        with cx.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("""
                SELECT id, headline, summary, courses, skills, hrs_per_week, avail_start, avail_end
                FROM students WHERE id = %s
            """, (student_id,))
            row = cur.fetchone()
            if not row:
                raise ValueError("student not found")

            # Build blob + embed
            courses = row["courses"] or []
            skills = row["skills"] or []
            blob = "\n".join([
                row["headline"] or "",
                f"Courses: {', '.join(courses)}",
                f"Skills: {', '.join(skills)}",
                row["summary"] or ""
            ])
            vec = embed_text(blob)
            cur.execute("UPDATE students SET embedding = %s WHERE id = %s", (to_pgvector(vec), student_id))

            # Update tsvector for BM25
            cur.execute("""
                UPDATE students
                SET tsv = to_tsvector('english', coalesce(headline,'') || ' ' || coalesce(summary,''))
                WHERE id = %s
            """, (student_id,))

def upsert_project_embedding(project_id: uuid.UUID):
    with _conn() as cx:
        cx.set_session(autocommit=True)
        with cx.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("""
                SELECT id, title, description, required_skills, hrs_per_week
                FROM projects WHERE id = %s
            """, (project_id,))
            row = cur.fetchone()
            if not row:
                raise ValueError("project not found")

            req = ", ".join(row["required_skills"] or [])
            blob = "\n".join([
                row["title"] or "",
                row["description"] or "",
                f"#required: {req}",
                f"Hours: {row['hrs_per_week']}/week",
            ])
            vec = embed_text(blob)
            cur.execute("UPDATE projects SET embedding = %s WHERE id = %s", (to_pgvector(vec), project_id))

            cur.execute("""
                UPDATE projects
                SET tsv = to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
                WHERE id = %s
            """, (project_id,))

# ----------------------------
# Candidate generation
# ----------------------------
def generate_candidates_for_student(
    student_id: uuid.UUID,
    k_ann: int = DEFAULT_K_ANN,
    k_bm25: int = DEFAULT_K_BM25
) -> List[Tuple[uuid.UUID, float]]:
    """
    Returns list of (project_id, cosine_sim) candidates for a student.
    Combines ANN (pgvector) + BM25 union, with cosine similarities.
    """
    with _conn() as cx:
        with cx.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            # Pull my embedding once
            cur.execute("SELECT embedding FROM students WHERE id = %s", (student_id,))
            row = cur.fetchone()
            if not row or row["embedding"] is None:
                raise ValueError("student embedding missing; call upsert_student_embedding first")
            # ANN
            cur.execute(f"""
                WITH me AS (SELECT embedding AS e FROM students WHERE id = %s)
                SELECT p.id, (p.embedding <=> (SELECT e FROM me)) AS dist
                FROM projects p
                WHERE p.is_open = TRUE AND p.embedding IS NOT NULL
                ORDER BY p.embedding <=> (SELECT e FROM me)
                LIMIT {k_ann}
            """, (student_id,))
            ann_rows = cur.fetchall()
            ann = {r["id"]: cosine_from_distance(r["dist"]) for r in ann_rows}

            # BM25: use ts_rank on project tsv vs student's text (headline+summary)
            cur.execute("""
                SELECT headline, summary, array_to_string(skills, ', ') AS sk
                FROM students WHERE id = %s
            """, (student_id,))
            me = cur.fetchone()
            student_query = " ".join([
                (me["headline"] or ""), (me["summary"] or ""), (me["sk"] or "")
            ]).strip()
            if student_query:
                cur.execute(f"""
                    SELECT id, ts_rank(tsv, plainto_tsquery('english', %s)) AS rnk
                    FROM projects
                    WHERE is_open = TRUE AND tsv @@ plainto_tsquery('english', %s)
                    ORDER BY rnk DESC
                    LIMIT {k_bm25}
                """, (student_query, student_query))
                bm25_rows = cur.fetchall()
                # Normalize BM25 rank into 0..1 and blend lightly into cosine
                if bm25_rows:
                    rmax = max(r["rnk"] for r in bm25_rows) or 1.0
                    for r in bm25_rows:
                        pid = r["id"]
                        bm = float(r["rnk"]) / float(rmax)
                        ann[pid] = max(ann.get(pid, 0.0), 0.7 * ann.get(pid, 0.0) + 0.3 * bm)

            # Return sorted by similarity
            out = sorted(ann.items(), key=lambda x: x[1], reverse=True)
            return out

# ----------------------------
# Feature computation & scoring
# ----------------------------
def compute_features_and_score(student_id: uuid.UUID, project_ids: List[uuid.UUID]) -> List[Dict]:
    if not project_ids:
        return []

    with _conn() as cx:
        with cx.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            # Student row
            cur.execute("""
                SELECT id, skills, hrs_per_week, avail_start, avail_end, gpa_norm, reliability
                FROM students WHERE id = %s
            """, (student_id,))
            s = cur.fetchone()
            if not s:
                raise ValueError("student not found")

            s_skills = set(s["skills"] or [])
            s_hrs = s["hrs_per_week"] or 0

            # Pre-fetch cosine sims from ANN step (store temp table for join)
            psycopg2.extras.execute_values(
                cur,
                "CREATE TEMP TABLE tmp_candidates(project_id uuid, sim float) ON COMMIT DROP; "
                "INSERT INTO tmp_candidates(project_id, sim) VALUES %s",
                [(pid, 0.0) for pid in project_ids],
                template=None
            )
            # Update tmp with actual sims by recomputing distances in SQL (fast)
            cur.execute("""
                WITH me AS (SELECT embedding AS e FROM students WHERE id = %s)
                UPDATE tmp_candidates t
                SET sim = 1.0 - (p.embedding <=> (SELECT e FROM me))
                FROM projects p WHERE p.id = t.project_id
            """, (student_id,))

            cur.execute("""
                SELECT p.id, p.required_skills, p.hrs_per_week, p.start_date, p.end_date, p.capacity,
                       t.sim AS cosine_sim
                FROM projects p
                JOIN tmp_candidates t ON t.project_id = p.id
            """)
            rows = cur.fetchall()

            results = []
            for r in rows:
                req = set(r["required_skills"] or [])
                coverage = (len(req & s_skills) / max(1, len(req))) if req else 1.0
                avail = availability_overlap(
                    s["avail_start"], s["avail_end"], r["start_date"], r["end_date"], s_hrs, r["hrs_per_week"] or 0
                )
                potential = student_potential(s["gpa_norm"], s["reliability"])

                # Fit = 0..1 blend (you can tune this)
                fit = 0.55 * float(r["cosine_sim"] or 0.0) + 0.30 * coverage + 0.15 * avail
                fit = max(0.0, min(1.0, fit))

                # If you already have models for accept/performance, call them here.
                # For now, proxy with calibrated transforms of signals:
                p_accept = 0.65 * float(r["cosine_sim"] or 0.0) + 0.35 * avail
                p_accept = max(0.0, min(1.0, p_accept))

                perf = 0.6 * potential + 0.4 * coverage
                perf = max(0.0, min(1.0, perf))

                score = W_ACCEPT * p_accept + W_PERF * perf + W_FIT * fit

                results.append(dict(
                    project_id=r["id"],
                    cosine_sim=float(r["cosine_sim"] or 0.0),
                    skill_coverage=coverage,
                    availability=avail,
                    potential=potential,
                    fit=fit,
                    p_accept=p_accept,
                    perf=perf,
                    score=score,
                    capacity=r["capacity"] or 1,
                ))

            # Sort descending by our scalar target
            results.sort(key=lambda x: x["score"], reverse=True)
            return results

# ----------------------------
# Capacity-aware assignment (simple & effective)
# ----------------------------
def greedy_capacity_match(
    student_ids: List[uuid.UUID],
    per_student_top_n: int = 20
) -> Dict[uuid.UUID, Optional[uuid.UUID]]:
    """
    For each student, pick the highest-scoring project that still has capacity.
    Returns dict: student_id -> project_id (or None if nothing fits).
    This is fast and works well as an MVP; upgrade to Hungarian/ILP later if needed.
    """
    # Fetch initial capacities
    with _conn() as cx:
        with cx.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("SELECT id, capacity FROM projects WHERE is_open = TRUE")
            caps = {row["id"]: int(row["capacity"] or 0) for row in cur.fetchall()}

    assignments: Dict[uuid.UUID, Optional[uuid.UUID]] = {}

    for sid in student_ids:
        # Candidate pool
        cands = generate_candidates_for_student(sid, k_ann=200, k_bm25=100)
        proj_ids = [pid for pid, _ in cands[:max(50, per_student_top_n)]]
        feats = compute_features_and_score(sid, proj_ids)

        # Pick best still-available
        chosen = None
        for f in feats[:per_student_top_n]:
            pid = f["project_id"]
            if caps.get(pid, 0) > 0:
                chosen = pid
                caps[pid] -= 1
                break
        assignments[sid] = chosen

    return assignments

# ----------------------------
# Convenience: explain a ranked list for a student
# ----------------------------
def top_projects_with_explanations(student_id: uuid.UUID, top_k: int = 10) -> List[Dict]:
    cands = generate_candidates_for_student(student_id)
    proj_ids = [pid for pid, _ in cands[:300]]  # wide
    feats = compute_features_and_score(student_id, proj_ids)
    out = []
    for f in feats[:top_k]:
        why = []
        if f["skill_coverage"] >= 0.66:  why.append("skills match")
        if f["availability"] >= 0.66:    why.append("availability fits")
        if f["cosine_sim"] >= 0.65:      why.append("strong topic affinity")
        if f["potential"] >= 0.7:        why.append("high potential")
        out.append({
            "project_id": f["project_id"],
            "score": round(f["score"], 4),
            "p_accept": round(f["p_accept"], 3),
            "perf": round(f["perf"], 3),
            "fit": round(f["fit"], 3),
            "why": why or ["overall good fit"]
        })
    return out