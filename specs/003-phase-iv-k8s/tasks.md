# Tasks: Phase IV - Local Kubernetes Deployment

**Branch**: `003-phase-iv-k8s` | **Spec**: [specs/003-phase-iv-k8s/spec.md](specs/003-phase-iv-k8s/spec.md)
**Plan**: [specs/003-phase-iv-k8s/plan.md](specs/003-phase-iv-k8s/plan.md)

## Dependencies

- Phase 1 (Setup) -> Phase 2 (Foundational)
- Phase 2 (Foundational) -> Phase 3 (US1: Containerization)
- Phase 3 (US1: Containerization) -> Phase 4 (US2: Deployment)
- Phase 4 (US2: Deployment) -> Phase 5 (US3: Optimization)

## Phase 1: Setup

*Goal: Prepare the local Kubernetes environment.*

- [x] T001 Initialize Minikube with Docker driver and enable ingress addon
- [x] T002 Configure local shell to use Minikube's Docker daemon (`minikube docker-env`)
- [x] T003 Verify kubectl, helm, kubectl-ai, and kagent installation

## Phase 2: Foundational

*Goal: Establish shared configuration and secrets.*

- [x] T004 Create `todo-app` namespace in Minikube
- [x] T005 Extract `DATABASE_URL` and `OPENAI_API_KEY` from local `.env` and create Kubernetes Secret `todo-secrets` in `todo-app` namespace

## Phase 3: User Story 1 (Containerization with Gordon)

*Goal: Generate and build Docker images for Frontend and Backend using Docker AI.*

- [x] T006 [US1] Generate `backend/Dockerfile` using Docker AI (Gordon) prompt
- [x] T007 [US1] Build `todo-backend:latest` image directly in Minikube registry
- [x] T008 [US1] Generate `frontend/Dockerfile` using Docker AI (Gordon) prompt
- [x] T009 [US1] Build `todo-frontend:latest` image directly in Minikube registry
- [x] T010 [US1] Verify images exist in Minikube (`docker images`)

## Phase 4: User Story 2 (Deployment with kubectl-ai)

*Goal: Generate Helm charts and deploy the application to Minikube.*

- [x] T011 [US2] Initialize `k8s/charts/todo-app` directory structure
- [x] T012 [US2] Generate Helm Chart structure using kubectl-ai prompt for backend (port 8000) and frontend (port 3000)
- [x] T013 [US2] Refine `k8s/charts/todo-app/values.yaml` to match `todo-backend:latest` and `todo-frontend:latest` with `pullPolicy: Never`
- [x] T014 [US2] Configure `k8s/charts/todo-app/templates/deployment-backend.yaml` to use `todo-secrets` for env vars
- [x] T015 [US2] Configure `k8s/charts/todo-app/templates/deployment-frontend.yaml` to point `NEXT_PUBLIC_API_URL` to backend service
- [x] T016 [US2] Deploy Helm Release `todo-release` to `todo-app` namespace
- [x] T017 [US2] Verify pods are running using kubectl-ai prompt

## Phase 5: User Story 3 (Optimization with Kagent)

*Goal: Analyze and optimize the deployment using Kagent.*

- [x] T018 [US3] Run Kagent analysis on `todo-app` namespace to check for health/resources
- [x] T019 [US3] Scale backend to 2 replicas using kubectl-ai or Helm update to verify scalability
- [x] T020 [US3] Configure local hosts file to map Minikube IP to `todo.local` (Ingress verification)
- [x] T021 [US3] Manual Verification: Access `http://todo.local` in browser and test chat functionality

## Phase 6: Polish & Cross-Cutting

*Goal: Final documentation and cleanup.*

- [x] T022 Document usage of AI tools (Gordon, kubectl-ai, kagent) in `specs/003-phase-iv-k8s/ai-logs.md`
- [ ] T023 Clean up resources (helm uninstall) to verify teardown

## Parallel Execution Examples

- **Phase 3**: T006 (Backend Dockerfile) and T008 (Frontend Dockerfile) can be done in parallel.
- **Phase 4**: T014 (Backend Config) and T015 (Frontend Config) are independent editing tasks.

## Implementation Strategy

1.  **Environment First**: Ensure Minikube is ready to accept images.
2.  **Images Second**: Build images before writing charts so values.yaml references are valid.
3.  **Deployment Third**: iteratively deploy and debug using kubectl-ai.
4.  **Verification Last**: Use Kagent and manual browser checks.
