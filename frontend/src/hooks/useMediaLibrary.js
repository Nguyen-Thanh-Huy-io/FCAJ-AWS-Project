import { useState, useEffect } from "react";
import { useFilters } from "./useFilters";
import { useDebounce } from "./useDebounce";
import apiService from "../services/api";
import { toast } from "sonner";

export function useMediaLibrary() {
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    view: "grid",
    search: "",
    type: "All",
    page: "1",
    limit: "20"
  });

  const [activeBrand, setActiveBrand] = useState(null);
  const [mediaData, setMediaData] = useState({ data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [detail, setDetail] = useState(null);
  const [dragging, setDragging] = useState(false);

  const view = filters.view || "grid";
  const typeFilter = filters.type || "All";
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch Active Brand
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await apiService.get("/brands");
        if (res.data?.length > 0) setActiveBrand(res.data[0]);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };
    fetchBrands();
  }, []);

  // Sync debounced search to URL params
  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Sync input value back if URL search parameter is cleared externally
  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  // Fetch real data from Backend
  const fetchMedia = async () => {
    if (!activeBrand) return;
    setLoading(true);
    try {
      const response = await apiService.get(`/media?brandId=${activeBrand.id}&${searchParamsString}`);
      setMediaData(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to load media files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [searchParamsString, activeBrand]);

  const uploadFiles = async (files) => {
    if (!activeBrand) return;
    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} file(s)...`);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("brandId", activeBrand.id);

        await apiService.post("/media/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      toast.success("All files uploaded successfully", { id: toastId });
      fetchMedia(); // Refresh list
    } catch (error) {
      toast.error(error.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      setDragging(false);
    }
  };

  const deleteFile = async (id) => {
    if (!activeBrand) return;
    try {
      await apiService.delete(`/media/${id}`, { data: { brandId: activeBrand.id } });
      toast.success("File deleted successfully");
      if (detail?.id === id) setDetail(null);
      fetchMedia();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  const deleteSelected = async () => {
    if (!activeBrand || selected.size === 0) return;
    const toastId = toast.loading(`Deleting ${selected.size} file(s)...`);
    try {
      for (const id of selected) {
        await apiService.delete(`/media/${id}`, { data: { brandId: activeBrand.id } });
      }
      toast.success("Selected files deleted", { id: toastId });
      setSelected(new Set());
      fetchMedia();
    } catch (error) {
      toast.error("Failed to delete some files", { id: toastId });
    }
  };

  const filteredMedia = mediaData.data || [];
  const totalEntries = mediaData.meta?.total || 0;
  const totalPages = mediaData.meta?.totalPages || 1;
  const currentPage = mediaData.meta?.page || 1;

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  return {
    filters,
    updateFilters,
    clearFilters,
    view,
    typeFilter,
    searchTerm,
    setSearchTerm,
    mediaData,
    loading,
    uploading,
    selected,
    setSelected,
    toggleSelect,
    clearSelection,
    deleteSelected,
    deleteFile,
    uploadFiles,
    detail,
    setDetail,
    dragging,
    setDragging,
    filteredMedia,
    totalEntries,
    totalPages,
    currentPage
  };
}
