from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, Union
from sqlalchemy import JSON

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = None
    is_completed: bool = Field(default=False)
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    coworker_ids: Optional[Union[list, str]] = Field(default=None, sa_type=JSON)  # Store as JSON array
    date: Optional[datetime] = Field(default=None)
    task_zone: Optional[str] = Field(default=None, max_length=50)  # e.g., "GMT+6"
    start_time: Optional[datetime] = Field(default=None)
    end_time: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)