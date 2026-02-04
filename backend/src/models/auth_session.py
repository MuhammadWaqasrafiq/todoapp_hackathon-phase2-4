from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Session(SQLModel, table=True):
    id: str = Field(primary_key=True)
    userId: str
    token: str
    expiresAt: datetime
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
