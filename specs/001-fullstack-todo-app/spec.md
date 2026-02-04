# Feature Specification: Full-Stack Todo Application

**Feature Branch**: `001-fullstack-todo-app`
**Created**: 2024-12-31
**Status**: Draft
**Input**: Phase II: Todo Full-Stack Web Application (Next.js 16+, FastAPI, Neon, Better Auth, JWT)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication (Priority: P1)

As a new or returning user, I want to securely sign up and sign in using my email and password so that I can access my private task list.

**Why this priority**: Without authentication, the "multi-user" and "private data" requirements cannot be met. It is the gatekeeper for the entire application.

**Independent Test**: Can be tested by creating a new account on the frontend and verifying that a JWT is received and stored, and subsequent API calls to a protected endpoint (e.g. `/api/{id}/tasks`) succeed with that token.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they click "Sign Up", **Then** they see a registration form using Better Auth.
2. **Given** valid credentials, **When** the user submits the signup form, **Then** a new user record is created, they are logged in, and a valid JWT is issued.
3. **Given** a logged-out user, **When** they enter correct credentials on the "Sign In" page, **Then** they are authenticated and redirected to their dashboard.
4. **Given** an unauthenticated user, **When** they attempt to access `/dashboard` or make a request to `/api/...`, **Then** they are redirected to login or receive a 401 Unauthorized response.

---

### User Story 2 - Task Management (CRUD) (Priority: P1)

As an authenticated user, I want to create, view, update, and delete tasks so that I can manage my daily work.

**Why this priority**: This is the core business value of a "Todo App".

**Independent Test**: Can be tested via API automation or UI by performing the full lifecycle of a task (Create -> Read -> Update -> Delete) for a specific logged-in user.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they view the dashboard, **Then** they see a list of *only* their own tasks (GET `/api/{user_id}/tasks`).
2. **Given** an authenticated user, **When** they submit a new task title/description, **Then** the task is saved to the database and appears in the list (POST `/api/{user_id}/tasks`).
3. **Given** an existing task, **When** the user edits its details, **Then** the changes are persisted (PUT `/api/{user_id}/tasks/{id}`).
4. **Given** a task, **When** the user clicks delete, **Then** the task is permanently removed (DELETE `/api/{user_id}/tasks/{id}`).

---

### User Story 3 - Task Completion (Priority: P2)

As an authenticated user, I want to quickly mark tasks as complete or incomplete so that I can track my progress.

**Why this priority**: A distinct, high-frequency interaction separate from full editing.

**Independent Test**: Verify the toggle state persists after page reload.

**Acceptance Scenarios**:

1. **Given** an incomplete task, **When** the user clicks the checkbox, **Then** the task visual style changes to "completed" and the status is updated on the server (PATCH `/api/{user_id}/tasks/{id}/complete`).
2. **Given** a completed task, **When** the user clicks the checkbox, **Then** it reverts to "active" status.

---

### User Story 4 - Data Privacy & Isolation (Priority: P0 - Security)

As a user, I want my data to be strictly private so that no other user can view or modify my tasks.

**Why this priority**: Critical security requirement defined in the Constitution.

**Independent Test**: Create two users (A and B). Create tasks for User A. Log in as User B and attempt to access User A's task IDs via API. Must return 404 or 403, never 200.

**Acceptance Scenarios**:

1. **Given** User A's valid JWT, **When** requesting `/api/{user_B_id}/tasks`, **Then** the server returns 401/403 (or 404 if masquerading isolation).
2. **Given** User A's valid JWT, **When** requesting GET/PUT/DELETE for a Task ID belonging to User B, **Then** the server returns 404 Not Found or 403 Forbidden.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to register and login using email/password via Better Auth.
- **FR-002**: Frontend MUST include a JWT token in the `Authorization: Bearer <token>` header for all backend API requests.
- **FR-003**: Backend MUST verify the JWT signature using the shared `BETTER_AUTH_SECRET` on every protected endpoint.
- **FR-004**: System MUST allow creating a task with at least a Title (required) and Description (optional).
- **FR-005**: System MUST allow listing all tasks belonging *strictly* to the authenticated user.
- **FR-006**: System MUST allow updating a task's title and description.
- **FR-007**: System MUST allow deleting a task.
- **FR-008**: System MUST allow toggling a task's completion status via a dedicated PATCH endpoint.
- **FR-009**: Backend MUST reject any request (401) that lacks a valid JWT or has an expired token.
- **FR-010**: API endpoints MUST validate that the `user_id` in the URL matches the `sub` (or equivalent ID) in the JWT token.

### Key Entities

- **User**: Managed by Better Auth (Frontend) / Referenced by ID (Backend).
  - Attributes: `id`, `email`, `created_at`.
- **Task**: The core unit of work.
  - Attributes: `id` (UUID/Int), `user_id` (Foreign Key), `title` (String), `description` (String/Text), `is_completed` (Boolean), `created_at` (DateTime), `updated_at` (DateTime).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (Security)**: 100% of backend API endpoints (excluding health check) reject requests without a valid JWT.
- **SC-002 (Isolation)**: A user cannot access another user's task even if they know the Task ID (verified via automated test).
- **SC-003 (Persistence)**: Created tasks persist in the database and are retrievable after a full page reload or logout/login cycle.
- **SC-004 (Usability)**: Critical user flows (Signup -> Create Task) can be completed without console errors or UI blockers.
- **SC-005 (Performance)**: Dashboard (task list) loads in under 1 second for a user with <50 tasks.
