import numpy as np, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
from sklearn.linear_model import LogisticRegression

# Try LightGBM for ranking; fallback to LR
try:
    from lightgbm import LGBMRanker
    HAVE_LGBM = True
except Exception:
    HAVE_LGBM = False

# --- NEW: BERT imports ---
from sentence_transformers import SentenceTransformer, util

# -------------------------
# 0) Hyperparameters for soft effects
# -------------------------
GATE_FLOOR = 0.85        # gate never reduces base below 85%
GATE_BLEND = 0.40        # 0=ignore gate, 1=use gate fully
MAJOR_BONUS_BASE = 0.015 # absolute bonus for strong major alignment
MAJOR_RELATED_FRAC = 0.50# related-major gets half the base

# -------------------------
# 1) Synthetic dataset
# -------------------------
students = pd.DataFrame([
    ("s1","ChemE major; courses: Organic chemistry A; skills: chemistry lab skill, calculas", "3.5-4.0", 10, 16, 0, 0,0,0,0),
    ("s2","cs major; courses: NLP B+, IR A; skills: python, nlp, keras",               "3.0-3.5", 12, 20, 0, 0,0,0,0),
    ("s3","BME major; courses: Imaging A-, Stats B+; skills: matlab, cv, statistics",  "3.5-4.0", 8, 12, 0, 0,0,0,0),
    ("s4","Math; courses: Probability A, Optimization A; skills: numpy, gnn, pytorch", "3.5-4.0", 15, 24, 0, 0,0,0,0),
    ("s5","ee major; courses: Lab A-, Writing B; skills: lab, writing, data analysis",    "3.0-3.5", 6, 10, 0, 0,0,0,0),
], columns=["sid","st_text","gpa_bucket","hrs","avail_weeks","reliability",
            "lack_commit","poor_comms","weak_writing","weak_numeracy"])
 
# Last 5 items are about performance: "reliability", "lack_commit","poor_comms","weak_writing","weak_numeracy".  set to all 0 for simplicity; can be randomized for more complex tests 


projects = pd.DataFrame([
    ("p1","Topic: GNNs for brain imaging; req: python, pytorch, gnn, statistics", 12, 16, {"python","pytorch","gnn","statistics"}),
    ("p2","Topic: NLP for IR; req: python, nlp, keras",                            10, 20, {"python","nlp","keras"}),
    ("p3","Topic: Medical imaging segmentation; req: matlab, cv",                   8, 12, {"matlab","cv"}),
    ("p4","Topic: DSP on edge devices; req: python, signal processing",            10, 16, {"python","signal processing"}),
], columns=["pid","pr_text","req_hrs","dur_weeks","req_skills"])

# Ground truth labels (accept & performance) for pairs we “observed”
# (1 if accepted and performed well; 0 otherwise)
labels = {
    ("s1","p4"):1, ("s1","p1"):1, ("s1","p2"):0,
    ("s2","p2"):1, ("s2","p1"):0, ("s2","p3"):0,
    ("s3","p3"):1, ("s3","p1"):0,
    ("s4","p1"):1, ("s4","p2"):0,
    ("s5","p4"):0, ("s5","p2"):0,
}

# Create datafram for all possible student-project pairs
pairs = [(s,p) for s in students.sid for p in projects.pid]
df = pd.DataFrame(pairs, columns=["sid","pid"])
df["y"] = df.apply(lambda r: labels.get((r.sid,r.pid), 0), axis=1)

# -------------------------
# 2) Semantic similarity via BERT
# -------------------------
model = SentenceTransformer('all-MiniLM-L6-v2')   # small, fast BERT model

# -------------------------
# 3) Structured features (same as before)
# -------------------------
def skill_tokens(text):
    """Extract normalized skills, handling multi-word phrases conservatively."""
    if not text:
        return set()
    txt = str(text).lower()
    allowed_phrases = {"signal processing", "data analysis"}
    allowed_unigrams = {"python","pytorch","gnn","statistics","nlp","keras","matlab","cv"}
    found = set()
    # Phrase detection first
    for phrase in allowed_phrases:
        if phrase in txt:
            found.add(phrase)
    # Unigram detection
    toks = {t.strip() for t in txt.replace(";"," ").replace(","," ").split()}
    for t in allowed_unigrams:
        if t in toks:
            found.add(t)
    return found

def coverage(s_text, req_skills):
    sskills = skill_tokens(s_text)
    if not req_skills:
        return 1.0
    inter = len(sskills & req_skills)
    return inter / max(1, len(req_skills))

def availability_fit(s_row, p_row):
    hrs = 1.0 - abs(s_row.hrs - p_row.req_hrs)/max(s_row.hrs, p_row.req_hrs)
    dur = min(s_row.avail_weeks, p_row.dur_weeks)/max(s_row.avail_weeks, p_row.dur_weeks)
    return 0.4*max(0,hrs) + 0.6*dur

