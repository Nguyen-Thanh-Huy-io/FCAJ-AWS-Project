import apiService from './api';

class AuthService {
  async login(payload) {
    const response = await apiService.post('/auth/login', payload);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async register(payload) {
    const response = await apiService.post('/auth/register', payload);
    return response.data;
  }

  async verifyOTP(payload) {
    const response = await apiService.post('/auth/verify-otp', payload);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async resendOTP(email) {
    const response = await apiService.post('/auth/resend-otp', { email });
    return response.data;
  }

  async forgotPassword(email) {
    const response = await apiService.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(payload) {
    const response = await apiService.post('/auth/reset-password', payload);
    return response.data;
  }

  async logout() {
    try {
      await apiService.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  }

  async refreshToken() {
    const response = await apiService.post('/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }
}

const authService = new AuthService();
export default authService;
