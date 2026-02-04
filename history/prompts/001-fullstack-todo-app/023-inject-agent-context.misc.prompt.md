---
id: "023"
title: "Inject User Context into Agent System Prompt"
stage: "misc"
date: "2026-01-01"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-1219"
feature: "mcp-agent-system"
branch: "002-mcp-agent-system"
user: "Iqra Abdullah"
command: "inject-agent-context"
labels:
  - "llm"
  - "prompt-engineering"
  - "ux"
  - "fix"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - backend/src/services/agent_runner.py
tests_yaml: |
  - (Manual) User asks "Add a task..." and agent does NOT ask for user ID.
prompt_text: |
  Could you please provide your user ID so I can add the task to your to-do list? i ask this question so how can i give the user id ?
response_text: |
  The LLM didn't know the current user's ID because it wasn't in the prompt context, so it asked the user for it (bad UX).
  Updated `backend/src/services/agent_runner.py` to prepend a system message:
  "You are a helpful task management assistant called Taskoo. The current user's ID is '{user_id}'. You do NOT need to ask the user for their ID..."
  This ensures the agent autonomously uses the correct ID for tool calls.
---

# Inject User Context into Agent System Prompt

## Context
The LLM, seeing the `add_task` tool requires a `user_id` parameter, correctly (but inconveniently) paused to ask the user for it. Since the user is already authenticated, the system should handle this automatically.

## Fix
Modified `backend/src/services/agent_runner.py`:
-   Added a **System Prompt** at the beginning of the message history sent to OpenAI.
-   The prompt explicitly states the current `user_id` and instructs the model to use it for tool calls without asking.

## Expected Result
When the user says "add a task", the LLM will see the `user_id` in its system instructions and generate the tool call immediately: `add_task(user_id="...", title="...")`.
