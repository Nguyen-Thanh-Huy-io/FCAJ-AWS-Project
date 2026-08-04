variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "node_type" {
  type    = string
  default = "cache.t3.micro"
}

variable "number_cache_clusters" {
  type    = number
  default = 1
}

variable "engine_version" {
  type    = string
  default = "7.1"
}

variable "port" {
  type    = number
  default = 6379
}