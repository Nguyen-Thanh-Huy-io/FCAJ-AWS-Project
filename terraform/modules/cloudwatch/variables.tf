variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "retention_in_days" {
  type    = number
  default = 7
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "alert_email" {
  type        = string
  description = "Địa chỉ email nhận thông báo cảnh báo từ CloudWatch Alarm"
}