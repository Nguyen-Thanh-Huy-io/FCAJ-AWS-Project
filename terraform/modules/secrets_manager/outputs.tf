output "backend_secret_arn" {
  value = aws_secretsmanager_secret.backend.arn
}

output "oauth_secret_arn" {
  value = aws_secretsmanager_secret.oauth.arn
}

output "payment_secret_arn" {
  value = aws_secretsmanager_secret.payment.arn
}
output "encryption_secret_arn" {
  value = aws_secretsmanager_secret.encryption.arn # Hoặc tên resource secret của bạn
}

