# import json
#
# from services.groq_client import client, MODEL
# # from services.groq_client import client, MODEL
# from models.job import JobD
#
#
#
# def parse_job_description(
#         job_description: str) -> JobD:
#
#     jobd_schema = JobD.model_json_schema()
#
#     system_prompt = f"""
# You are an expert HR assistant.
#
# Your job is to analyze job descriptions and extract
# structured information from them.
#
# Return ONLY valid JSON matching this schema:
#
# {jobd_schema}
#
# IMPORTANT:
# Do NOT return the schema itself.
# Do NOT return fields like "properties", "title" or "type".
# Fill the schema with actual information extracted from the job description.
#
# If minimum experience is not mentioned, return null.
# If information for a list is missing, return an empty list.
# Do not invent information.
# """
#
#     user_prompt = f"""
# Analyze the following job description:
#
# {job_description}
# """
#
#     response = client.chat.completions.create(
#         model=MODEL,
#
#         messages=[
#             {
#                 "role": "system",
#                 "content": system_prompt
#             },
#             {
#                 "role": "user",
#                 "content": user_prompt
#             }
#         ]
#     )
#
#     data = json.loads(
#         response.choices[0].message.content
#     )
#
#     return JobD(**data)



import json

from services.groq_client import client, MODEL
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

{job_description}
"""

    response = client.chat.completions.create(
        model=MODEL,
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
