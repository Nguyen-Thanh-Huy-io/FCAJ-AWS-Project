class LinkedInPublishStrategy {
  /**
   * Thực hiện logic đăng bài LinkedIn
   * @param {string} memberId 
   * @param {string} accessToken 
   * @param {Object} postData 
   */
  async publish(memberId, accessToken, postData) {
    throw new Error('Method publish() must be implemented');
  }
}

module.exports = LinkedInPublishStrategy;
