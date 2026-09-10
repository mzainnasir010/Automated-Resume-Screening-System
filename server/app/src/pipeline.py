# server/app/src/pipeline.py
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
from app.src.preprocessing import get_nlp, clean_text

CANDIDATE_STORE: Dict[str, dict] = {}
JOB_DESCRIPTION_STORE: Optional[dict] = None


def new_candidate_id() -> str:
    return f"cand_{uuid.uuid4().hex[:8]}"

NAME_HEADER_BLOCKLIST = {
    "resume", "curriculum vitae", "cv", "biodata", "profile",
    "contact", "contact information", "objective", "summary",
    "personal details", "career objective", "professional summary",
}


def _looks_like_a_name(line: str) -> Optional[str]:
    """Heuristic pass: a line that is ONLY a name (e.g. 'Jane Doe' sitting
    alone at the top of a resume) is the most common and most reliable
    signal, so we check for it before reaching for NER."""
    if not line or len(line) > 40:
        return None
    words = line.split()
    if not (1 < len(words) <= 4):
        return None
    if any(ch.isdigit() for ch in line) or "@" in line:
        return None
    if all(w[:1].isupper() and w[1:].islower() for w in words if w.isalpha()):
        return line
    return None


def extract_candidate_name(raw_text: str, nlp) -> Optional[str]:
    """
    Best-effort candidate name extraction from the top of a resume.
    Tries a title-case heuristic on the first few non-empty lines first
    (catches the common case where the name sits alone at the top),
    then falls back to spaCy's PERSON entity recognizer run line by line
    for messier headers. Returns None if nothing trustworthy is found,
    so the caller falls back to the filename.
    """
    lines = [l.strip() for l in raw_text.splitlines() if l.strip()][:6]

    for line in lines:
        if line.lower() in NAME_HEADER_BLOCKLIST:
            continue
        name = _looks_like_a_name(line)
        if name:
            return name

    for line in lines:
        if line.lower() in NAME_HEADER_BLOCKLIST or "@" in line or any(ch.isdigit() for ch in line):
            continue
        doc = nlp(line)
        persons = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
        if persons:
            return persons[0]

    return None


def process_resume(candidate_id: str, filename: str, file_bytes: bytes) -> dict:
    nlp = get_nlp()
    raw_text, status = extraction.extract_text_from_pdf(file_bytes)

    # Name extraction happens on the pre-clean text, while line breaks
    # still exist, since clean_text() collapses all whitespace to single
    # spaces (see below) and would destroy the line structure this relies on.
    extracted_name = extract_candidate_name(raw_text, nlp) if status == "ok" else None
    name = extracted_name or filename.rsplit(".", 1)[0]
    name_source = "extracted" if extracted_name else "filename"

    # F-03: normalize whitespace and bullet glyphs before anything downstream
    # sees this text. We deliberately stop at clean_text() here rather than
    # running the full tokenize/lemmatize/stopword-removal pipeline
    # (preprocessing.preprocess()) on the text that feeds skill matching and
    # embeddings: that fuller pass fragments technical tokens the brief asks
    # us to preserve (e.g. "CI/CD" -> "ci cd"), and lemmatized, stopword-
    # stripped text also degrades the sentence-transformer embeddings, which
    # expect natural phrasing. preprocess() is still available/documented
    # for anyone who wants a bag-of-lemmas view of the text.
    raw_text = clean_text(raw_text)

    record = {
        "candidate_id": candidate_id,
        "name": name,
        "name_source": name_source,
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
    text = clean_text(text)  # F-03: identical normalization path as resumes
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

    ok_candidates = [(cid, rec) for cid, rec in CANDIDATE_STORE.items() if rec["extraction_status"] == "ok"]
    failed_candidates = [(cid, rec) for cid, rec in CANDIDATE_STORE.items() if rec["extraction_status"] != "ok"]

    results = []

    for candidate_id, record in failed_candidates:
        results.append({
            "candidate_id": candidate_id,
            "name": record["name"],
            "name_source": record["name_source"],
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

    if ok_candidates:
        texts_to_embed = [job_text] + [rec["raw_text"] for _, rec in ok_candidates]
        embeddings = matching.embed_texts(texts_to_embed)
        job_embedding = embeddings[0]
        resume_embeddings = embeddings[1:]

        for (candidate_id, record), resume_embedding in zip(ok_candidates, resume_embeddings):
            similarity = matching.similarity_from_embeddings(job_embedding, resume_embedding)
            matched = [s for s in record["skills_found"] if s in required_skills]
            missing = skills.missing_skills(required_skills, record["skills_found"])

            base_score = matching.normalize_score(similarity)
            skill_overlap = (len(matched) / len(required_skills) * 100) if required_skills else 0.0
            final_score = round((base_score * 0.6) + (skill_overlap * 0.4), 1)

            results.append({
                "candidate_id": candidate_id,
                "name": record["name"],
                "name_source": record["name_source"],
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

def clear_session():
    global JOB_DESCRIPTION_STORE
    CANDIDATE_STORE.clear()
    JOB_DESCRIPTION_STORE = None