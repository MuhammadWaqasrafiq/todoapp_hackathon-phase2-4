from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, create_engine
from dotenv import load_dotenv
import os

from backend.auth import get_current_user
from backend.models import User
from backend.database import engine
from backend.routers import tasks

# Load environment variables
load_dotenv()

app = FastAPI()
app.include_router(tasks.router)

def get_session():
    with Session(engine) as session:
        yield session

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running!"}

@app.get("/api/v1/users/me", response_model=User)
async def read_users_me(current_user_id: str = Depends(get_current_user), session: Session = Depends(get_session)):
    user = session.get(User, current_user_id)
    if not user:
        # This case might happen if a user was deleted from the DB but their JWT is still valid.
        # Or, if we decide not to create a user record for every JWT.
        # For now, we can create one on the fly.
        user = User(id=current_user_id, email="placeholder@example.com") # Placeholder email
        session.add(user)
        session.commit()
        session.refresh(user)
        # raise HTTPException(status_code=404, detail="User not found")
    return user
