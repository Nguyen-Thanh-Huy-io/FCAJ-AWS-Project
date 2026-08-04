resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project}-${var.environment}-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project}-${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }

      Action = "sts:AssumeRole"
    }]
  })
}

# 1. Tạo một IAM Policy riêng biệt chuyên để đọc Secret
resource "aws_iam_policy" "ecs_secrets_policy_staging" {
  name        = "publiast-staging-ecs-secrets-policy-new"
  description = "Cap quyen doc Secrets Manager cho ECS Staging"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = "arn:aws:secretsmanager:ap-southeast-2:960010863301:secret:publiast-staging-*"
      }
    ]
  })
}

# 2. Đính kèm trực tiếp vào tên Role hệ thống đang vận hành trên AWS
resource "aws_iam_role_policy_attachment" "ecs_task_execution_secrets_staging" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = aws_iam_policy.ecs_secrets_policy_staging.arn
}

# Gắn quyền truy cập S3 cho Task Role
resource "aws_iam_role_policy" "backend_s3_policy" {
  name = "backend-s3-access-policy"
  role = aws_iam_role.ecs_task_role.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          var.media_bucket_arn,
          "${var.media_bucket_arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecs_exec_policy" {
  name = "${var.project}-${var.environment}-ecs-exec-policy"

  role = aws_iam_role.ecs_task_role.name

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ]

        Resource = "*"
      }
    ]
  })
}