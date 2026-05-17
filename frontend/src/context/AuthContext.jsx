import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import profileService from '../services/profile.service';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await profileService.getUserProfile();
      if (res && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      // Don't toast error here as it runs on every page load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      // After successful login, fetch the full user profile
      await checkAuth();
      toast.success('Đăng nhập thành công!');
      return data;
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.');
      return data;
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const data = await authService.verifyOTP({ email, otp });
      // After successful verification, cookies are set, fetch profile
      await checkAuth();
      toast.success('Xác thực thành công!');
      return data;
    } catch (error) {
      toast.error(error.message || 'Xác thực thất bại');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      toast.info('Đã đăng xuất');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyOTP,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
