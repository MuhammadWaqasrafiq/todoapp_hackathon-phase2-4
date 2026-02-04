---
id: "013"
title: "Switch Backend to Session Auth"
stage: "misc"
date: "2025-12-31"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "fullstack-todo-app"
branch: "main"
user: "DevAbdullah90"
command: "switch-to-session-auth"
labels:
  - "auth"
  - "backend"
  - "sqlmodel"
  - "better-auth"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "backend/src/models/auth_session.py"
  - "backend/src/core/security.py"
tests: []
---

# Prompt

Failed to load resource: the server responded with a status of 401 (Unauthorized)
DEBUG: JWT Decode Error: Not enough segments

# Response

The frontend is sending a database-backed session token (opaque string), but the backend was expecting a stateless JWT.

I switched the backend authentication strategy to match the frontend:
1.  Created a `Session` model in `backend/src/models/auth_session.py` to map to the `session` table created by `better-auth`.
2.  Updated `backend/src/core/security.py` to:
    *   Accept the opaque token.
    *   Look it up in the database.
    *   Verify it hasn't expired.
    *   Return the `userId` (as `sub`) so the rest of the API works as expected.

Please **restart your backend server** one last time. It should now successfully validate the token against the database.
