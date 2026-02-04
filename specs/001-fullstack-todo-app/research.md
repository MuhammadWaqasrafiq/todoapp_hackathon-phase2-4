# Research: Full-Stack Todo Application

**Feature**: `001-fullstack-todo-app`
**Status**: Completed

## Technical Decisions

### 1. Authentication Integration (Better Auth + FastAPI)
- **Decision**: Use Better Auth's JWT plugin to issue tokens on the frontend, and verify them manually on the backend using the shared `BETTER_AUTH_SECRET`.
- **Rationale**: Better Auth is designed for Next.js/Node ecosystems. Since our backend is Python (FastAPI), we cannot use Better Auth's backend SDK directly. JWT provides a stateless, standard way to share identity between the disparate frontend and backend services without direct database sharing for sessions.
- **Verification**: The backend will use `pyjwt` or similar to verify the `HS256` signature of the token found in the `Authorization` header.

### 2. Database & ORM
- **Decision**: Neon Serverless PostgreSQL with SQLModel (SQLAlchemy + Pydantic).
- **Rationale**: Neon provides a scalable, serverless Postgres instance. SQLModel is the modern standard for FastAPI, combining Pydantic's validation with SQLAlchemy's ORM capabilities, reducing boilerplate for request/response models.
- **Constraints**: 
  - Connection pooling might be needed if using serverless functions, but for a standard FastAPI deployment, standard connections are fine.
  - Migrations will be handled by `alembic` (standard with SQLModel/SQLAlchemy).

### 3. API Structure & Versioning
- **Decision**: Use URL path versioning (implicitly v1 via `/api/...` structure in prompt) and user-scoped routes `/api/{user_id}/tasks`.
- **Rationale**: The prompt explicitly mandated endpoints like `/api/{user_id}/tasks`. This RESTful style embeds ownership directly in the URL, which the backend middleware must validate against the JWT's subject to ensure isolation.

### 4. Frontend State Management
- **Decision**: Next.js App Router with Server Components for data fetching where possible, and Client Components for interactive forms.
- **Rationale**: App Router is the current Next.js standard. Better Auth client hooks will handle the auth state.

## Best Practices Adopted
- **Security**: "Stateless" JWT validation on backend. No session lookups in DB for API requests (performance + simplicity).
- **Isolation**: Middleware or Dependency Injection in FastAPI to enforce `current_user.id == path.user_id`.
- **Type Safety**: Pydantic models shared for API validation and Swagger documentation.
