import os
import uuid
from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database import SessionLocal, engine, get_db, Base
from models import User
from schemas import UserCreate, UserResponse
from auth import get_password_hash

# Load environment variables
load_dotenv()

# Create all tables defined in models.py
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running!"}

@app.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user_id = str(uuid.uuid4()) # Generate a UUID for the user ID

    db_user = User(
        id=new_user_id,
        email=user.email,
        hashed_password=hashed_password,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
