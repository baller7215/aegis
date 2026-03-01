"""semantic similarity-based confidence scoring using sentence embeddings"""

import logging
import re
from typing import Optional

logger = logging.getLogger(__name__)

CONFIDENT_REFS = [
    "This is definitely the case.",
    "It is certain that this is true.",
    "This will always work.",
    "There is no doubt about this.",
    "This is guaranteed to be correct.",
]

HEDGED_REFS = [
    "This might be the case.",
    "It is possible that this could happen.",
    "This may or may not be true.",
    "There is some uncertainty here.",
    "This could vary depending on context.",
]

MAX_CHUNKS = 50  # cap for long responses
_MODEL = None
_CONFIDENT_EMBEDS = None
_HEDGED_EMBEDS = None


def _get_model():
    """lazy-load the sentence transformer model"""
    global _MODEL
    if _MODEL is None:
        logger.info("[Aegis semantic] Loading sentence-transformers model (all-MiniLM-L6-v2)...")
        from sentence_transformers import SentenceTransformer
        _MODEL = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("[Aegis semantic] Model loaded successfully")
    return _MODEL


def _get_ref_embeddings():
    """lazy-load and cache reference embeddings"""
    global _CONFIDENT_EMBEDS, _HEDGED_EMBEDS
    if _CONFIDENT_EMBEDS is None:
        logger.info("[Aegis semantic] Encoding reference sentences...")
        model = _get_model()
        _CONFIDENT_EMBEDS = model.encode(CONFIDENT_REFS)
        _HEDGED_EMBEDS = model.encode(HEDGED_REFS)
        logger.info("[Aegis semantic] Reference embeddings cached")
    return _CONFIDENT_EMBEDS, _HEDGED_EMBEDS


def _chunk_by_sentence(text: str) -> list[str]:
    """split text into sentences, filter empty, cap at MAX_CHUNKS"""
    if not text or not text.strip():
        return []
    sentences = re.split(r'[.!?]+', text)
    chunks = [s.strip() for s in sentences if s.strip()]
    return chunks[:MAX_CHUNKS]


def compute_semantic_confidence(text: str) -> Optional[float]:
    """
    compute confidence score (0-1) via semantic similarity to confident vs hedged reference sentences
    @param {string} text - the text to analyze
    @return {Optional[float]} - the confidence score 0-1, or None on failure (model load, empty text, etc.)
    """
    if not text or not text.strip():
        logger.debug("[Aegis semantic] Empty text, returning None")
        return None

    try:
        import numpy as np
    except ImportError:
        logger.warning("[Aegis semantic] numpy not available, falling back to keyword-only")
        return None

    try:
        chunks = _chunk_by_sentence(text)
        if not chunks:
            logger.debug("[Aegis semantic] No chunks after sentence split, returning None")
            return None

        logger.info("[Aegis semantic] Processing %d sentence chunks", len(chunks))

        model = _get_model()
        confident_embeds, hedged_embeds = _get_ref_embeddings()

        chunk_embeds = model.encode(chunks)

        # for each chunk: max cosine similarity to confident refs, max to hedged refs
        # use dot product (normalized = cosine sim when vectors are L2-normalized)
        chunk_scores = []
        for ce in chunk_embeds:
            ce_norm = ce / (np.linalg.norm(ce) + 1e-8)
            conf_sim = float(np.max(np.dot(confident_embeds, ce_norm)))
            hedg_sim = float(np.max(np.dot(hedged_embeds, ce_norm)))
            # Clamp sims to [0, 1] (cosine can be in [-1, 1])
            conf_sim = max(0, min(1, (conf_sim + 1) / 2))
            hedg_sim = max(0, min(1, (hedg_sim + 1) / 2))
            score = conf_sim / (conf_sim + hedg_sim + 1e-8)
            chunk_scores.append(score)

        aggregated = float(np.mean(chunk_scores))
        result = min(max(aggregated, 0.0), 1.0)
        logger.info("[Aegis semantic] semantic_confidence=%.2f (from %d chunks)", result, len(chunks))
        return result

    except ImportError as e:
        logger.warning(
            "[Aegis semantic] sentence_transformers not found: %s. Run: pip install sentence-transformers. Falling back to keyword-only.",
            e,
        )
        return None
    except Exception as e:
        logger.warning("[Aegis semantic] Error computing semantic confidence: %s", e)
        return None
