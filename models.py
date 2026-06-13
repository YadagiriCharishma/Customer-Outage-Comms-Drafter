from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database import Base


class DraftRecord(Base):
    __tablename__ = "draft_records"

    id = Column(Integer, primary_key=True, index=True)
    timeline = Column(Text, nullable=False)
    tone = Column(String(32), nullable=False)
    severity = Column(String(32), nullable=False)
    initial_draft = Column(Text, nullable=False)
    in_progress_draft = Column(Text, nullable=False)
    resolved_draft = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
