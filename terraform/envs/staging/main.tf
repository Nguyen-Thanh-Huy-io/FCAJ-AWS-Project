locals {
  project = var.project
  env     = var.environment
}

module "vpc" {
  source      = "../../modules/vpc"
  project     = local.project
  environment = local.env
}

module "security_group" {
  source      = "../../modules/security_group"
  project     = local.project
  environment = local.env
  vpc_id      = module.vpc.vpc_id
}

module "rds" {
  source             = "../../modules/rds"
  project            = local.project
  environment        = local.env
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.security_group.rds_sg_id]
  username           = "admin"
  password           = var.db_password
}

module "elasticache" {
  source             = "../../modules/elasticache"
  project            = local.project
  environment        = local.env
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.security_group.redis_sg_id]
}

module "ecr" {

  source = "../../modules/ecr"

  project = local.project

  environment = local.env
}

module "ecs" {

  source = "../../modules/ecs"

  project = local.project

  environment = local.env
}

module "iam" {

  source = "../../modules/iam"

  project     = local.project
  environment = local.env

  media_bucket_arn = module.s3_cloudfront.backend_storage_bucket_arn
}

module "secrets_manager" {
  source = "../../modules/secrets_manager"

  project     = var.project
  environment = var.environment

  database_url   = "mysql://${module.rds.db_username}:${var.db_password}@${module.rds.db_address}:3306/publiast"
  redis_host     = module.elasticache.primary_endpoint_address
  redis_password = var.redis_password

  jwt_secret           = var.jwt_secret
  access_token_secret  = var.access_token_secret
  refresh_token_secret = var.refresh_token_secret

  email_user = var.email_user
  email_pass = var.email_pass

  resend_api_key        = var.resend_api_key
  resend_from_email     = var.resend_from_email
  google_client_secret  = var.google_client_secret
  google_client_id      = var.google_client_id
  facebook_app_id       = var.facebook_app_id
  facebook_app_secret   = var.facebook_app_secret
  threads_app_id        = var.threads_app_id
  threads_app_secret    = var.threads_app_secret
  tiktok_client_key     = var.tiktok_client_key
  tiktok_client_secret  = var.tiktok_client_secret
  discord_client_secret = var.discord_client_secret
  discord_bot_token     = var.discord_bot_token

  encryption_key = var.encryption_key

  openai_api_key = var.openai_api_key
  gemini_api_key = var.gemini_api_key

  sepay_api_key = var.sepay_api_key
  vietqr_acq_id = var.vietqr_acq_id
  vietqr_account_name = var.vietqr_account_name
  vietqr_account_no = var.vietqr_account_no
  vietqr_template = var.vietqr_template
  payment_gateway = var.payment_gateway
  payment_qr_expiry_minutes = var.payment_qr_expiry_minutes
}

module "ecs_task_definition" {
  source = "../../modules/ecs_task_definition"

  project     = var.project
  environment = var.environment

  frontend_url = var.frontend_url
  aws_region   = var.region

  container_image = "${module.ecr.repository_url}:latest"

  # Cấu hình IAM & S3
  execution_role_arn = module.iam.execution_role_arn
  task_role_arn      = module.iam.task_role_arn
  s3_bucket_name     = module.s3_cloudfront.backend_storage_bucket_name
  domain_name        = var.domain_name

  # Pass Secrets
  secret_arns = {
    backend    = module.secrets_manager.backend_secret_arn
    oauth      = module.secrets_manager.oauth_secret_arn
    payment    = module.secrets_manager.payment_secret_arn
    encryption = module.secrets_manager.encryption_secret_arn
  }
}

module "alb" {

  source = "../../modules/alb"

  project = var.project

  environment = var.environment

  vpc_id = module.vpc.vpc_id

  public_subnet_ids = module.vpc.public_subnet_ids

  alb_security_group_id = module.security_group.alb_sg_id

  target_port = 3000

  health_check_path = "/"

}

module "ecs_service" {
  source = "../../modules/ecs_service"
  project     = var.project
  environment = var.environment

  cluster_id = module.ecs.cluster_id

  api_task_definition_arn          = module.ecs_task_definition.api_task_definition_arn
  worker_light_task_definition_arn = module.ecs_task_definition.worker_light_task_definition_arn
  worker_heavy_task_definition_arn = module.ecs_task_definition.worker_heavy_task_definition_arn

  target_group_arn = module.alb.target_group_arn

  private_subnet_ids    = module.vpc.private_subnet_ids
  ecs_security_group_id = module.security_group.ecs_sg_id

  api_desired_count          = 2
  worker_light_desired_count = 1
  worker_heavy_desired_count = 1

}

module "cloudwatch" {
  source = "../../modules/cloudwatch"

  project     = local.project
  environment = local.env
  retention_in_days = var.retention_in_days
  alert_email       = var.alert_email 
  tags              = var.tags
}

module "s3_cloudfront" {
  source      = "../../modules/s3_cloudfront"
  project     = local.project
  environment = local.env

  domain_name = var.domain_name
  alb_dns_name = module.alb.alb_dns_name
  acm_certificate_arn = var.acm_certificate_arn

  # Truyền giá trị tùy chọn nếu muốn thay đổi
  index_document = "index.html"
  error_document = "index.html"
}

module "route53" {
  source = "../../modules/route53"
  hosted_zone_id = "Z043445810SXRLY1P1ARV"
  domain_name = "publicast"
  cloudfront_domain_name = module.s3_cloudfront.cloudfront_domain_name
}

module "cicd" {
  source      = "../../modules/ci/cd"
  project     = var.project
  environment = var.environment

  github_monorepo = var.github_monorepo
  github_branch   = var.github_branch

  ecr_repository_name         = module.ecr.repository_name
  ecs_cluster_name            = module.ecs.cluster_name
  frontend_s3_bucket_name     = module.s3_cloudfront.bucket_name
  cloudfront_distribution_id  = module.s3_cloudfront.cloudfront_id
}