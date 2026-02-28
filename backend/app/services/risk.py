"""risk scoring from heuristics and LLM results"""

from app.models.analysis_models import HeuristicResults, LLMResults, RiskResults


def compute_risk(
    heuristic_results: HeuristicResults,
    llm_results: LLMResults,
) -> RiskResults:
    """combine heuristic and LLM signals into risk scores"""
    score = 0.0
    factors: list[str] = []

    # heuristic contributions
    sens = heuristic_results.get("sensational_word_count", 0)
    if sens > 0:
        score += min(sens * 0.1, 0.3)
        factors.append(f"high sensational language ({sens} terms)")

    all_caps = heuristic_results.get("all_caps_ratio", 0)
    if all_caps > 0.05:
        score += 0.15
        factors.append("excessive caps")

    excl = heuristic_results.get("exclamation_ratio", 0)
    if excl > 0.01:
        score += min(excl * 5, 0.2)
        factors.append("high exclamation use")

    # llm contributions (placeholder)
    confidence = llm_results.get("factual_confidence", 0.5)
    if confidence < 0.4:
        score += 0.2
        factors.append("low factual confidence")

    # clamp to [0, 1]
    score = min(max(score, 0), 1)

    return {
        "overall_score": round(score, 2),
        "level": "low" if score < 0.4 else "medium" if score < 0.7 else "high",
        "factors": factors,
    }
