from src.mcp.server import mcp
from sqlmodel import Session, select
from src.core.database import engine
from src.models.task import Task
from typing import Optional, Literal, List

@mcp.tool()
def add_task(user_id: str, title: str, description: str = None) -> str:
    """Create a new task for the user."""
    with Session(engine) as session:
        task = Task(user_id=user_id, title=title, description=description)
        session.add(task)
        session.commit()
        session.refresh(task)
        return f"Task created with ID {task.id}: {task.title}"

@mcp.tool()
def list_tasks(user_id: str, status: Literal["all", "pending", "completed"] = "all") -> str:
    """Retrieve tasks from the list."""
    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == user_id)
        if status == "pending":
            statement = statement.where(Task.is_completed == False)
        elif status == "completed":
            statement = statement.where(Task.is_completed == True)
        
        tasks = session.exec(statement).all()
        if not tasks:
            return "No tasks found."
        
        result = []
        for t in tasks:
            status_str = "Completed" if t.is_completed else "Pending"
            result.append(f"{t.id}. {t.title} ({status_str})")
        return "\n".join(result)

@mcp.tool()
def update_task(user_id: str, task_id: int, title: str = None, description: str = None) -> str:
    """Modify task title or description."""
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task or task.user_id != user_id:
            return f"Task {task_id} not found."
        
        if title:
            task.title = title
        if description:
            task.description = description
            
        session.add(task)
        session.commit()
        session.refresh(task)
        return f"Task {task_id} updated."

@mcp.tool()
def complete_task(user_id: str, task_id: int) -> str:
    """Mark a task as complete."""
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task or task.user_id != user_id:
            return f"Task {task_id} not found."
        
        task.is_completed = True
        session.add(task)
        session.commit()
        return f"Task {task_id} marked as completed."

@mcp.tool()
def delete_task(user_id: str, task_id: int) -> str:
    """Remove a task from the list."""
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task or task.user_id != user_id:
            return f"Task {task_id} not found."
        
        session.delete(task)
        session.commit()
        return f"Task {task_id} deleted."
