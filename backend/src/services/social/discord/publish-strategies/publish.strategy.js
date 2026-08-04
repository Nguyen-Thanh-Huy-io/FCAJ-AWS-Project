class DiscordPublishStrategy {
  /**
   * Thực hiện logic đăng bài lên Discord qua Webhook
   * @param {string} webhookUrl 
   * @param {Object} postData 
   */
  async publish(webhookUrl, postData) {
    throw new Error('Method publish() must be implemented');
  }
}

module.exports = DiscordPublishStrategy;
