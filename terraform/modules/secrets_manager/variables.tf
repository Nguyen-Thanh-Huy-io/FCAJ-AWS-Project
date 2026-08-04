variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "database_url" {
  type      = string
  sensitive = true
}

variable "redis_host" {
  type = string
}

variable "redis_password" {
  type      = string
  sensitive = true
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

variable "google_client_secret" {
  type      = string
  sensitive = true
}

variable "google_client_id"{
  type      = string
  sensitive = true
}

variable "facebook_app_id" {
  type      = string
  sensitive = true
}

variable "facebook_app_secret" {
  type      = string
  sensitive = true
}

variable "threads_app_id" {
  type      = string
  sensitive = true
}

variable "threads_app_secret" {
  type      = string
  sensitive = true
}

variable "tiktok_client_key" {
  type      = string
  sensitive = true
}


variable "tiktok_client_secret" {
  type      = string
  sensitive = true
}

variable "discord_client_secret" {
  type      = string
  sensitive = true
}

variable "discord_bot_token" {
  type      = string
  sensitive = true
}

variable "sepay_api_key" {
  type      = string
  sensitive = true
}

variable "vietqr_acq_id" {
  type      = string
  sensitive = true
}

variable "vietqr_account_name" {
  type      = string
  sensitive = true
}

variable "vietqr_account_no" { 
  type      = string
  sensitive = true
}

variable "vietqr_template" {
  type      = string
  sensitive = true
}

variable "payment_gateway" {
  type      = string
  sensitive = true
}

variable "payment_qr_expiry_minutes" {
  type      = string
  sensitive = true
}

variable "resend_api_key" {
  type      = string
  sensitive = true
}

variable "resend_from_email" {
  type      = string
  sensitive = true
}

variable "openai_api_key" {
  type      = string
  sensitive = true
}

variable "gemini_api_key" {
  type      = string
  sensitive = true
}

variable "encryption_key" {
  type        = string
  description = "Key để mã hóa dữ liệu"
}