"""orchestrates the analysis pipeline"""

from app.services.heuristics import run_heuristics
from app.services.llm_analysis import run_llm_analysis
from app.services.risk import compute_risk
from app.services.report import build_report


async def run_analysis_from_text(text: str, numberOfSourcesUsed: int = 0) -> dict:
    metadata = {"url": "", "title": "", "author": "", "publish_date": ""}
    heuristic_results = run_heuristics(text, numberOfSourcesUsed=numberOfSourcesUsed)
    llm_results = await run_llm_analysis(text)
    risk_results = compute_risk(heuristic_results, llm_results)
    return build_report(text, metadata, heuristic_results, llm_results, risk_results)
