const BaseSocialService = require('../base-social.service');
const tiktokGateway = require('./tiktok.gateway');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS, SOCIAL_TECHNICAL, POST_STATUS } = require('../../../utils/constants');

class TikTokService extends BaseSocialService {
  /**
   * Connect TikTok Channel (OAuth callback logic)
   */
  async connectChannel(brandId, code, redirectUri) {
    const tokenData = await tiktokGateway.exchangeCodeForToken(code, redirectUri);
    const userInfo = await tiktokGateway.getUserInfo(tokenData.access_token);

    // Prepare standardized account data with statistics
    const pageData = {
      pageId: userInfo.open_id,
      username: userInfo.username || userInfo.display_name || 'TikTok User',
      displayName: userInfo.display_name || 'TikTok User',
      profilePictureUrl: userInfo.avatar_url || '',
      // Map TikTok specific statistics
      followersCount: userInfo.follower_count || 0,
      followingCount: userInfo.following_count || 0,
      likesCount: userInfo.likes_count || 0,
      videoCount: userInfo.video_count || 0
    };

    return socialAccountRepository.upsertTikTokAccount(brandId, pageData, {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expiry_date: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
      scope: tokenData.scope || 'user.info.basic,user.info.stats,video.list,video.publish'
    });
  }

  /**
   * Publish Post to TikTok
   */
  async publishPost(brandId, postData) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatformFirst(brandId, PLATFORMS.TIKTOK);
    if (!socialAccount) throw new Error('TikTok account not connected');

    const { mediaUrls, title, caption } = postData;
    if (!mediaUrls || mediaUrls.length === 0) throw new Error('TikTok requires a video URL');

    // TikTok Direct Post requires a public URL
    const videoUrl = mediaUrls[0]; 
    const finalTitle = title || caption || 'New TikTok Post';

    const result = await tiktokGateway.publishVideo(socialAccount.accessToken, videoUrl, finalTitle);

    return {
      platformVideoId: result.publish_id,
      status: POST_STATUS.PUBLISHED,
      publishedAt: new Date()
    };
  }

  async getChannelInfo(auth, startDate, endDate) {
    const userInfo = await tiktokGateway.getUserInfo(auth.accessToken);
    return {
      pageId: userInfo.open_id,
      username: userInfo.username || userInfo.display_name || 'TikTok User',
      displayName: userInfo.display_name || 'TikTok User',
      profilePictureUrl: userInfo.avatar_url || '',
    };
  }

  async getPublishedVideos(brandId, pageToken, limit) {
    const tiktokVideoService = require('./tiktok-video.service');
    return tiktokVideoService.getPublishedVideos(brandId, pageToken, limit);
  }

  async getAnalyticsReport(auth, startDate, endDate, currentFollowers) {
    const tiktokAnalyticsService = require('./tiktok-analytics.service');
    return tiktokAnalyticsService.getAnalyticsReport(auth, startDate, endDate, currentFollowers);
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate) {
    const tiktokAnalyticsService = require('./tiktok-analytics.service');
    return tiktokAnalyticsService.syncChannelMetrics(socialAccountId, startDate, endDate);
  }

  async fetchChannelComments() { return []; }
  async replyToComment() { return null; }
}

module.exports = new TikTokService();
