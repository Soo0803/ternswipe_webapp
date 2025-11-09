import uuid
from matcher import (
    ensure_indexes,
    upsert_student_embedding,
    upsert_project_embedding,
    top_projects_with_explanations,
    greedy_capacity_match,
)

ensure_indexes()

# After inserting/updating any student/project rows:
upsert_student_embedding(uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
upsert_project_embedding(uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"))

# Get ranked recommendations + explanations for a student
recs = top_projects_with_explanations(uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), top_k=10)
for r in recs:
    print(r)

# Batch matching with capacities (one pass)
student_ids = [
    uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
    uuid.UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"),
]
assignments = greedy_capacity_match(student_ids, per_student_top_n=20)
print(assignments)