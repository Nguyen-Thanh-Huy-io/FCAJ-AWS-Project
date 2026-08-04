# ==============================================================================
# GENERAL VARIABLES
# ==============================================================================
variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "container_image" {
  type = string
}

variable "cpu" {
  description = "CPU units for API Service (512 = 0.5 vCPU)"
  type        = number
  default     = 512
}

variable "memory" {
  description = "Memory (MB) for API Service"
  type        = number
  default     = 1024
}

# 2. Worker Light Service
variable "worker_light_cpu" {
  description = "CPU units for Worker Light (512 = 0.5 vCPU)"
  type        = number
  default     = 512
}

variable "worker_light_memory" {
  description = "Memory (MB) for Worker Light"
  type        = number
  default     = 1024
}

# 3. Worker Heavy Service (Cấu hình mạnh hơn cho FFmpeg/Media processing)
variable "worker_heavy_cpu" {
  description = "CPU units for Worker Heavy (2048 = 2 vCPU)"
  type        = number
  default     = 2048
}

variable "worker_heavy_memory" {
  description = "Memory (MB) for Worker Heavy"
  type        = number
  default     = 4096
}

# ==============================================================================
# IAM ROLES
# ==============================================================================
variable "execution_role_arn" {
  type = string
}

variable "task_role_arn" {
  type = string
}

# ==============================================================================
# SECRETS & CONFIGURATIONS
# ==============================================================================
variable "secret_arns" {
  description = "Secrets Manager ARNs"

  type = object({
    backend    = string
    oauth      = string
    payment    = string
    encryption = string
  })
}

variable "s3_bucket_name" {
  description = "Tên bucket lưu trữ ảnh/file cho backend"
  type        = string
}

variable "frontend_url" {
  description = "URL cho frontend"
  type        = string
}

variable "cors_allowed_origins" {
  type    = string
  default = "https://d2h2nyllhz7psh.cloudfront.net,https://publicast.trinhquoccongvinh.id.vn"
}

variable "domain_name" {
  type        = string
  description = "Tên miền CDN/CloudFront cho backend"
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}