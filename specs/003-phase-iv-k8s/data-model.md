# Data Model & Infrastructure Resources

**Note**: In this infrastructure phase, "Data Model" refers to the Kubernetes Resources and Docker Artifacts.

## 1. Docker Artifacts

| Image Name | Base Image | Ports | Description |
| :--- | :--- | :--- | :--- |
| `todo-backend` | `python:3.11-slim` | 8000 | FastAPI backend application |
| `todo-frontend` | `node:18-alpine` | 3000 | Next.js frontend application |

## 2. Kubernetes Resources

### Namespace
- **Name**: `todo-app`
- **Purpose**: Isolation of the application resources.

### Backend Resources

| Resource | Name | Description |
| :--- | :--- | :--- |
| **Deployment** | `backend-deploy` | Manages backend pods. Replicas: 2 (scalable). Env: `DATABASE_URL` (from Secret). |
| **Service** | `backend-svc` | Internal ClusterIP service exposing port 8000. |

### Frontend Resources

| Resource | Name | Description |
| :--- | :--- | :--- |
| **Deployment** | `frontend-deploy` | Manages frontend pods. Replicas: 1. Env: `NEXT_PUBLIC_API_URL` (pointing to backend service). |
| **Service** | `frontend-svc` | Internal ClusterIP service exposing port 3000. |
| **Ingress** | `todo-ingress` | Exposes `frontend-svc` to host via `todo.local`. |

### Configuration & Secrets

| Resource | Name | Keys | Source |
| :--- | :--- | :--- | :--- |
| **Secret** | `todo-secrets` | `DATABASE_URL`, `OPENAI_API_KEY` | Injected from local `.env` |

## 3. Helm Chart Structure

**Chart Name**: `todo-chatbot`

**Values Hierarchy**:
```yaml
global:
  env: "local"

backend:
  image:
    repository: todo-backend
    tag: latest
    pullPolicy: Never # For local Minikube builds
  replicaCount: 2
  service:
    port: 8000

frontend:
  image:
    repository: todo-frontend
    tag: latest
    pullPolicy: Never
  replicaCount: 1
  service:
    port: 3000
  ingress:
    enabled: true
    host: todo.local
```
