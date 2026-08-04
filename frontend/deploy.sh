#!/bin/bash

# Cấu hình
BUCKET_NAME="publiast-staging-frontend "  # Thay bằng tên bucket thật
DISTRIBUTION_ID="E2URAJBCXBVMZ0"     # Thay bằng ID của CloudFront Distribution
BUILD_FOLDER="dist"                 # Hoặc "build" tùy theo project của bạn

echo "🚀 Bắt đầu build project..."
npm run build

echo "📤 Đang upload lên S3..."
aws s3 sync $BUILD_FOLDER/ s3://$BUCKET_NAME/ --delete

echo "💨 Đang invalidate cache CloudFront..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deploy hoàn tất!"