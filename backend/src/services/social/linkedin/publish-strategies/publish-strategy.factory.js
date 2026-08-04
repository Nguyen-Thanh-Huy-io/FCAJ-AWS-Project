const TextPublishStrategy = require('./text.strategy');
const ImagePublishStrategy = require('./image.strategy');
const VideoPublishStrategy = require('./video.strategy');
const { MEDIA_EXTENSIONS } = require('../../../../utils/constants');

class LinkedInPublishStrategyFactory {
  static getStrategy(mediaUrl) {
    if (mediaUrl) {
      const isVideo = MEDIA_EXTENSIONS.VIDEO.some(ext => mediaUrl.toLowerCase().endsWith(ext));
      if (isVideo) {
        return new VideoPublishStrategy();
      } else {
        return new ImagePublishStrategy();
      }
    }
    return new TextPublishStrategy();
  }
}

module.exports = LinkedInPublishStrategyFactory;
