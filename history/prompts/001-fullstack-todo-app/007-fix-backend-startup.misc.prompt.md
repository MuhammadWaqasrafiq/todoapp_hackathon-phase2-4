---
id: 007
title: Fix Backend Startup Error
stage: misc
date: 2024-12-31
surface: agent
model: Gemini
feature: fullstack-todo-app
branch: 001-fullstack-todo-app
user: User
command: /fix
labels: [bugfix, uvicorn, path]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: null
tests: null

---

## Prompt

(.venv) PS C:\Users\hp\OneDrive\Desktop\ai-driven-development\Hackathon-II\Phase-II\backend> uvicorn main:app --reload
...
ERROR:    Error loading ASGI app. Could not import module "main".

## Response snapshot

Identified `main.py` is in `src/`. Corrected command to `uvicorn src.main:app --reload`.

## Outcome

- ✅ Impact: Unblocked user from running backend.
- 🧪 Tests: N/A
- 📁 Files: N/A
- 🔁 Next prompts: N/A
- 🧠 Reflection: Common issue with src layout; explicit pathing resolves it.

## Evaluation notes (flywheel)

- Failure modes observed: User confusion on uvicorn module paths with src layout.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
