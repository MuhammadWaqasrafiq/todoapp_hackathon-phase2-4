from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv
from sqlalchemy.pool import QueuePool

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to SQLite for local development
    DATABASE_URL = "sqlite:///./taskoo_local.db"
    print("DATABASE_URL not set, using local SQLite database: taskoo_local.db")

# Neon/Postgres requires postgresql:// but some libs output postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    # For PostgreSQL connections, we need to handle SSL and connection pooling for Neon
    # Add sslmode parameter if not present
    if "?sslmode=" not in DATABASE_URL.lower() and "sslmode=" not in DATABASE_URL.lower():
        if "?" in DATABASE_URL:
            DATABASE_URL += "&sslmode=require"
        else:
            DATABASE_URL += "?sslmode=require"

    # Connection pooling parameters should be handled in the engine creation, not in the URL
    # Remove any pooling parameters from the URL if they exist
    import re
    DATABASE_URL = re.sub(r'[?&](pool_size|max_overflow|pool_pre_ping|pool_recycle)=[^&]*', '', DATABASE_URL)
    # Clean up any double ampersands or question marks that might result
    DATABASE_URL = re.sub(r'\?&', '?', DATABASE_URL)
    DATABASE_URL = re.sub(r'&&', '&', DATABASE_URL)
    DATABASE_URL = DATABASE_URL.rstrip('&').rstrip('?')

# Create engine with proper PostgreSQL/Neon configuration
engine = create_engine(
    DATABASE_URL, 
    echo=True,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={
        "connect_timeout": 10,
    }
)

def get_session() -> Generator[Session, None, None]:
    try:
        with Session(engine) as session:
            yield session
    except Exception as e:
        print(f"Database session error: {str(e)}")
        raise

def init_db():
    # Import all models to ensure they're registered with SQLModel metadata
    from ..models.user import User
    from ..models.task import Task
    from ..models.category import Category
    from ..models.auth_session import Session as AuthSession
    from ..models.conversation import Conversation
    from ..models.message import Message
    
    SQLModel.metadata.create_all(engine)