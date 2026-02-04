# Quickstart: Local Kubernetes Deployment

## Prerequisites
- Docker Desktop (Running, with "Docker AI" enabled if available)
- Minikube (`minikube start --driver=docker`)
- Helm
- kubectl
- kubectl-ai (Optional but recommended)
- Kagent (Optional but recommended)

## 1. Start Minikube & Configure Docker Environment
```bash
minikube start --driver=docker
minikube addons enable ingress
eval $(minikube docker-env)
# Verify: docker ps should show minikube containers
```

## 2. Containerize Applications
**Using Gordon (Docker AI):**
```bash
docker ai "Generate a Dockerfile for the python backend in ./backend"
docker build -t todo-backend:latest ./backend

docker ai "Generate a Dockerfile for the nextjs frontend in ./frontend"
docker build -t todo-frontend:latest ./frontend
```

## 3. Deploy via Helm
**Generate Chart (using kubectl-ai):**
```bash
kubectl-ai "create a helm chart named todo-app for a python backend on port 8000 and nextjs frontend on port 3000"
```
*(Save output to `k8s/charts/todo-app`)*

**Deploy:**
```bash
# Create namespace
kubectl create namespace todo-app

# Create Secrets from local .env
kubectl create secret generic todo-secrets \
  --from-literal=DATABASE_URL=$DATABASE_URL \
  --from-literal=OPENAI_API_KEY=$OPENAI_API_KEY \
  -n todo-app

# Install Chart
helm install todo-release ./k8s/charts/todo-app -n todo-app -f ./k8s/charts/todo-app/values.yaml
```

## 4. Verification
**Using kubectl-ai:**
```bash
kubectl-ai "check if the todo-app pods are running and healthy"
```

**Access Application:**
- Get Minikube IP: `minikube ip`
- Add to hosts file: `<MINIKUBE_IP> todo.local`
- Browse to `http://todo.local`

**Cleanup:**
```bash
helm uninstall todo-release -n todo-app
minikube stop
```
