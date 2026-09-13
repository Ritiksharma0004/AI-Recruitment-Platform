from pathlib import Path
import shutil

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException
)
from fastapi.middleware.cors import CORSMiddleware

from models.job_request import JobRequest
from models.ats_request import ATSRequest

from services.jd_parser import parse_job_description

from services.resume_parser import (
    read_resume,
    parse_resume as parse_resume_service
)

from services.ats_scorer import final_score
from services.resume_optimizer import optimize_resume

app = FastAPI(
    title="AI Recruitment Service",
    description="Resume Parsing, ATS Scoring, and AI Resume Optimizer Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {
        "message": "AI Service Running"
    }


@app.post("/parse-job")
def parse_job(request: JobRequest):

    try:

        job = parse_job_description(
            request.job_description
        )

        return job

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/parse-resume")
async def parse_resume_endpoint(
        file: UploadFile = File(...)
):

    try:

        uploads_dir = Path("uploads")
        uploads_dir.mkdir(
            exist_ok=True
        )

        file_path = uploads_dir / file.filename

        with open(
                file_path,
                "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        resume_text = read_resume(
            file_path
        )

        parsed_resume = parse_resume_service(
            resume_text
        )

        return parsed_resume

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/ats-score")
def ats_score(
        request: ATSRequest
):

    try:

        job = parse_job_description(
            request.job_description
        )

        resume = parse_resume_service(
            request.resume_text
        )

        result = final_score(
            job,
            resume
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/ats-score-upload")
async def ats_score_upload(
        job_description: str = Form(...),
        file: UploadFile = File(...)
):
    try:
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(exist_ok=True)
        file_path = uploads_dir / file.filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        resume_text = read_resume(file_path)
        job = parse_job_description(job_description)
        resume = parse_resume_service(resume_text)
        
        result = final_score(job, resume)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize-resume")
def optimize_resume_endpoint(request: ATSRequest):
    try:
        return optimize_resume(
            request.job_description,
            request.resume_text
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/optimize-resume-upload")
async def optimize_resume_upload_endpoint(
        job_description: str = Form(...),
        file: UploadFile = File(...)
):
    try:
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(exist_ok=True)
        file_path = uploads_dir / file.filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        resume_text = read_resume(file_path)
        return optimize_resume(job_description, resume_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