def gpa_bucket_num(x):
    return {"3.5-4.0": 1.0, "3.0-3.5": 0.7, "2.5-3.0": 0.4}.get(x, 0.5)

# Build embeddings AFTER defining skill extraction
students = students.copy()
students["_norm_skills"] = students["st_text"].apply(lambda t: " ".join(sorted(list(skill_tokens(t)))))
students["_aug_text"] = students.apply(lambda r: f"{r.st_text}; skills: {r._norm_skills}".strip(), axis=1)
S_emb = model.encode(students._aug_text.tolist(), normalize_embeddings=True)
P_emb = model.encode(projects.pr_text.tolist(), normalize_embeddings=True)
cos = util.cos_sim(S_emb, P_emb).cpu().numpy()     # [S x P] cosine matrix

sidx = {sid:i for i,sid in enumerate(students.sid)}
pidx = {pid:j for j,pid in enumerate(projects.pid)}

rows=[]
for _,r in df.iterrows():
    si, pi = sidx[r.sid], pidx[r.pid]
    s = students.iloc[si]; p = projects.iloc[pi]
    rows.append({
        "sid": r.sid, "pid": r.pid, "y": r.y,
        "cosine": cos[si,pi],
        "coverage": coverage(s.st_text, p.req_skills),
        "avail": availability_fit(s,p),
        "gpa": gpa_bucket_num(s.gpa_bucket),
        "reliability": s.reliability,
        "lack_commit": s.lack_commit,
        "poor_comms": s.poor_comms,
        "weak_writing": s.weak_writing,
        "weak_numeracy": s.weak_numeracy,
    })
X = pd.DataFrame(rows)

# --- same proxy fit & penalty formulas (reweighted to emphasize required skills) ---
X["fit"] = 0.35*X["cosine"] + 0.50*X["coverage"] + 0.15*X["avail"]
pen = 0.10*X["lack_commit"] + 0.07*X["poor_comms"] + 0.05*X["weak_writing"] + 0.05*X["weak_numeracy"]

# -------------------------
# 4) Train acceptance model
# -------------------------
# Avoid feature leakage: exclude precomputed fit from model features
feat_cols = ["cosine","coverage","avail","gpa","reliability",
             "lack_commit","poor_comms","weak_writing","weak_numeracy"]
train, test = train_test_split(X, test_size=0.35, random_state=42, stratify=X["y"])

if HAVE_LGBM:
    def groups(df_): return df_.groupby("sid").size().tolist()
    ranker = LGBMRanker(n_estimators=200, learning_rate=0.1, random_state=42)
    ranker.fit(train[feat_cols], train["y"], group=groups(train))
    test["p_accept"] = ranker.predict(test[feat_cols])
else:
    lr = LogisticRegression(max_iter=1000)
    lr.fit(train[feat_cols], train["y"])
    test["p_accept"] = lr.predict_proba(test[feat_cols])[:,1]

# Performance proxy: reward potential but also required-skill coverage
test["perf"] = 0.6*(0.6*test["gpa"] + 0.4*test["reliability"]) + 0.4*test["coverage"]

# Major-based bonus: smaller, parameterized, scaled by coverage
# UPDATED

def major_bonus(row, base=MAJOR_BONUS_BASE, related_frac=MAJOR_RELATED_FRAC):
    sid = row["sid"]
    pid = row["pid"]
    s_text = students.loc[students.sid == sid, "st_text"].values[0].lower()
    req = projects.loc[projects.pid == pid, "req_skills"].values[0]

    # Map major keywords to canonical skill sets
    major_to_skills = {
        "computer science": {"python","nlp","keras","pytorch","gnn","statistics","cv"},
        "cs":               {"python","nlp","keras","pytorch","gnn","statistics","cv"},
        "electrical engineering": {"signal processing","python"},
        "ee":                     {"signal processing","python"},
        "biomedical":             {"matlab","cv"},
        "bme":                    {"matlab","cv"},
        "chemical":               set(),
        "cheme":                  set(),
        "math":                   {"statistics","gnn","python","pytorch"},
    }

    matched_skills = set()
    for key, skills in major_to_skills.items():
        if key in s_text:
            matched_skills |= skills

    if not matched_skills:
        return 0.0

    overlap = len(matched_skills & set(req or []))
    if overlap <= 0:
        return 0.0

    # Smaller, parameterized bonus
    if overlap >= 2:
        bonus_mag = base
    else:
        bonus_mag = related_frac * base

    # coverage-aware scaling (gentle)
    cov = float(row.get("coverage", 0.0))
    scale = 0.6 + 0.4*max(0.0, min(1.0, cov))  # 0.6..1.0
    return bonus_mag * scale

# Base score components (slightly increase weight on perf, reduce p_accept)
test["score_base"] = 0.30*test["p_accept"] + 0.50*test["perf"] + 0.20*test["fit"]

# Coverage gate: raw + softened application
# EXISTING raw gate

def cov_gate(c):
    if c <= 0.0:
        return 0.2
    if c < 0.34:
        return 0.5
    if c < 0.5:
        return 0.85
    return 1.0

