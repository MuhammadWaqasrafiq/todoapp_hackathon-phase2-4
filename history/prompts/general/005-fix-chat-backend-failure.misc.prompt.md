---
id: "005"
title: "fix-chat-backend-failure"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "backend-chat"
branch: "main"
user: "DevAbdullah90"
command: "fix"
labels: ["bugfix", "backend", "fastapi", "ai-sdk"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "c:\\Users\\hp\\OneDrive\\Desktop\\ai-driven-development\\Hackathon-II\\Phase-II\\backend\\src\\api\\routes\\chat.py"
tests: []
prompt_text: |
  now it is wrting but i am writing hi and then clikc on send it is diaapear 
response_text: |
  Fixed the issue where messages would disappear after sending.
  
  **Root Cause:** The backend API endpoint `/api/{user_id}/chat` expected a payload with a `message` field, but the Vercel AI SDK (`useChat`) sends a `messages` array by default. This mismatch caused the backend to likely throw a 422 Validation Error (or 400), which the frontend silently swallowed or failed to handle, causing the optimistic UI update to be rolled back (disappearing message).
  
  **Actions taken:**
  1.  Updated `backend/src/api/routes/chat.py` to accept `ChatSDKRequest` containing `messages: List[Message]`.
  2.  Modified the endpoint logic to extract the last user message from the `messages` list.
  3.  Ensured the `get_chat_history` endpoint remains intact.
  
  Now the backend correctly interprets the AI SDK's request format.
---

Fixed the issue where messages would disappear after sending.

**Root Cause:** The backend API endpoint `/api/{user_id}/chat` expected a payload with a `message` field, but the Vercel AI SDK (`useChat`) sends a `messages` array by default. This mismatch caused the backend to likely throw a 422 Validation Error (or 400), which the frontend silently swallowed or failed to handle, causing the optimistic UI update to be rolled back (disappearing message).

**Actions taken:**
1.  Updated `backend/src/api/routes/chat.py` to accept `ChatSDKRequest` containing `messages: List[Message]`.
2.  Modified the endpoint logic to extract the last user message from the `messages` list.
3.  Ensured the `get_chat_history` endpoint remains intact.

Now the backend correctly interprets the AI SDK's request format.
