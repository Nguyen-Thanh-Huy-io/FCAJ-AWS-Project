variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type    = string
  default = ""
}

variable "subnet_ids" {
  type    = list(string)
  default = []
}

variable "username" {
  type = string
}

variable "password" {
  type      = string
  sensitive = true
}

variable "instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "allocated_storage" {
  type    = number
  default = 20
}

variable "engine" {
  type    = string
  default = "mysql"
}

variable "security_group_ids" {
  type = list(string)
}

variable "engine_version" {
  type    = string
  default = "8.4.10"
}

variable "publicly_accessible" {
  type    = bool
  default = false
}

variable "allowed_cidr" {
  type    = string
  default = "10.0.0.0/16"
}