# NEW: soft gate wrapper to reduce impact

def soft_gate(c, floor=GATE_FLOOR, blend=GATE_BLEND):
    raw = cov_gate(c)                      # 0.2, 0.5, 0.85, 1.0
    soft = floor + (1.0 - floor) * raw     # in [floor, 1.0]
    return (1.0 - blend) * 1.0 + blend * soft

# apply softened gate and scaled major bonus
# UPDATED usage

test["gate"] = test["coverage"].apply(soft_gate)
test["maj_bonus"] = test.apply(major_bonus, axis=1)
test["score"] = test["score_base"]*test["gate"] + test["maj_bonus"] - pen.loc[test.index]

# -------------------------
# 5) Metrics
# -------------------------
auc = roc_auc_score(test["y"], test["score"])

def precision_at_k(df, k=3):
    out=[]; 
    for sid,grp in df.sort_values("score",ascending=False).groupby("sid"):
        topk=grp.head(k)
        out.append(topk["y"].mean() if len(topk)>0 else 0)
    return np.mean(out) if out else 0.0

def ndcg_at_k(df, k=3):
    def dcg(y): return np.sum([(2**rel -1)/np.log2(i+2) for i,rel in enumerate(y)])
    out=[]
    for sid,grp in df.sort_values("score",ascending=False).groupby("sid"):
        y_true=grp["y"].values[:k]; ideal=np.sort(grp["y"].values)[::-1][:k]
        out.append(dcg(y_true)/max(dcg(ideal),1e-9))
    return float(np.mean(out)) if out else 0.0

p3=precision_at_k(test,3); n3=ndcg_at_k(test,3)
print(f"AUC={auc:.3f}  P@3={p3:.3f}  NDCG@3={n3:.3f}")

# -------------------------
# 6) Sanity checks
# -------------------------
chk=test.copy()
by_cov=chk.assign(cbin=(chk.coverage>=0.5).astype(int)).groupby("cbin")["score"].mean().to_dict()
assert by_cov.get(1,0)>=by_cov.get(0,0),"Coverage not reflected"
row=test.iloc[0].copy(); base=row["score"]; row["lack_commit"]=1

def recompute(r):
    p = 0.10*r["lack_commit"] + 0.07*r["poor_comms"] + 0.05*r["weak_writing"] + 0.05*r["weak_numeracy"]
    base_score = 0.30*r["p_accept"] + 0.50*r["perf"] + 0.20*r["fit"]
    g = soft_gate(r["coverage"]) if "coverage" in r else 1.0
    mb = major_bonus(r)
    return base_score*g + mb - p

assert recompute(row)<=base+1e-9,"Penalty not decreasing"
print("Sanity checks passed.")

# -------------------------
# 7) Full match ratings
# -------------------------
model = ranker if HAVE_LGBM else lr

# UPDATED: align full computation with soft gate + scaled major bonus

def compute_full_match_ratings(X_all: pd.DataFrame) -> pd.DataFrame:
    if HAVE_LGBM and hasattr(model, "predict_proba"):
        p_accept_all = model.predict_proba(X_all[feat_cols])[:,1]
    elif HAVE_LGBM:
        raw = model.predict(X_all[feat_cols])
        p_accept_all = 1.0 / (1.0 + np.exp(-raw))  # logistic squash
    else:
        p_accept_all = model.predict_proba(X_all[feat_cols])[:,1]

    perf_all = 0.6*(0.6*X_all["gpa"] + 0.4*X_all["reliability"]) + 0.4*X_all["coverage"]
    pen_all = 0.10*X_all["lack_commit"] + 0.07*X_all["poor_comms"] + 0.05*X_all["weak_writing"] + 0.05*X_all["weak_numeracy"]

    base = 0.30*p_accept_all + 0.50*perf_all + 0.20*X_all["fit"]
    gate = X_all["coverage"].apply(soft_gate)
    maj  = X_all.apply(major_bonus, axis=1)

    score_all = base * gate + maj - pen_all
    out = X_all[["sid","pid","y","cosine","coverage","avail","gpa","reliability","fit"]].copy()
    out["p_accept"] = p_accept_all
    out["perf"] = perf_all
    out["match_rating"] = score_all
    return out

all_ratings = compute_full_match_ratings(X)

# Pretty print: sorted within each student
print("\n=== Matching ratings (all pairs, sorted per student) ===")
for sid, grp in all_ratings.sort_values(["sid","match_rating"], ascending=[True, False]).groupby("sid"):
    print(f"\nStudent {sid}:")
    print(grp[["pid","match_rating","p_accept","perf","fit","coverage","avail"]]
          .round(3).to_string(index=False))

# Also show a compact pivot table of ratings
pivot = all_ratings.pivot(index="sid", columns="pid", values="match_rating").round(3)
print("\n=== Match rating matrix (students x projects) ===")
print(pivot.fillna(0.0).to_string())