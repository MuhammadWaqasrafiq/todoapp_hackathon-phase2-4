---
id: "011"
title: "fix-backend-security-crash"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "backend-auth"
branch: "main"
user: "DevAbdullah90"
command: "fix"
labels: ["bugfix", "backend", "python", "auth"]
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
  [TracebackAttributeError: 'NoneType' object has no attribute 'credentials']
response_text: |
  Fixed a backend crash introduced during debugging.
  
  **Root Cause:** The previous edit to `verify_token` in `security.py` incorrectly attempted to access `credentials.credentials` inside the `if request:` block without checking if `credentials` was actually present. When only cookies were provided (via `request`), `credentials` was `None`, causing an `AttributeError`.
  
  **Observation:** The logs successfully showed `better-auth.session_token` in the cookies! This means the frontend fix worked, and the authentication flow will succeed once this backend crash is resolved.
  
  **Actions taken:**
  1.  Corrected the logic in `backend/src/core/security.py` to handle cases where `credentials` is `None` but `request` (cookies) is present.
  
  **Next Steps:** Restart backend server.
---

Fixed a backend crash introduced during debugging.

**Root Cause:** The previous edit to `verify_token` in `security.py` incorrectly attempted to access `credentials.credentials` inside the `if request:` block without checking if `credentials` was actually present. When only cookies were provided (via `request`), `credentials` was `None`, causing an `AttributeError`.

**Observation:** The logs successfully showed `better-auth.session_token` in the cookies! This means the frontend fix worked, and the authentication flow will succeed once this backend crash is resolved.

**Actions taken:**
1.  Corrected the logic in `backend/src/core/security.py` to handle cases where `credentials` is `None` but `request` (cookies) is present.

**Next Steps:** Restart backend server.
