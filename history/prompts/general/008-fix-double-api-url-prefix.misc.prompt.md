---
id: "008"
title: "fix-double-api-url-prefix"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "frontend-chat"
branch: "main"
user: "DevAbdullah90"
command: "fix"
labels: ["bugfix", "frontend", "url-construction", "404"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "c:\\Users\\hp\\OneDrive\\Desktop\\ai-driven-development\\Hackathon-II\\Phase-II\\frontend\\src\\hooks\\use-agent-chat.ts"
tests: []
prompt_text: |
  FROM category
  ...
  INFO:     127.0.0.1:58075 - "GET /api/api/7VQKeU5NWGWN6l2tomv3uNbcqkVFnJpA/chat HTTP/1.1" 404 Not Found
  ...
  it is giving this error when i am saying hello to chatbot 
response_text: |
  Fixed a 404 error caused by malformed request URLs containing a double `/api` prefix (e.g., `/api/api/...`).
  
  **Root Cause:** The `NEXT_PUBLIC_API_URL` environment variable likely included `/api`, and the frontend code was appending another `/api` segment, resulting in an invalid path.
  
  **Actions taken:**
  1.  Modified `src/hooks/use-agent-chat.ts` to normalize the base URL by stripping any trailing `/api` segment before appending the rest of the path.
  
  This ensures the constructed URL is always correct regardless of whether the environment variable includes the prefix.
---

Fixed a 404 error caused by malformed request URLs containing a double `/api` prefix (e.g., `/api/api/...`).

**Root Cause:** The `NEXT_PUBLIC_API_URL` environment variable likely included `/api`, and the frontend code was appending another `/api` segment, resulting in an invalid path.

**Actions taken:**
1.  Modified `src/hooks/use-agent-chat.ts` to normalize the base URL by stripping any trailing `/api` segment before appending the rest of the path.

This ensures the constructed URL is always correct regardless of whether the environment variable includes the prefix.
