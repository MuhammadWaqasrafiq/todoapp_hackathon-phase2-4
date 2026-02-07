from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional, List

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    category_id: Optional[int] = None
    coworker_ids: Optional[List[int]] = []
    date: Optional[datetime] = None
    task_zone: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    category_id: Optional[int] = None
    coworker_ids: Optional[List[int]] = None
    date: Optional[datetime] = None
    task_zone: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime