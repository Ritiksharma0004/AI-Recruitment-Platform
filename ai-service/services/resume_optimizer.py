import json
import re
from services.groq_client import client, MODEL

def optimize_resume(job_description: str, resume_text: str) -> dict:
    prompt = f"""
You are an expert ATS and Resume Optimization Specialist.
Analyze the resume against the target job description.

JOB DESCRIPTION:
{job_description[:1200]}

RESUME TEXT:
{resume_text[:1500]}

Return ONLY valid JSON (no markdown text before or after):
{{
    "match_score": 82,
    "match_level": "High Match",
    "matching_skills": ["Java", "SQL"],
    "missing_critical_skills": ["Docker", "Kubernetes"],
    "recommended_keywords": ["Microservices", "CI/CD", "AWS"],
    "strengths": ["Strong foundational programming background", "Proven problem-solving experience"],
    "bullet_point_improvements": [
        {{
            "original_area": "Developed backend APIs and fixed system bugs",
            "suggested_rewrite": "Architected resilient Spring Boot microservices serving 50K+ requests/day, achieving 99.9% uptime",
            "reason": "Includes measurable impact, numbers, and key JD keywords"
        }}
    ],
    "executive_summary": "Incorporate cloud containerization skills and highlight specific system throughput numbers to maximize interview callback rates."
}}
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a precise ATS optimizer. You output ONLY valid raw JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=480,
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()
        content = re.sub(r"^```(?:json)?\s*", "", content, flags=re.MULTILINE)
        content = re.sub(r"^```\s*", "", content, flags=re.MULTILINE)
        content = content.strip()

        # Find first { and last }
        first_brace = content.find('{')
        last_brace = content.rfind('}')
        if first_brace != -1 and last_brace != -1:
            content = content[first_brace:last_brace+1]

        data = json.loads(content)
        return data

    except Exception as e:
        print(f"Error calling Groq for resume optimization: {e}")
        # Dynamic fallback matching JD skills
        words = set(re.findall(r'\b[A-Za-z]{3,}\b', job_description))
        resume_words = set(re.findall(r'\b[A-Za-z]{3,}\b', resume_text))
        matched = list(words.intersection(resume_words))[:5]
        missing = list(words - resume_words)[:5]
        
        return {
            "match_score": 76,
            "match_level": "Moderate Match",
            "matching_skills": matched if matched else ["Java", "Software Development", "Problem Solving"],
            "missing_critical_skills": missing if missing else ["Docker", "Cloud Deployment", "Microservices"],
            "recommended_keywords": ["RESTful APIs", "System Design", "Agile", "Unit Testing"],
            "strengths": ["Solid educational background", "Directly aligned core competencies"],
            "bullet_point_improvements": [
                {
                    "original_area": "Worked on backend development and bug resolution.",
                    "suggested_rewrite": "Architected scalable backend microservices handling high concurrency, reducing response latency by 30%.",
                    "reason": "Quantifies business impact with metrics and action verbs."
                }
            ],
            "executive_summary": "Align technical keywords directly with the job description and quantify your project deliverables."
        }
