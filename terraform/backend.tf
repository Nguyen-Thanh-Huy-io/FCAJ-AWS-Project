terraform {
  backend "s3" {
    bucket         = "REPLACE_WITH_BUCKET"
    key            = "publiast/${var.environment}/terraform.tfstate"
    region         = var.region
    dynamodb_table = "REPLACE_WITH_LOCK_TABLE"
    encrypt        = true
  }
}
