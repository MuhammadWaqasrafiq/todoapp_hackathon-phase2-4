import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# --- Add logging ---
logging.basicConfig(level=logging.INFO)
logging.getLogger("sqlmodel").setLevel(logging.DEBUG)


# --- STEP 1: LOAD ENV FROM ROOT ---
# Terminal root folder mein hai, isliye hum root se .env uthayenge
root_env = Path.cwd() / ".env"
backend_env = Path(__file__).parent / ".env"

if root_env.exists():
    load_dotenv(dotenv_path=root_env)
    print(f"✅ Success: .env loaded from ROOT: {root_env}")
elif backend_env.exists():
    load_dotenv(dotenv_path=backend_env)
    print(f"✅ Success: .env loaded from BACKEND: {backend_env}")
else:
    print("❌ ERROR: .env file NOT FOUND anywhere!")

# --- STEP 2: VERIFY KEY BEFORE IMPORTS ---
if not os.getenv("BETTER_AUTH_SECRET"):
    print("⚠️ WARNING: BETTER_AUTH_SECRET is still empty in os.environ!")

# --- STEP 3: NOW IMPORT MODULES ---
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.auth import get_current_user
from backend.models import User
from backend.database import engine, get_session
from backend.routers import tasks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running!"}