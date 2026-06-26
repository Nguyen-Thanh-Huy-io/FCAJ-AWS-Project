const BaseValidator = require('./base.validator');

class YouTubeValidator extends BaseValidator {
  validate(postData, mediaInfo = {}) {
    const errors = [];
    
    // YouTube requires a title
    if (!postData.title || postData.title.trim() === 'New Post' || postData.title.trim() === 'Untitled') {
      errors.push('YouTube uploads require a valid title.');
    } else if (postData.title.length > 100) {
      errors.push('YouTube title must be 100 characters or less.');
    }

    errors.push(...this.validateCaption(postData.caption));
    errors.push(...this.validateMedia(mediaInfo));

    // YouTube specific: Must have a video
    const { hasMedia, isVideo } = mediaInfo;
    if (!hasMedia || !isVideo) {
      errors.push('YouTube uploads require a video file.');
    }

    return errors;
  }
}

module.exports = YouTubeValidator;
