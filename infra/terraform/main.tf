# --- VPC Network ---
resource "google_compute_network" "vpc" {
  name                    = "${var.env_name}-vpc"
  auto_create_subnetworks = false
}

# --- Subnet ---
resource "google_compute_subnetwork" "private" {
  name          = "${var.env_name}-subnet"
  region        = var.region
  network       = google_compute_network.vpc.id
  ip_cidr_range = "10.0.0.0/20"

  # Secondary ranges for GKE (Pods & Services)
  secondary_ip_range {
    range_name    = "k8s-pod-range"
    ip_cidr_range = "10.48.0.0/14"
  }
  secondary_ip_range {
    range_name    = "k8s-service-range"
    ip_cidr_range = "10.52.0.0/20"
  }

  private_ip_google_access = true
}

# --- Cloud Router & NAT (For internet access) ---
resource "google_compute_router" "router" {
  name    = "${var.env_name}-router"
  region  = var.region
  network = google_compute_network.vpc.id
}

resource "google_compute_router_nat" "nat" {
  name                               = "${var.env_name}-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}