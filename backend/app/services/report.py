"""build final analysis report from pipeline results"""

from app.models.analysis_models import (
    ContentMetadata,
    HeuristicResults,
    LLMResults,
    RiskResults,
)


def build_report(
    text: str,
    metadata: ContentMetadata,
    heuristic_results: HeuristicResults,
    llm_results: LLMResults,
    risk_results: RiskResults,
) -> dict:
    """combine all pipeline outputs into a single report"""
    return {
        "metadata": metadata,
        "risk": risk_results,
        "heuristics": heuristic_results,
        "llm_analysis": llm_results,
        "content_preview": text[:1000] + ("..." if len(text) > 1000 else ""),
    }
