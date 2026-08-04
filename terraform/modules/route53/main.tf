resource "aws_route53_record" "main" {
  zone_id = var.hosted_zone_id

  name = "publicast"

  type = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}