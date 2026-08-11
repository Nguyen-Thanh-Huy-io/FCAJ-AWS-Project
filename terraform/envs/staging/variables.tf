variable "region" {
  type    = string
  default = "ap-southeast-2"
}

variable "environment" {
  type    = string
  default = "staging"
}

variable "project" {
  type    = string
  default = "publiast"
}

variable "aws_profile" {
  type    = string
  default = "default"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "redis_password" {
  type      = string
  sensitive = true
}

variable "encryption_key" {
  type        = string
  description = "Khóa dùng để mã hóa dữ liệu"
  sensitive   = true # Nên để true vì đây là key bảo mật
}

variable "backend_base_url" {
  type    = string
  default = "" # Hoặc để trống nếu bạn muốn dùng giá trị trong tfvars
}

variable "cors_allowed_origins" {
  type    = string
  default = "https://d2h2nyllhz7psh.cloudfront.net"
}

variable "alert_email" {
  type        = string
  description = "Địa chỉ email nhận thông báo cảnh báo sự cố từ CloudWatch Alarm"
}

variable "retention_in_days" {
  type        = number
  description = "Số ngày lưu trữ log trong CloudWatch"
  default     = 7
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default     = {}
}

variable "domain_name" {
  type = string
}

variable "route53_zone_name" {
  type = string
}

variable "acm_certificate_arn" {
  type = string
}


variable "frontend_bucket_name" {
  type    = string
  default = "publiast-staging-frontend"
}

variable "frontend_url" {
  type    = string
  default = "https://publicast.trinhquoccongvinh.id.vn"
}

variable "container_image" {
  type    = string
  default = ""
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "access_token_secret" {
  type      = string
  sensitive = true
}

variable "refresh_token_secret" {
  type      = string
  sensitive = true
}

variable "email_user" {
  type = string
}

variable "email_pass" {
  type      = string
  sensitive = true
}

variable "google_client_id" {
  type    = string
  default = ""
}

variable "google_client_secret" {
  type      = string
  sensitive = true
  default   = ""
}

variable "facebook_app_id" {
  type      = string
  sensitive = true
  default   = ""
}

variable "facebook_app_secret" {
  type      = string
  sensitive = true
  default   = ""
}

variable "tiktok_client_key" {
  type    = string
  default = ""
}

variable "tiktok_client_secret" {
  type      = string
  sensitive = true
  default   = ""
}

variable "discord_client_id" {
  type    = string
  default = ""
}

variable "discord_client_secret" {
  type      = string
  sensitive = true
  default   = ""
}

variable "discord_bot_token" {
  type      = string
  sensitive = true
  default   = ""
}

variable "threads_app_id" {
  type      = string
  sensitive = true
  default   = ""
}

variable "threads_app_secret" {
  type      = string
  sensitive = true
  default   = ""
}

variable "resend_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "resend_from_email" {
  type      = string
  sensitive = true
  default   = ""
}

variable "sepay_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "vietqr_acq_id" {
  type      = string
  sensitive = true
  default   = ""
}

variable "vietqr_account_name" {
  type      = string
  sensitive = true
  default   = ""
} 

variable "vietqr_account_no" {
  type      = string
  sensitive = true
  default   = ""
}

variable "vietqr_template" {
  type      = string
  sensitive = true
  default   = ""
}

variable "payment_gateway" {
  type      = string
  sensitive = true
  default   = ""
}

variable "payment_qr_expiry_minutes" {
  type      = string
  sensitive = true
  default   = ""
}

variable "openai_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "gemini_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "github_monorepo" {
  type      = string
  default   = ""
}

variable "github_branch" {
  type      = string
  default   = ""
}