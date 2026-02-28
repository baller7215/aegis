"""llm-based structured analysis of text"""

from app.models.analysis_models import LLMResults


async def run_llm_analysis(text: str) -> LLMResults:
    """Run LLM structured analysis on text."""
    # @TODO: integrate with OpenAI/Anthropic/etc for real analysis
    # placeholder returns mock structure until LLM is wired up
    if not text:
        return {
            "claims": [],
            "bias_indicators": [],
            "factual_confidence": 0,
            "summary": "",
        }

    # truncate for placeholder (real LLM would process full text)
    preview = text[:500] if len(text) > 500 else text

    return {
        "claims": [],
        "bias_indicators": [],
        "factual_confidence": 0,
        "summary": preview + ("..." if len(text) > 500 else ""),
    }
