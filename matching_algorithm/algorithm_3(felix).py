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
# 1) Synthetic dataset
# -------------------------
students = pd.DataFrame([
    ("s1","EE major; courses: Organic chemistry A; skills: chemistry lab skill, calculas", "3.5-4.0", 10, 16, 0, 0,0,0,0),
    ("s2","cs major; courses: NLP B+, IR A; skills: python, nlp, keras",               "3.0-3.5", 12, 20, 0, 0,0,0,0),
    ("s3","BME major; courses: Imaging A-, Stats B+; skills: matlab, cv, statistics",  "3.5-4.0", 8, 12, 0, 0,0,0,0),
    ("s4","Math; courses: Probability A, Optimization A; skills: numpy, gnn, pytorch", "3.5-4.0", 15, 24, 0, 0,0,0,0),
    ("s5","ee major; courses: Lab A-, Writing B; skills: lab, writing, data analysis",    "3.0-3.5", 6, 10, 0, 0,0,0,0),
], columns=["sid","st_text","gpa_bucket","hrs","avail_weeks","reliability",
            "lack_commit","poor_comms","weak_writing","weak_numeracy"])

projects = pd.DataFrame([
    ("p1","Topic: GNNs for brain imaging; req: python, pytorch, gnn, statistics", 12, 16, {"python","pytorch","gnn","statistics"}),
    ("p2","Topic: NLP for IR; req: python, nlp, keras",                            10, 20, {"python","nlp","keras"}),
    ("p3","Topic: Medical imaging segmentation; req: matlab, cv",                   8, 12, {"matlab","cv"}),
    ("p4","Topic: DSP on edge devices; req: python, signal processing",            10, 16, {"python","signal processing"}),
], columns=["pid","pr_text","req_hrs","dur_weeks","req_skills"])

labels = {
    ("s1","p4"):0, ("s1","p1"):0, ("s1","p2"):0, ("s1","p3"): 1,
    ("s2","p2"):1, ("s2","p1"):0, ("s2","p3"):0,
    ("s3","p3"):1, ("s3","p1"):0,
    ("s4","p1"):1, ("s4","p2"):0,
    ("s5","p4"):0, ("s5","p2"):0,
}
pairs = [(s,p) for s in students.sid for p in projects.pid]
df = pd.DataFrame(pairs, columns=["sid","pid"])
df["y"] = df.apply(lambda r: labels.get((r.sid,r.pid), 0), axis=1)

# -------------------------
# 2) Semantic similarity via BERT
# -------------------------
model = SentenceTransformer('all-MiniLM-L6-v2')   # small, fast BERT model
S_emb = model.encode(students.st_text, normalize_embeddings=True)
P_emb = model.encode(projects.pr_text, normalize_embeddings=True)
cos = util.cos_sim(S_emb, P_emb).cpu().numpy()     # [S x P] cosine matrix

sidx = {sid:i for i,sid in enumerate(students.sid)}
pidx = {pid:j for j,pid in enumerate(projects.pid)}

# -------------------------
# 3) Structured features (same as before)
# -------------------------
def skill_tokens(text):
    toks = set([t.strip().lower() for t in text.replace(";"," ").replace(","," ").split()])
    return {t for t in toks if t in {"python","pytorch","gnn","statistics","nlp","keras","matlab","cv","signal","processing","signal processing","data","analysis"}}

def coverage(s_text, req_skills):
    sskills = skill_tokens(s_text)
    inter = len(sskills & req_skills)
    return inter / max(1, len(req_skills))

def availability_fit(s_row, p_row):
    hrs = 1.0 - abs(s_row.hrs - p_row.req_hrs)/max(s_row.hrs, p_row.req_hrs)
    dur = min(s_row.avail_weeks, p_row.dur_weeks)/max(s_row.avail_weeks, p_row.dur_weeks)
    return 0.4*max(0,hrs) + 0.6*dur

def gpa_bucket_num(x):
    return {"3.5-4.0": 1.0, "3.0-3.5": 0.7, "2.5-3.0": 0.4}.get(x, 0.5)

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

