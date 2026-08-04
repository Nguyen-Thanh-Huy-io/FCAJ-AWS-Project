resource "aws_db_subnet_group" "this" {
  name       = "${var.project}-${var.environment}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.project}-${var.environment}-db-subnet-group"
  }
}

resource "aws_db_instance" "this" {
  identifier = "${var.project}-${var.environment}-db"
  allocated_storage    = var.allocated_storage
  engine               = var.engine
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  db_name                 = "${var.project}"
  username             = var.username
  password             = var.password
  db_subnet_group_name = aws_db_subnet_group.this.name
  vpc_security_group_ids = var.security_group_ids
  publicly_accessible  = var.publicly_accessible
  skip_final_snapshot  = true
  allow_major_version_upgrade = true
  backup_retention_period = 1
  backup_window           = "03:00-04:00"

  deletion_protection = false
  multi_az            = false

  auto_minor_version_upgrade = true
  tags = {
    Name = "${var.project}-${var.environment}-db"
  }
}
