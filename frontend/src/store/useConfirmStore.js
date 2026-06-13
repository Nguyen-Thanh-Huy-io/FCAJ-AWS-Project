import { create } from 'zustand';

/**
 * useConfirmStore
 * Quản lý trạng thái và luồng dữ liệu bất đồng bộ (Promise) cho Confirm Dialog toàn cục.
 * Áp dụng Facade Pattern để cô lập logic điều khiển.
 */
export const useConfirmStore = create((set, get) => ({
  isOpen: false,
  title: '',
  description: '',
  confirmText: 'Xác nhận',
  cancelText: 'Hủy',
  variant: 'destructive',
  resolve: null,

  showConfirm: (options) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        title: options.title || 'Xác nhận',
        description: options.description || '',
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy',
        variant: options.variant || 'destructive',
        resolve,
      });
    });
  },

  onConfirm: () => {
    const { resolve } = get();
    if (resolve) resolve(true);
    set({ isOpen: false, resolve: null });
  },

  onCancel: () => {
    const { resolve } = get();
    if (resolve) resolve(false);
    set({ isOpen: false, resolve: null });
  }
}));
