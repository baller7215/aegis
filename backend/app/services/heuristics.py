"""Rule-based heuristic analysis of text."""

import re

from app.models.analysis_models import HeuristicResults

# TODO: expand with more words or make more dynamic w transformers/llms
CERTAINTY_WORDS = [
    "always", "never", "definitely", "clearly",
    "guaranteed", "proven", "will", "undoubtedly",
    "certainly", "obviously", "must", "certain",
]

HEDGE_WORDS = [
    "may", "might", "could", "possibly",
    "suggests", "likely", "appears", "perhaps",
    "sometimes", "generally", "usually", "tends",
]

# TODO: expand with more patterns or make more dynamic w transformers/llms
EVIDENCE_PATTERNS = [
    r"\baccording to\b",
    r"\bstudy\b",
    r"\bstudies\b",
    r"\bresearch\b",
    r"\breport\b",
    r"\breports\b",
    r"\bdata shows\b",
    r"\bdata suggests\b",
    r"\bevidence\b",
    r"\bsurvey\b",
    r"\bpublished\b",
    r"\bpaper\b",
    r"\bjournal\b",
    r"\bcitation\b",
    r"\bcited\b",
    r"\bsource\b",
    r"\bsources\b",
    r"\bstatistics\b",
    r"\bpercent\b",
    r"\b%",
]

# TODO: expand with more domains or make more dynamic w transformers/llms
DOMAIN_KEYWORDS = {
    "medical": [
        "cancer", "treatment", "disease", "symptoms", "diagnosis",
        "medication", "therapy", "patient", "doctor", "health",
        "vitamin", "cure", "drug", "clinical",
    ],
    "legal": [
        "lawsuit", "illegal", "contract", "court", "lawyer",
        "legal", "rights", "claim", "liable", "regulation",
    ],
    "financial": [
        "invest", "stock", "crypto", "profit", "market",
        "trading", "return", "investment", "revenue", "price",
    ],
    "political": [
        "election", "vote", "policy", "government", "political",
        "democrat", "republican", "congress", "senate",
    ],
}


def run_heuristics(text: str) -> HeuristicResults:
    """
    Runs heuristic checks on extracted text
    @param {string} text - the text to analyze
    @returns {HeuristicResults} - the heuristic results
    {
        "confidence_score": float,
        "evidence_score": float,
        "domain": str
    }
    """
    if not text:
        return {
            "confidence_score": 0.0,
            "evidence_score": 0.0,
            "domain": "general",
        }

    text_lower = text.lower()
    words = text_lower.split()

    # confidence score calculation: certainty_hits vs hedge_hits
    certainty_hits = sum(1 for w in words if w.rstrip(".,!?:;") in CERTAINTY_WORDS)
    hedge_hits = sum(1 for w in words if w.rstrip(".,!?:;") in HEDGE_WORDS)
    confidence_raw = certainty_hits - hedge_hits
    # base confidence score is 0.5, +0.3 per net certainty, -0.3 per net hedge; clamp to [0, 1]
    confidence_score = 0.5 + 0.3 * confidence_raw
    confidence_score = min(max(confidence_score, 0.0), 1.0)

    # evidence score calculation: presence of evidence markers
    evidence_count = 0
    for pattern in EVIDENCE_PATTERNS:
        evidence_count += len(re.findall(pattern, text_lower, re.IGNORECASE))
    # normalize: cap at ~10 hits for full score
    evidence_score = min(evidence_count / 5.0, 1.0)
    evidence_score = round(evidence_score, 2)

    # domain detection: keyword classification
    domain_scores: dict[str, int] = {}
    for domain, keywords in DOMAIN_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            domain_scores[domain] = score
    domain = max(domain_scores, key=domain_scores.get) if domain_scores else "general"

    return {
        "confidence_score": round(confidence_score, 2),
        "evidence_score": round(evidence_score, 2),
        "domain": domain,
    }
