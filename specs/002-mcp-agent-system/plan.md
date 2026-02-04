# Implementation Plan - Taskoo AI: Agentic MCP Architecture

## Technical Context

### Architecture Overview
- **System Type**: AI-Native Agentic Application.
- **Frontend**: Next.js (App Router) with OpenAI ChatKit.
- **Backend**: Python FastAPI service exposing a single stateless chat endpoint and hosting the Agent/MCP runtime.
- **AI Logic**: OpenAI Agents SDK (stateless runner).
- **Tooling**: Official MCP SDK (Python) implementing `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task`.
- **Persistence**: Neon Serverless PostgreSQL using SQLModel.
- **Authentication**: Better Auth (JWT-based, stateless).

### Technologies & Libraries
- **Language**: Python 3.11+, TypeScript (Next.js 16+).
- **Frameworks**: FastAPI, Next.js, OpenAI Agents SDK.
- **Libraries**: `mcp` (Official SDK), `sqlmodel`, `pydantic`, `openai`, `better-auth`.
- **Infrastructure**: Neon (Postgres).

### Constraints & Unknowns
- **Constraint**: The backend must be completely stateless. Conversation history must be loaded from DB on every request.
- **Constraint**: All AI actions must go through MCP tools.
- **Unknown**: Specific pattern for integrating OpenAI Agents SDK with custom MCP server in a single FastAPI process (Needs Research).
- **Unknown**: Exact schema for ChatKit frontend compatibility (Needs Research).

## Constitution Check

### Principle Alignment
- **I. Spec-Driven Agentic Workflow**: Plan follows the spec -> plan -> tasks cycle.
- **II. AI-Native Full-Stack Architecture**: Architecture explicitly uses ChatKit, Agents SDK, and MCP.
- **III. Stateless Agentic Architecture**: Design enforces DB persistence for all state; no in-memory session storage.
- **IV. MCP Standard**: All task operations are defined as MCP tools.
- **V. Secure Data Isolation**: Plan includes `user_id` scoping for all DB models and tool args.
- **VI. Testable Deliverables**: Plan includes unit tests for MCP tools and integration tests for the chat endpoint.

### Gate Evaluation
- **Gate 1 (Spec)**: Spec is detailed and approved.
- **Gate 2 (Constitution)**: Alignment confirmed.
- **Gate 3 (Feasibility)**: Architecture is viable, but specific integration patterns need research (Phase 0).

## Phase 0: Research & Discovery

### Research Tasks
1. **Research OpenAI Agents SDK + MCP Integration**:
   - *Goal*: Determine how to register local MCP tools with the OpenAI Agent runner within a FastAPI route.
   - *Output*: Code snippet/pattern for tool registration.
2. **Research ChatKit Frontend Contract**:
   - *Goal*: Identify the expected API response format for ChatKit to render messages and tool calls correctly.
   - *Output*: JSON schema for the `/api/chat` response.
3. **Research Better Auth Integration**:
   - *Goal*: Confirm header/token format for stateless verification in FastAPI.
   - *Output*: Auth dependency code pattern.

### Research Output (Expected)
- `specs/002-mcp-agent-system/research.md`: Consolidated findings and patterns.

## Phase 1: Design & Contracts

### Data Model (`data-model.md`)
- **Entities**:
  - `User` (managed by Better Auth, referenced by ID).
  - `Task` (id, user_id, title, description, completed, timestamps).
  - `Conversation` (id, user_id, timestamps).
  - `Message` (id, conversation_id, role, content, tool_calls, created_at).

### API Contracts (`contracts/openapi.yaml`)
- **Endpoint**: `POST /api/{user_id}/chat`
  - **Input**: Message content, optional conversation_id.
  - **Output**: Agent response, tool call details, conversation_id.
- **Security Scheme**: Bearer Token (JWT).

### Agent Context
- Update `backend/README.md` and `frontend/README.md` with new architecture details.
- Create `quickstart.md` for local dev setup of the agentic stack.

## Phase 2: Implementation Tasks (Preview)

1. **Backend Setup**: Init FastAPI, SQLModel, Neon connection.
2. **MCP Tool Implementation**: Implement the 5 tools with Pydantic models.
3. **Agent Runner**: Implement the stateless agent runner service.
4. **Chat Endpoint**: Wire up the API route to the runner.
5. **Frontend Setup**: Scaffold ChatKit UI and connect to backend.
6. **E2E Testing**: Verify full flow from UI -> Backend -> Agent -> Tool -> DB.
