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
  INSTAGRAM: 'INSTAGRAM',
  TIKTOK: 'TIKTOK'
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
  REJECTED: 'REJECTED',
  PAUSED: 'PAUSED'
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

const AUTOLIST_TYPES = {
  SOURCE: {
    MANUAL: 'MANUAL',
    RSS: 'RSS',
    DRIVE: 'DRIVE'
  },
  SCHEDULE: {
    INTERVAL: 'INTERVAL',
    SPECIFIC: 'SPECIFIC'
  }
};

const SEPARATORS = {
  COMMA: ','
};

const BILLING_CYCLES = {
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL'
};

const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

const INVOICE_STATUS = {
  PAID: 'PAID',
  UNPAID: 'UNPAID'
};

const POST_TYPES = {
  VIDEO: 'VIDEO',
  IMAGE: 'IMAGE',
  CAROUSEL: 'CAROUSEL',
  REEL: 'REEL',
  STORY: 'STORY',
  TEXT: 'TEXT',
  SHORT: 'SHORT'
};

const SYSTEM_PLANS = {
  FREE: 'FREE',
  BASIC: 'BASIC',
  PRO: 'PRO',
  BUSINESS: 'BUSINESS'
};

const ANALYTICS = {
  GRANULARITY: {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY'
  },
  TYPES: {
    YOUTUBE_DETAILED: 'YOUTUBE_DETAILED',
    FACEBOOK_DETAILED: 'FACEBOOK_DETAILED',
    TIKTOK_DETAILED: 'TIKTOK_DETAILED'
  },
  METRICS: {
    FACEBOOK: {
      VIEWS: 'page_views_total',
      IMPRESSIONS: 'page_impressions_unique',
      FOLLOWS: 'page_daily_follows_unique',
      ENGAGEMENTS: 'page_post_engagements',
      ACTIONS: 'page_total_actions',
      POST_REACH: 'post_impressions_unique',
      POST_VIEWS: 'post_impressions',
      POST_CLICKS: 'post_clicks_by_type'
    },
    YOUTUBE: {
      VIEWS: 'views',
      MINUTES_WATCHED: 'estimatedMinutesWatched',
      SUBSCRIBERS_GAINED: 'subscribersGained',
      SUBSCRIBERS_LOST: 'subscribersLost',
      VIEWER_PERCENTAGE: 'viewerPercentage'
    }
  },
  DIMENSIONS: {
    YOUTUBE: {
      TRAFFIC_SOURCE: 'insightTrafficSourceType',
      COUNTRY: 'country',
      DAY: 'day',
      AGE_GROUP: 'ageGroup',
      GENDER: 'gender',
      VIDEO: 'video'
    }
  },
  SORT: {
    YOUTUBE: {
      VIEWS_DESC: '-views',
      DAY_ASC: 'day'
    }
  }
};

const SOCIAL_TECHNICAL = {
  FB_ATTACHMENT: {
    ALBUM: 'album',
    VIDEO: 'video',
    VIDEO_INLINE: 'video_inline',
    PHOTO: 'photo',
    STATUS: 'status'
  },
  ATTACHMENT_TYPES: {
    VIDEO: 'video',
    IMAGE: 'image',
    PHOTO: 'photo'
  },
  YOUTUBE_RESOURCE: {
    VIDEO: 'video',
    CHANNEL: 'channel',
    PLAYLIST: 'playlist'
  },
  YOUTUBE_PART: {
    SNIPPET: 'snippet',
    STATISTICS: 'statistics',
    CONTENT_DETAILS: 'contentDetails',
    STATUS: 'status',
    REPLIES: 'replies'
  },
  TIKTOK_SCOPES: [
    'user.info.basic',
    'user.info.stats',
    'video.list',
    'video.publish'
  ],
  INBOX_LABELS: {
    ME: 'me',
    THEM: 'them'
  }
};

const YOUTUBE_PRIVACY = {
  PRIVATE: 'private',
  PUBLIC: 'public',
  UNLISTED: 'unlisted'
};

const YOUTUBE_CATEGORIES = {
  PEOPLE_BLOGS: '22',
  ENTERTAINMENT: '24',
  EDUCATION: '27',
  SCIENCE_TECH: '28',
  GAMING: '20'
};

const NOTIFICATION_TYPES = {
  STREAM: 'stream',
  CONTENT: 'content',
  TEAM: 'team',
  PLATFORM: 'platform',
  SYSTEM: 'system'
};

const DEFAULT_CONFIG = {
  LOCALE: 'vi-VN',
  TIMEZONE: 'Asia/Ho_Chi_Minh',
  LANGUAGE: 'vi',
  TIME: '12:00',
  CURRENCY: 'USD',
  UNTITLED_POST: 'Untitled Post',
  NO_CONTENT: 'No content'
};

const API_VERSIONS = {
  FACEBOOK: 'v25.0',
  YOUTUBE: 'v3',
  YOUTUBE_ANALYTICS: 'v2',
  TIKTOK: 'v2'
};

const MEDIA_EXTENSIONS = {
  VIDEO: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

const AUDIT_CONFIG = {
  SYSTEM_ACTOR: 'System',
  ROOT_ROLE: 'Root',
  DEFAULT_STATUS: 'success'
};

const WORKSPACE_DEFAULTS = {
  BRAND_NAME: 'New Workspace',
  DEFAULT_TIME: '12:00',
  UNTITLED: 'Untitled',
  FB_POST_FALLBACK: 'Facebook Post',
  YT_POST_FALLBACK: 'New YouTube Post'
};

const SYSTEM_LABELS = {
  ALL: 'All',
  ALL_PLATFORMS: 'All Platforms',
  ALL_STATUSES: 'All Statuses',
  SYSTEM: 'System',
  UNKNOWN: 'Unknown',
  NEW: 'New',
  RENEWAL: 'Renewal'
};

const SEARCH_PATHS = {
  ADMIN_AUDIT: '/admin/audit',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings'
};

const NOTIFICATION_LABELS = {
  ACTION: {
    MONITOR: 'Monitor',
    REVIEW: 'Review',
    RECONNECT: 'Reconnect',
    VIEW_TEAM: 'View Team',
    MANAGE: 'Manage',
    VIEW: 'View'
  },
  TIME: {
    JUST_NOW: 'Just now',
    MIN_AGO: 'min ago',
    HOUR_AGO: 'h ago',
    DAY_AGO: 'd ago'
  }
};

module.exports = {
  PLATFORMS,
  USER_ROLES,
  USER_STATUS,
  AUTH_PROVIDERS,
  INBOX_STATUS,
  INBOX_TYPES,
  POST_STATUS,
  ERROR_MESSAGES,
  AUTOLIST_TYPES,
  SEPARATORS,
  BILLING_CYCLES,
  SUBSCRIPTION_STATUS,
  INVOICE_STATUS,
  ANALYTICS,
  POST_TYPES,
  SYSTEM_PLANS,
  YOUTUBE_PRIVACY,
  YOUTUBE_CATEGORIES,
  NOTIFICATION_TYPES,
  DEFAULT_CONFIG,
  API_VERSIONS,
  MEDIA_EXTENSIONS,
  AUDIT_CONFIG,
  SOCIAL_TECHNICAL,
  WORKSPACE_DEFAULTS,
  SYSTEM_LABELS,
  SEARCH_PATHS,
  NOTIFICATION_LABELS
};
