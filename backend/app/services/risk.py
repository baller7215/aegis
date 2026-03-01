"""risk scoring from heuristics and LLM results"""

from app.models.analysis_models import HeuristicResults, LLMResults, RiskResults

# TODO: hardcoded rn so make more dynamic w transformers/llms
def compute_risk(
    heuristic_results: HeuristicResults,
    llm_results: LLMResults,
) -> RiskResults:
    """combine heuristic and LLM signals into risk scores"""
    score = 0.0
    factors: list[str] = []

    # confidence vs evidence gap (primary signal)
    confidence = heuristic_results.get("confidence_score", 0.5)
    evidence = heuristic_results.get("evidence_score", 0.5)
    gap = confidence - evidence
    if gap > 0.3:
        score += min(gap * 1.5, 0.6)
        factors.append("high confidence gap (low evidence relative to certainty)")
    elif gap > 0.15:
        score += 0.2
        factors.append("moderate confidence gap")

    domain = heuristic_results.get("domain", "general")
    if domain in ("medical", "legal", "financial") and gap > 0.2:
        score += 0.15
        factors.append(f"elevated risk in {domain} domain")

    # clamp to [0, 1]
    score = min(max(score, 0), 1)

    return {
        "overall_score": round(score, 2),
        "level": "low" if score < 0.4 else "medium" if score < 0.7 else "high",
        "factors": factors,
    }
