from typing import Optional
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field
import uuid

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Session(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    userId: str
    token: str
    expiresAt: datetime
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    createdAt: datetime = Field(default_factory=utc_now)
    updatedAt: datetime = Field(default_factory=utc_now)
