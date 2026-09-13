import json
from services.groq_client import client, MODEL, call_groq_completions, extract_json_from_text
from models.job import JobD


def parse_job_description(job_description: str) -> JobD:
    safe_jd = (job_description[:8000] if job_description else "").strip()
    if not safe_jd:
        safe_jd = "Software Engineer with full stack skills."

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

{safe_jd}
"""

    data = {}
    try:
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
            max_tokens=1500,
            temperature=0.1
        )
        raw_output = response.choices[0].message.content or ""
        data = extract_json_from_text(raw_output)
    except Exception as e:
        print(f"[jd_parser] Primary extraction failed: {e}")
        data = {}

    if not data or not isinstance(data, dict):
        words = [w.strip() for w in safe_jd.replace("\n", " ").split() if len(w) > 3]
        data = {
            "role": "Software Developer",
            "required_skills": list(set(words[:8])),
            "preferred_skills": [],
            "minimum_experience": 1,
            "education_requirements": [],
            "responsibilities": []
        }

    return JobD(**data)
