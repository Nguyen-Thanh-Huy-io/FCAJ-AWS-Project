const BaseSocialService = require('../base-social.service');
const facebookAnalytics = require('./facebook-analytics.service');
const facebookPost = require('./facebook-post.service');
const facebookComment = require('./facebook-comment.service');

class FacebookService extends BaseSocialService {
  // --- Analytics & Page ---
  async getChannelInfo(auth, startDate, endDate) {
    return facebookAnalytics.getChannelInfo(auth, startDate, endDate);
  }

  async getAnalyticsReport(auth, startDate, endDate) {
    // In Facebook, auth can be the pageId and access token inside auth object
    return facebookAnalytics.getAnalyticsReport(auth.pageId, auth.pageAccessToken, startDate, endDate, auth.followersCount || 0);
  }

  async connectChannel(brandId, code, redirectUri) {
    return facebookAnalytics.connectChannel(brandId, code, redirectUri);
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate) {
    return facebookAnalytics.syncChannelMetrics(socialAccountId, startDate, endDate);
  }

  // --- Posts & Feed ---
  async getPublishedVideos(brandId, pageToken = null, limit = 10) {
    // For Facebook, getPublishedVideos behaves as getPublishedPosts
    return facebookPost.getPublishedPosts(brandId, limit);
  }

  async publishPost(brandId, postData) {
    return facebookPost.publishPost(brandId, postData);
  }

  // --- Unsupported or Stub methods for LSP Compliance ---
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
    return facebookComment.fetchChannelComments(brandId);
  }

  async replyToComment(brandId, parentCommentId, text) {
    return facebookComment.replyToComment(brandId, parentCommentId, text);
  }
}

module.exports = new FacebookService();
