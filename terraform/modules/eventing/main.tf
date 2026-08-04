terraform {
  required_providers {
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda_handler.js"
  output_path = "${path.module}/lambda_handler.zip"
}

resource "aws_sqs_queue" "events" {
  name = "${var.project}-${var.environment}-events"
}

resource "aws_iam_role" "lambda_exec" {
  name = "${var.project}-${var.environment}-event-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_exec" {
  name = "${var.project}-${var.environment}-event-lambda-policy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.events.arn
      }
    ]
  })
}

resource "aws_lambda_function" "processor" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.project}-${var.environment}-event-processor"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "lambda_handler.handler"
  runtime          = "nodejs20.x"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      QUEUE_URL = aws_sqs_queue.events.url
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs" {
  event_source_arn = aws_sqs_queue.events.arn
  function_name    = aws_lambda_function.processor.arn
  batch_size       = 1
}

resource "aws_cloudwatch_event_rule" "post_created" {
  name = "${var.project}-${var.environment}-post-created-rule"

  event_pattern = jsonencode({
    source      = [var.event_source]
    detail-type = [var.event_type]
  })
}

resource "aws_iam_role" "eventbridge_to_sqs" {
  name = "${var.project}-${var.environment}-eventbridge-sqs"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "events.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "eventbridge_to_sqs" {
  name = "${var.project}-${var.environment}-eventbridge-sqs-policy"
  role = aws_iam_role.eventbridge_to_sqs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["sqs:SendMessage"]
      Resource = aws_sqs_queue.events.arn
    }]
  })
}

resource "aws_cloudwatch_event_target" "queue" {
  rule      = aws_cloudwatch_event_rule.post_created.name
  target_id = "send-to-sqs"
  arn       = aws_sqs_queue.events.arn
  role_arn  = aws_iam_role.eventbridge_to_sqs.arn
}
