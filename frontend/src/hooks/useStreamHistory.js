import { useState, useEffect } from "react";
import { useFilters } from "./useFilters";
import { useDebounce } from "./useDebounce";
import apiService from "../services/api";
import { toast } from "sonner";

export function useStreamHistory() {
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    search: "",
    platform: "",
    status: "",
    view: "grid",
    page: "1",
    limit: "10"
  });

  const view = filters.view || "grid";
  const [selected, setSelected] = useState(null);
  const [detailTab, setDetailTab] = useState("Overview");
  const [streamData, setStreamData] = useState({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } });
  const [loading, setLoading] = useState(false);

  // Keep a local state for the search input
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

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

  // Fetch real data from Backend API
  useEffect(() => {
    const fetchStreams = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/livestreams/history?${searchParamsString}`);
        setStreamData(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to load stream history");
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [searchParamsString]);

  const filteredStreams = streamData.data || [];
  const totalEntries = streamData.meta?.total || 0;
  const totalPages = streamData.meta?.totalPages || 1;
  const currentPage = streamData.meta?.page || 1;

  const currentTotalViews = filteredStreams.reduce((acc, curr) => acc + curr.views, 0);
  const currentMaxPeak = filteredStreams.reduce((acc, curr) => Math.max(acc, curr.peak), 0);

  return {
    filters,
    updateFilters,
    clearFilters,
    view,
    selected,
    setSelected,
    detailTab,
    setDetailTab,
    streamData,
    loading,
    searchTerm,
    setSearchTerm,
    filteredStreams,
    totalEntries,
    totalPages,
    currentPage,
    currentTotalViews,
    currentMaxPeak
  };
}
