from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class CategoryBase(SQLModel):
    name: str = Field(index=True, unique=True, max_length=50)
    color: Optional[str] = Field(default="#FFFFFF", max_length=20) # Hex color for UI

class Category(CategoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
