import json

from services.groq_client import client, MODEL, call_groq_completions
from models.job import JobD


def parse_job_description(
         job_description: str) -> JobD:

    system_prompt = """
You are an expert HR assistant.

Analyze the job description and return ONLY valid JSON.

Format:

{
    "role": "",
    "required_skills": [],
    "preferred_skills": [],
    "minimum_experience": null,
    "education_requirements": [],
    "responsibilities": []
}

Rules:
- No markdown
- No explanations
- No schema
- JSON only
"""

    user_prompt = f"""
Job Description:

{job_description[:8000]}
"""

    response = call_groq_completions(
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        max_tokens=700,
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

    return JobD(**data)
