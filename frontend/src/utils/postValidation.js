import { isVideoPath } from './url';

/**
 * validatePostForm
 * Hàm validate bài viết dựa trên platform và định dạng file (Reel, Story, Short, Video...).
 * Tách biệt hoàn toàn logic validation khỏi component/hook để dễ dàng Unit Test và tuân thủ SRP.
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
  videoFileUrl,
  videoFile,
  videoDuration,
  videoWidth,
  videoHeight,
  uploadedVideoPath
}) {
  const errors = [];
  if (isLibrary) {
    return errors; // Templates do không yêu cầu ngày lên lịch hoặc tải lên media
  }

  // 1. Validate ngày lên lịch
  if (selectedPublishId !== 'now') {
    const isPastDate = new Date(scheduledDate).getTime() < Date.now() - 60000;
    if (isPastDate) {
      errors.push("Publish date can't be a past date.");
    }
  }

  const isVid = isVideoPath(videoFileUrl, videoFile);

  // 2. Validate theo Platform và Type
  if (activePlatform === "facebook") {
    if (facebookType === "reel") {
      if (!uploadedVideoPath && !videoFile) {
        errors.push("Reel -> Add at least 1 video.");
      } else if (!isVid) {
        errors.push("Facebook Reel must be a video file.");
      } else {
        // Facebook Reels: tối thiểu 3s, tối đa 900s (15 phút)
        if (videoDuration > 0 && (videoDuration < 3 || videoDuration > 900)) {
          errors.push(`Facebook Reels must be between 3 seconds and 15 minutes. (Current: ${videoDuration.toFixed(1)}s)`);
        }
        if (videoWidth > 0 && videoHeight > 0 && videoWidth >= videoHeight) {
          errors.push(`Facebook Reels must be vertical (9:16 aspect ratio). Current ratio is horizontal or square.`);
        }
      }
    }
    if (facebookType === "story") {
      if (!uploadedVideoPath && !videoFile) {
        errors.push("Auto publish (story) -> Add at least 1 image or video.");
      } else if (isVid) {
        if (videoDuration > 15) {
          errors.push(`Facebook Story videos should be 15 seconds or less. (Current: ${videoDuration.toFixed(1)}s)`);
        }
        if (videoWidth > 0 && videoHeight > 0 && videoWidth >= videoHeight) {
          errors.push(`Facebook Story videos should be vertical (9:16 aspect ratio).`);
        }
      }
    }
  } else if (activePlatform === "youtube") {
    if (!uploadedVideoPath && !videoFile) {
      errors.push("YouTube -> Add at least 1 video.");
    } else if (!isVid) {
      errors.push("YouTube publication must be a video file.");
    } else if (youtubeType === "short") {
      if (videoDuration > 60) {
        errors.push(`YouTube Shorts must be 60 seconds or less. (Current: ${videoDuration.toFixed(1)}s)`);
      }
      if (videoWidth > 0 && videoHeight > 0 && videoWidth > videoHeight) {
        errors.push(`YouTube Shorts must be vertical or square. Current ratio is horizontal.`);
      }
    }
  } else if (activePlatform === "tiktok") {
    if (!uploadedVideoPath && !videoFile) {
      errors.push("TikTok -> Add at least 1 image or video.");
    }
  }

  return errors;
}
