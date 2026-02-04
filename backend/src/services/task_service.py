from sqlmodel import Session, select
from ..models.task import Task
from ..schemas.task import TaskCreate, TaskUpdate
from datetime import datetime

class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task: TaskCreate, user_id: str) -> Task:
        db_task = Task.model_validate(task, update={"user_id": user_id})
        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)
        return db_task

    def get_tasks(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Task]:
        statement = select(Task).where(Task.user_id == user_id).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def get_task(self, task_id: int, user_id: str) -> Task | None:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return self.session.exec(statement).first()

    def update_task(self, task_id: int, task_update: TaskUpdate, user_id: str) -> Task | None:
        db_task = self.get_task(task_id, user_id)
        if not db_task:
            return None
        task_data = task_update.model_dump(exclude_unset=True)
        for key, value in task_data.items():
            setattr(db_task, key, value)
        db_task.updated_at = datetime.utcnow()
        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)
        return db_task

    def delete_task(self, task_id: int, user_id: str) -> bool:
        db_task = self.get_task(task_id, user_id)
        if not db_task:
            return False
        self.session.delete(db_task)
        self.session.commit()
        return True
