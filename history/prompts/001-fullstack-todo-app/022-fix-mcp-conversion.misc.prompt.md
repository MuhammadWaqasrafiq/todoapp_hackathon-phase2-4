---
id: "022"
title: "Fix MCP Tool to OpenAI Conversion"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "mcp-agent-system"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "fix-mcp-conversion"
labels:
  - "mcp"
  - "openai"
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
  - (Manual) Verify chat functionality works without AttributeError.
prompt_text: |
  AttributeError: 'Tool' object has no attribute 'get_openai_definition'
response_text: |
  The `mcp.list_tools()` function returns Pydantic models (from `mcp` library) which do not have a `get_openai_definition` helper method.
  Implemented a helper function `convert_mcp_to_openai` in `backend/src/services/agent_runner.py` to manually map the MCP tool schema to the OpenAI function calling format.
---

# Fix MCP Tool to OpenAI Conversion

## Context
The chat agent failed to start because it tried to call `tool.get_openai_definition()`, but the `FastMCP` library returns raw Pydantic models for tools, not objects with helper methods.

## Fix
Updated `backend/src/services/agent_runner.py`:
-   Added `convert_mcp_to_openai` helper function.
-   Manually constructs the OpenAI tool definition dictionary:
    ```python
    {
        "type": "function",
        "function": {
            "name": tool.name,
            "description": tool.description,
            "parameters": tool.inputSchema
        }
    }
    ```
-   Replaced the crashing list comprehension with a call to this helper.

## Expected Result
The agent should now correctly register the MCP tools (add_task, list_tasks, etc.) with the OpenAI API and process user chat messages.
