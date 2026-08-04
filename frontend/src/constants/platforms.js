/**
 * PLATFORMS — Enum các nền tảng mạng xã hội được hỗ trợ.
 * Dùng thay thế mọi string literal 'youtube', 'facebook', 'tiktok'.
 */
export const PLATFORMS = {
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook',
  TIKTOK: 'tiktok',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  TELEGRAM: 'telegram',
  DISCORD: 'discord',
  THREADS: 'threads',
};

/** Tên hiển thị */
export const PLATFORM_LABELS = {
  [PLATFORMS.YOUTUBE]: 'YouTube',
  [PLATFORMS.FACEBOOK]: 'Facebook',
  [PLATFORMS.TIKTOK]: 'TikTok',
  [PLATFORMS.INSTAGRAM]: 'Instagram',
  [PLATFORMS.LINKEDIN]: 'LinkedIn',
  [PLATFORMS.TELEGRAM]: 'Telegram',
  [PLATFORMS.DISCORD]: 'Discord',
  [PLATFORMS.THREADS]: 'Threads',
};

/** Default tab khi vào Platform Dashboard */
export const PLATFORM_DEFAULT_TAB = {
  [PLATFORMS.YOUTUBE]: 'community',
  [PLATFORMS.FACEBOOK]: 'overview',
  [PLATFORMS.TIKTOK]: 'community',
  [PLATFORMS.INSTAGRAM]: 'overview',
  [PLATFORMS.LINKEDIN]: 'overview',
  [PLATFORMS.TELEGRAM]: 'overview',
  [PLATFORMS.DISCORD]: 'overview',
  [PLATFORMS.THREADS]: 'community',
};

/** Platform gửi lên backend (uppercase) */
export const PLATFORM_API_KEY = {
  [PLATFORMS.YOUTUBE]: 'YOUTUBE',
  [PLATFORMS.FACEBOOK]: 'FACEBOOK',
  [PLATFORMS.TIKTOK]: 'TIKTOK',
  [PLATFORMS.INSTAGRAM]: 'INSTAGRAM',
  [PLATFORMS.LINKEDIN]: 'LINKEDIN',
  [PLATFORMS.TELEGRAM]: 'TELEGRAM',
  [PLATFORMS.DISCORD]: 'DISCORD',
  [PLATFORMS.THREADS]: 'THREADS',
  X: 'TWITTER_X', // special case
};

/** Platform mặc định khi tạo bài */
export const DEFAULT_PLATFORM = PLATFORMS.YOUTUBE;
