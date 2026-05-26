const BaseStep = require('../../../../core/pipeline/base.step');
const socialPlatformFactory = require('../../../social/social-platform.factory');
const { SEPARATORS } = require('../../../../utils/constants');

class SocialPublishStep extends BaseStep {
  async execute(context) {
    const { post, platforms, options, brandId } = context;
    context.results = [];

    for (const platform of platforms) {
      try {
        const service = socialPlatformFactory.getService(platform);
        const result = await service.publishPost(brandId, {
          title: post.title,
          caption: post.caption,
          mediaUrls: post.mediaUrls ? post.mediaUrls.split(SEPARATORS.COMMA).map(m => m.trim()) : [],
          type: post.type,
          options: options
        });
        
        context.results.push({ platform, success: true, result });
      } catch (error) {
        console.error(`[Pipeline] Failed to publish to ${platform}:`, error.message);
        context.results.push({ platform, success: false, error: error.message });
        // We continue to other platforms even if one fails
      }
    }
  }
}

module.exports = SocialPublishStep;
