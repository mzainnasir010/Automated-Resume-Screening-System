"""
F 03: NLP Processing
Cleans and normalizes extracted text using spaCy. Same pipeline is
used for resumes and job descriptions, so comparison happens on
content rather than formatting noise.
"""

import re
import spacy

_nlp = None


def get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = text.replace("•", " ").replace("●", " ").replace("▪", " ")
    return text.strip()


def preprocess(text: str) -> str:
    cleaned = clean_text(text)
    nlp = get_nlp()
    doc = nlp(cleaned)
    tokens = [
        token.lemma_.lower()
        for token in doc
        if not token.is_stop and not token.is_punct and not token.is_space
    ]
    return " ".join(tokens)