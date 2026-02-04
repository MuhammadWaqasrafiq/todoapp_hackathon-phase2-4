---
id: "017"
title: "Force JWT Session Refresh"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "auth-integration"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "force-jwt-refresh"
labels:
  - "auth"
  - "jwt"
  - "cookies"
  - "bugfix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - frontend/src/lib/auth.ts
tests_yaml: |
  - (Manual) User must restart frontend and login again.
prompt_text: |
  it is still giving this error (JWT Decode Error: Not enough segments)
response_text: |
  Detected that the frontend client was still holding onto an old opaque session cookie, ignoring the new JWT configuration.
  Updated `frontend/src/lib/auth.ts` to include `advanced: { cookiePrefix: "taskoo-v2" }`.
  This invalidates previous cookies, forcing the user to log in again and generate a fresh JWT-based session.
---

# Force JWT Session Refresh

## Context
The user continued to face `JWT Decode Error` because the frontend was sending a legacy opaque token (cookie) instead of the expected JWT. Even after enabling JWT sessions in config, `better-auth` was likely reusing the existing valid opaque cookie.

## Solution
To forcibly flush out the old session without requiring manual cookie clearing by the user (which is error-prone):
1.  **Cookie Prefix:** Added `cookiePrefix: "taskoo-v2"` to `frontend/src/lib/auth.ts`.
2.  **Effect:** The browser will treat this as a new application namespace. Old cookies (without the prefix) will be ignored. The user will be effectively logged out.
3.  **Result:** When the user logs in again, `better-auth` will create a NEW session. Since `jwt: true` is active, this new session will be a JWT.

## Action Required
- **Restart Frontend:** The Next.js server must be restarted to pick up the config change.
- **Login:** The user will need to log in again.
