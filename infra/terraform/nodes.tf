# Service Account for Nodes
resource "google_service_account" "kubernetes" {
  account_id   = "k8s-nodes-sa"
  display_name = "Kubernetes Nodes SA"
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "${var.env_name}-node-pool"
  location   = "${var.region}-a"
  cluster    = google_container_cluster.primary.name
  node_count = 1

  node_config {
    preemptible  = true # Spot Instances
    machine_type = "e2-standard-2" # 2 CPU, 8GB RAM (Optimized for IDP stack)

    service_account = google_service_account.kubernetes.email
    oauth_scopes    = ["https://www.googleapis.com/auth/cloud-platform"]
    
    tags = ["k8s-node"]
  }
}