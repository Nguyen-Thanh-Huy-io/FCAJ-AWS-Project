import React, { createContext, useEffect } from "react";
import { useBrandStore } from "../store/useBrandStore";
import { useAuthStore } from "../store/useAuthStore";

export const BrandContext = createContext(null);

export const BrandProvider = ({ children }) => {
  const fetchBrands = useBrandStore((state) => state.fetchBrands);
  const reset = useBrandStore((state) => state.reset);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBrands();
    } else {
      reset();
    }
  }, [isAuthenticated, fetchBrands, reset]);

  return (
    <BrandContext.Provider value={null}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  return useBrandStore();
};
