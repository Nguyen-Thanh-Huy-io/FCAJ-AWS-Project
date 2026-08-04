output "record_fqdn" {
  description = "Tên miền đầy đủ (FQDN) của bản ghi vừa tạo"
  value       = aws_route53_record.main.fqdn
}