---
id: "018"
title: "Debug and Fix Opaque Token Issue"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "auth-integration"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "fix-opaque-token"
labels:
  - "auth"
  - "jwt"
  - "debugging"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - frontend/src/lib/api.ts
tests_yaml: |
  - (Manual) User must check browser console for "DEBUG: Token does not look like a JWT" warning.
prompt_text: |
  still giving this error please solve it
response_text: |
  Confirmed frontend has `.env.local` with `BETTER_AUTH_SECRET`.
  However, `better-auth` is still returning an opaque token.
  Updated `frontend/src/lib/api.ts` to add robust logging and checking for non-JWT tokens.
  The issue implies `better-auth` is NOT respecting `session: { jwt: true }` when a database is connected, or the client is not receiving the JWT.
  Investigating next: Why `better-auth` behaves this way.
---

# Debug and Fix Opaque Token Issue

## Context
Despite `session: { jwt: true }` and `cookiePrefix` change, the frontend continues to send opaque tokens (32 chars) to the backend. The backend strictly requires JWTs signed with `BETTER_AUTH_SECRET`.

## Investigation
- Checked `frontend/.env.local`: **Exists** and contains `BETTER_AUTH_SECRET`.
- Checked `frontend/src/lib/auth.ts`: **Correctly** imports `better-auth` and sets `jwt: true`.
- Checked `frontend/package.json`: Version `1.4.9`.

## Implementation
Updated `frontend/src/lib/api.ts` to:
1.  Log the **entire** session object structure to help debug what `better-auth` returns.
2.  Warn specifically if the token does not start with `ey` (JWT signature).
3.  Attempt to find `idToken` or `accessToken` as fallbacks.

## Hypothesis
There is a known behavior in some auth libraries where the "session token" remains an opaque database ID, but the "access token" or "id token" is the JWT. We need to identify *where* the JWT is hiding in the session object.
