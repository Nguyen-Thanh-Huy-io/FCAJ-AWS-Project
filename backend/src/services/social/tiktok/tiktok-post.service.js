const tiktokGateway = require('./tiktok.gateway');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS, POST_STATUS } = require('../../../utils/constants');

class TikTokPostService {
  async publishPost(brandId, postData) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatformFirst(brandId, PLATFORMS.TIKTOK);
    if (!socialAccount) throw new Error('TikTok account not connected');

    const { mediaUrls, title, caption } = postData;
    if (!mediaUrls || mediaUrls.length === 0) throw new Error('TikTok requires a video URL');

    const videoUrl = mediaUrls[0]; 
    const finalTitle = title || caption || 'New TikTok Post';

    const result = await tiktokGateway.publishVideo(socialAccount.accessToken, videoUrl, finalTitle);

    return {
      platformVideoId: result.publish_id,
      status: POST_STATUS.PUBLISHED,
      publishedAt: new Date()
    };
  }
}

module.exports = new TikTokPostService();
