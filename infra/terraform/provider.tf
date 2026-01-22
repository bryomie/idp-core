terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  # Backend config will be added here
  # backend "gcs" {}
}

provider "google" {
  project = var.project_id
  region  = var.region
}