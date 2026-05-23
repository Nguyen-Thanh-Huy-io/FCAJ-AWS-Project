import apiService from './api';

class SocialService {
  async getGoogleAuthUrl(brandId) {
    const response = await apiService.get(`/social/google/url?brandId=${brandId}`);
    return response.data;
  }

  async getMetrics(brandId) {
    const response = await apiService.get(`/social/metrics?brandId=${brandId}`);
    return response.data;
  }
}

const socialService = new SocialService();
export default socialService;
