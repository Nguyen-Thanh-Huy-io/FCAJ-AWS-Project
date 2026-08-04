const ReelPublishStrategy = require('./reel.strategy');
const StoryPublishStrategy = require('./story.strategy');
const VideoPublishStrategy = require('./video.strategy');
const PhotoPublishStrategy = require('./photo.strategy');
const CarouselPublishStrategy = require('./carousel.strategy');
const { POST_TYPES, MEDIA_EXTENSIONS } = require('../../../../utils/constants');

class InstagramPublishStrategyFactory {
  static getStrategy(type, mediaUrls = []) {
    if (type === POST_TYPES.REEL) {
      return new ReelPublishStrategy();
    }
    if (type === POST_TYPES.STORY) {
      return new StoryPublishStrategy();
    }
    if (type === POST_TYPES.CAROUSEL || mediaUrls.length > 1) {
      return new CarouselPublishStrategy();
    }
    
    if (mediaUrls.length > 0) {
      const mediaUrl = mediaUrls[0];
      const isVideo = MEDIA_EXTENSIONS.VIDEO.some(ext => mediaUrl.toLowerCase().endsWith(ext));
      if (isVideo) {
        return new VideoPublishStrategy();
      } else {
        return new PhotoPublishStrategy();
      }
    }

    throw new Error('Instagram requires at least one photo or video to publish a post.');
  }
}

module.exports = InstagramPublishStrategyFactory;
