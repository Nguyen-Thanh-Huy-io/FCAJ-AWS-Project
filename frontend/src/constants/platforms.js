/**
 * PLATFORMS — Enum các nền tảng mạng xã hội được hỗ trợ.
 * Dùng thay thế mọi string literal 'youtube', 'facebook', 'tiktok'.
 */
export const PLATFORMS = {
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook',
  TIKTOK: 'tiktok',
};

/** Tên hiển thị */
export const PLATFORM_LABELS = {
  [PLATFORMS.YOUTUBE]: 'YouTube',
  [PLATFORMS.FACEBOOK]: 'Facebook',
  [PLATFORMS.TIKTOK]: 'TikTok',
};

/** Default tab khi vào Platform Dashboard */
export const PLATFORM_DEFAULT_TAB = {
  [PLATFORMS.YOUTUBE]: 'community',
  [PLATFORMS.FACEBOOK]: 'overview',
  [PLATFORMS.TIKTOK]: 'community',
};

/** Platform gửi lên backend (uppercase) */
export const PLATFORM_API_KEY = {
  [PLATFORMS.YOUTUBE]: 'YOUTUBE',
  [PLATFORMS.FACEBOOK]: 'FACEBOOK',
  [PLATFORMS.TIKTOK]: 'TIKTOK',
  X: 'TWITTER_X', // special case
};

/** Platform mặc định khi tạo bài */
export const DEFAULT_PLATFORM = PLATFORMS.YOUTUBE;
