resource "google_container_cluster" "primary" {
  name     = "${var.env_name}-cluster"
  location = "${var.region}-a" # Zonal (Cheaper)
  
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc.id
  subnetwork = google_compute_subnetwork.private.id

  # Enable VPC-native traffic
  ip_allocation_policy {
    cluster_secondary_range_name  = "k8s-pod-range"
    services_secondary_range_name = "k8s-service-range"
  }

  deletion_protection = false

  # Enable Workload Identity (Critical for future steps!)
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }
}