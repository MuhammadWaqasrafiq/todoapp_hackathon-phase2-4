from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    email: str = Field(unique=True, nullable=False, index=True)
    password_hash: str = Field(nullable=False)
    name: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Add relationship to tasks
    # tasks: List["Task"] = Relationship(back_populates="user")