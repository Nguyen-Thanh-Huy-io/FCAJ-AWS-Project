output "sqs_queue_url" {
  value = aws_sqs_queue.events.url
}

output "sqs_queue_arn" {
  value = aws_sqs_queue.events.arn
}

output "lambda_function_name" {
  value = aws_lambda_function.processor.function_name
}

output "event_rule_name" {
  value = aws_cloudwatch_event_rule.post_created.name
}
