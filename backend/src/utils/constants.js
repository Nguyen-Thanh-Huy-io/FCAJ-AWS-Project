const AUTH_PROVIDERS = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  TIKTOK: 'TIKTOK',
  LINKEDIN: 'LINKEDIN',
  TWITTER: 'TWITTER',
  YOUTUBE: 'YOUTUBE',
  TWITCH: 'TWITCH',
  SNAPCHAT: 'SNAPCHAT'
};

const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
  ANALYST: 'ANALYST',
  STREAM_MANAGER: 'STREAM_MANAGER',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
  CONTENT_CREATOR: 'CONTENT_CREATOR',
  STREAM_OPERATOR: 'STREAM_OPERATOR',
  CLIENT: 'CLIENT'
};

// User account statuses - using booleans in new schema
const USER_STATUS = {
  ACTIVE: 'ACTIVE', // when isActive=true and isEmailVerified=true
  INACTIVE: 'INACTIVE', // when isEmailVerified=false
  BANNED: 'BANNED' // when isActive=false
};

const ERROR_MESSAGES = {
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  OTP_EXPIRED: 'OTP expired or not found',
  INVALID_OTP: 'Invalid OTP',
  REGISTRATION_SUCCESS: 'Registration successful. Please check your email for OTP.',
  ACTIVATION_SUCCESS: 'Account activated successfully',
  // Login errors
  LOGIN_SUCCESS: 'Login successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_EMAIL: 'Email does not exist',
  INVALID_PASSWORD: 'Password is incorrect',
  ACCOUNT_NOT_ACTIVATED: 'Account not activated. Please verify your email first.',
  ACCOUNT_BANNED: 'Your account has been banned',
  TOO_MANY_LOGIN_ATTEMPTS: 'Too many login attempts. Please try again later.',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  // Profile
  USER_NOT_FOUND: 'User not found',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  ACCESS_DENIED: 'Access denied',
  // Forgot password
  FORGOT_PASSWORD_OTP_SENT: 'OTP sent if email exists',
  RESET_PASSWORD_SUCCESS: 'Password reset successfully',
  RESET_PASSWORD_OTP_EXPIRED: 'OTP has expired, please request again',
  RESET_PASSWORD_INVALID_OTP: 'Invalid OTP',
  RESET_PASSWORD_OTP_LOCKED: 'Invalid OTP too many times. Please request a new OTP.',
  NEW_PASSWORD_SAME_AS_OLD: 'New password must differ from old'
};

const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_REDIS_EXPIRY: 7 * 24 * 60 * 60 // 7 days in seconds
};

module.exports = {
  AUTH_PROVIDERS,
  USER_ROLES,
  USER_STATUS,
  ERROR_MESSAGES,
  JWT_CONFIG
};
