from sqlmodel import SQLModel
from typing import Optional

class CategoryCreate(SQLModel):
    name: str
    color: Optional[str] = "#FFFFFF"

class CategoryRead(SQLModel):
    id: int
    name: str
    color: str
