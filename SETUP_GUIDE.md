# Step-by-Step Guide to Setup Backend for Todo App with Chatbot

## Step 1: Environment Variables Setup

1. Navigate to the backend directory:
   ```bash
   cd C:\Users\user\Desktop\hackathon-phases2-4-todo-app\backend
   ```

2. The `.env` file has been created with all required environment variables. You need to update these values:

### Required Environment Variables:

#### 1. DATABASE_URL
- PostgreSQL database connection string
- Format: `postgresql://username:password@host:port/database_name`
- For local development, you can use:
  - Local PostgreSQL: `postgresql://postgres:password@localhost:5432/taskoo_db`
  - For production, use a managed PostgreSQL service like AWS RDS, Google Cloud SQL, etc.

#### 2. BETTER_AUTH_SECRET
- A secret key for JWT token signing
- Generate a random string of at least 32 characters
- Example: `mysecretkeythatissuperlongandrandom1234567890`
- To generate a secure key: `openssl rand -hex 32`

#### 3. OPENAI_API_KEY
- Your OpenAI API key to power the chatbot
- Get it from: https://platform.openai.com/api-keys
- Required for chatbot functionality

#### 4. QDRANT Configuration (for chatbot memory)
- QDRANT_URL: Your Qdrant cluster URL (e.g., `https://your-cluster.qdrant.tech:6333`)
- QDRANT_API_KEY: Your Qdrant API key
- QDRANT_COLLECTION_NAME: Collection name for storing chat memories (e.g., `chat_memory`)
- Sign up at: https://qdrant.tech/
- Note: If you don't want to use Qdrant, you can ignore these for now

## Step 2: Install Backend Dependencies

1. Make sure you have Python 3.9+ installed
2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Step 3: Database Setup

1. Make sure PostgreSQL is running on your system
2. Create the database specified in DATABASE_URL if it doesn't exist
3. The application will automatically create tables on startup

## Step 4: Start the Backend Server

1. From the backend directory, run:
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```
2. The server will start on http://localhost:8000

## Step 5: Verify Backend is Running

1. Visit http://localhost:8000/ - you should see: `{"message": "Hello World"}`
2. Visit http://localhost:8000/docs - you should see the API documentation

## Step 6: Connect Frontend to Backend

1. The frontend should automatically connect to the backend
2. Make sure both frontend and backend are running simultaneously
3. The frontend will use the backend APIs for authentication, task management, and chat functionality

## Important Notes:

- Keep your `.env` file secure and never commit it to version control
- The application supports authentication with JWT tokens
- Tasks will be stored in the PostgreSQL database
- Chat conversations will be saved to the database and optionally to Qdrant if configured
- The chatbot uses OpenAI GPT-4o model for intelligent responses
- All API endpoints are protected with authentication

## Troubleshooting:

1. If you get a database connection error:
   - Make sure PostgreSQL is running
   - Verify your DATABASE_URL is correct
   - Check if the database exists

2. If authentication fails:
   - Make sure BETTER_AUTH_SECRET is properly set
   - Verify the frontend is sending tokens correctly

3. If chatbot doesn't work:
   - Ensure OPENAI_API_KEY is valid and has sufficient credits
   - Check that the OpenAI API is accessible from your network

4. If you don't want to use Qdrant:
   - The application will still work without Qdrant
   - Chat history will be stored in the database only