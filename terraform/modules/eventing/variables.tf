variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "event_source" {
  type    = string
  default = "publiast.app"
}

variable "event_type" {
  type    = string
  default = "post.created"
}
