from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True # Allow ORM models to be converted to Pydantic models
