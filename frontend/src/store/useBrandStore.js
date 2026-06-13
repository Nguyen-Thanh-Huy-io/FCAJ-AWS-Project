import { create } from 'zustand';
import brandService from '../services/brand.service';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useBrandStore = create((set, get) => ({
  brands: [],
  activeBrand: null,
  loading: false,

  fetchBrands: async (selectId = null) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) return;

    set({ loading: true });
    try {
      const res = await brandService.getBrands();
      const brandList = res.data || [];
      set({ brands: brandList });

      if (brandList.length > 0) {
        const savedBrandId = selectId || localStorage.getItem(STORAGE_KEYS.ACTIVE_BRAND_ID);
        const matchedBrand = brandList.find(b => b.id === savedBrandId);
        
        const currentActive = matchedBrand || brandList[0];
        set({ activeBrand: currentActive });
        localStorage.setItem(STORAGE_KEYS.ACTIVE_BRAND_ID, currentActive.id);
      } else {
        set({ activeBrand: null });
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_BRAND_ID);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      toast.error("Không thể tải danh sách thương hiệu");
    } finally {
      set({ loading: false });
    }
  },

  selectBrand: (brandId) => {
    const matched = get().brands.find(b => b.id === brandId);
    if (matched) {
      set({ activeBrand: matched });
      localStorage.setItem(STORAGE_KEYS.ACTIVE_BRAND_ID, brandId);
      toast.success(`Đã chuyển sang thương hiệu: ${matched.name}`);
    }
  },

  createBrand: async (brandData) => {
    try {
      const res = await brandService.createBrand(brandData);
      toast.success("Tạo thương hiệu mới thành công!");
      if (res.data && res.data.id) {
        await get().fetchBrands(res.data.id);
      } else {
        await get().fetchBrands();
      }
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Tạo thương hiệu thất bại";
      toast.error(msg);
      throw error;
    }
  },

  updateBrand: async (id, brandData) => {
    try {
      const res = await brandService.updateBrand(id, brandData);
      toast.success("Cập nhật thông tin thương hiệu thành công!");
      await get().fetchBrands(get().activeBrand?.id);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Cập nhật thương hiệu thất bại";
      toast.error(msg);
      throw error;
    }
  },

  deleteBrand: async (id) => {
    try {
      await brandService.deleteBrand(id);
      toast.success("Xóa thương hiệu thành công!");
      
      const nextActiveId = get().activeBrand?.id === id ? null : get().activeBrand?.id;
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_BRAND_ID);
      await get().fetchBrands(nextActiveId);
    } catch (error) {
      const msg = error.response?.data?.message || "Xóa thương hiệu thất bại";
      toast.error(msg);
      throw error;
    }
  },

  refreshBrands: async (selectId = null) => {
    await get().fetchBrands(selectId);
  },

  reset: () => {
    set({ brands: [], activeBrand: null });
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_BRAND_ID);
  }
}));
