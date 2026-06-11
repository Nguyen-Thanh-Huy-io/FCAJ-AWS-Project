import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import brandService from "../services/brand.service";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const BrandContext = createContext(null);

export const BrandProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [brands, setBrands] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBrands = useCallback(async (selectId = null) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await brandService.getBrands();
      const brandList = res.data || [];
      setBrands(brandList);

      if (brandList.length > 0) {
        // Thứ tự ưu tiên chọn active brand:
        // 1. selectId truyền vào (khi vừa tạo brand mới)
        // 2. brandId lưu trong localStorage
        // 3. Brand đầu tiên trong danh sách
        const savedBrandId = selectId || localStorage.getItem("activeBrandId");
        const matchedBrand = brandList.find(b => b.id === savedBrandId);
        
        const currentActive = matchedBrand || brandList[0];
        setActiveBrand(currentActive);
        localStorage.setItem("activeBrandId", currentActive.id);
      } else {
        setActiveBrand(null);
        localStorage.removeItem("activeBrandId");
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      toast.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBrands();
    } else {
      setBrands([]);
      setActiveBrand(null);
      localStorage.removeItem("activeBrandId");
    }
  }, [isAuthenticated, fetchBrands]);

  const selectBrand = useCallback((brandId) => {
    const matched = brands.find(b => b.id === brandId);
    if (matched) {
      setActiveBrand(matched);
      localStorage.setItem("activeBrandId", brandId);
      toast.success(`Đã chuyển sang thương hiệu: ${matched.name}`);
    }
  }, [brands]);

  const createBrand = async (brandData) => {
    try {
      const res = await brandService.createBrand(brandData);
      toast.success("Tạo thương hiệu mới thành công!");
      // Nạp lại danh sách brands và chọn ngay brand mới tạo
      if (res.data && res.data.id) {
        await fetchBrands(res.data.id);
      } else {
        await fetchBrands();
      }
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Tạo thương hiệu thất bại";
      toast.error(msg);
      throw error;
    }
  };

  const updateBrand = async (id, brandData) => {
    try {
      const res = await brandService.updateBrand(id, brandData);
      toast.success("Cập nhật thông tin thương hiệu thành công!");
      // Tải lại danh sách brand giữ nguyên brand hiện tại
      await fetchBrands(activeBrand?.id);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Cập nhật thương hiệu thất bại";
      toast.error(msg);
      throw error;
    }
  };

  const deleteBrand = async (id) => {
    try {
      await brandService.deleteBrand(id);
      toast.success("Xóa thương hiệu thành công!");
      
      // Nếu xóa đúng active brand, reset về mặc định
      const nextActiveId = activeBrand?.id === id ? null : activeBrand?.id;
      localStorage.removeItem("activeBrandId");
      await fetchBrands(nextActiveId);
    } catch (error) {
      const msg = error.response?.data?.message || "Xóa thương hiệu thất bại";
      toast.error(msg);
      throw error;
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brands,
        activeBrand,
        loading,
        selectBrand,
        createBrand,
        updateBrand,
        deleteBrand,
        refreshBrands: fetchBrands
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};
