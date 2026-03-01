from fastapi import APIRouter
from app.models.request_models import AnalyzeRequest, AnalyzeTextRequest, RecalibrateRequest
from app.services.aggregator import run_analysis, run_analysis_from_text
from app.services.recalibrate import run_recalibration

router = APIRouter()


@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    result = await run_analysis(request)
    return result


@router.post("/analyze/text")
async def analyze_text(request: AnalyzeTextRequest):
    result = await run_analysis_from_text(request.text, request.numberOfSourcesUsed)
    return result


@router.post("/recalibrate")
async def recalibrate(request: RecalibrateRequest):
    text = await run_recalibration(
        text=request.text,
        confidence=request.confidence,
        evidence=request.evidence,
        domain=request.domain,
        decision_delegation_detected=request.decision_delegation_detected,
    )
    return {"recalibrated_text": text}