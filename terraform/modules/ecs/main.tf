resource "aws_ecs_cluster" "this" {

  name = "${var.project}-${var.environment}-cluster"

  tags = merge({
    Name = "${var.project}-${var.environment}-cluster"
  }, var.tags)
}