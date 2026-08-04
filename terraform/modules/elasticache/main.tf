resource "aws_elasticache_subnet_group" "this" {
  name       = "${var.project}-${var.environment}-redis-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.project}-${var.environment}-redis-subnet-group"
  }
}

resource "aws_elasticache_replication_group" "this" {
  replication_group_id          = "${var.project}-${var.environment}-rg"
  description = "Redis replication group for ${var.project}-${var.environment}"
  node_type                     = var.node_type
  num_cache_clusters         = var.number_cache_clusters
  automatic_failover_enabled    = var.number_cache_clusters > 1 ? true : false
  engine                        = "redis"
  engine_version                = var.engine_version
  port                          = var.port
  subnet_group_name             = aws_elasticache_subnet_group.this.name
  security_group_ids            = var.security_group_ids
  apply_immediately             = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auto_minor_version_upgrade = true
}
