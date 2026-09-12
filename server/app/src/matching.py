from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import spaces

_model = None
MAX_CHARS = 3000


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("google/embeddinggemma-300m")
    return _model


@spaces.GPU
def embed_texts(texts: list[str]):
    model = get_model()
    trimmed = [t[:MAX_CHARS] for t in texts]
    return model.encode(trimmed, normalize_embeddings=True, batch_size=8)


def similarity_from_embeddings(job_embedding, resume_embedding) -> float:
    score = cosine_similarity([job_embedding], [resume_embedding])[0][0]
    return float(score)


def normalize_score(raw_similarity: float) -> float:
    score = max(0.0, min(raw_similarity, 1.0)) * 100
    return round(score, 1)