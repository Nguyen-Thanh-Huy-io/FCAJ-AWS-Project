output "api_task_definition_arn" {
  description = "ARN of the API task definition"
  value       = aws_ecs_task_definition.api.arn
}

output "api_task_definition_family" {
  description = "Family of the API task definition"
  value       = aws_ecs_task_definition.api.family
}

output "api_task_definition_revision" {
  description = "Revision of the API task definition"
  value       = aws_ecs_task_definition.api.revision
}

output "worker_light_task_definition_arn" {
  description = "ARN of the Worker Light task definition"
  value       = aws_ecs_task_definition.worker_light.arn
}

output "worker_light_task_definition_family" {
  description = "Family of the Worker Light task definition"
  value       = aws_ecs_task_definition.worker_light.family
}

output "worker_light_task_definition_revision" {
  description = "Revision of the Worker Light task definition"
  value       = aws_ecs_task_definition.worker_light.revision
}

output "worker_heavy_task_definition_arn" {
  description = "ARN of the Worker Heavy task definition"
  value       = aws_ecs_task_definition.worker_heavy.arn
}

output "worker_heavy_task_definition_family" {
  description = "Family of the Worker Heavy task definition"
  value       = aws_ecs_task_definition.worker_heavy.family
}

output "worker_heavy_task_definition_revision" {
  description = "Revision of the Worker Heavy task definition"
  value       = aws_ecs_task_definition.worker_heavy.revision
}