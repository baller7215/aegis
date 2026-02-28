from fastapi import APIRouter
from app.models.request_models import AnalyzeRequest, AnalyzeTextRequest
from app.services.aggregator import run_analysis, run_analysis_from_text

router = APIRouter()


@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    result = await run_analysis(request)
    return result


@router.post("/analyze/text")
async def analyze_text(request: AnalyzeTextRequest):
    result = await run_analysis_from_text(request.text)
    return result