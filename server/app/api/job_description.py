"""
F 05: Job Description Processing
Endpoint that accepts a typed job description and returns the
extracted required skill set.
"""

from fastapi import APIRouter, HTTPException
from app.src import pipeline
from app.models.schemas import JobDescriptionRequest, JobDescriptionResult

router = APIRouter()
MIN_CHARS = 100


@router.post("/job-description", response_model=JobDescriptionResult)
async def submit_job_description(payload: JobDescriptionRequest):
    if len(payload.text.strip()) < MIN_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Job description must be at least {MIN_CHARS} characters",
        )
    return pipeline.process_job_description(payload.text)