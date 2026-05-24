const BaseSocialService = require('../base-social.service');
const youtubeAnalytics = require('./youtube-analytics.service');
const youtubeVideo = require('./youtube-video.service');
const youtubeComment = require('./youtube-comment.service');

class YouTubeService extends BaseSocialService {
  // --- Analytics & Channel ---
  async getChannelInfo(auth, startDate, endDate) {
    return youtubeAnalytics.getChannelInfo(auth, startDate, endDate);
  }

  async getAnalyticsReport(auth, startDate, endDate) {
    return youtubeAnalytics.getAnalyticsReport(auth, startDate, endDate);
  }

  async connectChannel(brandId, code, redirectUri) {
    return youtubeAnalytics.connectChannel(brandId, code, redirectUri);
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate) {
    return youtubeAnalytics.syncChannelMetrics(socialAccountId, startDate, endDate);
  }

  async addCompetitor(brandId, channelId) {
    return youtubeAnalytics.addCompetitor(brandId, channelId);
  }

  async getCompetitors(brandId) {
    return youtubeAnalytics.getCompetitors(brandId);
  }

  // --- Videos & Tracking ---
  async getPublishedVideos(brandId, pageToken = null, limit = 10) {
    return youtubeVideo.getPublishedVideos(brandId, pageToken, limit);
  }

  async trackVideo(brandId, videoUrl) {
    return youtubeVideo.trackVideo(brandId, videoUrl);
  }

  async getTrackedVideos(brandId) {
    return youtubeVideo.getTrackedVideos(brandId);
  }

  async getVideoDetails(brandId, videoId) {
    return youtubeVideo.getVideoDetails(brandId, videoId);
  }

  async searchChannel(brandId, query) {
    return youtubeVideo.searchChannel(brandId, query);
  }

  // --- Comments & Interactions ---
  async fetchChannelComments(brandId) {
    return youtubeComment.fetchChannelComments(brandId);
  }

  async replyToComment(brandId, parentCommentId, text) {
    return youtubeComment.replyToComment(brandId, parentCommentId, text);
  }
}

module.exports = new YouTubeService();
