import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { usePostCreator } from "../../../context/PostCreatorContext";
import apiService from "../../../services/api";
import { useBrand } from "../../../context/BrandContext";
import { useGoogleDriveImport } from "../../../hooks/useGoogleDriveImport";
import { toast } from "sonner";
import postService from "../../../services/post.service";

// Import SOLID Subcomponents
import { UpgradeBanner } from "./components/UpgradeBanner";
import { PlannerToolbar } from "./components/PlannerToolbar";
import { WeeklyGrid } from "./components/WeeklyGrid";
import { SidebarIntegrations } from "./components/SidebarIntegrations";
import { ImportOverlay } from "./components/ImportOverlay";

export function WeeklyCalendarView() {
  const [searchTerm, setSearchTerm] = useState("");
  const { openPostCreator, isOpen } = usePostCreator();
  const { activeBrand } = useBrand();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [rowHeight, setRowHeight] = useState(100);
  const [visiblePlatforms, setVisiblePlatforms] = useState({
    YOUTUBE: true,
    FACEBOOK: true,
    TIKTOK: true,
    INSTAGRAM: true,
    LINKEDIN: true,
    X: true,
    TWITTER: true
  });
  
  // Center date of current selected week (Defaults to current date)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Custom Hook for Drive Imports (SOLID/SRP)
  const { isImporting, importFromDrive } = useGoogleDriveImport(activeBrand);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Posts based on selectedDate
  const fetchPosts = async () => {
    if (!activeBrand) return;
    setLoading(true);

    // Calculate start & end of selected date week (Sunday to Saturday)
    const current = new Date(selectedDate);
    const day = current.getDay();
    const sunday = new Date(current.setDate(current.getDate() - day));
    const saturday = new Date(current.setDate(current.getDate() - day + 6));

    const toLocalDateStr = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDateStr = toLocalDateStr(sunday);
    const endDateStr = toLocalDateStr(saturday);

    try {
      const res = await apiService.get(`/posts?brandId=${activeBrand.id}&startDate=${startDateStr}&endDate=${endDateStr}&limit=100`);
      setPostData(res.data.data || []);
    } catch (e) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeBrand, selectedDate, isOpen]);

  // Group and search-filter posts dynamically
  const groupedPosts = useMemo(() => {
    const grid = {};
    const filtered = postData.filter(post => {
      const matchesSearch = !searchTerm || post.title?.toLowerCase().includes(searchTerm.toLowerCase());
      // Check if at least one platform on the post is visible
      const matchesPlatform = post.platforms?.some(p => visiblePlatforms[p.toUpperCase()] !== false) ?? true;
      return matchesSearch && matchesPlatform;
    });
    filtered.forEach(post => {
      const date = new Date(post.scheduledAt || post.createdAt);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const hour = date.getHours();
      const key = `${dateStr}-${hour}`;
      if (!grid[key]) grid[key] = [];
      grid[key].push(post);
    });
    return grid;
  }, [postData, searchTerm, visiblePlatforms]);

  // Date handlers
  const handlePrevWeek = () => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 7);
      return d;
    });
  };

  const handleTodayWeek = () => {
    setSelectedDate(new Date());
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleCellClick = (date, hour) => {
    // Open post creator at specific date and hour
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hour, 0, 0, 0);
    openPostCreator({ defaultScheduledAt: scheduledDate });
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* 1. Plan Upgrade Banner */}
      <UpgradeBanner postedCount={postData.length} limit={20} />

      {/* 2. Navigation & Actions Toolbar */}
      <PlannerToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onTodayWeek={handleTodayWeek}
        onCreatePostClick={openPostCreator}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar(prev => !prev)}
        rowHeight={rowHeight}
        onRowHeightChange={setRowHeight}
        visiblePlatforms={visiblePlatforms}
        onVisiblePlatformsChange={setVisiblePlatforms}
        postData={postData}
        activeBrand={activeBrand}
        fetchPosts={fetchPosts}
      />

      {loading && (
        <div className="flex items-center justify-center py-4 no-print">
          <Loader2 className="animate-spin text-[#0A0A0A] mr-2" size={18} />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading calendar posts...</span>
        </div>
      )}

      {/* 3. Main Grid layout: Lịch bên trái, Tích hợp bên phải */}
      <div className="h-[750px] flex flex-col lg:flex-row gap-6 items-stretch mb-6">
        {/* Lưới lịch tuần */}
        <div className="flex-1 w-full h-full">
          <WeeklyGrid
            selectedDate={selectedDate}
            groupedPosts={groupedPosts}
            currentTime={currentTime}
            onCellClick={handleCellClick}
            onPostClick={(post) => openPostCreator({ post })}
            onCellDrop={importFromDrive}
            rowHeight={rowHeight}
          />
        </div>

        {/* Cột tích hợp bên phải */}
        {showSidebar && (
          <div className="w-full lg:w-[280px] shrink-0 h-full animate-in slide-in-from-right duration-250">
            <SidebarIntegrations activeBrand={activeBrand} />
          </div>
        )}
      </div>

      {/* Google Drive Import Backdrop Overlay */}
      <ImportOverlay isOpen={isImporting} />
    </div>
  );
}
