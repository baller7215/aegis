"""structured extraction schema for LLM output"""

from typing import Optional

from pydantic import BaseModel


class ExtractionResult(BaseModel):
    assumptions: list[str] = []
    missing_context: list[str] = []
    bias_type: Optional[str] = None
    bias_explanation: Optional[str] = None
    failure_modes: list[str] = []
    decision_delegation_detected: bool = False
    context_sensitivity: dict = {}
