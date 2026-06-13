import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { buildMediaUrl } from '@/utils/url';

const PLATFORM_COLORS = {
  YOUTUBE: "#FF0000",
  FACEBOOK: "#1877F2",
  TIKTOK: "#010101",
  INSTAGRAM: "#E1306C",
  TWITCH: "#9146FF",
  LINKEDIN: "#0A66C2",
  X: "#000000",
  TWITTER: "#000000"
};

const STATUS_COLORS = {
  published: "bg-green-50 text-green-700 border-green-100",
  scheduled: "bg-blue-50 text-blue-700 border-blue-100",
  draft: "bg-gray-50 text-gray-500 border-gray-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
  pending_approval: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  failed: "bg-rose-50 text-rose-700 border-rose-100"
};

const renderPlatformIcon = (platformName, sizeClass = "w-3 h-3") => {
  const p = platformName?.toUpperCase();
  if (p === 'FACEBOOK') {
    return (
      <svg viewBox="0 0 24 24" className={`${sizeClass} fill-current text-[#1877F2] shrink-0`}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    );
  }
  if (p === 'TIKTOK') {
    return (
      <svg viewBox="0 0 24 24" className={`${sizeClass} fill-current text-[#010101] shrink-0`}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.2 2.27 2.04 3.75 2.4v3.9c-1.57-.02-3.11-.45-4.49-1.25-.43-.25-.83-.55-1.21-.88v6.79c.02 2.25-.8 4.43-2.31 6.09-1.5 1.66-3.64 2.64-5.91 2.73-2.43.08-4.83-.8-6.55-2.52-1.72-1.72-2.61-4.12-2.49-6.56.12-2.27 1.13-4.39 2.82-5.88 1.69-1.49 3.91-2.24 6.17-2.09l-.01 3.97c-1.25-.09-2.5.3-3.46 1.1-.96.8-1.51 1.98-1.51 3.23.01 1.27.59 2.47 1.58 3.24.99.78 2.27 1.12 3.51.93 1.2-.18 2.24-1.02 2.74-2.14.28-.63.41-1.32.39-2.01V.02z"/>
      </svg>
    );
  }
  if (p === 'INSTAGRAM') {
    return (
      <svg viewBox="0 0 24 24" className={`${sizeClass} stroke-current text-[#E1306C] fill-none shrink-0`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  }
  if (p === 'LINKEDIN') {
    return (
      <svg viewBox="0 0 24 24" className={`${sizeClass} fill-current text-[#0A66C2] shrink-0`}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
      </svg>
    );
  }
  if (p === 'X' || p === 'TWITTER') {
    return (
      <svg viewBox="0 0 24 24" className={`${sizeClass} fill-current text-[#000000] shrink-0`}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (p === 'TWITCH') {
    return (
      <svg viewBox="0 0 24 24" className={`${sizeClass} fill-current text-[#9146FF] shrink-0`}>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={`${sizeClass} fill-current text-[#FF0000] shrink-0`}>
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
};

export function MonthlyGrid({
  selectedDate,
  postData = [],
  onCellClick,
  onPostClick,
  visiblePlatforms = {}
}) {
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Group posts by local date string 'yyyy-MM-dd'
  const postsByDate = useMemo(() => {
    const map = {};
    postData.forEach(post => {
      // Filter out posts that do not match the visible platforms
      const matchesPlatform = !post.platforms || post.platforms.length === 0 || post.platforms.some(p => visiblePlatforms[p.toUpperCase()] !== false);
      if (!matchesPlatform) return;

      const date = new Date(post.scheduledAt || post.createdAt);
      const dateStr = format(date, 'yyyy-MM-dd');
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(post);
    });
    return map;
  }, [postData, visiblePlatforms]);

  // Generate 42 days grid for Month view
  const daysInMonthGrid = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    
    // Set to the first Sunday of the grid
    const start = new Date(firstDay);
    start.setDate(start.getDate() - start.getDay());
    
    const grid = [];
    const temp = new Date(start);
    
    for (let i = 0; i < 42; i++) {
      const d = new Date(temp);
      const isCurrentMonth = d.getMonth() === month;
      const isToday = d.getDate() === new Date().getDate() &&
                      d.getMonth() === new Date().getMonth() &&
                      d.getFullYear() === new Date().getFullYear();
      const dateStr = format(d, 'yyyy-MM-dd');
      
      grid.push({
        date: d.getDate(),
        fullStr: dateStr,
        isCurrentMonth,
        isToday,
        raw: d
      });
      temp.setDate(temp.getDate() + 1);
    }
    return grid;
  }, [selectedDate]);

  const handleDateClick = (dateRaw) => {
    if (onCellClick) {
      const newDate = new Date(dateRaw);
      newDate.setHours(9, 0, 0, 0); // Default to 9:00 AM
      onCellClick(newDate, 9);
    }
  };

  const handlePostClick = (e, post) => {
    e.stopPropagation();
    if (onPostClick) {
      onPostClick(post);
    }
  };

  return (
    <div className="w-full h-full bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/20 py-3 text-center no-print">
        {weekdayNames.map((dayName, idx) => (
          <div key={idx} className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
            {dayName.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* 42 Days Grid */}
      <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-gray-100 bg-gray-50/10 overflow-y-auto">
        {daysInMonthGrid.map((day, idx) => {
          const cellPosts = postsByDate[day.fullStr] || [];
          
          return (
            <div
              key={idx}
              onClick={() => handleDateClick(day.raw)}
              className={`min-h-[115px] p-2 flex flex-col gap-1 transition-all hover:bg-gray-50/50 cursor-pointer relative ${
                day.isCurrentMonth ? "bg-white text-gray-800" : "bg-gray-50/30 text-gray-300"
              }`}
            >
              {/* Day number */}
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full ${
                  day.isToday 
                    ? "bg-[#10B981] text-white shadow-sm" 
                    : day.isCurrentMonth ? "text-gray-700" : "text-gray-300"
                }`}>
                  {day.date}
                </span>
                {cellPosts.length > 0 && (
                  <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full shrink-0">
                    {cellPosts.length} posts
                  </span>
                )}
              </div>

              {/* Day Posts List */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 max-h-[85px] scrollbar-none">
                {cellPosts.map(post => (
                  <div
                    key={post.id}
                    onClick={(e) => handlePostClick(e, post)}
                    className={`flex items-center gap-1.5 px-2 py-1 border rounded-lg text-[10px] font-bold truncate transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm ${
                      STATUS_COLORS[post.status?.toLowerCase()] || 'bg-white border-gray-100 text-gray-700'
                    }`}
                    title={`${post.title || post.caption || "Untitled"} (${format(new Date(post.scheduledAt || post.createdAt), 'h:mma')})`}
                  >
                    {/* Platform icon */}
                    <div className="flex gap-0.5 shrink-0">
                      {post.platforms?.map(p => (
                        <span key={p} className="shrink-0">
                          {renderPlatformIcon(p, "w-2.5 h-2.5")}
                        </span>
                      ))}
                    </div>
                    
                    <span className="truncate flex-1 font-medium">{post.title || post.caption || "Untitled"}</span>
                    <span className="text-[8px] opacity-75 font-black uppercase font-mono tracking-tight shrink-0">
                      {format(new Date(post.scheduledAt || post.createdAt), 'h:mma')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
