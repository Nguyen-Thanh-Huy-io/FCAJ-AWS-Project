class InstagramPublishStrategy {
  async publish(igAccountId, accessToken, postData) {
    throw new Error("Method 'publish()' must be implemented.");
  }

  /**
   * Helper method to poll for container status until it is ready (FINISHED)
   */
  async pollUntilReady(instagramGateway, containerId, accessToken, maxAttempts = 10, intervalMs = 2000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const statusData = await instagramGateway.pollContainerStatus(containerId, accessToken);
      const code = statusData.status_code;
      if (code === 'FINISHED') {
        return;
      }
      if (code === 'ERROR') {
        throw new Error(statusData.error_message || 'Instagram video container processing failed');
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    throw new Error('Timeout waiting for Instagram media container to be ready');
  }
}

module.exports = InstagramPublishStrategy;
