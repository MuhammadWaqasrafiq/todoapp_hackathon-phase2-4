---
id: "024"
title: "Fix Chat Message Format"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "mcp-agent-system"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "fix-chat-format"
labels:
  - "backend"
  - "openai"
  - "bugfix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - backend/src/api/routes/chat.py
tests_yaml: |
  - (Manual) Verify chat functionality works and agent responds correctly.
prompt_text: |
  list my task i asked this with chatbot but when i say list my tasks it is not giving any answer... POST /api/.../chat HTTP/1.1 500 Internal Server Error
response_text: |
  The 500 error likely originated from passing invalid message structures to the OpenAI API (e.g., `None` content).
  Updated `backend/src/api/routes/chat.py` to ensure `content` is never None (defaulting to empty string) when constructing the message history for the LLM.
---

# Fix Chat Message Format

## Context
The chat endpoint crashed (500 Error) when processing message history. This often happens if the database contains messages with `null` content (e.g., purely tool call messages or initial setup messages) that are then passed to the OpenAI API, which requires `content` to be a string (even if empty).

## Fix
Modified `backend/src/api/routes/chat.py`:
-   When mapping DB messages to OpenAI format, forced `content` to be `""` if it is `None`.
    ```python
    m = {"role": msg.role, "content": msg.content or ""}
    ```

## Expected Result
The `run_agent` function should now receive valid message objects, allowing the LLM to process the history and respond to "list my tasks".
