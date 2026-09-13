from pathlib import Path

from services.resume_parser import (
    read_resume,
    parse_resume
)

from services.jd_parser import (
    parse_job_description
)

from services.ats_scorer import (
    final_score
)


job_description = """
Looking for a Java Backend Developer.

Skills:
Java
Spring Boot
Kafka
Docker

Experience:
3 years
"""


job = parse_job_description(
    job_description
)

files = list(
    Path("uploads").glob("*.pdf")
)

if not files:
    raise ValueError(
        "No PDF found in uploads folder"
    )

resume_text = read_resume(
    files[0]
)

resume = parse_resume(
    resume_text
)

result = final_score(
    job,
    resume
)

print("\nJOB")
print(job)

print("\nRESUME")
print(resume)

print("\nATS RESULT")
print(result)