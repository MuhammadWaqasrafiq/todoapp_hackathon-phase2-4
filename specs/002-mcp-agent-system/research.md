# Research: Agentic MCP System

## Unknowns & Clarifications

### 1. OpenAI Agents SDK + MCP Integration
- **Question**: How do we register local python functions (MCP tools) with the OpenAI Agent runner in a stateless request?
- **Decision**: Use standard OpenAI API `tools` parameter.
- **Pattern**:
  1. Define MCP tools as Python functions with Pydantic arguments.
  2. Generate JSON Schema for each tool.
  3. Pass schema to OpenAI `chat.completions.create` (or Agents SDK equivalent).
  4. On `tool_calls` response, map name to Python function, execute, and append result to history.
  5. Recursively call LLM with tool outputs.

### 2. ChatKit Frontend Contract
- **Question**: What is the exact JSON structure ChatKit expects from the backend?
- **Decision**: Standard Vercel AI SDK `useChat` format.
- **Pattern**:
  - **Request**: `POST /api/chat` with body `{"messages": [{"role": "user", "content": "..."}]}`.
  - **Response**: Streaming text or JSON object. For this phase, we will use **JSON** to simplify tool handling visibility.
  - **Contract**: `{"id": "...", "role": "assistant", "content": "...", "tool_calls": [...]}`.

### 3. Better Auth Stateless Verification
- **Question**: How do we verify Better Auth session tokens in FastAPI?
- **Decision**: JWT Verification.
- **Pattern**:
  - Middleware extracts `Authorization: Bearer <token>`.
  - Verify signature using `BETTER_AUTH_SECRET`.
  - Decode payload to get `user_id`.
  - Reject if invalid/expired.

## Decisions & Patterns

### Pattern: Stateless Agent Runner
- **Description**: Re-hydrate the agent with history from DB on every request.
- **Rationale**: Ensures scalability and server resilience (Constitution Principle III).

### Pattern: SQLModel for Persistence
- **Description**: Use SQLModel for both DB definition and Pydantic validation.
- **Rationale**: Reduces code duplication between DB models and API schemas.