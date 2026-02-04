---
id: "013"
title: "fix-auth-signed-encoded-tokens"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "backend-auth"
branch: "main"
user: "DevAbdullah90"
command: "fix"
labels: ["bugfix", "backend", "auth", "cookies", "encoding"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "c:\\Users\\hp\\OneDrive\\Desktop\\ai-driven-development\\Hackathon-II\\Phase-II\\backend\\src\\core\\security.py"
tests: []
prompt_text: |
  still giving this error
  [Logs: taskoo-v2 contains %3D and .signature suffix]
response_text: |
  Fixed `401 Unauthorized` caused by cookie encoding/signing mismatch.
  
  **Root Cause:** The browser sends cookies URL-encoded (e.g., `%3D` for `=`) and signed (e.g., `token.signature`). The database stores the raw, decoded token. A direct equality check was failing.
  
  **Actions taken:**
  1.  Enhanced `backend/src/core/security.py` to test variations of the token:
      - Raw
      - URL-decoded (handling `%3D`)
      - Signature-stripped (handling `.signature` suffix)
      - Both (handling encoded + signed)
  
  **Result:** The backend will now correctly match the cookie against the database record regardless of encoding or signing.
---

Fixed `401 Unauthorized` caused by cookie encoding/signing mismatch.

**Root Cause:** The browser sends cookies URL-encoded (e.g., `%3D` for `=`) and signed (e.g., `token.signature`). The database stores the raw, decoded token. A direct equality check was failing.

**Actions taken:**
1.  Enhanced `backend/src/core/security.py` to test variations of the token:
    - Raw
    - URL-decoded (handling `%3D`)
    - Signature-stripped (handling `.signature` suffix)
    - Both (handling encoded + signed)

**Result:** The backend will now correctly match the cookie against the database record regardless of encoding or signing.
