---
id: "016"
title: "Fix Authentication JWT Mismatch"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "auth-integration"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "fix-auth"
labels:
  - "auth"
  - "jwt"
  - "better-auth"
  - "bugfix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - frontend/src/lib/auth.ts
tests_yaml: |
  - (Manual) Verify login flow generates JWT
prompt_text: |
  i loggged but is giving this error and frontend is not showing any task and categories but it is showing the name from database Hi Iqra Abdullah
response_text: |
  Identified mismatch between frontend session token (opaque) and backend expectation (JWT).
  Updated `frontend/src/lib/auth.ts` to enable `session: { jwt: true }`, forcing Better Auth to use JWTs which the backend can verify.
  User needs to restart frontend and re-login.
---

# Fix Authentication JWT Mismatch

## Context
The user reported that tasks were not loading after login, despite the user name appearing. Backend logs showed `401 Unauthorized` and `JWT Decode Error: Not enough segments` when accessing `/api/{user_id}/tasks`. The token received was an opaque session ID (`XAax...`), but the backend's `verify_token` function expects a JWT signed with `BETTER_AUTH_SECRET`.

## Analysis
- **Backend:** `backend/src/core/security.py` uses `jwt.decode` to validate tokens. It assumes the token is a JWT.
- **Frontend:** `frontend/src/lib/auth.ts` was using the default Better Auth session strategy (database-backed opaque tokens), even though the `jwt` plugin was enabled.
- **Mismatch:** The frontend sent an opaque token; the backend tried to decode it as a JWT and failed.

## Implementation
Modified `frontend/src/lib/auth.ts` to explicitly enable JWT sessions:
```typescript
session: {
    jwt: true,
},
```
This configuration ensures `better-auth` issues a JWT as the session token, which `frontend/src/lib/api.ts` will then send to the backend, satisfying the `jwt.decode` requirement.

## Next Steps
- User must restart the frontend server.
- User must log out and log back in to generate a new JWT session token.
