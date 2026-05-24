const youtubeGateway = require('./youtube.gateway');
const googleOAuthService = require('../google-oauth.service');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS } = require('../../../utils/constants');

class YouTubePublishService {
  /**
   * Đăng tải video lên YouTube
   * @param {string} brandId 
   * @param {Object} postData 
   * @returns {Promise<Object>} Kết quả đăng tải
   */
  async publishPost(brandId, postData) {
    const { title, caption, mediaUrls, options = {} } = postData;
    
    // 1. Validate video URL
    if (!mediaUrls) {
      throw new Error('Video URL is required for YouTube upload');
    }
    
    // Nếu mediaUrls là string cách nhau bởi dấu phẩy
    const videoUrl = mediaUrls.split(',')[0].trim();
    if (!videoUrl) {
      throw new Error('Video URL is required for YouTube upload');
    }

    // 2. Tìm tài khoản YouTube liên kết
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) {
      throw new Error('YouTube account not connected for this brand');
    }
    const account = socialAccount[0];

    // 3. Khởi tạo Auth client
    const auth = googleOAuthService.createClient();
    auth.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
      expiry_date: account.tokenExpiresAt ? account.tokenExpiresAt.getTime() : undefined
    });

    // 4. Get video stream (từ URL hoặc file path local)
    let videoStream;
    if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
      try {
        const response = await fetch(videoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        videoStream = response.body;
      } catch (err) {
        throw new Error(`Failed to download video from URL: ${err.message}`);
      }
    } else {
      const fs = require('fs');
      const path = require('path');
      const localPath = path.join(__dirname, '../../../../', videoUrl.replace(/^\//, ''));
      if (!fs.existsSync(localPath)) {
        throw new Error(`Local video file not found at ${localPath}`);
      }
      videoStream = fs.createReadStream(localPath);
    }

    // 5. Map cấu hình options nâng cao
    const privacyStatus = options.privacyStatus || 'private'; // public, private, unlisted
    const categoryId = options.categoryId || '22'; // Default: People & Blogs
    const youtubeTitle = options.youtubeTitle || title || 'New YouTube Post';
    const selfDeclaredMadeForKids = options.madeForKids === true || options.madeForKids === 'true';
    
    // Tự động thêm hashtag #Shorts cho video ngắn để YouTube phân phối vào đúng mục Shorts
    let finalTitle = youtubeTitle;
    let finalDescription = caption || '';
    if (options.youtubeType === 'short') {
      if (!finalTitle.toLowerCase().includes('#shorts') && finalTitle.length <= 92) {
        finalTitle = `${finalTitle} #Shorts`;
      } else if (!finalDescription.toLowerCase().includes('#shorts')) {
        finalDescription = `${finalDescription}\n\n#Shorts`;
      }
    }

    // Xử lý tags từ string sang array
    let tagsArray = [];
    if (options.tags) {
      tagsArray = options.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }

    // 6. Gọi Gateway thực hiện upload
    const uploadRes = await youtubeGateway.uploadVideo(auth, videoStream, {
      title: finalTitle,
      description: finalDescription,
      privacyStatus,
      categoryId,
      selfDeclaredMadeForKids,
      tags: tagsArray
    });

    const videoData = uploadRes.data;
    const videoId = videoData.id;

    // 7. Thực hiện thêm video vào Playlist nếu có cấu hình
    if (options.playlistId) {
      try {
        await youtubeGateway.addVideoToPlaylist(auth, options.playlistId, videoId);
      } catch (playlistErr) {
        console.error(`Failed to add video ${videoId} to playlist ${options.playlistId}:`, playlistErr.message);
        // Không ném lỗi ra ngoài vì video đã được upload thành công
      }
    }

    // 8. Tự động gửi bình luận đầu tiên nếu có cấu hình
    if (options.firstComment && options.firstComment.trim()) {
      try {
        await youtubeGateway.insertCommentThread(auth, videoId, options.firstComment.trim());
      } catch (commentErr) {
        console.error(`Failed to post first comment to video ${videoId}:`, commentErr.message);
        // Không ném lỗi ra ngoài vì video đã được upload thành công
      }
    }

    return {
      platformVideoId: videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      status: 'PUBLISHED',
      publishedAt: new Date(videoData.snippet.publishedAt)
    };
  }
}

module.exports = new YouTubePublishService();
