# Quickstart: Full-Stack Todo App

## Prerequisites
- Node.js 18+
- Python 3.11+
- Neon Account (Postgres)
- Better Auth Account (or local setup)

## Backend Setup (FastAPI)
1. Navigate to `backend/`
2. Create venv: `python -m venv .venv`
3. Activate: `source .venv/bin/activate` (or `.\.venv\Scripts\Activate` on Windows)
4. Install: `pip install -r requirements.txt`
5. Env: Create `.env` with `DATABASE_URL` and `BETTER_AUTH_SECRET`.
6. Run: `uvicorn src.main:app --reload`

## Frontend Setup (Next.js)
1. Navigate to `frontend/`
2. Install: `npm install`
3. Env: Create `.env.local` with `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_API_URL`.
4. Run: `npm run dev`

## Verification
1. Open `http://localhost:3000`.
2. Sign Up.
3. Check Dashboard -> Create Task.
4. Verify data in Neon Console.
