---
id: "010"
title: "Fix API URL Env Var"
stage: "misc"
date: "2025-12-31"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "fullstack-todo-app"
branch: "main"
user: "DevAbdullah90"
command: "fix-api-url"
labels:
  - "env"
  - "bugfix"
  - "frontend"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "frontend/.env.local"
tests: []
---

# Prompt

INFO:     127.0.0.1:62489 - "GET /AUXutC3na5tbqf74A2cszyams6IA3Dic/tasks HTTP/1.1" 404 Not Found
backend is giving me this error when i am creating any task

# Response

The error occurred because `NEXT_PUBLIC_API_URL` in `frontend/.env.local` was set to `http://localhost:8000`, missing the `/api` prefix required by the backend.

I updated `frontend/.env.local` to:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Please restart your frontend server for the changes to take effect.
