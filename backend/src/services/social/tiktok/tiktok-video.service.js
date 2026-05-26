const tiktokGateway = require('./tiktok.gateway');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS, POST_STATUS } = require('../../../utils/constants');

class TikTokVideoService {
  async getPublishedVideos(brandId, pageToken = 0, limit = 10) {
    const account = await this._getAccount(brandId);
    
    // pageToken in TikTok is usually the cursor. If it's a string, try to parse it.
    const cursor = parseInt(pageToken) || 0;
    const maxCount = parseInt(limit) || 10;
    
    try {
      const response = await tiktokGateway.getVideoList(account.accessToken, cursor, maxCount);
      
      if (!response || !response.videos) {
        return { videos: [], nextPageToken: null, prevPageToken: null };
      }
      
      const formattedVideos = this._formatVideoList(response.videos);
      
      return {
        videos: formattedVideos,
        nextPageToken: response.has_more ? response.cursor.toString() : null,
        prevPageToken: cursor > 0 ? '0' : null // Simple fallback for prev token
      };
    } catch (err) {
      console.error(`[TikTok Video Service] Error fetching videos: ${err.message}`);
      return { videos: [], nextPageToken: null, prevPageToken: null };
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
