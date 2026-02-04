from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Optional
import uuid
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from src.core.database import get_session
from src.core.security import BETTER_AUTH_SECRET
from src.models.auth_session import Session as AuthSession
from src.models.user import User
from passlib.context import CryptContext
import jwt

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, BETTER_AUTH_SECRET, algorithm="HS256")
    return encoded_jwt

import logging
logger = logging.getLogger(__name__)

# Legacy endpoints for compatibility
@router.post("/auth/register", response_model=dict)  # Changed to dict for compatibility
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    try:
        logger.info(f"Registration attempt for email: {user_data.email}")

        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            logger.warning(f"Registration failed: Email already registered: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Hash password
        hashed_password = get_password_hash(user_data.password)

        # Create user
        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            name=user_data.name
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        # Create session token
        token = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(days=30)

        auth_session = AuthSession(
            id=str(uuid.uuid4()),
            userId=user.id,
            token=token,
            expiresAt=expires_at
        )
        session.add(auth_session)
        session.commit()

        # Create JWT token
        access_token = create_access_token(
            data={"sub": user.id, "email": user.email}
        )

        logger.info(f"User registered successfully: {user.id}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email
        }
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/auth/login", response_model=dict)  # Changed to dict for compatibility
def login(login_data: UserLogin, session: Session = Depends(get_session)):
    try:
        logger.info(f"Login attempt for email: {login_data.email}")

        # Find user
        user = session.exec(select(User).where(User.email == login_data.email)).first()
        if not user or not verify_password(login_data.password, user.password_hash):
            logger.warning(f"Login failed: Incorrect email or password for: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # Create session token
        token = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(days=30)

        auth_session = AuthSession(
            id=str(uuid.uuid4()),
            userId=user.id,
            token=token,
            expiresAt=expires_at
        )
        session.add(auth_session)
        session.commit()

        # Create JWT token
        access_token = create_access_token(
            data={"sub": user.id, "email": user.email}
        )

        logger.info(f"User logged in successfully: {user.id}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email
        }
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/auth/logout")
def logout(session: Session = Depends(get_session)):
    # In a real implementation, you'd invalidate the session token
    # For now, just return success
    return {"message": "Logged out successfully"}