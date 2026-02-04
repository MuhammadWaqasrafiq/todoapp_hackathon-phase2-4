# Research: Phase IV Kubernetes Deployment

## 1. Tooling & Approaches

### Decision: Docker AI (Gordon) for Containerization
- **Rationale**: Mandated by constitution (Principle II & III). Gordon leverages LLMs to generate optimized Dockerfiles and build commands, reducing manual error and ensuring best practices.
- **Usage**: `docker ai "Generate a Dockerfile..."`
- **Alternatives Considered**: Manual Dockerfile writing (Rejected: violates "No manual coding" preference and AIOps principle).

### Decision: Minikube for Orchestration
- **Rationale**: Mandated by constitution (Principle IV). Standard tool for local K8s development.
- **Configuration**:
    - Driver: `docker` (preferred for compatibility with Docker Desktop).
    - Addons: `ingress` (required for exposing frontend).

### Decision: Helm for Packaging
- **Rationale**: Mandated by constitution (Principle V). Allows parameterized deployment and versioning.
- **Generation**: `kubectl-ai` will be used to scaffold the chart structure.

### Decision: AI Agents for Operations (kubectl-ai & Kagent)
- **Rationale**: Mandated by constitution (Principle II).
    - `kubectl-ai`: For imperative resource creation and debugging ("check why pods are failing").
    - `kagent`: For cluster-wide analysis and optimization ("analyze cluster health").

## 2. External Dependencies

### Neon Serverless Postgres
- **Integration**: The backend in Minikube must connect to the external Neon DB.
- **Requirement**: The cluster must have outbound internet access.
- **Security**: Connection string will be injected via Kubernetes Secrets (populated from `.env`), NOT hardcoded in Docker images.

## 3. Unknowns & Clarifications

### Resolved: Networking
- **Question**: How to expose the frontend?
- **Answer**: Use `minikube tunnel` or the `ingress` addon. We will use `ingress` as it's more "production-like" for local simulation.

### Resolved: Local Registry
- **Question**: How to get images into Minikube?
- **Answer**: Use `eval $(minikube docker-env)` to build images directly into Minikube's Docker daemon, avoiding the need for a remote registry push/pull cycle.
