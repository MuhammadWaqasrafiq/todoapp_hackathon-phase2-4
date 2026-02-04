from pydantic import BaseModel, Field
from typing import Optional, Literal

class AddTask(BaseModel):
    user_id: str = Field(description="The ID of the user owning the task")
    title: str = Field(description="Title of the task")
    description: Optional[str] = Field(None, description="Optional details about the task")

class ListTasks(BaseModel):
    user_id: str = Field(description="The ID of the user")
    status: Optional[Literal["all", "pending", "completed"]] = Field("all", description="Filter tasks by status")

class UpdateTask(BaseModel):
    user_id: str = Field(description="The ID of the user")
    task_id: int = Field(description="The ID of the task to update")
    title: Optional[str] = Field(None, description="New title")
    description: Optional[str] = Field(None, description="New description")

class CompleteTask(BaseModel):
    user_id: str = Field(description="The ID of the user")
    task_id: int = Field(description="The ID of the task to complete")

class DeleteTask(BaseModel):
    user_id: str = Field(description="The ID of the user")
    task_id: int = Field(description="The ID of the task to delete")
