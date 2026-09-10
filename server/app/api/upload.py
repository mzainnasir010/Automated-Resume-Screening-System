"""
F 01: Resume Upload
Endpoint that accepts a batch of PDF resumes, validates file type,
and returns the list of accepted and rejected files.
"""

from fastapi import APIRouter, UploadFile, File
from typing import List
from app.src import pipeline
from app.models.schemas import UploadResponse

router = APIRouter()
ALLOWED_TYPE = "application/pdf"


@router.post("/upload", response_model=UploadResponse)
async def upload_resumes(files: List[UploadFile] = File(...)):
    accepted = []
    rejected = []

    for f in files:
        if f.content_type != ALLOWED_TYPE:
            rejected.append({"filename": f.filename, "reason": "Only PDF files are supported"})
            continue

        contents = await f.read()
        if len(contents) == 0:
            rejected.append({"filename": f.filename, "reason": "File is empty"})
            continue

        candidate_id = pipeline.new_candidate_id()
        pipeline.process_resume(candidate_id, f.filename, contents)
        accepted.append(f.filename)

    return {"accepted": accepted, "rejected": rejected}