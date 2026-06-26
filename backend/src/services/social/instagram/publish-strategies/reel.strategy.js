const InstagramPublishStrategy = require('./publish.strategy');
const instagramGateway = require('../instagram.gateway');

class ReelPublishStrategy extends InstagramPublishStrategy {
  async publish(igAccountId, accessToken, postData) {
    if (accessToken.startsWith('mock-')) {
      return { id: `ig_mock_reel_${Date.now()}` };
    }

    const mediaUrl = postData.mediaUrl || (postData.mediaUrls && postData.mediaUrls[0]);
    const { caption } = postData;
    const container = await instagramGateway.createReelContainer(igAccountId, accessToken, mediaUrl, caption);
    await this.pollUntilReady(instagramGateway, container.id, accessToken);
    return instagramGateway.publishContainer(igAccountId, accessToken, container.id);
  }
}

module.exports = ReelPublishStrategy;
