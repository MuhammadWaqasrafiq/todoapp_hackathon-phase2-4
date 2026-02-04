# Tasks: Taskoo AI - Agentic MCP Architecture

## Phase 1: Setup & Infrastructure
**Goal**: Initialize the project structure for the new AI-native architecture and set up core infrastructure.

- [x] T001 Install core backend dependencies (fastapi, uvicorn, sqlmodel, openai, mcp, better-auth) in `backend/requirements.txt`
- [x] T002 Configure environment variables for OpenAI and Database in `backend/.env.example`
- [x] T003 Set up database connection logic with SQLModel in `backend/src/core/database.py`
- [x] T004 Implement Better Auth stateless verification dependency in `backend/src/core/security.py`
- [x] T005 [P] Initialize Next.js project with ChatKit dependencies in `frontend/package.json`
- [x] T006 [P] Configure Next.js environment variables in `frontend/.env.example`

## Phase 2: Foundational Components
**Goal**: Implement the core data models and the MCP server foundation before building specific features.

- [x] T007 Define SQLModel entities (Task, Conversation, Message) in `backend/src/models/`
- [x] T008 Implement database migration/initialization script in `backend/src/db_init.py`
- [x] T009 Create Pydantic models for MCP tool arguments in `backend/src/schemas/tools.py`
- [x] T010 Implement the base MCP server structure and tool registration logic in `backend/src/mcp/server.py`
- [x] T011 Create the stateless Agent Runner service that integrates OpenAI SDK with MCP tools in `backend/src/services/agent_runner.py`
- [x] T012 Implement conversation history management service (fetch/store) in `backend/src/services/history_service.py`

## Phase 3: Conversational Interface (US1)
**Goal**: Enable users to send natural language messages and receive responses (FR1, FR2, FR3).

- [x] T013 [Story] [US1] Create the chat endpoint `POST /api/{user_id}/chat` in `backend/src/api/routes/chat.py`
- [x] T014 [Story] [US1] Wire the chat endpoint to the Agent Runner and History Service in `backend/src/api/routes/chat.py`
- [x] T015 [Story] [US1] Implement the ChatKit `useChat` hook integration in `frontend/src/hooks/use-agent-chat.ts`
- [x] T016 [Story] [US1] Build the main Chat Interface component in `frontend/src/components/chat-interface.tsx`
- [x] T017 [Story] [US1] Connect the Chat Interface to the backend API in `frontend/src/app/chat/page.tsx`
- [x] T018 [Story] [US1] Verify conversation persistence across page reloads (Test Manual)

## Phase 4: Task Management Tools (US2, US3, US4)
**Goal**: Enable the Agent to perform CRUD operations on tasks via MCP tools (FR4-FR8).

- [x] T019 [Story] [US2] Implement `add_task` MCP tool logic in `backend/src/mcp/tools/tasks.py`
- [x] T020 [Story] [US3] Implement `list_tasks` MCP tool logic with filtering in `backend/src/mcp/tools/tasks.py`
- [x] T021 [Story] [US4] Implement `update_task` MCP tool logic in `backend/src/mcp/tools/tasks.py`
- [x] T022 [Story] [US4] Implement `complete_task` MCP tool logic in `backend/src/mcp/tools/tasks.py`
- [x] T023 [Story] [US4] Implement `delete_task` MCP tool logic in `backend/src/mcp/tools/tasks.py`
- [x] T024 [Story] [US2] Register all task tools with the MCP server in `backend/src/mcp/server.py`
- [x] T025 [P] [Story] [US3] Create a Task List visualization component in Frontend to show real-time state in `frontend/src/components/task-view.tsx`

## Phase 5: Polish & Security
**Goal**: Ensure robust error handling, security, and smooth UX.

- [x] T026 Implement global exception handler for Agent/MCP errors in `backend/src/core/exceptions.py`
- [x] T027 Verify User Isolation: Ensure `list_tasks` only returns user's own data (Test Manual)
- [x] T028 Add loading states and tool call indicators to Chat UI in `frontend/src/components/chat-interface.tsx`
- [x] T029 Update documentation (README) with setup instructions for the new architecture in `README.md`

## Dependencies
- Phase 1 must be completed before Phase 2.
- Phase 2 must be completed before Phase 3 and 4.
- Phase 3 (Chat) and Phase 4 (Tools) can be partially parallelized, but tools need the runner from Phase 2.
- US1 (Conversation) is the entry point for US2-US4 (Task Tools).

## Implementation Strategy
- **MVP**: Complete Phases 1, 2, and 3 first to get a working "echo" bot that persists history.
- **Incremental**: Add one tool at a time (Add -> List -> Update/Delete) in Phase 4.
- **Testing**: Verify each MCP tool independently with unit tests before wiring to the Agent.
