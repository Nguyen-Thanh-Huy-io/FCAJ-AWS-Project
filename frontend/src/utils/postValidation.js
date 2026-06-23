import { isVideoPath } from './url';
import { PLATFORM_CONFIGS } from '../constants/platformRegistry';

/**
 * validatePostForm
 * Hàm validate bài viết dựa trên platform và định dạng file, sử dụng cấu hình registry động kết hợp DB PlatformLimits.
 *
 * @returns {string[]} Mảng chứa các thông báo lỗi (rỗng nếu không có lỗi)
 */
export function validatePostForm({
  isLibrary,
  selectedPublishId,
  scheduledDate,
  selectedPlatforms = [],
  facebookType,
  youtubeType,
  instagramType,
  videoFileUrl,
  videoFile,
  videoDuration,
  videoWidth,
  videoHeight,
  uploadedVideoPath,
  platformLimits = []
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

  const hasMedia = !!(uploadedVideoPath || videoFile);
  const isVid = isVideoPath(videoFileUrl, videoFile);

  // 2. Validate từng platform được tích chọn
  for (const platform of selectedPlatforms) {
    const platUpper = platform.toUpperCase();
    
    // Xác định subType
    let subType = 'POST';
    if (platform === 'facebook') subType = facebookType.toUpperCase();
    else if (platform === 'youtube') subType = youtubeType.toUpperCase();
    else if (platform === 'instagram') subType = instagramType.toUpperCase();
    else if (platform === 'tiktok') subType = 'VIDEO';

    // Tìm cấu hình limit động từ DB
    const limitConfig = platformLimits.find(l => l.platform === platUpper && l.subType === subType);

    if (!limitConfig) {
      // Fallback sang cấu hình static registry nếu chưa load được DB limits
      const config = PLATFORM_CONFIGS[platform];
      if (config) {
        let activeType = config.defaultType;
        if (platform === 'facebook') activeType = facebookType;
        else if (platform === 'youtube') activeType = youtubeType;
        else if (platform === 'instagram') activeType = instagramType;

        const checkContext = {
          hasMedia,
          isVideo: isVid,
          videoDuration: videoDuration || 0,
          videoWidth: videoWidth || 0,
          videoHeight: videoHeight || 0
        };

        const alwaysRules = config.validationRules?._always || [];
        for (const rule of alwaysRules) {
          if (rule.check(checkContext)) {
            errors.push(`[${platUpper}] ${rule.message(checkContext)}`);
          }
        }

        const typeRules = config.validationRules?.[activeType] || [];
        for (const rule of typeRules) {
          if (rule.check(checkContext)) {
            errors.push(`[${platUpper} - ${activeType.toUpperCase()}] ${rule.message(checkContext)}`);
          }
        }
      }
      continue;
    }

    // Thực hiện validation dựa trên DB limits
    
    // Check Allowed Media Types
    if (limitConfig.allowedMediaTypes === 'NONE' && hasMedia) {
      errors.push(`[${platUpper} - ${subType}] Media uploads are not allowed.`);
    }
    if (limitConfig.allowedMediaTypes === 'VIDEO' && hasMedia && !isVid) {
      errors.push(`[${platUpper} - ${subType}] Only video files are allowed.`);
    }
    if (limitConfig.allowedMediaTypes === 'IMAGE' && hasMedia && isVid) {
      errors.push(`[${platUpper} - ${subType}] Only image files are allowed.`);
    }

    if (hasMedia) {
      // Validate format
      if (limitConfig.allowedFormats) {
        const allowed = limitConfig.allowedFormats.split(',').map(f => f.trim().toLowerCase());
        const fileName = videoFile ? videoFile.name : (uploadedVideoPath || videoFileUrl || '');
        const format = fileName.split('.').pop().split('?')[0].toLowerCase();
        
        if (format && !allowed.includes(format)) {
          errors.push(`[${platUpper} - ${subType}] Format "${format}" is not supported. Supported formats: ${limitConfig.allowedFormats}`);
        }
      }

      // Validate duration (chỉ cho video)
      if (isVid && videoDuration) {
        if (limitConfig.minVideoDuration && videoDuration < limitConfig.minVideoDuration) {
          errors.push(`[${platUpper} - ${subType}] Video duration (${Math.round(videoDuration)}s) is shorter than the minimum required ${limitConfig.minVideoDuration}s.`);
        }
        if (limitConfig.maxVideoDuration && videoDuration > limitConfig.maxVideoDuration) {
          errors.push(`[${platUpper} - ${subType}] Video duration (${Math.round(videoDuration)}s) is longer than the maximum allowed ${limitConfig.maxVideoDuration}s.`);
        }
      }
    }

    // Bắt buộc có media đối với Reels/Stories/Shorts/TikTok/YouTube
    if (platUpper === 'TIKTOK' && !hasMedia) {
      errors.push(`[${platUpper} - ${subType}] TikTok posts require a video file.`);
    }
    if (platUpper === 'YOUTUBE' && !hasMedia) {
      errors.push(`[${platUpper} - ${subType}] YouTube uploads require a video file.`);
    }
    if (platUpper === 'INSTAGRAM' && ['REEL', 'STORY'].includes(subType) && !hasMedia) {
      errors.push(`[${platUpper} - ${subType}] Instagram ${subType.toLowerCase()} requires a media file.`);
    }
    if (platUpper === 'FACEBOOK' && ['REEL', 'STORY'].includes(subType) && !hasMedia) {
      errors.push(`[${platUpper} - ${subType}] Facebook ${subType.toLowerCase()} requires a media file.`);
    }
  }

  return errors;
}

