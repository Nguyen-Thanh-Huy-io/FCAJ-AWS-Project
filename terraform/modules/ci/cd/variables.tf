variable "project" {
  type        = string
  description = "Tên dự án (VD: publicast)"
}

variable "environment" {
  type        = string
  description = "Môi trường triển khai (VD: staging)"
}

variable "github_monorepo" {
  type        = string
  description = "Tên repo Backend trên GitHub (VD: thanhhuy/publicast-backend)"
}

variable "github_branch" {
  type    = string
  default = "staging"
}

variable "ecr_repository_name" {
  type    = string
}

variable "ecs_cluster_name" {
  type    = string
}

variable "frontend_s3_bucket_name" {
  type    = string
}

variable "cloudfront_distribution_id" {
  type    = string
}