from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


Tone = Literal["calm", "empathetic", "concise"]
Severity = Literal["low", "medium", "high", "critical"]


class GenerateRequest(BaseModel):
    timeline: str = Field(..., min_length=10, description="Technical outage timeline from engineers")
    tone: Tone = "calm"


class DraftSet(BaseModel):
    initial: str
    in_progress: str
    resolved: str


class GenerateResponse(BaseModel):
    severity: Severity
    tone: Tone
    drafts: DraftSet
    record_id: int | None = None


class DraftRecordResponse(BaseModel):
    id: int
    timeline: str
    tone: Tone
    severity: Severity
    drafts: DraftSet
    created_at: datetime

    class Config:
        from_attributes = True
