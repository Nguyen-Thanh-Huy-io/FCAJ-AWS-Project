variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "alb_security_group_id" {
  type = string
}

variable "target_port" {
  type    = number
  default = 3000
}

variable "health_check_path" {
  type    = string
  default = "/"
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for HTTPS listener. Certificate must be in the same AWS region as the ALB."
  type        = string
}

variable "route53_zone_name" {
  type = string
}