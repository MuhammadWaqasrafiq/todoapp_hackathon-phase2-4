---
id: "014"
title: "fix-backend-mcp-coroutine"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "backend-agent"
branch: "main"
user: "DevAbdullah90"
command: "fix"
labels: ["bugfix", "backend", "python", "async"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "c:\\Users\\hp\\OneDrive\\Desktop\\ai-driven-development\\Hackathon-II\\Phase-II\\backend\\src\\services\\agent_runner.py"
tests: []
prompt_text: |
  still giving this error
  [Traceback: TypeError: 'coroutine' object is not iterable in agent_runner.py]
response_text: |
  Fixed backend crash during tool loading.
  
  **Root Cause:** `mcp.list_tools()` is an asynchronous function (coroutine), but the code was collecting it like a synchronous list: `[tool... for tool in mcp.list_tools()]`.
  
  **Actions taken:**
  1.  Added `await` to `mcp.list_tools()` in `backend/src/services/agent_runner.py`.
  
  **Status:** Authentication is confirmed successful (past the 401 error). The backend is now reaching the logic where it prepares the AI agent. This should be the final fix.
---

Fixed backend crash during tool loading.

**Root Cause:** `mcp.list_tools()` is an asynchronous function (coroutine), but the code was collecting it like a synchronous list: `[tool... for tool in mcp.list_tools()]`.

**Actions taken:**
1.  Added `await` to `mcp.list_tools()` in `backend/src/services/agent_runner.py`.

**Status:** Authentication is confirmed successful (past the 401 error). The backend is now reaching the logic where it prepares the AI agent. This should be the final fix.
