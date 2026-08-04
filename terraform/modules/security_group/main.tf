resource "aws_security_group" "alb"{
    name = "${var.project}-${var.environment}-alb-sg"
    description = "Security Group for ALB"
    vpc_id = var.vpc_id

    ingress {
        description = "HTTP"
        from_port = 80
        to_port = 80
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "HTTPS"
        from_port = 443
        to_port = 443
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "${var.project}-${var.environment}-alb-sg"
    }
}

resource "aws_security_group" "ecs"{
    name = "${var.project}-${var.environment}-ecs-sg"
    description = "Security Group for ECS"
    vpc_id = var.vpc_id

    ingress {
        description = "Traffic from ALB"
        from_port = 3000
        to_port = 3000
        protocol = "tcp"
        security_groups = [aws_security_group.alb.id]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "${var.project}-${var.environment}-alb-ecs"
    }
}

resource "aws_security_group" "rds"{
    name = "${var.project}-${var.environment}-rds-sg"
    description = "Security Group for RDS"
    vpc_id = var.vpc_id

    ingress {
        description = "MySQL from ecs"
        from_port = 3306
        to_port = 3306
        protocol = "tcp"
        security_groups = [aws_security_group.ecs.id]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "${var.project}-${var.environment}-rds-ecs"
    }
}

resource "aws_security_group" "redis"{
    name = "${var.project}-${var.environment}-redis-sg"
    description = "Security Group for REDIS"
    vpc_id = var.vpc_id

    ingress {
        description = "Redis from ECS"
        from_port = 6379
        to_port = 6379
        protocol = "tcp"
        security_groups = [aws_security_group.ecs.id]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "${var.project}-${var.environment}-redis-ecs"
    }
}
