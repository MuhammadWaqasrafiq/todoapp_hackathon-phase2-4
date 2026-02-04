from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session, select
from typing import Optional
import uuid
from datetime import datetime, timedelta, timezone

from ..core.database import get_session
from ..core.security import BETTER_AUTH_SECRET
from ..models.auth_session import Session as AuthSession
from ..models.user import User
from passlib.context import CryptContext
import jwt

# Router for root-level endpoints (Better Auth default)
root_router = APIRouter()

# Router for /api/auth prefixed endpoints (to match the error path)
prefixed_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

# Shared function implementations
async def _common_signup_logic(body: dict, session: Session):
    email = body.get("email")
    password = body.get("password")
    name = body.get("name", None)

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = get_password_hash(password)

    # Create user
    user = User(
        email=email,
        password_hash=hashed_password,
        name=name
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

    # Return Better Auth compatible response
    return {
        "session": {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "createdAt": user.created_at.isoformat(),
                "updatedAt": user.updated_at.isoformat()
            },
            "token": access_token,
            "expiresAt": expires_at.isoformat()
        }
    }

async def _common_signin_logic(body: dict, session: Session):
    email = body.get("email")
    password = body.get("password")

    # Find user
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.password_hash):
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

    # Return Better Auth compatible response
    return {
        "session": {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "createdAt": user.created_at.isoformat(),
                "updatedAt": user.updated_at.isoformat()
            },
            "token": access_token,
            "expiresAt": expires_at.isoformat()
        }
    }

# Root-level endpoints (Better Auth default)
@root_router.post("/sign-up/email")
async def better_auth_root_signup(request: Request, session: Session = Depends(get_session)):
    body = await request.json()
    return await _common_signup_logic(body, session)

@root_router.post("/sign-in/email")
async def better_auth_root_signin(request: Request, session: Session = Depends(get_session)):
    body = await request.json()
    return await _common_signin_logic(body, session)

@root_router.post("/sign-out")
async def better_auth_root_signout(request: Request, session: Session = Depends(get_session)):
    # In a real implementation, you'd invalidate the session token
    # For now, just return success
    return {"success": True}

# Prefixed endpoints (to match the error path - /api/auth/sign-up/email)
@prefixed_router.post("/sign-up/email")
async def better_auth_prefixed_signup(request: Request, session: Session = Depends(get_session)):
    body = await request.json()
    return await _common_signup_logic(body, session)

@prefixed_router.post("/sign-in/email")
async def better_auth_prefixed_signin(request: Request, session: Session = Depends(get_session)):
    body = await request.json()
    return await _common_signin_logic(body, session)

@prefixed_router.post("/sign-out")
async def better_auth_prefixed_signout(request: Request, session: Session = Depends(get_session)):
    # In a real implementation, you'd invalidate the session token
    # For now, just return success
    return {"success": True}