import React, { createContext, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useAuthStore();
};
