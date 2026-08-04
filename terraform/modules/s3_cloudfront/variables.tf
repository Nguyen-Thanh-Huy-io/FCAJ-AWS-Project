variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "bucket_name" {
  type    = string
  default = ""
}

variable "index_document" {
  type    = string
  default = "index.html"
}

variable "error_document" {
  type    = string
  default = "index.html"
}

variable "acm_certificate_arn" {
  type = string
}

variable "alb_dns_name" {
 type = string
}

variable "domain_name" {
  type = string
}