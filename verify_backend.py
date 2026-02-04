#!/usr/bin/env python3
"""
Quick verification script to check if backend environment is properly configured
"""

import os
import sys
from pathlib import Path

def check_environment():
    print("Checking backend environment configuration...")

    # Change to backend directory
    backend_dir = Path(__file__).parent / "backend"

    # Check if .env file exists
    env_file = backend_dir / ".env"
    if not env_file.exists():
        print("[ERROR] .env file not found!")
        return False
    else:
        print("[OK] .env file found")

    # Load environment variables
    import os
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=env_file)

    # Check required environment variables
    required_vars = [
        "DATABASE_URL",
        "BETTER_AUTH_SECRET"
    ]

    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        print(f"[ERROR] Missing required environment variables: {', '.join(missing_vars)}")
        print("Please update your .env file with the required values.")
        return False
    else:
        print("[OK] All required environment variables are set")

    # Check if dependencies are installed
    try:
        import fastapi
        import sqlmodel
        import openai
        import mcp
        import psycopg2
        print("[OK] Dependencies are installed")
    except ImportError as e:
        print(f"[ERROR] Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

    # Add current directory to Python path
    import sys
    sys.path.insert(0, str(backend_dir))
    sys.path.insert(0, os.path.join(str(backend_dir), "src"))

    # Check if we can import the main application
    try:
        from src.main import app
        print("[OK] Main application can be imported")
    except Exception as e:
        print(f"[ERROR] Error importing main application: {e}")
        return False

    print("\n[SUCCESS] Environment verification successful!")
    print("\nTo start the backend server, run:")
    print("cd backend")
    print("uvicorn src.main:app --reload --host 0.0.0.0 --port 8000")
    print("\nThe backend will:")
    print("- Store tasks in the PostgreSQL database")
    print("- Handle authentication with JWT tokens")
    print("- Power the chatbot using OpenAI API")
    print("- Optionally store chat memories in Qdrant if configured")

    return True

if __name__ == "__main__":
    success = check_environment()
    if not success:
        sys.exit(1)