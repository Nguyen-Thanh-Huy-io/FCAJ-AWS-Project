const InstagramPublishStrategy = require('./publish.strategy');
const instagramGateway = require('../instagram.gateway');

class VideoPublishStrategy extends InstagramPublishStrategy {
  async publish(igAccountId, accessToken, postData) {
    if (accessToken.startsWith('mock-')) {
      return { id: `ig_mock_video_${Date.now()}` };
    }

    const mediaUrl = postData.mediaUrl || (postData.mediaUrls && postData.mediaUrls[0]);
    const { caption } = postData;
    const container = await instagramGateway.createVideoContainer(igAccountId, accessToken, mediaUrl, caption);
    await this.pollUntilReady(instagramGateway, container.id, accessToken);
    return instagramGateway.publishContainer(igAccountId, accessToken, container.id);
  }
}

module.exports = VideoPublishStrategy;
