from fastapi import APIRouter
from app.models.request_models import AnalyzeRequest
from app.services.aggregator import run_analysis

router = APIRouter()


@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    result = await run_analysis(request)
    return result