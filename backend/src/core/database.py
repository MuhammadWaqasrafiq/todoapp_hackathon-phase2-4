from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

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
    # For PostgreSQL connections, we might need to handle SSL issues
    # Add sslmode parameter if not present
    if "?sslmode=" not in DATABASE_URL.lower() and "sslmode=" not in DATABASE_URL.lower():
        DATABASE_URL += "?sslmode=require"

engine = create_engine(DATABASE_URL, echo=True)

def get_session() -> Generator[Session, None, None]:
    try:
        with Session(engine) as session:
            yield session
    except Exception as e:
        print(f"Database session error: {str(e)}")
        raise

def init_db():
    SQLModel.metadata.create_all(engine)