const LinkedInPublishStrategy = require('./publish.strategy');
const linkedinGateway = require('../linkedin.gateway');

class ImagePublishStrategy extends LinkedInPublishStrategy {
  async publish(memberId, accessToken, postData) {
    return linkedinGateway.createPost(accessToken, memberId, {
      caption: postData.caption,
      mediaUrl: postData.mediaUrl,
      title: postData.title || 'Image Post'
    });
  }
}

module.exports = ImagePublishStrategy;