# --- same proxy fit & penalty formulas ---
X["fit"] = 0.45*X["cosine"] + 0.40*X["coverage"] + 0.15*X["avail"]
pen = 0.10*X["lack_commit"] + 0.07*X["poor_comms"] + 0.05*X["weak_writing"] + 0.05*X["weak_numeracy"]

# -------------------------
# 4) Train acceptance model
# -------------------------
feat_cols = ["cosine","coverage","avail","gpa","reliability","fit",
             "lack_commit","poor_comms","weak_writing","weak_numeracy"]
train, test = train_test_split(X, test_size=0.35, random_state=0, stratify=X["y"])

# train, test = train_test_split(X, test_size=0.35, random_state=42, stratify=X["y"])

if HAVE_LGBM:
    def groups(df_): return df_.groupby("sid").size().tolist()
    ranker = LGBMRanker(n_estimators=200, learning_rate=0.1, random_state=42)
    ranker.fit(train[feat_cols], train["y"], group=groups(train))
    test["p_accept"] = ranker.predict(test[feat_cols])
else:
    lr = LogisticRegression(max_iter=1000)
    lr.fit(train[feat_cols], train["y"])
    test["p_accept"] = lr.predict_proba(test[feat_cols])[:,1]

test["perf"] = 0.6*(0.6*test["gpa"] + 0.4*test["reliability"]) + 0.4*test["coverage"]
test["score"] = 0.35*test["p_accept"] + 0.45*test["perf"] + 0.20*test["fit"] - pen.loc[test.index]

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
    p=0.10*r["lack_commit"]+0.07*r["poor_comms"]+0.05*r["weak_writing"]+0.05*r["weak_numeracy"]
    return 0.35*r["p_accept"]+0.45*r["perf"]+0.20*r["fit"]-p
assert recompute(row)<=base+1e-9,"Penalty not decreasing"
print("Sanity checks passed.")

# -------------------------
# 7) Full match ratings
# -------------------------
model = ranker if HAVE_LGBM else lr
def compute_full_match_ratings(X_all: pd.DataFrame) -> pd.DataFrame:
    if HAVE_LGBM:
        p_accept_all = model.predict(X_all[feat_cols])
    else:
        p_accept_all = model.predict_proba(X_all[feat_cols])[:,1]
    perf_all = 0.6*(0.6*X_all["gpa"] + 0.4*X_all["reliability"]) + 0.4*X_all["coverage"]
    pen_all = 0.10*X_all["lack_commit"] + 0.07*X_all["poor_comms"] + 0.05*X_all["weak_writing"] + 0.05*X_all["weak_numeracy"]
    score_all = 0.35*p_accept_all + 0.45*perf_all + 0.20*X_all["fit"] - pen_all
    out=X_all[["sid","pid","y","cosine","coverage","avail","gpa","reliability","fit"]].copy()
    out["p_accept"]=p_accept_all; out["perf"]=perf_all; out["match_rating"]=score_all
    return out

all_ratings = compute_full_match_ratings(X)
for sid, grp in all_ratings.sort_values(["sid","match_rating"], ascending=[True, False]).groupby("sid"):
    print(f"\nStudent {sid}:")
    print(grp[["pid","match_rating","p_accept","perf","fit","coverage","avail"]].round(3).to_string(index=False))

# -------------------------
# 7) Matching ratings for ALL student–project pairs
# -------------------------
# choose the trained model handle
model = ranker if HAVE_LGBM else lr

def compute_full_match_ratings(X_all: pd.DataFrame) -> pd.DataFrame:
    # predict p_accept for all pairs
    if HAVE_LGBM:
        p_accept_all = model.predict(X_all[feat_cols])
    else:
        p_accept_all = model.predict_proba(X_all[feat_cols])[:, 1]

    # same perf/score recipe as test set
    perf_all = 0.6*(0.6*X_all["gpa"] + 0.4*X_all["reliability"]) + 0.4*X_all["coverage"]
    pen_all = 0.10*X_all["lack_commit"] + 0.07*X_all["poor_comms"] + 0.05*X_all["weak_writing"] + 0.05*X_all["weak_numeracy"]
    score_all = 0.35*p_accept_all + 0.45*perf_all + 0.20*X_all["fit"] - pen_all

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
