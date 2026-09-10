from pydantic import BaseModel, Field
from typing import List, Literal

ExtractionStatus = Literal["ok", "empty_text", "parse_error"]


class CandidateRecord(BaseModel):
    candidate_id: str
    name: str
    source_file: str
    extraction_status: ExtractionStatus
    raw_text_chars: int
    skills_found: List[str]
    skills_matched: List[str]
    skills_missing: List[str]
    similarity_raw: float
    match_score: float
    rank: int
    summary: str
    warnings: List[str]


class JobDescriptionRequest(BaseModel):
    text: str = Field(..., min_length=1)


class JobDescriptionResult(BaseModel):
    job_title: str
    raw_text: str
    required_skills: List[str]
    essential_skills: List[str]
    desirable_skills: List[str]


class RejectedFile(BaseModel):
    filename: str
    reason: str


class UploadResponse(BaseModel):
    accepted: List[str]
    rejected: List[RejectedFile]