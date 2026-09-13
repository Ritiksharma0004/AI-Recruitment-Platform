# from pydantic import BaseModel
#
# class Experience(BaseModel):
#     company: str | None = None
#     role: str | None = None
#     duration: str | None = None
#     description: str | None = None
#     skills_used: list[str] = []
#
# class Resume(BaseModel):
#     name: str | None = None
#     email: str | None = None
#     phone: str | None = None
#
#     total_experience_years: float | None = None
#
#     skills: list[str] = []
#     experiences: list[Experience] = []
#     education: list = []
#     projects: list = []
#     certifications: list = []




from pydantic import BaseModel


class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    duration: str | None = None
    description: str | None = None
    skills_used: list[str] = []


class Education(BaseModel):
    school: str | None = None
    degree: str | None = None
    field: str | None = None
    graduation_year: str | None = None
    CGPA: str | None = None


class Project(BaseModel):
    title: str | None = None
    type: str | None = None
    languages: list[str] = []
    technologies: list[str] = []


class Certification(BaseModel):
    name: str | None = None
    code: str | None = None


class Resume(BaseModel):

    name: str | None = None
    email: str | None = None
    phone: str | None = None

    total_experience_years: float | None = None

    skills: list[str] = []

    experiences: list[Experience] = []

    education: list[Education] = []

    projects: list[Project] = []

    certifications: list[Certification] = []
