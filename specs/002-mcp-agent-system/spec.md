# Specification: Taskoo AI - Agentic MCP Architecture

## 1. Background

### 1.1 Problem Statement
The current Todo application is a standard CRUD app. Users want a more natural, conversational way to manage their tasks. We need to shift to an AI-Native architecture where an AI Agent serves as the primary interface, intelligently invoking tools to perform actions.

### 1.2 Business Goals
- **Enable Natural Language Interaction**: Users should manage tasks by talking/typing naturally.
- **Scalable Architecture**: Move to a stateless, agentic backend that can scale horizontally.
- **Standardized Tooling**: Adopt the Model Context Protocol (MCP) to standardize how the AI interacts with the system.

### 1.3 Scope
- **In Scope**:
  - Conversational Interface (OpenAI ChatKit).
  - Stateless FastAPI Backend with OpenAI Agents SDK.
  - MCP Server exposing 5 core task operations.
  - Database persistence for Tasks, Conversations, and Messages.
  - Stateless Auth (Better Auth).
- **Out of Scope**:
  - Voice input/output (text only for now).
  - Multi-agent collaboration (single agent system).
  - File attachments or complex media.

## 2. Functional Requirements

### 2.1 Conversational Interface
- **FR1**: Users MUST be able to send natural language messages to the system.
- **FR2**: The system MUST persist conversation history across sessions.
- **FR3**: The interface MUST display the AI's response and indicate when actions (tools) are being taken.

### 2.2 Task Management via AI
- **FR4**: The Agent MUST be able to **Create** tasks based on user intent (e.g., "Remind me to buy milk").
- **FR5**: The Agent MUST be able to **List** tasks with filters (all, pending, completed).
- **FR6**: The Agent MUST be able to **Update** tasks (rename, change description).
- **FR7**: The Agent MUST be able to **Complete** tasks by ID or context.
- **FR8**: The Agent MUST be able to **Delete** tasks.

### 2.3 Context & State
- **FR9**: The backend MUST NOT store session state in memory. All state MUST be retrieved from the database per request.
- **FR10**: The Agent MUST have access to the conversation history to understand context (e.g., "Delete *that* task").

## 3. User Experience

### 3.1 User Scenarios

**Scenario 1: Adding a Task**
- **User**: "Add a task to buy groceries."
- **System**: Parses intent, calls `add_task` tool.
- **Agent**: "I've added 'Buy groceries' to your list."
- **UI**: Displays the new task (optional) and the confirmation message.

**Scenario 2: Listing & Filtering**
- **User**: "What do I have left to do?"
- **System**: Calls `list_tasks` with `status="pending"`.
- **Agent**: "You have 3 pending tasks: ..." (lists tasks).

**Scenario 3: Completing a Task**
- **User**: "Mark task 3 as done."
- **System**: Calls `complete_task` with `task_id=3`.
- **Agent**: "Task 3 'Call mom' has been marked as completed."

**Scenario 4: Contextual Deletion**
- **User**: "Delete the meeting task."
- **System**:
  1. Calls `list_tasks` to find tasks matching "meeting".
  2. Finds "Team Meeting (ID: 5)".
  3. Calls `delete_task` with `task_id=5`.
- **Agent**: "I've deleted the 'Team Meeting' task."

### 3.2 Error Handling
- If the Agent cannot find a task mentioned by the user, it should ask for clarification.
- If an API error occurs, the Agent should inform the user gracefully ("I couldn't access your tasks right now.").

## 4. Non-Functional Requirements

### 4.1 Architecture & Stack
- **Frontend**: OpenAI ChatKit (Next.js).
- **Backend**: Python FastAPI.
- **AI Framework**: OpenAI Agents SDK.
- **MCP Server**: Official MCP SDK.
- **Database**: Neon Serverless PostgreSQL (SQLModel ORM).
- **Auth**: Better Auth (Stateless, JWT verification).

### 4.2 Statelessness
- The `POST /api/{user_id}/chat` endpoint MUST be stateless.
- **Flow**: Request -> Fetch DB History -> Run Agent -> Store DB -> Response.

### 4.3 Security
- **User Isolation**: All database queries and tool executions MUST be scoped to the `user_id` from the auth token.
- **Domain Allowlist**: Frontend URL must be allowed in OpenAI settings.

## 5. Data Model & API

### 5.1 Database Schema (Conceptual)
- **Task**: `id`, `user_id`, `title`, `description`, `completed`, `created_at`
- **Conversation**: `id`, `user_id`, `created_at`
- **Message**: `id`, `conversation_id`, `role` (user/assistant), `content`, `created_at`

### 5.2 API Contract
- **Endpoint**: `POST /api/{user_id}/chat`
- **Request**:
  ```json
  {
    "conversation_id": "optional_int",
    "message": "User input string"
  }
  ```
- **Response**:
  ```json
  {
    "conversation_id": 123,
    "response": "AI text response",
    "tool_calls": ["add_task", "list_tasks"]
  }
  ```

### 5.3 MCP Tools Definition
The Agent interacts via these strictly typed tools:

| Tool | Parameters | Returns |
|------|------------|---------|
| `add_task` | `user_id` (str), `title` (str), `desc` (opt) | Task details |
| `list_tasks` | `user_id` (str), `status` (opt enum: all, pending, completed) | List of Tasks |
| `complete_task` | `user_id` (str), `task_id` (int) | Updated Task |
| `delete_task` | `user_id` (str), `task_id` (int) | Deleted Task ID |
| `update_task` | `user_id` (str), `task_id` (int), `title` (opt), `desc` (opt) | Updated Task |

## 6. Success Criteria
- **SC1**: User can perform all CRUD operations on tasks using only natural language.
- **SC2**: Server handles restarts seamlessly without losing conversation context (stateless verification).
- **SC3**: Unauthorized users cannot access or manipulate other users' tasks (security verification).
- **SC4**: System responds to basic intents ("Buy milk", "List tasks") correctly >95% of the time.

## 7. Assumptions & Risks
- **Assumption**: OpenAI API is available and responsive.
- **Risk**: Latency may be higher than CRUD due to LLM round-trips.
- **Risk**: LLM might hallucinate task IDs (mitigated by tool output validation).