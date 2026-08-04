const ReelPublishStrategy = require('./reel.strategy');
const StoryPublishStrategy = require('./story.strategy');
const VideoPublishStrategy = require('./video.strategy');
const PhotoPublishStrategy = require('./photo.strategy');
const AlbumPublishStrategy = require('./album.strategy');
const TextPublishStrategy = require('./text.strategy');
const { POST_TYPES, MEDIA_EXTENSIONS } = require('../../../../utils/constants');

class FacebookPublishStrategyFactory {
  static getStrategy(type, mediaUrl) {
    if (type === POST_TYPES.REEL) {
      return new ReelPublishStrategy();
    }
    if (type === POST_TYPES.STORY) {
      return new StoryPublishStrategy();
    }
    if (type === POST_TYPES.CAROUSEL) {
      return new AlbumPublishStrategy();
    }
    if (mediaUrl) {
      const isVideo = MEDIA_EXTENSIONS.VIDEO.some(ext => mediaUrl.toLowerCase().endsWith(ext));
      if (isVideo) {
        return new VideoPublishStrategy();
      } else {
        return new PhotoPublishStrategy();
      }
    }
    return new TextPublishStrategy();
  }
}

module.exports = FacebookPublishStrategyFactory;
