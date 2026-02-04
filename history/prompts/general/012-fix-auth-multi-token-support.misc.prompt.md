---
id: "012"
title: "fix-auth-multi-token-support"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "backend-auth"
branch: "main"
user: "DevAbdullah90"
command: "fix"
labels: ["bugfix", "backend", "auth", "refactor"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "c:\\Users\\hp\\OneDrive\\Desktop\\ai-driven-development\\Hackathon-II\\Phase-II\\backend\\src\\core\\security.py"
tests: []
prompt_text: |
  giving this error now
  [Logs: better-auth.session_token received, Valid opaque session found for user (taskoo-v2?), then No session record found (better-auth)]
response_text: |
  Fixed persistent `401 Unauthorized` by supporting multiple session token sources.
  
  **Root Cause:** The user has two session cookies: `better-auth.session_token` (likely stale/invalid) and `taskoo-v2.session_token` (valid). The previous backend logic prioritized the `better-auth` cookie and failed immediately when it was invalid, ignoring the valid `taskoo-v2` cookie.
  
  **Actions taken:**
  1.  Refactored `verify_token` in `backend/src/core/security.py` to iterate through ALL available tokens (header and both cookies).
  2.  The validation loop now tries each token; if one fails, it proceeds to the next until a valid session is found or all candidates are exhausted.
  
  **Result:** The backend will now correctly identify the valid `taskoo-v2` session even if the invalid `better-auth` cookie is present.
---

Fixed persistent `401 Unauthorized` by supporting multiple session token sources.

**Root Cause:** The user has two session cookies: `better-auth.session_token` (likely stale/invalid) and `taskoo-v2.session_token` (valid). The previous backend logic prioritized the `better-auth` cookie and failed immediately when it was invalid, ignoring the valid `taskoo-v2` cookie.

**Actions taken:**
1.  Refactored `verify_token` in `backend/src/core/security.py` to iterate through ALL available tokens (header and both cookies).
2.  The validation loop now tries each token; if one fails, it proceeds to the next until a valid session is found or all candidates are exhausted.

**Result:** The backend will now correctly identify the valid `taskoo-v2` session even if the invalid `better-auth` cookie is present.
