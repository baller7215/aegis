"""Rule-based heuristic analysis of text."""

from app.models.analysis_models import HeuristicResults


def run_heuristics(text: str) -> HeuristicResults:
    """Run heuristic checks on extracted text."""
    if not text:
        return {
            "sensational_word_count": 0,
            "all_caps_ratio": 0,
            "exclamation_ratio": 0,
            "length": 0,
        }

    words = text.split()
    word_count = len(words)

    # sensational/loaded words (expand as needed)
    sensational_words = {
        "shocking", "outrageous", "breaking", "exclusive", "unbelievable",
        "massive", "explosive", "devastating", "controversial", "secret",
    }
    sensational_count = sum(1 for w in words if w.lower().rstrip(".,!?") in sensational_words)

    # all-caps ratio (headline-like emphasis)
    all_caps = sum(1 for w in words if len(w) > 1 and w.isupper())
    all_caps_ratio = all_caps / word_count if word_count else 0

    # exclamation marks
    exclamations = text.count("!")
    exclamation_ratio = exclamations / len(text) if text else 0

    return {
        "sensational_word_count": sensational_count,
        "all_caps_ratio": round(all_caps_ratio, 4),
        "exclamation_ratio": round(exclamation_ratio, 4),
        "length": len(text),
        "word_count": word_count,
    }
