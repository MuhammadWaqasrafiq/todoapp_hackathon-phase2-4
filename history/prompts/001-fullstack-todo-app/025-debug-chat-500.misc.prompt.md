---
id: "025"
title: "Instrument Chat Endpoint with Traceback Logging"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "mcp-agent-system"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "debug-chat-500"
labels:
  - "backend"
  - "debugging"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - backend/src/api/routes/chat.py
tests_yaml: |
  - (Manual) Check backend logs for full python traceback on 500 error.
prompt_text: |
  POST /api/.../chat HTTP/1.1 500 Internal Server Error
response_text: |
  The previous 500 error didn't print a traceback in the provided logs.
  Added a `try-except` block with `traceback.print_exc()` to the `chat_endpoint` in `backend/src/api/routes/chat.py`.
  This will force the error details to the console so we can diagnose the root cause (likely an OpenAI API issue or tool execution failure).
---

# Instrument Chat Endpoint with Traceback Logging

## Context
The chat endpoint is returning a generic 500 Internal Server Error, and the standard logs aren't revealing the root cause (e.g., specific exception message).

## Action
Wrapped the critical `await run_agent(...)` call in a `try-except Exception` block.
Inside the catch block, I'm calling `traceback.print_exc()` to dump the stack trace to standard output/logs.

## Next Steps
User needs to trigger the error again ("List my tasks") and share the new, detailed log output.
