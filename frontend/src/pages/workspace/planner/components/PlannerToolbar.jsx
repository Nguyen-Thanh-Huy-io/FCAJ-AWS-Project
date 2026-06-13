import React, { useState } from 'react';
import { 
  Search, ChevronLeft, ChevronRight, Filter, 
  MoreVertical, Plus, Image, Calendar as CalendarIcon,
  ChevronDown, Youtube, ZoomIn, Layers, Upload, Download,
  Eye, Settings, Check, Instagram, PlayCircle
} from 'lucide-react';
import { DatePickerPopover } from './DatePickerPopover';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import postService from '../../../../services/post.service';
import { buildMediaUrl } from '@/utils/url';

export function PlannerToolbar({
  searchTerm,
  setSearchTerm,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  onTodayWeek,
  onCreatePostClick,
  showSidebar,
  onToggleSidebar,
  rowHeight,
  onRowHeightChange,
  visiblePlatforms = {},
  onVisiblePlatformsChange,
  postData = [],
  activeBrand,
  fetchPosts
}) {
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isPreviewFeedOpen, setIsPreviewFeedOpen] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleExportCSV = () => {
    if (!postData || postData.length === 0) {
      toast.error("No posts to export!");
      return;
    }
    const headers = ["Title", "Caption", "ScheduledAt", "Platforms", "Status"];
    const csvRows = [
      headers.join(","),
      ...postData.map(post => {
        const title = `"${(post.title || '').replace(/"/g, '""')}"`;
        const caption = `"${(post.caption || '').replace(/"/g, '""')}"`;
        const scheduledAt = post.scheduledAt || post.createdAt || '';
        const platforms = `"${(post.platforms || []).join(';')}"`;
        const status = post.status || '';
        return [title, caption, scheduledAt, platforms, status].join(",");
      })
    ];
    const csvContent = "\ufeff" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `publicast_planner_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
    setIsMoreMenuOpen(false);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!activeBrand) {
      toast.error("No active brand selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        if (lines.length <= 1) {
          toast.error("CSV file is empty or only contains headers.");
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
        const titleIdx = headers.findIndex(h => h === 'title');
        const captionIdx = headers.findIndex(h => h === 'caption');
        const scheduledAtIdx = headers.findIndex(h => h === 'scheduledat' || h === 'date');
        const platformsIdx = headers.findIndex(h => h === 'platforms' || h === 'platform');

        if (titleIdx === -1) {
          toast.error("CSV must contain a 'Title' column.");
          return;
        }

        toast.info("Importing posts from CSV...");
        let successCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVRow(lines[i]);
          if (row.length === 0) continue;

          const title = row[titleIdx] || 'Imported Post';
          const caption = captionIdx !== -1 ? row[captionIdx] : '';
          const scheduledAtStr = scheduledAtIdx !== -1 ? row[scheduledAtIdx] : '';
          const platformsStr = platformsIdx !== -1 ? row[platformsIdx] : 'YOUTUBE';

          const platforms = platformsStr.split(';').map(p => p.trim().toUpperCase());
          const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr) : new Date();

          await postService.createPost({
            brandId: activeBrand.id,
            title,
            caption,
            platforms,
            scheduledAt: scheduledAt.toISOString(),
            status: 'draft'
          });
          successCount++;
        }

        toast.success(`Successfully imported ${successCount} posts from CSV!`);
        if (fetchPosts) fetchPosts();
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse or import CSV file.");
      }
    };
    reader.readAsText(file);
    setIsMoreMenuOpen(false);
  };

  const parseCSVRow = (text) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  const togglePlatform = (platform) => {
    if (!onVisiblePlatformsChange) return;
    onVisiblePlatformsChange(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  // Format date range for the toolbar (e.g. May 24, 2026 - May 30, 2026)
  const formatDateRange = (centerDate) => {
    const current = new Date(centerDate);
    const day = current.getDay();
    const sunday = new Date(current.setDate(current.getDate() - day));
    const saturday = new Date(current.setDate(current.getDate() - day + 6));

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return `${sunday.toLocaleDateString('en-US', options)} - ${saturday.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm group">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
        <input 
          type="text" 
          placeholder="Search" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-700"
        />
      </div>

      {/* This Week Button */}
      <button 
        onClick={onTodayWeek}
        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-sm"
      >
        This week
      </button>

      {/* Date Navigation group */}
      <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-visible relative shadow-sm h-10">
        <button 
          onClick={onPrevWeek}
          className="px-3 h-full hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        
        <button 
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className="px-4 h-full flex items-center gap-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all border-l border-r border-gray-100 cursor-pointer"
        >
          <CalendarIcon size={14} className="text-gray-400" />
          {formatDateRange(selectedDate)}
        </button>

        <DatePickerPopover 
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />

        <button 
          onClick={onNextWeek}
          className="px-3 h-full hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Filter and More buttons */}
      <div className="flex gap-2 relative">
        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
          <Filter size={16} />
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer shadow-sm ${
              isMoreMenuOpen 
                ? "bg-[#0A0A0A] border-[#0A0A0A] text-white" 
                : "bg-white border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MoreVertical size={16} />
          </button>
          
          {isMoreMenuOpen && (
            <>
              {/* Overlay backdrop to close menu when click outside */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={() => setIsMoreMenuOpen(false)} 
              />
              
              {/* Floating Menu Container */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl py-2.5 z-50 text-left animate-in fade-in slide-in-from-top-3 duration-200 font-medium">
                
                {/* 1. Calendar Zoom */}
                <div className="relative group/sub">
                  <button className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between group cursor-pointer transition-colors border-none bg-transparent">
                    <div className="flex items-center gap-3">
                      <ZoomIn size={14} className="text-gray-400 group-hover:text-gray-700" />
                      <span>Calendar zoom</span>
                    </div>
                    <ChevronRight size={12} className="text-gray-400" />
                  </button>
                  {/* Submenu for Zoom */}
                  <div className="absolute left-full top-0 pl-1.5 hidden group-hover/sub:block animate-in fade-in slide-in-from-left-2 duration-150 z-50">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl py-2 w-48 text-left">
                      {[
                        { label: "Small (80px)", value: 80 },
                        { label: "Medium (100px)", value: 100 },
                        { label: "Large (120px)", value: 120 }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            if (onRowHeightChange) onRowHeightChange(opt.value);
                            toast.success(`Zoom level set to ${opt.value}px`);
                            setIsMoreMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer border-none bg-transparent"
                        >
                          <span>{opt.label}</span>
                          {rowHeight === opt.value && <Check size={12} className="text-green-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Calendar View */}
                <div className="relative group/sub">
                  <button className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between group cursor-pointer transition-colors border-none bg-transparent">
                    <div className="flex items-center gap-3">
                      <CalendarIcon size={14} className="text-gray-400 group-hover:text-gray-700" />
                      <span>Calendar view</span>
                    </div>
                    <ChevronRight size={12} className="text-gray-400" />
                  </button>
                  {/* Submenu for Views */}
                  <div className="absolute left-full top-0 pl-1.5 hidden group-hover/sub:block animate-in fade-in slide-in-from-left-2 duration-150 z-50">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl py-2 w-48 text-left">
                      {[
                        { label: "Weekly Grid", path: "/workspace/planner/calendar" },
                        { label: "List View", path: "/workspace/planner/list" },
                        { label: "Posts Library", path: "/workspace/planner/library" },
                        { label: "Autolists", path: "/workspace/planner/autolists" },
                        { label: "Deleted posts", path: "/workspace/planner/history" }
                      ].map(opt => (
                        <button
                          key={opt.label}
                          onClick={() => {
                            navigate(opt.path);
                            setIsMoreMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer border-none bg-transparent"
                        >
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Social Calendars */}
                <div className="relative group/sub">
                  <button className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between group cursor-pointer transition-colors border-none bg-transparent">
                    <div className="flex items-center gap-3">
                      <Layers size={14} className="text-gray-400 group-hover:text-gray-700" />
                      <span>Social calendars</span>
                    </div>
                    <ChevronRight size={12} className="text-gray-400" />
                  </button>
                  {/* Submenu for Social Channels toggling */}
                  <div className="absolute left-full top-0 pl-1.5 hidden group-hover/sub:block animate-in fade-in slide-in-from-left-2 duration-150 z-50">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl py-2 w-48 text-left">
                      {[
                        { label: "YouTube", key: "YOUTUBE" },
                        { label: "Facebook", key: "FACEBOOK" },
                        { label: "TikTok", key: "TIKTOK" },
                        { label: "Instagram", key: "INSTAGRAM" },
                        { label: "LinkedIn", key: "LINKEDIN" },
                        { label: "X / Twitter", key: "X" }
                      ].map(platform => (
                        <button
                          key={platform.key}
                          onClick={() => {
                            togglePlatform(platform.key);
                            if (platform.key === "X") {
                              togglePlatform("TWITTER");
                            }
                          }}
                          className="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer border-none bg-transparent"
                        >
                          <span>{platform.label}</span>
                          {visiblePlatforms[platform.key] !== false && <Check size={12} className="text-green-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="my-1 border-t border-gray-100" />

                {/* 4. Import CSV */}
                <button 
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 group cursor-pointer transition-colors border-none bg-transparent"
                >
                  <Upload size={14} className="text-gray-400 group-hover:text-gray-700" />
                  <span>Import CSV</span>
                </button>

                {/* 5. Export CSV */}
                <button 
                  onClick={handleExportCSV}
                  className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 group cursor-pointer transition-colors border-none bg-transparent"
                >
                  <Download size={14} className="text-gray-400 group-hover:text-gray-700" />
                  <span>Export CSV</span>
                </button>

                <div className="my-1 border-t border-gray-100" />

                {/* 6. Preview feed */}
                <button 
                  onClick={() => {
                    setIsPreviewFeedOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 group cursor-pointer transition-colors border-none bg-transparent"
                >
                  <Instagram size={14} className="text-gray-400 group-hover:text-gray-700" />
                  <span>Preview feed</span>
                </button>

                {/* 7. Notifications */}
                <button 
                  onClick={() => {
                    toast.success("Notification settings updated.");
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 group cursor-pointer transition-colors border-none bg-transparent"
                >
                  <Settings size={14} className="text-gray-400 group-hover:text-gray-700" />
                  <span>Notifications</span>
                </button>

              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1" />

      {/* Best Times and Action buttons */}
      <div className="flex items-center gap-2">
        {/* Best Times Dropdown */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
          <div className="w-4 h-4 bg-[#FF0000] rounded-sm flex items-center justify-center text-white shrink-0">
            <Youtube size={10} className="fill-white text-[#FF0000]" />
          </div>
          <span>Best times</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {/* Media/Photo Button */}
        <button 
          onClick={onToggleSidebar}
          className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer shadow-sm ${
            showSidebar 
              ? "bg-[#0A0A0A] border-[#0A0A0A] text-white hover:bg-black" 
              : "bg-[#F3EFE9] border-gray-200/50 text-gray-700 hover:bg-[#EAE5DF]"
          }`}
        >
          <Image size={18} />
        </button>

        {/* Create Post Button */}
        <button 
          onClick={onCreatePostClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white rounded-full text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer"
        >
          <Plus size={16} />
          <span>Create post</span>
        </button>
      </div>

      {/* Hidden File Input for CSV Imports */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportCSV} 
        accept=".csv" 
        style={{ display: "none" }} 
      />

      {/* Feed Preview Dialog */}
      {isPreviewFeedOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col relative h-[650px] border border-gray-100">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-xs font-black text-gray-800 uppercase tracking-wider">Feed Preview</span>
              <button 
                onClick={() => setIsPreviewFeedOpen(false)}
                className="text-xs font-bold text-gray-400 hover:text-black hover:bg-gray-100 px-3 py-1 rounded-xl transition-all cursor-pointer border-none bg-transparent"
              >
                Close
              </button>
            </div>

            {/* Instagram Phone mock container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white flex flex-col">
              {/* Instagram header profile info mock */}
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-fuchsia-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-white p-[2px]">
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">
                      PC
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-[11px] font-black text-[#0A0A0A] leading-tight">publicast_creator</h5>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Feed Mockup</p>
                </div>
              </div>

              {/* Feed Grid (3 columns) */}
              <div className="grid grid-cols-3 gap-1">
                {postData.length === 0 ? (
                  <div className="col-span-3 py-12 text-center flex flex-col items-center justify-center text-gray-300">
                    <Instagram size={36} className="mb-2 stroke-[1.5]" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No scheduled posts yet</p>
                  </div>
                ) : (
                  postData.map(post => {
                    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
                    const thumbUrl = buildMediaUrl(post.thumbnail);
                    return (
                      <div 
                        key={post.id} 
                        className="aspect-square bg-gray-50 border border-gray-100/50 relative overflow-hidden group cursor-pointer rounded-md"
                        title={post.caption || post.title}
                      >
                        {thumbUrl ? (
                          <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[9px] text-gray-400 font-medium">
                            No Media
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye size={16} className="text-white animate-pulse" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
