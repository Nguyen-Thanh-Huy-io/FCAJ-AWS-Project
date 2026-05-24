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

  const view = filters.view || "grid";
  const typeFilter = filters.type || "All";
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [mediaData, setMediaData] = useState({ data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [detail, setDetail] = useState(null);
  const [dragging, setDragging] = useState(false);

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
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/media?${searchParamsString}`);
        setMediaData(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to load media files");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [searchParamsString]);

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
    selected,
    setSelected,
    toggleSelect,
    clearSelection,
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
