output "log_group_name" {
  value = aws_cloudwatch_log_group.ecs.name
}

output "log_group_arn" {
  value = aws_cloudwatch_log_group.ecs.arn
}

output "sns_topic_arn" {
  value       = aws_sns_topic.alerts.arn
  description = "ARN của SNS Topic dùng cho cảnh báo"
}

output "cloudwatch_alarm_arn" {
  value       = aws_cloudwatch_metric_alarm.ecs_app_errors.arn
  description = "ARN của CloudWatch Metric Alarm bắt lỗi ECS"
}