from sqlmodel import SQLModel, Field
from sqlalchemy import Integer, JSON
from datetime import datetime
from typing import Optional, Any
from pydantic import Field as PydanticField

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(index=True)  # Foreign key reference will be handled by SQLAlchemy
    role: str = Field(index=True) # user, assistant, system, tool
    content: Optional[str] = None
    tool_calls: Optional[dict] = Field(default=None, sa_type=JSON)  # Using JSON type for PostgreSQL
    tool_call_id: Optional[str] = None # For tool messages
    created_at: datetime = Field(default_factory=datetime.utcnow)
