#!/bin/bash
# Setup script for backend environment

echo "Setting up backend environment for Todo App..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/taskoo_db

# Authentication Secret
BETTER_AUTH_SECRET=your-super-secret-auth-key-here-change-this-to-a-random-string

# OpenAI API Key (for chatbot functionality)
OPENAI_API_KEY=your-openai-api-key-here

# Qdrant Vector Database Configuration (for chatbot memory storage)
QDRANT_URL=https://your-cluster-url.qdrant.tech:6333
QDRANT_API_KEY=your-qdrant-api-key-here
QDRANT_COLLECTION_NAME=chat_memory

# Application Configuration
APP_ENV=development
PORT=8000
HOST=0.0.0.0
EOF
    echo ".env file created. Please update the values with your actual configuration."
else
    echo ".env file already exists."
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
    echo "Virtual environment created."
fi

# Activate virtual environment and install dependencies
echo "Activating virtual environment and installing dependencies..."
source venv/Scripts/activate && pip install -r requirements.txt

echo "Setup complete!"
echo "To start the backend server, run:"
echo "cd backend"
echo "source venv/Scripts/activate  # On Windows: venv\Scripts\activate"
echo "uvicorn src.main:app --reload --host 0.0.0.0 --port 8000"