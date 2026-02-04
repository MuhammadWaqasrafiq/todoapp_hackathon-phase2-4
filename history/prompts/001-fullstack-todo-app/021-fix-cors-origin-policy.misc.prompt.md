---
id: "021"
title: "Fix CORS Origin Policy"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "auth-integration"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "fix-cors"
labels:
  - "cors"
  - "backend"
  - "bugfix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - backend/src/main.py
tests_yaml: |
  - (Manual) Verify no 'Access-Control-Allow-Origin' errors in browser console.
prompt_text: |
  browser console is giivng this error ccess to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
response_text: |
  Identified strict CORS policy as the blocker for the dashboard data fetch.
  Updated `backend/src/main.py` to allow both `http://localhost:3000` and `http://127.0.0.1:3000` to cover different browser behaviors.
---

# Fix CORS Origin Policy

## Context
After fixing the authentication logic (Token + Timezone), the frontend attempted to fetch tasks but was blocked by the browser's CORS policy. This typically happens when the `allow_origins` list in the backend doesn't exactly match the origin of the request (even `localhost` vs `127.0.0.1` matters).

## Fix
Updated `backend/src/main.py`:
-   Expanded `allow_origins` in `CORSMiddleware`.
-   Added `http://127.0.0.1:3000` alongside `http://localhost:3000`.

## Expected Result
Browser requests from the dashboard will now pass the preflight (OPTIONS) check and successfully retrieve data.
