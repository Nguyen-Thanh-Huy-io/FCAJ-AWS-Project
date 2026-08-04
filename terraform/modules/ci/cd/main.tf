# ------------------------------------------------------------------------------
# 1. S3 BUCKET ĐỂ LƯU CODEPIPELINE ARTIFACTS
# ------------------------------------------------------------------------------
resource "aws_s3_bucket" "pipeline_artifacts" {
  bucket        = "${var.project}-${var.environment}-pipeline-artifacts"
  force_destroy = true
}

# ------------------------------------------------------------------------------
# 2. CODESTAR CONNECTION (KẾT NỐI GITHUB)
# ------------------------------------------------------------------------------
resource "aws_codestarconnections_connection" "github" {
  name          = "${var.project}-${var.environment}-github-conn"
  provider_type = "GitHub"
}

# ------------------------------------------------------------------------------
# 3. IAM ROLES & POLICIES FOR CODEBUILD
# ------------------------------------------------------------------------------
resource "aws_iam_role" "codebuild_role" {
  name = "${var.project}-${var.environment}-codebuild-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "codebuild.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "codebuild_policy" {
  name = "${var.project}-${var.environment}-codebuild-policy"
  role = aws_iam_role.codebuild_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:*", "s3:*", "ecr:*", "ecs:*", "cloudfront:*"]
        Resource = "*"
      }
    ]
  })
}

# ------------------------------------------------------------------------------
# 4. IAM ROLES & POLICIES FOR CODEPIPELINE
# ------------------------------------------------------------------------------
resource "aws_iam_role" "codepipeline_role" {
  name = "${var.project}-${var.environment}-codepipeline-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "codepipeline.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name = "${var.project}-${var.environment}-codepipeline-policy"
  role = aws_iam_role.codepipeline_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:*", "codebuild:*", "codestar-connections:UseConnection"]
        Resource = "*"
      }
    ]
  })
}

# ------------------------------------------------------------------------------
# 5. CODEBUILD PROJECTS
# ------------------------------------------------------------------------------

# --- A. Backend CodeBuild ---
resource "aws_codebuild_project" "backend" {
  name         = "${var.project}-${var.environment}-backend-build"
  service_role = aws_iam_role.codebuild_role.arn

  artifacts { type = "CODEPIPELINE" }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true # ⚠️ Bắt buộc true để chạy Docker in Docker

    environment_variable {
      name  = "AWS_ACCOUNT_ID"
      value = data.aws_caller_identity.current.account_id
    }
    environment_variable {
      name  = "IMAGE_REPO_NAME"
      value = var.ecr_repository_name
    }
    environment_variable {
      name  = "ECS_CLUSTER_NAME"
      value = var.ecs_cluster_name
    }
    environment_variable {
      name  = "ECS_SERVICE_API"
      value = "${var.project}-${var.environment}-api"
    }
    environment_variable {
      name  = "ECS_SERVICE_WORKER_LIGHT"
      value = "${var.project}-${var.environment}-worker-light"
    }
    environment_variable {
      name  = "ECS_SERVICE_WORKER_HEAVY"
      value = "${var.project}-${var.environment}-worker-heavy"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "backend/buildspec.yml"
  }
}

# --- B. Frontend CodeBuild ---
resource "aws_codebuild_project" "frontend" {
  name         = "${var.project}-${var.environment}-frontend-build"
  service_role = aws_iam_role.codebuild_role.arn

  artifacts { type = "CODEPIPELINE" }

  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    image           = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type            = "LINUX_CONTAINER"
    privileged_mode = false

    environment_variable {
      name  = "S3_BUCKET_NAME"
      value = var.frontend_s3_bucket_name
    }
    environment_variable {
      name  = "CLOUDFRONT_DIST_ID"
      value = var.cloudfront_distribution_id
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "frontend/buildspec.yml"
  }
}

# ------------------------------------------------------------------------------
# 6. CODEPIPELINES
# ------------------------------------------------------------------------------

# --- A. Backend Pipeline ---
resource "aws_codepipeline" "backend" {
  name     = "${var.project}-${var.environment}-backend-pipeline"
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.pipeline_artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"
    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]
      configuration = {
        ConnectionArn    = aws_codestarconnections_connection.github.arn
        FullRepositoryId = var.github_monorepo 
        BranchName       = var.github_branch      
      }
    }
  }

  stage {
    name = "Build"
    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      version          = "1"
      configuration = {
        ProjectName = aws_codebuild_project.backend.name
      }
    }
  }
}

# --- B. Frontend Pipeline ---
resource "aws_codepipeline" "frontend" {
  name     = "${var.project}-${var.environment}-frontend-pipeline"
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.pipeline_artifacts.bucket
    type     = "S3"
  }

  stage {
    name = "Source"
    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]
      configuration = {
        ConnectionArn    = aws_codestarconnections_connection.github.arn
        FullRepositoryId = var.github_monorepo 
        BranchName       = var.github_branch
      }
    }
  }

  stage {
    name = "Build"
    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      version          = "1"
      configuration = {
        ProjectName = aws_codebuild_project.frontend.name
      }
    }
  }
}

# Data source lấy AWS Account ID hiện tại
data "aws_caller_identity" "current" {}