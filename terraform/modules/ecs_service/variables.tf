variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "cluster_id" {
  type = string
}

variable "target_group_arn" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "ecs_security_group_id" {
  type = string
}

variable "desired_count" {
  type    = number
  default = 2
}

variable "container_name" {
  type    = string
  default = "backend"
}

variable "container_port" {
  type    = number
  default = 3000
}

variable "api_task_definition_arn" {
  description = "ARN of the API task definition"
  type        = string
}

variable "worker_light_task_definition_arn" {
  description = "ARN of the Worker Light task definition"
  type        = string
}

variable "worker_heavy_task_definition_arn" {
  description = "ARN of the Worker Heavy task definition"
  type        = string
}

variable "api_desired_count" {
  description = "Desired number of API tasks"
  type        = number
  default     = 2
}

variable "worker_light_desired_count" {
  description = "Desired number of Worker Light tasks"
  type        = number
  default     = 1
}

variable "worker_heavy_desired_count" {
  description = "Desired number of Worker Heavy tasks"
  type        = number
  default     = 1
}

variable "tags" {
  type    = map(string)
  default = {}
}