locals {
  backend_secret_keys = [
    "DATABASE_URL",
    "REDIS_HOST",
    "REDIS_PORT",
    "JWT_SECRET",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "EMAIL_USER",
    "EMAIL_PASS",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "OPENAI_API_KEY",    
    "GEMINI_API_KEY"
  ]

  oauth_secret_keys = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "FACEBOOK_APP_ID",
    "FACEBOOK_APP_SECRET",
    "THREADS_APP_ID",
    "THREADS_APP_SECRET",
    "TIKTOK_CLIENT_KEY",
    "TIKTOK_CLIENT_SECRET",
    "DISCORD_CLIENT_SECRET",
    "DISCORD_BOT_TOKEN"
  ]

  payment_secret_keys = [
    "PAYMENT_GATEWAY",
    "VIETQR_ACCOUNT_NO",
    "VIETQR_ACCOUNT_NAME",
    "VIETQR_ACQ_ID",
    "VIETQR_TEMPLATE",
    "SEPAY_API_KEY",
    "PAYMENT_QR_EXPIRY_MINUTES"
  ]

  backend_secrets = [
    for key in local.backend_secret_keys : {
      name      = key
      valueFrom = "${var.secret_arns.backend}:${key}::"
    }
  ]

  oauth_secrets = [
    for key in local.oauth_secret_keys : {
      name      = key
      valueFrom = "${var.secret_arns.oauth}:${key}::"
    }
  ]

  payment_secrets = [
    for key in local.payment_secret_keys : {
      name      = key
      valueFrom = "${var.secret_arns.payment}:${key}::"
    }
  ]

  encryption_secret = {
    name      = "ENCRYPTION_KEY"
    valueFrom = "${var.secret_arns["encryption"]}:ENCRYPTION_KEY::"
  }

  container_secrets = concat(
    local.backend_secrets,
    local.oauth_secrets,
    local.payment_secrets,
    [local.encryption_secret]
  )

  common_environment = [
    { name = "FRONTEND_URL",        value = var.frontend_url },
    { name = "AWS_S3_BUCKET_NAME",  value = var.s3_bucket_name },
    { name = "AWS_REGION",          value = var.aws_region },
    { name = "CORS_ALLOWED_ORIGINS", value = var.cors_allowed_origins },
    { name = "CLOUDFRONT_DOMAIN",   value = var.domain_name },
    { name = "GEMINI_MODEL",        value = "gemini-3.5-flash" },  
    { name = "AI_PROVIDER",         value = "GEMINI" },
  ]
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${var.project}-${var.environment}-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.cpu 
  memory                   = var.memory 
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = var.container_image
      essential = true
      command   = ["node", "src/entrypoints/api.js"]

      linuxParameters = {
        initProcessEnabled = true
      }

      environment = local.common_environment
      secrets     = local.container_secrets

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project}-${var.environment}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "api"
        }
      }
    }
  ])

  tags = var.tags
}

resource "aws_ecs_task_definition" "worker_light" {
  family                   = "${var.project}-${var.environment}-worker-light"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.worker_light_cpu
  memory                   = var.worker_light_memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = var.container_image
      essential = true
      command   = ["node", "src/entrypoints/worker-light.js"]

      linuxParameters = {
        initProcessEnabled = true
      }

      environment = local.common_environment
      secrets     = local.container_secrets

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project}-${var.environment}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "worker-light"
        }
      }
    }
  ])

  tags = var.tags
}

resource "aws_ecs_task_definition" "worker_heavy" {
  family                   = "${var.project}-${var.environment}-worker-heavy"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.worker_heavy_cpu
  memory                   = var.worker_heavy_memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = var.container_image
      essential = true
      command   = ["node", "src/entrypoints/worker-heavy.js"]

      linuxParameters = {
        initProcessEnabled = true
      }

      environment = local.common_environment
      secrets     = local.container_secrets

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project}-${var.environment}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "worker-heavy"
        }
      }
    }
  ])
  tags = var.tags
}