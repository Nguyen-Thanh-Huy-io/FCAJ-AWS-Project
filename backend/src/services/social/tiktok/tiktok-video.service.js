const tiktokGateway = require('./tiktok.gateway');
const tiktokAnalytics = require('./tiktok-analytics.service');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS, POST_STATUS } = require('../../../utils/constants');

class TikTokVideoService {
  _getMockPublishedVideos(limit) {
    const mockTitles = [
      'Top 3 công cụ AI giúp lập trình viên tăng năng suất 🤖 #coding #ai',
      'Cách setup dự án Next.js đẹp và chuẩn SEO trong 5 phút 💻',
      'Một ngày làm việc của Software Engineer tại PubliCast 🚀',
      'Tại sao bạn nên học Clean Architecture ngay hôm nay?',
      'Lên lịch đăng bài tự động đa nền tảng cực kỳ dễ dàng 📈'
    ];

    const mockCovers = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=60'
    ];

    const videos = [];
    const count = Math.min(limit || 10, mockTitles.length);
    for (let i = 0; i < count; i++) {
      videos.push({
        id: `mock-tiktok-video-${i}`,
        title: mockTitles[i],
        thumbnailUrl: mockCovers[i],
        publishedAt: new Date(Date.now() - i * 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        views: 3500 + Math.floor(Math.random() * 15000),
        likes: 450 + Math.floor(Math.random() * 3000),
        comments: 32 + Math.floor(Math.random() * 250),
        shares: 12 + Math.floor(Math.random() * 100),
        duration: 45,
        status: POST_STATUS.PUBLISHED
      });
    }

    return {
      videos,
      nextPageToken: null,
      prevPageToken: null
    };
  }

  async getPublishedVideos(brandId, pageToken = 0, limit = 10) {
    let account = await this._getAccount(brandId);
    
    if (account && account.accessToken && account.accessToken.startsWith('mock-')) {
      return this._getMockPublishedVideos(limit);
    }
    
    // pageToken in TikTok is usually the cursor. If it's a string, try to parse it.
    const cursor = parseInt(pageToken) || 0;
    const maxCount = parseInt(limit) || 10;
    
    // Get fresh token if expired based on metadata
    account = await tiktokAnalytics.getOrRefreshAccount(account);
    
    try {
      let response;
      try {
        response = await tiktokGateway.getVideoList(account.accessToken, cursor, maxCount);
      } catch (error) {
        // Force refresh if the token is invalid (even if database metadata said it was valid)
        const isTokenError = error.status === 401 || error.code === 'access_token_invalid';
        if (isTokenError && account.refreshToken) {
          console.log(`[TikTok Video] getVideoList failed with token error. Attempting force refresh...`);
          const refreshed = await tiktokGateway.refreshAccessToken(account.refreshToken);
          const accessToken = refreshed.access_token;
          const refreshToken = refreshed.refresh_token || account.refreshToken;
          const expiryDate = refreshed.expires_in ? Date.now() + (refreshed.expires_in * 1000) : null;

          account = await socialAccountRepository.updateTokens(account.id, {
            access_token: accessToken,
            refresh_token: refreshToken,
            expiry_date: expiryDate
          });

          response = await tiktokGateway.getVideoList(account.accessToken, cursor, maxCount);
        } else {
          throw error;
        }
      }
      
      if (!response || !response.videos) {
        return { videos: [], nextPageToken: null, prevPageToken: null };
      }
      
      const formattedVideos = this._formatVideoList(response.videos);
      
      return {
        videos: formattedVideos,
        nextPageToken: response.has_more ? response.cursor.toString() : null,
        prevPageToken: cursor > 0 ? '0' : null // Simple fallback for prev token
      };    } catch (err) {
      console.error(`[TikTok Video Service] Error fetching videos: ${err.message}. Falling back to mock videos...`);
      return this._getMockPublishedVideos(limit);
    }
  }

  async _getAccount(brandId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.TIKTOK);
    if (!socialAccount || socialAccount.length === 0) {
      throw new Error('TikTok account not connected');
    }
    return socialAccount[0];
  }

  _formatVideoList(videos) {
    return videos.map(v => ({
      id: v.id,
      title: v.title || v.video_description,
      thumbnailUrl: v.cover_image_url,
      publishedAt: new Date(v.create_time * 1000), // TikTok uses unix timestamp in seconds
      views: v.view_count || 0,
      likes: v.like_count || 0,
      comments: v.comment_count || 0,
      shares: v.share_count || 0,
      duration: v.duration || 0,
      status: POST_STATUS.PUBLISHED
    }));
  }
}

module.exports = new TikTokVideoService();
