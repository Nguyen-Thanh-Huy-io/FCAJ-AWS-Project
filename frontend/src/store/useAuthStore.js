import { create } from 'zustand';
import authService from '../services/auth.service';
import profileService from '../services/profile.service';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await profileService.getUserProfile();
      if (res && res.data) {
        set({ user: res.data, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      await get().checkAuth();
      toast.success('Đăng nhập thành công!');
      return data;
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại');
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const data = await authService.register(userData);
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.');
      return data;
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại');
      throw error;
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const data = await authService.verifyOTP({ email, otp });
      await get().checkAuth();
      toast.success('Xác thực thành công!');
      return data;
    } catch (error) {
      toast.error(error.message || 'Xác thực thất bại');
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
      toast.info('Đã đăng xuất');
    }
  }
}));
