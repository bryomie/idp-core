
# 📘 IDP Core Bootstrap Guide

This guide describes how to provision the infrastructure and bootstrap the IDP platform from scratch (Zero-to-One).

## 🛠 Prerequisites

*   **Google Cloud Account** (Project created, Billing enabled).
*   **Domain Name** managed via DNS provider (e.g., Cloudflare, GoDaddy).
*   **Tools installed:** `gcloud`, `kubectl`, `helm`, `terraform`, `docker`.

---

## ⚙️ Configuration Checklist (IMPORTANT)

Before running any commands, you **must** update the following files with your specific values. The codebase uses placeholders or default values (e.g., `idp.filippov.world`) which need to be customized.

### 1. Terraform Backend
**File:** `infra/terraform/provider.tf`
Update the GCS bucket name to store your Terraform state securely.

```hcl
backend "gcs" {
  bucket  = "tf-state-idp-core-YOUR-NAME" # <--- UPDATE THIS
  prefix  = "terraform/state"
}
```

### 2. Project Variables
**File:** `infra/terraform/terraform.tfvars` (Create this file from `.example`)

```hcl
project_id = "your-gcp-project-id" # <--- UPDATE THIS
region     = "us-central1"
```

### 3. Application Domain
**File:** `infra/k8s/charts/frontend/values.yaml`
Update the Ingress host to match your domain.

```yaml
ingress:
  host: "idp.your-domain.com" # <--- UPDATE THIS
```

**File:** `infra/k8s/charts/backend/values.yaml` (if applicable)

```yaml
ingress:
  host: "api.idp.your-domain.com" # <--- UPDATE THIS
```

---

## 🚀 Phase 1: Infrastructure Provisioning (Terraform)

### 1. Initialize Terraform
```bash
cd infra/terraform
terraform init
```

### 2. Review the Plan
```bash
terraform plan
```

### 3. Apply Infrastructure
This will create the VPC, GKE Cluster, NAT, and Static IPs.
```bash
terraform apply
```

### 4. Connect to the Cluster
Once applied, configure `kubectl` to talk to your new GKE cluster:
```bash
gcloud container clusters get-credentials <CLUSTER_NAME> --region <REGION> --project <PROJECT_ID>

# Verify connection
kubectl get nodes
```

---

## ⚓ Phase 2: System Components (Helm)

We use Helm to install the foundational services (Ingress, Certs, GitOps).

### 1. Add Helm Repositories
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add cnpg https://cloudnative-pg.io/charts
helm repo add jetstack https://charts.jetstack.io
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

### 2. Install Ingress Controller
```bash
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer
```

### 3. Install Cert-Manager (SSL)
```bash
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --version v1.13.3 --set installCRDs=true
```

### 4. Install CloudNativePG (Database Operator)
```bash
helm upgrade --install cnpg cnpg/cloudnative-pg \
  --namespace cnpg-system --create-namespace
```

### 5. Install Prometheus Stack (Observability)
```bash
helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  --set grafana.adminPassword=admin \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false
```

### 6. Install ArgoCD (GitOps)
```bash
helm upgrade --install argocd argo/argo-cd --namespace argocd --create-namespace --version 6.0.0
```

---

## 🌐 Phase 3: Networking & DNS Setup

### 1. Get LoadBalancer IP
Run the command below and look for `EXTERNAL-IP`:
```bash
kubectl get svc -n ingress-nginx
```

### 2. Update DNS Records
Go to your DNS provider and create **A Records** pointing to that External IP:
*   `idp.your-domain.com` (Frontend)
*   `api.idp.your-domain.com` (Backend)
*   `argocd.your-domain.com` (Optional, if exposing Argo)

### 3. Configure SSL (ClusterIssuer)
Apply the Let's Encrypt issuer config:
```bash
kubectl apply -f infra/k8s/cert-manager/cluster-issuer.yaml
```

---

## 📦 Phase 4: Deploy Applications (GitOps)

Now that the platform is ready, we deploy the Application Set via ArgoCD.

### 1. Apply the Root Application
```bash
kubectl apply -f infra/k8s/argocd/applications.yaml
```

### 2. Verify Sync
ArgoCD will detect the changes in this repo and sync the Frontend, Backend, and Database manifests to the cluster.

---

## 🔑 Phase 5: Access & Credentials

### 1. ArgoCD Admin Password
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

### 2. Grafana Access
```bash
# Port-forward to localhost:3001
kubectl port-forward svc/kube-prometheus-stack-grafana -n monitoring 3001:80
```

### 3. Platform URL
Open `https://idp.your-domain.com` in your browser.