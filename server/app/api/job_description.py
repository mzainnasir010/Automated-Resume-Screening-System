# server/app/api/job_description.py
"""
F 05: Job Description Processing
Endpoints that accept a job description either as typed text or as an
uploaded file (PDF or .txt). Both paths converge on the same
pipeline.process_job_description() call, so typed and uploaded
descriptions are validated and processed identically downstream.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from app.src import pipeline, extraction
from app.models.schemas import JobDescriptionRequest, JobDescriptionResult

router = APIRouter()
MIN_CHARS = 100
ALLOWED_UPLOAD_TYPES = {"application/pdf", "text/plain"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB, a job description has no business being larger


def _validate_and_process(text: str) -> JobDescriptionResult:
    if len(text.strip()) < MIN_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Job description must be at least {MIN_CHARS} characters",
        )
    return pipeline.process_job_description(text)


@router.post("/job-description", response_model=JobDescriptionResult)
async def submit_job_description(payload: JobDescriptionRequest):
    return _validate_and_process(payload.text)


@router.post("/job-description/upload", response_model=JobDescriptionResult)
async def upload_job_description(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_UPLOAD_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PDF or plain text (.txt) files are supported for job descriptions",
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds the {MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB size limit",
        )

    if file.content_type == "application/pdf":
        text, status = extraction.extract_text_from_pdf(contents)
        if status != "ok":
            raise HTTPException(
                status_code=400,
                detail="Could not extract readable text from this PDF. Try pasting the description instead.",
            )
    else:
        try:
            text = contents.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Could not read this file as text")

    return _validate_and_process(text)