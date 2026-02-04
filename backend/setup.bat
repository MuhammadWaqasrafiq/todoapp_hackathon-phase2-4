@echo off
REM Setup script for backend environment on Windows

echo Setting up backend environment for Todo App...

REM Check if .env file exists
if not exist .env (
    echo Creating .env file...
    echo # Database Configuration > .env
    echo DATABASE_URL=postgresql://username:password@localhost:5432/taskoo_db >> .env
    echo. >> .env
    echo # Authentication Secret >> .env
    echo BETTER_AUTH_SECRET=your-super-secret-auth-key-here-change-this-to-a-random-string >> .env
    echo. >> .env
    echo # OpenAI API Key ^(for chatbot functionality^) >> .env
    echo OPENAI_API_KEY=your-openai-api-key-here >> .env
    echo. >> .env
    echo # Qdrant Vector Database Configuration ^(for chatbot memory storage^) >> .env
    echo QDRANT_URL=https://your-cluster-url.qdrant.tech:6333 >> .env
    echo QDRANT_API_KEY=your-qdrant-api-key-here >> .env
    echo QDRANT_COLLECTION_NAME=chat_memory >> .env
    echo. >> .env
    echo # Application Configuration >> .env
    echo APP_ENV=development >> .env
    echo PORT=8000 >> .env
    echo HOST=0.0.0.0 >> .env
    echo .env file created. Please update the values with your actual configuration.
) else (
    echo .env file already exists.
)

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created.
)

REM Activate virtual environment and install dependencies
echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate && pip install -r requirements.txt

echo Setup complete!
echo To start the backend server, run:
echo cd backend
echo venv\Scripts\activate
echo uvicorn src.main:app --reload --host 0.0.0.0 --port 8000