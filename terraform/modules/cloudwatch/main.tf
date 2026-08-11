# 1. Metric Filter: Quét từ khóa lỗi trong Log Group ECS hiện tại của bạn
resource "aws_cloudwatch_log_metric_filter" "ecs_errors" {
  name           = "${var.project}-${var.environment}-ecs-error-filter"
  pattern        = "?ERROR ?Error ?Exception ?uncaughtException ?unhandledRejection"
  log_group_name = aws_cloudwatch_log_group.ecs.name

  metric_transformation {
    name      = "AppErrorCount"
    namespace = "${var.project}/${var.environment}/ECS"
    value     = "1"
    default_value = "0"
  }
}

# 2. SNS Topic: Kênh tiếp nhận và phân phối tin nhắn cảnh báo
resource "aws_sns_topic" "alerts" {
  name = "${var.project}-${var.environment}-alerts-topic"

  tags = merge({
    Name = "${var.project}-${var.environment}-alerts"
  }, var.tags)
}

# Đăng ký nhận thông báo qua Email (Xác nhận email sau khi terraform apply)
resource "aws_sns_topic_subscription" "email_alert" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "nguyenthanhhuy021005@gmail.com" 
}

# 3. CloudWatch Alarm: Bật báo động khi xuất hiện lỗi trong Log
resource "aws_cloudwatch_metric_alarm" "ecs_app_errors" {
  alarm_name          = "${var.project}-${var.environment}-ecs-app-errors-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = aws_cloudwatch_log_metric_filter.ecs_errors.metric_transformation[0].name
  namespace           = aws_cloudwatch_log_metric_filter.ecs_errors.metric_transformation[0].namespace
  period              = 60
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "Cảnh báo: Phát hiện lỗi (ERROR / Exception) trong log của ECS Services!"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = merge({
    Name = "${var.project}-${var.environment}-app-error-alarm"
  }, var.tags)
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project}-${var.environment}"
  retention_in_days = var.retention_in_days

  tags = merge({
    Name = "${var.project}-${var.environment}-logs"
  }, var.tags)
}
