from sqlmodel import Session, select
from ..models.task import Task
from ..schemas.task import TaskCreate, TaskUpdate
from datetime import datetime

class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task: TaskCreate, user_id: str) -> Task:
        # Prepare the data for validation
        task_data = task.model_dump()
        task_data['user_id'] = user_id
        
        # Handle the date/time fields properly
        if isinstance(task_data.get('date'), str):
            task_data['date'] = datetime.fromisoformat(task_data['date'].replace('Z', '+00:00'))
        if isinstance(task_data.get('start_time'), str):
            task_data['start_time'] = datetime.fromisoformat(task_data['start_time'].replace('Z', '+00:00'))
        if isinstance(task_data.get('end_time'), str):
            task_data['end_time'] = datetime.fromisoformat(task_data['end_time'].replace('Z', '+00:00'))
        
        db_task = Task.model_validate(task_data)
        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)
        return db_task

    def get_tasks(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Task]:
        statement = select(Task).where(Task.user_id == user_id).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def get_tasks_by_date(self, user_id: str, date_start: datetime, date_end: datetime) -> list[Task]:
        statement = select(Task).where(
            Task.user_id == user_id,
            Task.date >= date_start,
            Task.date <= date_end
        )
        return self.session.exec(statement).all()

    def get_tasks_by_category(self, user_id: str) -> dict:
        statement = select(Task).where(Task.user_id == user_id)
        tasks = self.session.exec(statement).all()
        
        # Group tasks by category_id
        grouped_tasks = {}
        for task in tasks:
            category_id = task.category_id or 0  # Use 0 for tasks without category
            if category_id not in grouped_tasks:
                grouped_tasks[category_id] = []
            grouped_tasks[category_id].append(task)
        
        return grouped_tasks

    def get_task(self, task_id: int, user_id: str) -> Task | None:
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return self.session.exec(statement).first()

    def update_task(self, task_id: int, task_update: TaskUpdate, user_id: str) -> Task | None:
        db_task = self.get_task(task_id, user_id)
        if not db_task:
            return None
            
        task_data = task_update.model_dump(exclude_unset=True)
        
        # Handle the date/time fields properly
        if isinstance(task_data.get('date'), str):
            task_data['date'] = datetime.fromisoformat(task_data['date'].replace('Z', '+00:00'))
        if isinstance(task_data.get('start_time'), str):
            task_data['start_time'] = datetime.fromisoformat(task_data['start_time'].replace('Z', '+00:00'))
        if isinstance(task_data.get('end_time'), str):
            task_data['end_time'] = datetime.fromisoformat(task_data['end_time'].replace('Z', '+00:00'))
        
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
