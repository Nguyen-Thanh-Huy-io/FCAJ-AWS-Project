locals {
  api_cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  api_origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3"
}

# ==============================
# Frontend S3 Bucket
# ==============================

resource "aws_s3_bucket" "frontend" {
  bucket = var.bucket_name != "" ? var.bucket_name : "${var.project}-${var.environment}-frontend-new"
  tags = {
    Name        = "${var.project}-${var.environment}-frontend"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ==============================
# Backend Storage S3 Bucket
# ==============================

resource "aws_s3_bucket" "backend_storage" {
  bucket = "${var.project}-${var.environment}-backend-storage-new"

}

resource "aws_s3_bucket_public_access_block" "backend_storage_block" {
  bucket = aws_s3_bucket.backend_storage.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ==============================
# CloudFront Origin Access Control
# ==============================

resource "aws_cloudfront_origin_access_control" "frontend" {
  name = "${var.project}-${var.environment}-frontend-oac"
  description = "OAC for frontend bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "backend_storage" {
  name = "${var.project}-${var.environment}-backend-storage-oac"
  description = "OAC for backend storage"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

# ==============================
# CloudFront Distribution
# ==============================

resource "aws_cloudfront_distribution" "frontend" {
  enabled = true
  is_ipv6_enabled = true
  default_root_object = var.index_document
  aliases = [
    var.domain_name
  ]

  # React Frontend
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
    s3_origin_config {
      origin_access_identity = ""
    }
  }

  # Backend API
  origin {
    domain_name = var.alb_dns_name
    origin_id = "alb-origin"
    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = [
        "TLSv1.2"
      ]
    }
  }
  
  # User uploaded files
  origin {
    domain_name = aws_s3_bucket.backend_storage.bucket_regional_domain_name
    origin_id = "backend-storage-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.backend_storage.id
  }

  # Default Frontend Behavior
  default_cache_behavior {
    target_origin_id = "s3-origin"
    allowed_methods = [
      "GET",
      "HEAD"
    ]
    cached_methods = [
      "GET",
      "HEAD"
    ]
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
    min_ttl = 0
    default_ttl = 3600
    max_ttl = 86400
  }

  # Backend API
  ordered_cache_behavior {
    path_pattern = "/api/*"
    target_origin_id = "alb-origin"
    compress = true
    allowed_methods = [
      "GET",
      "HEAD",
      "OPTIONS",
      "PUT",
      "POST",
      "PATCH",
      "DELETE"
    ]
    cached_methods = [
      "GET",
      "HEAD"
    ]
    cache_policy_id = local.api_cache_policy_id
    origin_request_policy_id = local.api_origin_request_policy_id
    viewer_protocol_policy = "redirect-to-https"
  }

  # Media Files
  ordered_cache_behavior {
    path_pattern = "/media/*"
    target_origin_id = "backend-storage-origin"
    allowed_methods = [
      "GET",
      "HEAD"
    ]
    cached_methods = [
      "GET",
      "HEAD"
    ]
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    viewer_protocol_policy = "redirect-to-https"
    min_ttl = 0
    default_ttl = 86400
    max_ttl = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # React SPA Routing

  custom_error_response {
    error_code = 403
    response_code = 200
    response_page_path = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code = 404
    response_code = 200
    response_page_path = "/index.html"
    error_caching_min_ttl = 10
  }

  tags = {
    Name = "${var.project}-${var.environment}-cdn"
  }
}

# ==============================
# S3 Policies
# ==============================

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "AllowCloudFrontRead"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = [
          "s3:GetObject"

        ]
        Resource = [
          "${aws_s3_bucket.frontend.arn}/*"
        ]
        Condition = {
          StringEquals = { "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn}
        }
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "backend_storage" {
  bucket = aws_s3_bucket.backend_storage.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "AllowCloudFrontRead"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = [
          "s3:GetObject"
        ]
        Resource = [
          "${aws_s3_bucket.backend_storage.arn}/*"
        ]
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}