/**
 * Environment Variable Validator
 * Validates all required env vars at startup — fail fast strategy.
 * Following SOLID: Single Responsibility (validation only).
 */

const REQUIRED_VARS = [
  'DATABASE_URL',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'ENCRYPTION_KEY',
  'AWS_S3_BUCKET_NAME',     // S3 Bucket for media storage
  'AWS_REGION',             // AWS Region (e.g. ap-southeast-2)
];

const WARNED_VARS = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'TIKTOK_CLIENT_KEY',
  'TIKTOK_CLIENT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
  'FRONTEND_URL',
  'BACKEND_BASE_URL',
];

/**
 * Validate environment variables.
 * @throws {Error} if any required variable is missing.
 */
function validateEnv() {
  // Skip AWS validation when using local storage
  const effectiveRequired = process.env.UPLOAD_STORAGE === 'local'
    ? REQUIRED_VARS.filter(v => !v.startsWith('AWS_'))
    : REQUIRED_VARS;

  const missing = effectiveRequired.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `[EnvValidator] ❌ Missing required environment variables: ${missing.join(', ')}.\n` +
      'Please check your .env file.'
    );
  }

  const warned = WARNED_VARS.filter((key) => !process.env[key]);
  if (warned.length > 0) {
    console.warn(
      `[EnvValidator] ⚠️ Optional environment variables not set: ${warned.join(', ')}. ` +
      'Some features may be disabled.'
    );
  }

  // Validate JWT_SECRET strength
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  if (accessSecret && accessSecret.length < 32) {
    throw new Error('[EnvValidator] ❌ ACCESS_TOKEN_SECRET must be at least 32 characters long.');
  }

  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  if (refreshSecret && refreshSecret.length < 32) {
    throw new Error('[EnvValidator] ❌ REFRESH_TOKEN_SECRET must be at least 32 characters long.');
  }

  // Validate ENCRYPTION_KEY strength
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (encryptionKey && encryptionKey.length < 32) {
    throw new Error('[EnvValidator] ❌ ENCRYPTION_KEY must be at least 32 characters long.');
  }
}

module.exports = { validateEnv };
