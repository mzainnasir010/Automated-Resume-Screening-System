"""
F 06: Candidate Matching
Computes semantic similarity between a resume and a job description
using EmbeddingGemma, normalized into a 0 to 100 bounded score.
"""

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

_model = None


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("google/embeddinggemma-300m")
    return _model


def compute_similarity(resume_text: str, job_text: str) -> float:
    model = get_model()
    embeddings = model.encode([job_text, resume_text], normalize_embeddings=True)
    score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return float(score)


def normalize_score(raw_similarity: float) -> float:
    score = max(0.0, min(raw_similarity, 1.0)) * 100
    return round(score, 1)