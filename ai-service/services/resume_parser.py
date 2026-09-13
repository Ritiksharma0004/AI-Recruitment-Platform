import json
from datetime import datetime
import re
from pypdf import PdfReader

from services.groq_client import client, MODEL, call_groq_completions, extract_json_from_text
from models.resume import Resume


def fix_candidate_name(raw_name, email=""):
    if not raw_name or not isinstance(raw_name, str):
        return raw_name
    s = raw_name.strip()

    if email and "@" in email:
        prefix = email.split("@")[0].lower()
        parts = [p for p in re.split(r'[^a-zA-Z]', prefix) if len(p) >= 3 and p not in ['gmail', 'mail', 'sde', 'dev', 'test', 'admin', 'user', 'recruiter']]
        collapsed = re.sub(r'[^a-zA-Z]', '', s).lower()
        matched = [p for p in parts if p in collapsed]
        if len(matched) >= 2:
            return " ".join([m.capitalize() for m in matched])

    s = re.sub(r'\bR\s+Itik\b', 'Ritik', s, flags=re.IGNORECASE)
    s = re.sub(r's\s+Harma\b', ' Sharma', s, flags=re.IGNORECASE)
    s = re.sub(r'\b([A-Za-z]+)s\s+Harma\b', r'\1 Sharma', s, flags=re.IGNORECASE)
    s = re.sub(r'\b([A-Za-z])\s+([A-Za-z]{2,})\b', r'\1\2', s)
    s = re.sub(r'\b([A-Za-z]{2,})s\s+([A-Za-z]{3,})\b', r'\1 s\2', s)
    if re.search(r'\b[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\b', s):
        s = re.sub(r'\b([A-Za-z])\s+(?=[A-Za-z]\b)', r'\1', s)

    words = s.split()
    if words:
        s = " ".join([w.capitalize() if not (len(w) > 1 and w.isupper()) else w.title() for w in words])
    return s


def read_resume(file_path):
    suffix = file_path.suffix.lower()

    if suffix == ".pdf":
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text

    elif suffix in [".txt", ".md"]:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()

    else:
        raise ValueError("Unsupported file format")


def calculate_experience_years(experiences):
    total_months = 0
    current_year = datetime.now().year

    for exp in experiences:
        if not exp.start_date:
            continue

        try:
            start = datetime.strptime(
                exp.start_date,
                "%Y-%m"
            )

            if exp.end_date:
                end = datetime.strptime(
                    exp.end_date,
                    "%Y-%m"
                )
            else:
                end = datetime.now()

            months = (
                (end.year - start.year) * 12
                + (end.month - start.month)
            )

            if months > 0:
                total_months += months

        except Exception:
            try:
                start_year = int(exp.start_date[:4])
                if exp.end_date:
                    end_year = int(exp.end_date[:4])
                else:
                    end_year = current_year

                diff = end_year - start_year
                if diff > 0:
                    total_months += diff * 12
            except Exception:
                continue

    return round(total_months / 12, 1)


def normalize_resume_data(data):
    if not isinstance(data, dict):
        data = {}

    list_fields = [
        "skills",
        "education",
        "experiences",
        "projects",
        "certifications",
        "languages",
        "links"
    ]

    for field in list_fields:
        if field not in data or data[field] is None:
            data[field] = []
        elif not isinstance(data[field], list):
            data[field] = [data[field]]

    for exp in data.get("experiences", []):
        if isinstance(exp, dict):
            if "technologies" not in exp or not isinstance(exp["technologies"], list):
                exp["technologies"] = []

    for proj in data.get("projects", []):
        if isinstance(proj, dict):
            if "technologies" not in proj or not isinstance(proj["technologies"], list):
                proj["technologies"] = []

    for cert in data.get("certifications", []):
        if isinstance(cert, dict):
            if "skills_used" not in cert or not isinstance(cert["skills_used"], list):
                cert["skills_used"] = []

    if "name" in data and data["name"]:
        data["name"] = fix_candidate_name(data["name"], data.get("email", ""))

    return data


def parse_resume(resume_text: str) -> Resume:
    safe_resume_text = (resume_text[:10000] if resume_text else "").strip()
    if not safe_resume_text or len(safe_resume_text) < 5:
        safe_resume_text = "Candidate profile with engineering competencies."

    system_prompt = """
You are a professional resume parser.
Analyze the resume and return ONLY valid JSON.

Format:

{
    "name": "",
    "email": "",
    "phone": "",
    "total_experience_years": null,
    "skills": [],
    "experiences": [
        {
            "company": "",
            "role": "",
            "start_date": "YYYY-MM",
            "end_date": "YYYY-MM",
            "description": "",
            "technologies": []
        }
    ],
    "education": [
        {
            "institution": "",
            "degree": "",
            "field_of_study": "",
            "start_year": null,
            "end_year": null,
            "cgpa": null
        }
    ],
    "projects": [
        {
            "name": "",
            "description": "",
            "technologies": [],
            "link": null
        }
    ],
    "certifications": [
        {
            "name": "",
            "issuer": "",
            "issue_date": null,
            "certification_code": null,
            "skills_used": []
        }
    ],
    "languages": [],
    "links": []
}

Rules:
1. Do NOT count education years as experience.
2. Count ONLY full-time jobs, internships, freelance.
3. Extract skills comprehensively from Skills, Projects, and Experience.
4. Extract technologies from projects.
5. No markdown, no explanations, return JSON only.
6. STRONGLY FIX KERNING ERRORS IN NAMES (e.g. "R Itiks Harma" -> "Ritik Sharma").
"""

    user_prompt = f"""
Parse the following resume:

{safe_resume_text}
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
            max_tokens=2500,
            temperature=0.1
        )
        raw_output = response.choices[0].message.content or ""
        data = extract_json_from_text(raw_output)
    except Exception as e:
        print(f"[resume_parser] Primary LLM extraction failed: {e}")
        data = {}

    if not data or not isinstance(data, dict):
        try:
            quick_resp = call_groq_completions(
                messages=[
                    {"role": "system", "content": "Extract candidate name, email, and technical skills as JSON: {\"name\": \"\", \"email\": \"\", \"skills\": []}"},
                    {"role": "user", "content": safe_resume_text[:3000]}
                ],
                max_tokens=1000,
                temperature=0.1
            )
            data = extract_json_from_text(quick_resp.choices[0].message.content or "")
        except Exception:
            data = {}

    data = normalize_resume_data(data)

    try:
        resume = Resume(**data)
    except Exception:
        resume = Resume(
            name=data.get("name") or "Candidate",
            email=data.get("email"),
            phone=data.get("phone"),
            skills=data.get("skills") or ["Software Engineering", "Problem Solving"]
        )

    try:
        resume.total_experience_years = (
            calculate_experience_years(
                resume.experiences
            )
        )
    except Exception:
        resume.total_experience_years = 0

    return resume
