---
id: "014"
title: "Create Task Table on Startup"
stage: "misc"
date: "2025-12-31"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "fullstack-todo-app"
branch: "main"
user: "DevAbdullah90"
command: "init-db-schema"
labels:
  - "database"
  - "sqlmodel"
  - "backend"
  - "bugfix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "backend/src/core/database.py"
  - "backend/src/main.py"
tests: []
---

# Prompt

psycopg2.errors.UndefinedTable: relation "task" does not exist

# Response

The `task` table was missing because the application wasn't initializing the database schema for its own models (only `better-auth` tables existed).

I fixed this by:
1.  Updating `backend/src/core/database.py` to include a `create_db_and_tables` function that explicitly imports the `Task` and `Session` models (registering them with SQLModel).
2.  Updating `backend/src/main.py` to use a `lifespan` context manager that calls `create_db_and_tables()` when the application starts.

**Action Required:**
Please **restart your backend server** one more time. On startup, it will now detect the missing `task` table and automatically create it.
