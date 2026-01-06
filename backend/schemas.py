from pydantic import BaseModel

# This file is kept for now, in case we need to define any schemas
# that are not directly tied to a database model.
# For now, we rely on SQLModel to act as both the ORM model and the Pydantic schema.

class TaskCreate(BaseModel):
    title: str
    description: str | None = None

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None