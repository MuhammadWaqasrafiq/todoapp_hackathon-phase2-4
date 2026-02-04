---
id: "027"
title: "Fix MCP Tool Invocation Syntax"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "mcp-agent-system"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "fix-mcp-call"
labels:
  - "mcp"
  - "backend"
  - "bugfix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - backend/src/services/agent_runner.py
tests_yaml: |
  - (Manual) Verify chat tool execution (e.g., "add task") works without TypeError.
prompt_text: |
  TypeError: FastMCP.call_tool() got an unexpected keyword argument 'user_id'
response_text: |
  The logs revealed that `FastMCP.call_tool()` was being called with unpacked arguments (`**arguments`), which passed `user_id` as a keyword argument.
  However, `FastMCP` expects the arguments dictionary as a single positional argument: `call_tool(name, arguments_dict)`.
  Updated `backend/src/services/agent_runner.py` to pass the `arguments` dictionary directly.
---

# Fix MCP Tool Invocation Syntax

## Context
The chat agent failed when executing tools because of a Python syntax mismatch. The code was doing `call_tool(name, user_id="...", title="...")`, but the `FastMCP` library expects `call_tool(name, {"user_id": "...", "title": "..."})`.

## Fix
Updated `backend/src/services/agent_runner.py`:
-   Changed `await mcp.call_tool(function_name, **arguments)`
-   To `await mcp.call_tool(function_name, arguments)`

## Expected Result
The tool execution should now succeed, and the agent should be able to list and create tasks.
