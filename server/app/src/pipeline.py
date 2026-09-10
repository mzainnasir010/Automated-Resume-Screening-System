"""
Orchestration layer.
Holds the in memory candidate and job description store, and wires
extraction -> skill extraction -> matching -> ranking together.
This project has no auth or multi tenancy, so a single in process
store is enough, per the brief's stated scope.
"""
import re

import uuid
from typing import Dict, List, Optional

from app.src import extraction, skills, matching, ranking
from app.src.preprocessing import get_nlp

CANDIDATE_STORE: Dict[str, dict] = {}
JOB_DESCRIPTION_STORE: Optional[dict] = None


def new_candidate_id() -> str:
    return f"cand_{uuid.uuid4().hex[:8]}"

def process_resume(candidate_id: str, filename: str, file_bytes: bytes) -> dict:
    nlp = get_nlp()
    raw_text, status = extraction.extract_text_from_pdf(file_bytes)

    record = {
        "candidate_id": candidate_id,
        "name": filename.rsplit(".", 1)[0],
        "source_file": filename,
        "extraction_status": status,
        "raw_text_chars": len(raw_text),
        "raw_text": raw_text,
        "skills_found": [],
        "warnings": [],
    }

    if status != "ok":
        record["warnings"].append("Could not extract readable text from this file")
        CANDIDATE_STORE[candidate_id] = record
        return record

    record["skills_found"] = skills.extract_skills(raw_text, nlp)
    CANDIDATE_STORE[candidate_id] = record
    return record


TITLE_PATTERNS = [
    r"hiring (?:an?|for an?)?\s*([A-Z][A-Za-z0-9/&+\- ]{2,50}?)(?:\s+with|\s+who|\.|,|\n)",
    r"looking for (?:an?)?\s*([A-Z][A-Za-z0-9/&+\- ]{2,50}?)(?:\s+with|\s+who|\.|,|\n)",
    r"position of\s*([A-Z][A-Za-z0-9/&+\- ]{2,50}?)(?:\s+with|\s+who|\.|,|\n)",
    r"job title\s*[:\-]\s*([A-Za-z0-9/&+\- ]{2,50}?)(?:\n|$)",
    r"role\s*[:\-]\s*([A-Za-z0-9/&+\- ]{2,50}?)(?:\n|$)",
]


def extract_job_title(text: str) -> str:
    for pattern in TITLE_PATTERNS:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()
    first_line = text.strip().split("\n")[0].strip()
    return first_line[:80] if first_line else "Not specified"


def process_job_description(text: str) -> dict:
    global JOB_DESCRIPTION_STORE
    nlp = get_nlp()
    required = skills.extract_skills(text, nlp)

    result = {
        "job_title": extract_job_title(text),
        "raw_text": text,
        "required_skills": required,
        "essential_skills": required,
        "desirable_skills": [],
    }
    JOB_DESCRIPTION_STORE = result
    return result


def run_scoring() -> List[dict]:
    if JOB_DESCRIPTION_STORE is None:
        raise ValueError("Submit a job description before requesting scores")
    if not CANDIDATE_STORE:
        raise ValueError("Upload at least one resume before requesting scores")

    job_text = JOB_DESCRIPTION_STORE["raw_text"]
    required_skills = JOB_DESCRIPTION_STORE["required_skills"]

    results = []
    for candidate_id, record in CANDIDATE_STORE.items():
        if record["extraction_status"] != "ok":
            results.append({
                "candidate_id": candidate_id,
                "name": record["name"],
                "source_file": record["source_file"],
                "extraction_status": record["extraction_status"],
                "raw_text_chars": record["raw_text_chars"],
                "skills_found": [],
                "skills_matched": [],
                "skills_missing": required_skills,
                "similarity_raw": 0.0,
                "match_score": 0.0,
                "summary": "",
                "warnings": record["warnings"],
                "rank": 0,
            })
            continue

        similarity = matching.compute_similarity(record["raw_text"], job_text)
        matched = [s for s in record["skills_found"] if s in required_skills]
        missing = skills.missing_skills(required_skills, record["skills_found"])

        base_score = matching.normalize_score(similarity)
        skill_overlap = (len(matched) / len(required_skills) * 100) if required_skills else 0.0
        final_score = round((base_score * 0.6) + (skill_overlap * 0.4), 1)

        results.append({
            "candidate_id": candidate_id,
            "name": record["name"],
            "source_file": record["source_file"],
            "extraction_status": record["extraction_status"],
            "raw_text_chars": record["raw_text_chars"],
            "skills_found": record["skills_found"],
            "skills_matched": matched,
            "skills_missing": missing,
            "similarity_raw": round(similarity, 4),
            "match_score": final_score,
            "summary": (record["raw_text"][:200].strip() + "...") if record["raw_text"] else "",
            "warnings": record["warnings"],
            "rank": 0,
        })

    return ranking.rank_candidates(results)