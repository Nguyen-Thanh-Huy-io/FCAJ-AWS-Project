resource "aws_secretsmanager_secret" "backend" {
  name                    = "${var.project}-${var.environment}-backend"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "backend" {
  secret_id = aws_secretsmanager_secret.backend.id

  secret_string = jsonencode({
    DATABASE_URL         = var.database_url
    REDIS_HOST           = var.redis_host
    REDIS_PORT           = "6379"
    JWT_SECRET           = var.jwt_secret
    ACCESS_TOKEN_SECRET  = var.access_token_secret
    REFRESH_TOKEN_SECRET = var.refresh_token_secret
    EMAIL_USER           = var.email_user
    EMAIL_PASS           = var.email_pass
    RESEND_API_KEY       = var.resend_api_key
    RESEND_FROM_EMAIL    = var.resend_from_email
    GEMINI_API_KEY       = var.gemini_api_key
    OPENAI_API_KEY       = var.openai_api_key
  })
}

resource "aws_secretsmanager_secret" "oauth" {
  name                    = "${var.project}-${var.environment}-oauth"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "oauth" {
  secret_id = aws_secretsmanager_secret.oauth.id

  secret_string = jsonencode({
    GOOGLE_CLIENT_SECRET   = var.google_client_secret
    GOOGLE_CLIENT_ID       = var.google_client_id
    FACEBOOK_APP_ID        = var.facebook_app_id
    FACEBOOK_APP_SECRET    = var.facebook_app_secret
    THREADS_APP_ID     = var.threads_app_id
    THREADS_APP_SECRET     = var.threads_app_secret
    TIKTOK_CLIENT_KEY      = var.tiktok_client_key
    TIKTOK_CLIENT_SECRET   = var.tiktok_client_secret
    DISCORD_CLIENT_SECRET  = var.discord_client_secret
    DISCORD_BOT_TOKEN      = var.discord_bot_token
  })
}

resource "aws_secretsmanager_secret" "payment" {
  name                    = "${var.project}-${var.environment}-payment"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "payment" {
  secret_id = aws_secretsmanager_secret.payment.id

  secret_string = jsonencode({
    SEPAY_API_KEY = var.sepay_api_key
    PAYMENT_GATEWAY = var.payment_gateway
    VIETQR_ACCOUNT_NO = var.vietqr_account_no
    VIETQR_ACCOUNT_NAME = var.vietqr_account_name
    VIETQR_ACQ_ID = var.vietqr_acq_id
    VIETQR_TEMPLATE = var.vietqr_template
    SEPAY_API_KEY =  var.sepay_api_key
    PAYMENT_QR_EXPIRY_MINUTES = var.payment_qr_expiry_minutes
  })
}

resource "aws_secretsmanager_secret" "encryption" {
  name = "${var.project}-${var.environment}-encryption-key"
}

# Nếu bạn muốn nạp giá trị vào luôn thì thêm resource này:
resource "aws_secretsmanager_secret_version" "encryption_version" {
  secret_id     = aws_secretsmanager_secret.encryption.id
  secret_string = jsonencode({
    ENCRYPTION_KEY = var.encryption_key
  })
}

