variable "hosted_zone_id" {
  description = "ID của Hosted Zone trên Route 53"
  type        = string
}

variable "domain_name" {
  description = "Tên record cần tạo"
  type        = string
}

variable "cloudfront_domain_name" {
  description = "Domain name của CloudFront Distribution"
  type        = string
}