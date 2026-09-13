import json

from services.groq_client import client, MODEL, call_groq_completions
from models.match_result import MatchResult


def final_score(
        job,
        resume
):

    prompt = f"""
You are an HR recruiter.

Compare the resume against the job description.

JOB:

{job.model_dump_json(indent=2)}

RESUME:

{resume.model_dump_json(indent=2)}

Return ONLY valid JSON.

Format:

{{
    "score": 0,
    "details": {{
        "candidate_name": "",
        "matching_skills": [],
        "missing_skills": [],
        "experience_requirement_met": true,
        "final_verdict": ""
    }}
}}

Rules:

- score must be between 0 and 100
- no markdown
- no explanation
- json only
"""

    response = call_groq_completions(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=600,
        temperature=0.1
    )

    raw_output = response.choices[0].message.content

    raw_output = (
        raw_output
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    data = json.loads(raw_output)

    return MatchResult(**data)
