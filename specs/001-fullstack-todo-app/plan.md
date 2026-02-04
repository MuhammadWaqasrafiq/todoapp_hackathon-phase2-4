# Implementation Plan: Full-Stack Todo Application

**Branch**: `001-fullstack-todo-app` | **Date**: 2024-12-31 | **Spec**: [specs/001-fullstack-todo-app/spec.md](./spec.md)
**Input**: Feature specification from `specs/001-fullstack-todo-app/spec.md`

## Summary

Build a modern, multi-user Todo application with strict data isolation.  
**Tech Stack**: Next.js 16+ (Frontend), FastAPI (Backend), Neon Serverless PostgreSQL (DB), Better Auth (Auth).  
**Core Mechanism**: Better Auth on frontend issues JWTs; FastAPI backend verifies them statelessly and strictly scopes all DB queries to the token's user ID.

## Technical Context

**Language/Version**: Python 3.11+, TypeScript 5+ (Next.js)
**Primary Dependencies**: FastAPI, SQLModel, Next.js 16+, Better Auth, PyJWT
**Storage**: Neon Serverless PostgreSQL
**Testing**: Pytest (Backend), Jest/React Testing Library (Frontend)
**Target Platform**: Vercel (Frontend), Railway/Render/HuggingFace (Backend) - *Deployment out of scope for strict implementation but planned for.*
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: <500ms API response time, <1s Dashboard load
**Constraints**: Strict user isolation (P0), Stateless Backend Auth
**Scale/Scope**: ~50-100 concurrent users for MVP, standard Todo app complexity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Spec-Driven Agentic Workflow**: Spec created first. Plan being created now.
- [x] **Modern Full-Stack Architecture**: Stack matches (Next.js, FastAPI, Neon).
- [x] **Stateless Secure Authentication**: Plan uses Better Auth + JWT + Backend Verification.
- [x] **Data Persistence & Isolation**: SQLModel + User ID filtering planned.
- [x] **API-First Design**: REST API defined in contracts/openapi.yaml.
- [x] **Testable Deliverables**: Independent testing strategies defined in Spec.

## Project Structure

### Documentation (this feature)

```text
specs/001-fullstack-todo-app/
├── plan.md              # This file
├── research.md          # Tech decisions (Auth, DB, Stack)
├── data-model.md        # DB Schema (User, Task)
├── quickstart.md        # Setup guide
├── contracts/           
│   └── openapi.yaml     # API Specification
└── tasks.md             # Implementation Tasks (Pending)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py          # App entrypoint
│   ├── models/          # SQLModel entities (Task)
│   ├── api/             # Routes (tasks.py)
│   ├── core/            # Config, Security (JWT verify)
│   └── services/        # Business logic
├── tests/
│   ├── unit/
│   └── integration/
├── requirements.txt
└── alembic/             # Migrations

frontend/
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # UI Components (TaskForm, TaskList)
│   ├── lib/             # API Client, Auth Hooks
│   └── types/           # TS Interfaces
├── package.json
└── .env.local
```

**Structure Decision**: Standard Monorepo-style split (`backend/` and `frontend/` at root) to keep concerns separated as per Constitution Principle II.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Distributed Auth | Requirement | Simple session auth violates "Stateless Backend" principle |
| Split Repo Structure | Constitution | Single app structure violates "Full-Stack Architecture" separation |
