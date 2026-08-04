variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "retention_in_days" {
  type    = number
  default = 7
}

variable "tags" {
  type    = map(string)
  default = {}
}