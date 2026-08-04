# ==============================================================================
# LOCAL VARIABLES
# ==============================================================================
locals {
  name_prefix = "${var.project}-${var.environment}"
}

# ==============================================================================
# 1. API SERVICE (Kết nối ALB, scale theo HTTP Request)
# ==============================================================================
resource "aws_ecs_service" "api" {
  name            = "${local.name_prefix}-api-service"
  cluster         = var.cluster_id
  task_definition = var.api_task_definition_arn
  desired_count   = var.api_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arn # Gọi đúng tên biến đã khai báo
    container_name   = "app"
    container_port   = 3000
  }

  tags = merge({
    Name = "${local.name_prefix}-api-service"
  }, var.tags)
}

# ==============================================================================
# 2. WORKER LIGHT SERVICE (Xử lý BullMQ publish, không cần ALB)
# ==============================================================================
resource "aws_ecs_service" "worker_light" {
  name            = "${local.name_prefix}-worker-light-service"
  cluster         = var.cluster_id
  task_definition = var.worker_light_task_definition_arn
  desired_count   = var.worker_light_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  tags = merge({
    Name = "${local.name_prefix}-worker-light-service"
  }, var.tags)
}

# ==============================================================================
# 3. WORKER HEAVY SERVICE (Xử lý FFmpeg/Media, dùng Fargate Spot)
# ==============================================================================
resource "aws_ecs_service" "worker_heavy" {
  name            = "${local.name_prefix}-worker-heavy-service"
  cluster         = var.cluster_id
  task_definition = var.worker_heavy_task_definition_arn
  desired_count   = var.worker_heavy_desired_count

  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 100
  }

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = false
  }

  tags = merge({
    Name = "${local.name_prefix}-worker-heavy-service"
  }, var.tags)
}