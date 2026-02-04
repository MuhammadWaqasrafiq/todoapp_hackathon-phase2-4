# Quickstart: Taskoo AI Development

## Prerequisites
- Python 3.11+
- Node.js 18+
- Docker (for local Neon/Postgres if needed, or use cloud)
- OpenAI API Key

## Backend Setup
1. **Navigate**: `cd backend`
2. **Env**: Copy `.env.example` to `.env` and fill:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
3. **Venv**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Win
   pip install -r requirements.txt
   ```
4. **Run**:
   ```bash
   fastapi dev src/main.py
   ```

## Frontend Setup
1. **Navigate**: `cd frontend`
2. **Env**: Copy `.env.example` to `.env.local` and fill:
   - `NEXT_PUBLIC_API_URL=http://localhost:8000`
   - `NEXT_PUBLIC_OPENAI_DOMAIN_KEY`
3. **Install**:
   ```bash
   npm install
   ```
4. **Run**:
   ```bash
   npm run dev
   ```

## Verification
1. Open `http://localhost:3000`.
2. Login/Signup.
3. Type "Add a task to buy milk".
4. Check Dashboard to see the new task.
