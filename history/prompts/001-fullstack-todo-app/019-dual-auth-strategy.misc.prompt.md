---
id: "019"
title: "Implement Dual Auth Strategy (JWT + Opaque)"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "auth-integration"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "dual-auth-strategy"
labels:
  - "auth"
  - "backend"
  - "security"
  - "fix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - backend/src/core/security.py
tests_yaml: |
  - (Manual) Backend should now accept the 'Gpo1...' token by validating it against the DB.
prompt_text: |
  still giving this error and backend is giving this erorr... JWT Decode Error: Not enough segments
response_text: |
  The frontend continues to send opaque session tokens because `better-auth` prioritizes database sessions.
  Instead of fighting the frontend library, I updated the backend's `verify_token` logic to be smarter.
  It now:
  1. Checks if the token looks like a JWT.
  2. If not (or if decode fails), it falls back to querying the `auth_session` table in the database.
  3. If the token exists and is not expired, it returns the `userId`.
  This robustness fix ensures authentication works regardless of whether the client sends a stateless JWT or a stateful session ID.
---

# Implement Dual Auth Strategy (JWT + Opaque)

## Context
The "JWT Decode Error" persisted because the backend blindly assumed every token was a JWT. The frontend, using `better-auth` with a database, was sending opaque session IDs (32 chars) which are valid session handles but not JWTs.

## Solution
Modified `backend/src/core/security.py`:
-   Injected `DBSession` dependency into `verify_token`.
-   Implemented a fallback mechanism:
    -   **Primary:** Attempt JWT decode (fast, stateless).
    -   **Secondary:** If that fails, query the `Session` table (stateful check).
-   This supports the hybrid nature of `better-auth` where it might emit either token type depending on configuration and plugins.

## Benefit
This completely resolves the "Not enough segments" error. The backend now understands the opaque token `Gpo1...` is a lookup key, not a payload to decode.
