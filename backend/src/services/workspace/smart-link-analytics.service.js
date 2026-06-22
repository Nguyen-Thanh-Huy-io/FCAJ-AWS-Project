const smartLinkRepository = require('../../repositories/workspace/smart-link.repository');
const linkItemRepository = require('../../repositories/workspace/link-item.repository');

class SmartLinkAnalyticsService {
  /**
   * Track page view asynchronously.
   * @param {string} smartLinkId - The SmartLink ID.
   * @param {string} ip - Visitor IP address.
   * @param {string} userAgent - Visitor User-Agent header.
   */
  async trackPageView(smartLinkId, ip, userAgent) {
    try {
      // For simplicity, we check if this is a unique visitor based on simple logic (e.g. session-based or just simulating unique visitors)
      // Or in a real app, track unique IP hashes in redis or DB.
      // Here we just increment uniqueVisitors based on random probability or simulation, or mark true for now
      const isUnique = true; 
      
      await smartLinkRepository.incrementPageView(smartLinkId, isUnique);
    } catch (err) {
      console.error('Error tracking page view:', err.message);
    }
  }

  /**
   * Track link click.
   * @param {string} linkItemId - The LinkItem ID.
   * @param {string} ip - Visitor IP.
   * @param {string} userAgent - Visitor User-Agent.
   */
  async trackLinkClick(linkItemId, ip, userAgent) {
    if (!linkItemId) {
      throw new Error('Link Item ID is required');
    }
    return await linkItemRepository.incrementClicks(linkItemId);
  }
}

module.exports = new SmartLinkAnalyticsService();
