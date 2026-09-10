"""
F 06 / F 07 / F 08: Candidate Matching, Ranking, Missing Skills
Runs the full pipeline against whatever resumes and job description
are currently in memory, and returns the ranked candidate list.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.src import pipeline
from app.models.schemas import CandidateRecord

router = APIRouter()


@router.post("/score", response_model=List[CandidateRecord])
async def get_scores():
    try:
        return pipeline.run_scoring()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))