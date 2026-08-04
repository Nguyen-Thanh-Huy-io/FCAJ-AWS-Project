output "bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "bucket_domain_name" {
  value = aws_s3_bucket.frontend.bucket_domain_name
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_id" {
  value = aws_cloudfront_distribution.frontend.id
}

output "backend_storage_bucket_name" {
  value = aws_s3_bucket.backend_storage.bucket
}

output "backend_storage_bucket_arn" {
  value = aws_s3_bucket.backend_storage.arn
}

