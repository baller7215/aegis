"""LLM-based structured analysis of text"""

from app.models.analysis_models import LLMResults
from app.services.structured_extraction import extract_structured_signals


async def run_llm_analysis(text: str) -> LLMResults:
    """run structured extraction via 4o-mini and return as LLMResults"""
    if not text:
        return {
            "assumptions": [],
            "missing_context": [],
            "bias_type": None,
            "bias_explanation": None,
            "failure_modes": [],
            "decision_delegation_detected": False,
            "context_sensitivity": {},
        }

    result = await extract_structured_signals(text)
    return {
        "assumptions": result.assumptions,
        "missing_context": result.missing_context,
        "bias_type": result.bias_type,
        "bias_explanation": result.bias_explanation,
        "failure_modes": result.failure_modes,
        "decision_delegation_detected": result.decision_delegation_detected,
        "context_sensitivity": result.context_sensitivity,
    }
