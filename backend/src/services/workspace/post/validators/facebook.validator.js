const BaseValidator = require('./base.validator');

class FacebookValidator extends BaseValidator {
  validate(postData, mediaInfo = {}) {
    const errors = [];
    errors.push(...this.validateCaption(postData.caption));
    errors.push(...this.validateMedia(mediaInfo));
    return errors;
  }
}

module.exports = FacebookValidator;
