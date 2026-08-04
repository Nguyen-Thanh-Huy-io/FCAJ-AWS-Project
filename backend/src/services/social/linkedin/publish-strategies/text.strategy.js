const LinkedInPublishStrategy = require('./publish.strategy');
const linkedinGateway = require('../linkedin.gateway');

class TextPublishStrategy extends LinkedInPublishStrategy {
  async publish(memberId, accessToken, postData) {
    return linkedinGateway.createPost(accessToken, memberId, {
      caption: postData.caption
    });
  }
}

module.exports = TextPublishStrategy;
