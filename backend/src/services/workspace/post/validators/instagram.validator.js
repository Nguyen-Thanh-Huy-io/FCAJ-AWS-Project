const BaseValidator = require('./base.validator');

class InstagramValidator extends BaseValidator {
  validate(postData, mediaInfo = {}) {
    const errors = [];
    errors.push(...this.validateCaption(postData.caption));
    errors.push(...this.validateMedia(mediaInfo));

    // Instagram specific: Reel/Story must have video/image
    const { hasMedia } = mediaInfo;
    if (['REEL', 'STORY'].includes(this.limitConfig.subType) && !hasMedia) {
      errors.push(`Instagram ${this.limitConfig.subType.toLowerCase()} requires a media file.`);
    }

    return errors;
  }
}

module.exports = InstagramValidator;
