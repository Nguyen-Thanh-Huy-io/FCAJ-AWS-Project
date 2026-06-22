import apiService from './api';

class SocialService {
  async getGoogleAuthUrl(brandId) {
    const response = await apiService.get(`/social/google/url?brandId=${brandId}`);
    return response.data;
  }

  async getMetrics(brandId, params = {}) {
    const queryParams = new URLSearchParams({ brandId, ...params }).toString();
    const response = await apiService.get(`/social/metrics?${queryParams}`);
    return response.data;
  }

  async addTrackedVideo(brandId, videoUrl) {
    const response = await apiService.post('/social/youtube/track', { brandId, videoUrl });
    return response.data;
  }

  async getTrackedVideos(brandId) {
    const response = await apiService.get(`/social/youtube/tracked-videos?brandId=${brandId}`);
    return response.data;
  }

  async getPublishedVideos(brandId, pageToken = null, limit = 10) {
    const url = `/social/youtube/published-videos?brandId=${brandId}${pageToken ? `&pageToken=${pageToken}` : ''}${limit ? `&limit=${limit}` : ''}`;
    const response = await apiService.get(url);
    return response.data;
  }

  async getVideoAnalytics(brandId, videoId, startDate, endDate) {
    let url = `/social/youtube/video-analytics?brandId=${brandId}&videoId=${videoId}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    const response = await apiService.get(url);
    return response.data;
  }

  async searchChannels(brandId, query) {
    const response = await apiService.get(`/social/youtube/search-channels?brandId=${brandId}&query=${query}`);
    return response.data;
  }

  async addCompetitor(brandId, channelId) {
    const response = await apiService.post('/social/youtube/competitors', { brandId, channelId });
    return response.data;
  }

  async getCompetitors(brandId) {
    const response = await apiService.get(`/social/youtube/competitors?brandId=${brandId}`);
    return response.data;
  }

  async deleteCompetitor(id) {
    const response = await apiService.delete(`/social/youtube/competitors/${id}`);
    return response.data;
  }

  async getGoogleDriveFiles(brandId) {
    const response = await apiService.get(`/social/google/drive/files?brandId=${brandId}`);
    return response.data;
  }

  async downloadGoogleDriveFile(brandId, fileId, fileName) {
    const response = await apiService.post('/social/google/drive/download', { brandId, fileId, fileName });
    return response.data;
  }

  async disconnectGoogleAccount(brandId) {
    const response = await apiService.post('/social/google/disconnect', { brandId });
    return response.data;
  }

  async getFacebookAuthUrl(brandId) {
    const response = await apiService.get(`/social/facebook/url?brandId=${brandId}`);
    return response.data;
  }

  async getFacebookPublishedPosts(brandId, pageToken = null, limit = 10) {
    const url = `/social/facebook/published-posts?brandId=${brandId}${pageToken ? `&pageToken=${pageToken}` : ''}${limit ? `&limit=${limit}` : ''}`;
    const response = await apiService.get(url);
    return response.data;
  }

  async disconnectFacebookAccount(brandId) {
    const response = await apiService.post('/social/facebook/disconnect', { brandId });
    return response.data;
  }

  async getTikTokAuthUrl(brandId) {
    const response = await apiService.get(`/social/tiktok/url?brandId=${brandId}`);
    return response.data;
  }

  async getTikTokPublishedVideos(brandId, pageToken = null, limit = 10) {
    const url = `/social/tiktok/published-videos?brandId=${brandId}${pageToken ? `&pageToken=${pageToken}` : ''}${limit ? `&limit=${limit}` : ''}`;
    const response = await apiService.get(url);
    return response.data;
  }

  async disconnectTikTokAccount(brandId) {
    const response = await apiService.post('/social/tiktok/disconnect', { brandId });
    return response.data;
  }

  async getInstagramAuthUrl(brandId) {
    const response = await apiService.get(`/social/instagram/url?brandId=${brandId}`);
    return response.data;
  }

  async getInstagramPublishedPosts(brandId, pageToken = null, limit = 10) {
    const url = `/social/instagram/published-posts?brandId=${brandId}${pageToken ? `&pageToken=${pageToken}` : ''}${limit ? `&limit=${limit}` : ''}`;
    const response = await apiService.get(url);
    return response.data;
  }

  async disconnectInstagramAccount(brandId) {
    const response = await apiService.post('/social/instagram/disconnect', { brandId });
    return response.data;
  }

  async getLinkedInAuthUrl(brandId) {
    const response = await apiService.get(`/social/linkedin/url?brandId=${brandId}`);
    return response.data;
  }

  async disconnectLinkedInAccount(brandId) {
    const response = await apiService.post('/social/linkedin/disconnect', { brandId });
    return response.data;
  }

  async connectTelegramAccount(brandId, botToken, chatId) {
    const response = await apiService.post('/social/telegram/connect', { brandId, botToken, chatId });
    return response.data;
  }

  async disconnectTelegramAccount(brandId) {
    const response = await apiService.post('/social/telegram/disconnect', { brandId });
    return response.data;
  }

  async reassignSocialAccount(platform, platformAccountId, targetBrandId) {
    const response = await apiService.post('/social/reassign', { platform, platformAccountId, targetBrandId });
    return response.data;
  }
}

const socialService = new SocialService();
export default socialService;
