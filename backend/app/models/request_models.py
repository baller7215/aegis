from pydantic import BaseModel, HttpUrl
from typing import Optional


class AnalyzeRequest(BaseModel):
    url: HttpUrl


class AnalyzeTextRequest(BaseModel):
    text: str
    conversation: Optional[list[dict]] = None
    numberOfSourcesUsed: int = 0


class RecalibrateRequest(BaseModel):
    text: str
    confidence: float
    evidence: float
    domain: str = "general"
    decision_delegation_detected: bool = False
