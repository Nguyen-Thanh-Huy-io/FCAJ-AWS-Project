const FacebookPublishStrategy = require('./publish.strategy');
const facebookGateway = require('../facebook.gateway');

class ReelPublishStrategy extends FacebookPublishStrategy {
  async publish(pageId, pageAccessToken, postData) {
    const { mediaUrl, caption } = postData;
    if (!mediaUrl) {
      throw new Error('Reel requires a video media file');
    }
    return facebookGateway.publishReel(pageId, pageAccessToken, mediaUrl, caption);
  }
}

module.exports = ReelPublishStrategy;
