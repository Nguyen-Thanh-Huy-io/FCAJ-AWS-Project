output "codestar_connection_arn" {
  description = "ARN của CodeStar Connection với GitHub (Cần thiết để verify kết nối)"
  value       = aws_codestarconnections_connection.github.arn
}

output "codestar_connection_status" {
  description = "Trạng thái hiện tại của kết nối GitHub (PENDING_VERIFICATION / AVAILABLE)"
  value       = aws_codestarconnections_connection.github.connection_status
}

output "backend_pipeline_name" {
  description = "Tên AWS CodePipeline cho Backend"
  value       = aws_codepipeline.backend.name
}

output "frontend_pipeline_name" {
  description = "Tên AWS CodePipeline cho Frontend"
  value       = aws_codepipeline.frontend.name
}

output "backend_codebuild_name" {
  description = "Tên AWS CodeBuild Project cho Backend"
  value       = aws_codebuild_project.backend.name
}

output "frontend_codebuild_name" {
  description = "Tên AWS CodeBuild Project cho Frontend"
  value       = aws_codebuild_project.frontend.name
}

output "pipeline_artifacts_bucket_name" {
  description = "S3 Bucket lưu trữ Artifacts tạm thời cho Pipeline"
  value       = aws_s3_bucket.pipeline_artifacts.bucket
}