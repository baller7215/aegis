from pydantic import BaseModel, HttpUrl
from typing import Optional


class AnalyzeRequest(BaseModel):
    url: HttpUrl


class AnalyzeTextRequest(BaseModel):
    text: str
    conversation: Optional[list[dict]] = None
