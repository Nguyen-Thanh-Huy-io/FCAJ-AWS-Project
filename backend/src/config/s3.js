const { S3Client } = require('@aws-sdk/client-s3');

/**
 * AWS S3 Client Configuration
 * 
 * On ECS: Uses IAM Task Role automatically (no static credentials needed).
 * On local dev: Uses AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY from .env.
 */
const s3Config = {
  region: process.env.AWS_REGION || 'ap-southeast-2',
};

// Only use static credentials if explicitly provided (local dev).
// On ECS, the SDK automatically picks up the IAM Task Role credentials.
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const s3Client = new S3Client(s3Config);

module.exports = { s3Client };
