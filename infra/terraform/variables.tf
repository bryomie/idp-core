variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  default     = "us-central1"
}

variable "cluster_name" {
  description = "GKE Cluster Name"
  default     = "idp-cluster-prod"
}