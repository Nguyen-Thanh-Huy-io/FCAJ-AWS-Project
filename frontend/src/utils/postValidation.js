import { isVideoPath } from './url';
import { PLATFORM_CONFIGS } from '../constants/platformRegistry';

/**
 * validatePostForm
 * Hàm validate bài viết dựa trên platform và định dạng file, sử dụng cấu hình registry động.
 *
 * @returns {string[]} Mảng chứa các thông báo lỗi (rỗng nếu không có lỗi)
 */
export function validatePostForm({
  isLibrary,
  selectedPublishId,
  scheduledDate,
  activePlatform,
  facebookType,
  youtubeType,
  instagramType,
  videoFileUrl,
  videoFile,
  videoDuration,
  videoWidth,
  videoHeight,
  uploadedVideoPath
}) {
  const errors = [];
  if (isLibrary) {
    return errors;
  }

  // 1. Validate ngày lên lịch
  if (selectedPublishId !== 'now') {
    const isPastDate = new Date(scheduledDate).getTime() < Date.now() - 60000;
    if (isPastDate) {
      errors.push("Publish date can't be a past date.");
    }
  }

  // Lấy cấu hình cho platform hiện tại
  const config = PLATFORM_CONFIGS[activePlatform];
  if (!config) {
    return errors;
  }

  // Xác định sub-type đang hoạt động cho platform
  let activeType = config.defaultType;
  if (activePlatform === 'facebook') activeType = facebookType;
  else if (activePlatform === 'youtube') activeType = youtubeType;
  else if (activePlatform === 'instagram') activeType = instagramType;

  const hasMedia = !!(uploadedVideoPath || videoFile);
  const isVid = isVideoPath(videoFileUrl, videoFile);

  const checkContext = {
    hasMedia,
    isVideo: isVid,
    videoDuration: videoDuration || 0,
    videoWidth: videoWidth || 0,
    videoHeight: videoHeight || 0
  };

  // 1. Chạy các luật luôn áp dụng (_always)
  const alwaysRules = config.validationRules?._always || [];
  for (const rule of alwaysRules) {
    if (rule.check(checkContext)) {
      errors.push(rule.message(checkContext));
    }
  }

  // 2. Chạy các luật cho activeType cụ thể
  const typeRules = config.validationRules?.[activeType] || [];
  for (const rule of typeRules) {
    if (rule.check(checkContext)) {
      errors.push(rule.message(checkContext));
    }
  }

  return errors;
}
