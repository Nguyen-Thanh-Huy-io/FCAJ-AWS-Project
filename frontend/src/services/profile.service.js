import apiService from './api';

class ProfileService {
  async getUserProfile() {
    const response = await apiService.get('/user/profile');
    return response.data;
  }

  async getAdminProfile() {
    const response = await apiService.get('/admin/profile');
    return response.data;
  }

  async editProfile(payload) {
    const response = await apiService.put('/profile/edit', payload);
    return response.data;
  }
}

const profileService = new ProfileService();
export default profileService;
