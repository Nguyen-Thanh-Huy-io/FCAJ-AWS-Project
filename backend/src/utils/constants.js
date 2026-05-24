/**
 * Centralize all constants to avoid Magic Strings across the application.
 * Following SOLID principles for better maintainability.
 */

const PLATFORMS = {
  YOUTUBE: 'YOUTUBE',
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  TIKTOK: 'TIKTOK',
  LINKEDIN: 'LINKEDIN',
  TWITTER_X: 'TWITTER_X'
};

const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
  USER: 'USER',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
  ANALYST: 'ANALYST',
  STREAM_MANAGER: 'STREAM_MANAGER',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
  CONTENT_CREATOR: 'CONTENT_CREATOR',
  STREAM_OPERATOR: 'STREAM_OPERATOR',
  CLIENT: 'CLIENT'
};

const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BANNED: 'BANNED'
};

const AUTH_PROVIDERS = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM'
};

const INBOX_STATUS = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  RESOLVED: 'RESOLVED',
  OPEN: 'OPEN',
  SPAM: 'SPAM',
  ARCHIVED: 'ARCHIVED'
};

const INBOX_TYPES = {
  COMMENT: 'COMMENT',
  DIRECT_MESSAGE: 'DIRECT_MESSAGE',
  MENTION: 'MENTION',
  REVIEW: 'REVIEW'
};

const POST_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
  REJECTED: 'REJECTED'
};

const ERROR_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful. Please check your email for activation OTP.',
  LOGIN_SUCCESS: 'Login successful',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  OTP_EXPIRED: 'OTP has expired',
  INVALID_OTP: 'Invalid OTP',
  ACTIVATION_SUCCESS: 'Account activated successfully',
  INVALID_EMAIL: 'Invalid email address',
  ACCOUNT_NOT_ACTIVATED: 'Account not activated. Please verify your email first.',
  ACCOUNT_BANNED: 'Your account has been banned',
  INVALID_PASSWORD: 'Invalid email or password',
  FORGOT_PASSWORD_OTP_SENT: 'OTP sent if email exists',
  RESET_PASSWORD_OTP_EXPIRED: 'OTP has expired, please request again',
  RESET_PASSWORD_OTP_LOCKED: 'Too many wrong attempts. Please request a new OTP.',
  RESET_PASSWORD_INVALID_OTP: 'Invalid OTP',
  NEW_PASSWORD_SAME_AS_OLD: 'New password must differ from old',
  RESET_PASSWORD_SUCCESS: 'Password reset successfully',
  USER_NOT_FOUND: 'User not found'
};

module.exports = {
  PLATFORMS,
  USER_ROLES,
  USER_STATUS,
  AUTH_PROVIDERS,
  INBOX_STATUS,
  INBOX_TYPES,
  POST_STATUS,
  ERROR_MESSAGES
};
