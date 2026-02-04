from sqlmodel import SQLModel, Field, JSON
from datetime import datetime
from typing import Optional, Any

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    role: str = Field(index=True) # user, assistant, system, tool
    content: Optional[str] = None
    tool_calls: Optional[Any] = Field(default=None, sa_type=JSON)
    tool_call_id: Optional[str] = None # For tool messages
    created_at: datetime = Field(default_factory=datetime.utcnow)
