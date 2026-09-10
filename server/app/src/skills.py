"""
F 04 / F 08: Skill Extraction and Missing Skills
Uses spaCy PhraseMatcher plus a curated taxonomy to identify skills,
and computes the gap between required and found skills.
"""

import json
from pathlib import Path
from spacy.matcher import PhraseMatcher

TAXONOMY_PATH = Path(__file__).resolve().parents[2] / "data" / "skills_taxonomy.json"

_matcher = None


def _load_taxonomy() -> dict:
    with open(TAXONOMY_PATH, "r") as f:
        return json.load(f)


def _build_matcher(nlp):
    global _matcher
    taxonomy = _load_taxonomy()
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    for category, category_skills in taxonomy.items():
        for canonical, aliases in category_skills.items():
            patterns = [nlp.make_doc(alias) for alias in aliases]
            matcher.add(canonical, patterns)
    _matcher = matcher
    return matcher


def extract_skills(text: str, nlp) -> list[str]:
    matcher = _matcher or _build_matcher(nlp)
    doc = nlp.make_doc(text.lower())
    matches = matcher(doc)
    found = {nlp.vocab.strings[match_id] for match_id, _, _ in matches}
    return sorted(found)


def missing_skills(required: list[str], found: list[str]) -> list[str]:
    found_set = set(found)
    return [s for s in required if s not in found_set]