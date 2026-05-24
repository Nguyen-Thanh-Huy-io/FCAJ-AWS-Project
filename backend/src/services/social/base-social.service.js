/**
 * Lớp cơ sở trừu tượng (Abstract Base Class) định nghĩa giao diện chung cho các Social Platform Services.
 * Tuân thủ nguyên lý Liskov Substitution Principle (LSP) và Open/Closed Principle (OCP).
 */
class BaseSocialService {
  async getChannelInfo(auth, startDate, endDate) {
    throw new Error("Method 'getChannelInfo()' must be implemented.");
  }

  async getPublishedVideos(brandId, pageToken, limit) {
    throw new Error("Method 'getPublishedVideos()' must be implemented.");
  }

  async getAnalyticsReport(auth, startDate, endDate) {
    throw new Error("Method 'getAnalyticsReport()' must be implemented.");
  }

  async connectChannel(brandId, code, redirectUri) {
    throw new Error("Method 'connectChannel()' must be implemented.");
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate) {
    throw new Error("Method 'syncChannelMetrics()' must be implemented.");
  }

  async trackVideo(brandId, videoUrl) {
    throw new Error("Method 'trackVideo()' must be implemented.");
  }

  async getVideoDetails(brandId, videoId) {
    throw new Error("Method 'getVideoDetails()' must be implemented.");
  }

  async searchChannel(brandId, query) {
    throw new Error("Method 'searchChannel()' must be implemented.");
  }

  async addCompetitor(brandId, channelId) {
    throw new Error("Method 'addCompetitor()' must be implemented.");
  }

  async fetchChannelComments(brandId) {
    throw new Error("Method 'fetchChannelComments()' must be implemented.");
  }

  async replyToComment(brandId, parentCommentId, text) {
    throw new Error("Method 'replyToComment()' must be implemented.");
  }
}

module.exports = BaseSocialService;
