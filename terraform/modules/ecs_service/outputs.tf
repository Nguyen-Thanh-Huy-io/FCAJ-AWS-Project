# ==============================================================================
# 1. API SERVICE OUTPUTS
# ==============================================================================
output "api_service_name" {
  description = "Name of the API ECS service"
  value       = aws_ecs_service.api.name
}

output "api_service_id" {
  description = "ID of the API ECS service"
  value       = aws_ecs_service.api.id
}

# ==============================================================================
# 2. WORKER LIGHT SERVICE OUTPUTS
# ==============================================================================
output "worker_light_service_name" {
  description = "Name of the Worker Light ECS service"
  value       = aws_ecs_service.worker_light.name
}

output "worker_light_service_id" {
  description = "ID of the Worker Light ECS service"
  value       = aws_ecs_service.worker_light.id
}

# ==============================================================================
# 3. WORKER HEAVY SERVICE OUTPUTS
# ==============================================================================
output "worker_heavy_service_name" {
  description = "Name of the Worker Heavy ECS service"
  value       = aws_ecs_service.worker_heavy.name
}

output "worker_heavy_service_id" {
  description = "ID of the Worker Heavy ECS service"
  value       = aws_ecs_service.worker_heavy.id
}

# ==============================================================================
# 4. TƯƠNG THÍCH NGƯỢC (Trỏ về API để các module/code khác gọi không bị gãy)
# ==============================================================================
output "service_name" {
  value = aws_ecs_service.api.name
}

output "service_id" {
  value = aws_ecs_service.api.id
}

output "service_arn" {
  value = aws_ecs_service.api.id
}