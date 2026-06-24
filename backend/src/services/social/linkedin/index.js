const BaseSocialService = require('../base-social.service');
const linkedinAnalytics = require('./linkedin-analytics.service');
const linkedinPost = require('./linkedin-post.service');

class LinkedInService extends BaseSocialService {
  /**
   * Kết nối kênh LinkedIn
   */
  async connectChannel(brandId, code, redirectUri) {
    return linkedinAnalytics.connectChannel(brandId, code, redirectUri);
  }

  /**
   * Đăng bài viết lên LinkedIn
   */
  async publishPost(brandId, postData) {
    return linkedinPost.publishPost(brandId, postData);
  }

  async getChannelInfo(auth, startDate, endDate) {
    return linkedinAnalytics.getChannelInfo(auth, startDate, endDate);
  }

  async getAnalyticsReport(auth, startDate, endDate, currentFollowers) {
    return linkedinAnalytics.getAnalyticsReport(auth, startDate, endDate, currentFollowers);
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate) {
    return linkedinAnalytics.syncChannelMetrics(socialAccountId, startDate, endDate);
  }

  // --- Các hàm Stub/Bù đắp để tuân thủ LSP (Liskov Substitution Principle) ---
  async getPublishedVideos(brandId, pageToken = null, limit = 10) {
    return { data: [], nextPageToken: null, prevPageToken: null };
  }

  async trackVideo(brandId, videoUrl) {
    return null;
  }

  async getVideoDetails(brandId, videoId) {
    return null;
  }

  async searchChannel(brandId, query) {
    return [];
  }

  async addCompetitor(brandId, channelId) {
    return null;
  }

  async fetchChannelComments(brandId) {
    return [];
  }

  async replyToComment(brandId, parentCommentId, text) {
    return null;
  }
}

module.exports = new LinkedInService();
