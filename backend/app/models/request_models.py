from typing import Optional

from pydantic import BaseModel


class AnalyzeTextRequest(BaseModel):
    text: str
    numberOfSourcesUsed: Optional[int] = None


class RecalibrateRequest(BaseModel):
    text: str
    confidence: float
    evidence: float
    domain: str = "general"
    decision_delegation_detected: bool = False
