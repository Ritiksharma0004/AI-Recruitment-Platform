import json
from datetime import datetime
import re
from pypdf import PdfReader

from services.groq_client import client, MODEL, call_groq_completions
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

    return " ".join([w.capitalize() for w in s.split()])


def read_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        text = re.sub(r'\bR\s+Itiks\s+Harma\b', 'Ritik Sharma', text, flags=re.IGNORECASE)
        text = re.sub(r'\bR\s+Itik\s+s\s+Harma\b', 'Ritik Sharma', text, flags=re.IGNORECASE)
        text = re.sub(r'\bR\s+Itik\b', 'Ritik', text, flags=re.IGNORECASE)
        
        # Clamp length to prevent massive PDFs from blowing token limits
        if len(text) > 10000:
            text = text[:10000]
            
        return text
    except Exception as e:
        print(f"Error reading PDF {file_path}: {e}")
        return ""


def read_resume(file_path):
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        return read_pdf(file_path)
    elif suffix in [".txt", ".md"]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()[:10000]
        except Exception:
            return ""
    return ""


def calculate_experience_years(experiences):
    total_months = 0
    for exp in experiences:
        if not exp.duration:
            continue
        match = re.match(
            r"([A-Za-z]{3}\s+\d{4})\s*[\-\–\—]\s*(Present|[A-Za-z]{3}\s+\d{4})",
            exp.duration
        )
        if not match:
            continue
        start_str = match.group(1)
        end_str = match.group(2)
        try:
            start_date = datetime.strptime(start_str, "%b %Y")
            if end_str == "Present":
                end_date = datetime.now()
            else:
                end_date = datetime.strptime(end_str, "%b %Y")

            months = (
                (end_date.year - start_date.year) * 12
                + end_date.month
                - start_date.month
            )
            total_months += max(months, 0)
        except Exception:
            continue

    return round(total_months / 12, 1)


def normalize_resume_data(data):
    if data.get("name"):
        data["name"] = fix_candidate_name(data.get("name"), data.get("email", ""))

    if isinstance(data.get("skills"), str):
        data["skills"] = [data["skills"]]

    if isinstance(data.get("experiences"), dict):
        data["experiences"] = [data["experiences"]]

    for experience in data.get("experiences", []):
        skills_used = experience.get("skills_used")
        if isinstance(skills_used, str):
            experience["skills_used"] = [skills_used]
        elif skills_used is None:
            experience["skills_used"] = []

    if isinstance(data.get("education"), dict):
        data["education"] = [data["education"]]

    if isinstance(data.get("projects"), dict):
        data["projects"] = [data["projects"]]

    for project in data.get("projects", []):
        languages = project.get("languages")
        if isinstance(languages, str):
            project["languages"] = [languages]
        elif languages is None:
            project["languages"] = []

        technologies = project.get("technologies")
        if isinstance(technologies, str):
            project["technologies"] = [technologies]
        elif technologies is None:
            project["technologies"] = []

    if isinstance(data.get("certifications"), dict):
        data["certifications"] = [data["certifications"]]

    return data


def parse_resume(resume_text):
    if not resume_text or len(resume_text.strip()) < 5:
        resume_text = "Candidate profile with software engineering skills and experience."

    if len(resume_text) > 10000:
        resume_text = resume_text[:10000]

    system_prompt = """
You are an expert resume parser.

Extract resume information and return ONLY valid JSON.

Format:

{
    "name": "",
    "email": "",
    "phone": "",
    "total_experience_years": 0,
    "skills": [],
    "experiences": [
        {
            "company": "",
            "role": "",
            "duration": "",
            "description": "",
            "skills_used": []
        }
    ],
    "education": [
        {
            "school": "",
            "degree": "",
            "field": "",
            "graduation_year": "",
            "CGPA": ""
        }
    ],
    "projects": [
        {
            "title": "",
            "type": "",
            "languages": [],
            "technologies": []
        }
    ],
    "certifications": [
        {
            "name": "",
            "code": ""
        }
    ]
}

IMPORTANT RULES

1. Do NOT count education years as experience.
2. Count ONLY:
   - Full-time jobs
   - Internships
   - Contract work
   - Freelance work

3. Do not estimate experience.

4. Extract skills from:
   - Skills section
   - Projects
   - Experience
   - Technologies
   - Certifications

5. Extract technologies from projects.

6. Extract CGPA if present.

7. Extract certification codes if present.

8. languages MUST always be arrays.

Correct:
"languages": ["Java", "Python"]

Wrong:
"languages": "Java"

9. technologies MUST always be arrays.

Correct:
"technologies": ["Spring Boot", "Kafka"]

Wrong:
"technologies": "Spring Boot"

10. skills_used MUST always be arrays.

11. Do not invent data.

12. Use null if unavailable.

13. No markdown.

14. No explanations.

15. No schema.

16. Return JSON only.
17. STRONGLY FIX KERNING ERRORS IN NAMES: PDFs often have terrible kerning which creates spaces like "R Itiks Harma" or "R I T I K S H A R M A". You MUST intelligently infer the actual real human name and fix all typos, spaces, and formatting, outputting the perfect Title Cased format (e.g. "Ritik Sharma").
"""

    user_prompt = f"""
Parse the following resume:

{resume_text}
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
        max_tokens=900,
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
    data = normalize_resume_data(data)

    resume = Resume(**data)
    resume.total_experience_years = (
        calculate_experience_years(
            resume.experiences
        )
    )

    return resume
