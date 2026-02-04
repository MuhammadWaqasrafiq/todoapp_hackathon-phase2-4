from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ..core.database import get_session
from ..core.security import verify_token
from ..schemas.task import TaskCreate, TaskResponse, TaskUpdate
from ..services.task_service import TaskService

router = APIRouter()

def get_service(session: Session = Depends(get_session)) -> TaskService:
    return TaskService(session)

@router.get("/{user_id}/tasks", response_model=list[TaskResponse])
def list_tasks(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    service: TaskService = Depends(get_service),
    token_user_id: str = Depends(verify_token)
):
    if user_id != token_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.get_tasks(user_id, skip, limit)

@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=201)
def create_task(
    user_id: str,
    task: TaskCreate,
    service: TaskService = Depends(get_service),
    token_user_id: str = Depends(verify_token)
):
    if user_id != token_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.create_task(task, user_id)

@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: str,
    task_id: int,
    service: TaskService = Depends(get_service),
    token_user_id: str = Depends(verify_token)
):
    if user_id != token_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    task = service.get_task(task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,
    service: TaskService = Depends(get_service),
    token_user_id: str = Depends(verify_token)
):
    if user_id != token_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    task = service.update_task(task_id, task_update, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/{user_id}/tasks/{task_id}", status_code=204)
def delete_task(
    user_id: str,
    task_id: int,
    service: TaskService = Depends(get_service),
    token_user_id: str = Depends(verify_token)
):
    if user_id != token_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    success = service.delete_task(task_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_task_complete(
    user_id: str,
    task_id: int,
    service: TaskService = Depends(get_service),
    token_user_id: str = Depends(verify_token)
):
    if user_id != token_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    task = service.get_task(task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    new_status = not task.is_completed
    return service.update_task(task_id, TaskUpdate(is_completed=new_status), user_id)