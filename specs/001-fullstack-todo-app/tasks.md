---
description: "Task list for Full-Stack Todo Application implementation"
---

# Tasks: Full-Stack Todo Application

**Input**: Design documents from `specs/001-fullstack-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Tests are OPTIONAL but recommended for critical paths.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`
- **Tests**: `backend/tests/` and `frontend/__tests__/` (if applicable)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directories: `backend/`, `frontend/`, `backend/src`, `backend/tests`, `frontend/src`
- [x] T002 Initialize Backend: Create `backend/pyproject.toml` (or requirements.txt) with FastAPI, SQLModel, PyJWT dependencies
- [x] T003 Initialize Frontend: Run `create-next-app` in `frontend/` (Next.js 16+, App Router)
- [x] T004 [P] Configure `.env` templates: `backend/.env.example` and `frontend/.env.example` with required keys (DATABASE_URL, BETTER_AUTH_SECRET, etc.)
- [x] T005 [P] Setup Git ignore files for both `backend/.gitignore` and `frontend/.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Setup Backend Database: Create `backend/src/core/database.py` with SQLModel engine and session dependency
- [x] T007 Implement Backend Config: Create `backend/src/core/config.py` to load env vars (BETTER_AUTH_SECRET, DB_URL)
- [x] T008 Implement JWT Security: Create `backend/src/core/security.py` with `get_current_user` dependency that validates JWT signature
- [x] T009 Setup Frontend Auth: Install Better Auth in `frontend/` and configure client in `frontend/src/lib/auth-client.ts` (or equivalent)
- [x] T010 [P] Create Backend Main: Initialize `backend/src/main.py` with FastAPI app and CORS middleware

**Checkpoint**: Foundation ready - Authentication logic is scaffolded, DB connection is ready.

---

## Phase 3: User Story 1 - User Authentication (Priority: P1)

**Goal**: Users can sign up and sign in; Backend validates their identity via JWT.

**Independent Test**: Verify frontend can obtain a JWT token and backend accepts it for a protected test route.

### Implementation for User Story 1

- [x] T011 [US1] Create Auth UI: Implement `frontend/src/app/(auth)/sign-in/page.tsx` using Better Auth components
- [x] T012 [US1] Create Auth UI: Implement `frontend/src/app/(auth)/sign-up/page.tsx` using Better Auth components
- [x] T013 [US1] Create Protected Test Endpoint: Add `GET /api/me` in `backend/src/api/auth_test.py` that requires `get_current_user`
- [x] T014 [US1] Frontend Auth Guard: Create `frontend/src/components/auth-guard.tsx` (or middleware) to protect dashboard routes
- [x] T015 [US1] Verify Integration: Manual test - Log in on frontend, use token to call backend `/api/me` (curl or UI)

**Checkpoint**: Authentication flow is end-to-end functional.

---

## Phase 4: User Story 2 - Task Management (CRUD) (Priority: P1)

**Goal**: Authenticated users can Create, Read, Update, and Delete their own tasks.

**Independent Test**: Create a task via API, verify it exists. Update it, verify change. Delete it, verify it's gone.

### Implementation for User Story 2

- [x] T016 [US2] Backend Model: Define `Task` entity in `backend/src/models/task.py` matching data-model.md
- [x] T017 [US2] Backend Schemas: Define Pydantic models (Create, Update, Response) in `backend/src/schemas/task.py` matching contracts
- [x] T018 [US2] Backend Service: Implement CRUD logic in `backend/src/services/task_service.py` (filtering by user_id)
- [x] T019 [US2] Backend API: Implement `GET /api/{user_id}/tasks` and `POST /api/{user_id}/tasks` in `backend/src/api/tasks.py`
- [x] T020 [US2] Backend API: Implement `GET`, `PUT`, `DELETE` for single task in `backend/src/api/tasks.py`
- [x] T021 [US2] Frontend Client: Create `frontend/src/lib/api.ts` with fetch wrappers including Auth header
- [x] T022 [US2] Frontend UI: Create `frontend/src/components/task-list.tsx` to fetch and display tasks
- [x] T023 [US2] Frontend UI: Create `frontend/src/components/task-form.tsx` for creating/editing tasks
- [x] T024 [US2] Frontend Page: Assemble `frontend/src/app/dashboard/page.tsx` using TaskList and TaskForm

**Checkpoint**: Full CRUD capability is live for logged-in users.

---

## Phase 5: User Story 3 - Task Completion (Priority: P2)

**Goal**: Quickly toggle task status.

**Independent Test**: PATCH a task's status and verify the boolean flips.

### Implementation for User Story 3

- [x] T025 [US3] Backend API: Implement `PATCH /api/{user_id}/tasks/{id}/complete` in `backend/src/api/tasks.py`
- [x] T026 [US3] Backend Service: Add toggle logic to `backend/src/services/task_service.py`
- [x] T027 [US3] Frontend UI: Add checkbox/toggle interaction to `frontend/src/components/task-item.tsx`
- [x] T028 [US3] Frontend Integration: Connect toggle action to API in `frontend/src/lib/api.ts`

**Checkpoint**: Task completion feature is functional.

---

## Phase 6: User Story 4 - Data Privacy & Isolation (Priority: P0 - Security)

**Goal**: Ensure strict isolation (User A cannot see User B's data).

**Independent Test**: Attempt API calls with User A's token for User B's user_id path. Expect 403/401.

### Implementation for User Story 4

- [x] T029 [US4] Backend Security: Add middleware/dependency in `backend/src/core/security.py` to enforce `token.sub == path.user_id`
- [x] T030 [US4] Backend API: Apply isolation dependency to all `/api/{user_id}/...` routes in `backend/src/api/tasks.py`
- [x] T031 [US4] Security Test: Add automated test `backend/tests/test_security.py` attempting cross-user access (should fail)

**Checkpoint**: Security isolation is verified and enforced.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanups and non-functional improvements

- [x] T032 Documentation: Update `README.md` with final run instructions
- [x] T033 UI Polish: Improve styling (Tailwind CSS) for Dashboard and Auth pages
- [x] T034 Error Handling: Add toast notifications for API errors in Frontend
- [x] T035 Cleanup: Remove `backend/src/api/auth_test.py` (if desired) or secure it

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks US1, US2, US3, US4.
- **US1 (Auth)**: Depends on Foundational. Blocks US2 (needs valid token for tasks).
- **US2 (CRUD)**: Depends on US1 (need logged-in user).
- **US3 (Completion)**: Depends on US2 (need tasks to complete).
- **US4 (Isolation)**: Can be implemented alongside US2, but explicitly verified in Phase 6.

### Parallel Opportunities

- **Frontend vs Backend**: Once contracts are defined (which they are), Frontend (T021-T024) and Backend (T016-T020) for US2 can proceed in parallel using mocked data if needed, then integrated.
- **Setup Tasks**: T004, T005 can run in parallel with T001-T003.

## Implementation Strategy

### MVP First (Auth + CRUD)
1. Complete Setup & Foundation.
2. Implement US1 (Auth) to get tokens.
3. Implement US2 (CRUD) to get core value.
4. **MVP Milestone**: Users can log in and manage tasks.

### Security Hardening
1. Implement US4 (Isolation) immediately after or during US2 to ensure no security debt.
2. Implement US3 (Polish feature) last.
