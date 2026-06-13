import React, { useEffect, useRef, useMemo } from 'react';
import { buildMediaUrl } from '@/utils/url';

const getBestTimePercentage = (dayIdx, hourVal) => {
  // Deterministic but natural looking percentage distribution
  const seed = (dayIdx * 13 + hourVal * 19) % 100;
  return 30 + Math.round((seed / 100) * 60); // 30% to 90%
};

const getHeatmapBg = (percentage) => {
  // Soft coral/pink color style of image.png
  const opacity = ((percentage - 20) / 80) * 0.55; // range 0.05 to 0.55
  return `rgba(254, 215, 215, ${opacity})`;
};

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

const renderPlatformIcon = (platformName, sizeClass = "w-3.5 h-3.5") => {
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
  // Default YouTube
  return (
    <svg viewBox="0 0 24 24" className={`${sizeClass} fill-current text-[#FF0000] shrink-0`}>
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
};

export function WeeklyGrid({
  selectedDate,
  groupedPosts,
  currentTime,
  onCellClick,
  onPostClick,
  onCellDrop,
  rowHeight = 100
}) {
  const gridContainerRef = useRef(null);

  // Generate the 7 days of the selected week (Sunday to Saturday)
  const days = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    // Set to Sunday of that week
    startOfWeek.setDate(startOfWeek.getDate() - day);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const isSelected = d.getDate() === selectedDate.getDate() &&
                         d.getMonth() === selectedDate.getMonth() &&
                         d.getFullYear() === selectedDate.getFullYear();
      
      const isToday = d.getDate() === new Date().getDate() &&
                      d.getMonth() === new Date().getMonth() &&
                      d.getFullYear() === new Date().getFullYear();

      return {
        name: d.toLocaleDateString('en-US', { weekday: 'long' }),
        shortName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        month: d.getMonth() + 1,
        full: (() => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        })(),
        isSelected,
        isToday,
        raw: d
      };
    });
  }, [selectedDate]);

  // Generate 24 hours
  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const ampm = i >= 12 ? 'pm' : 'am';
      const displayHour = i === 0 ? 12 : i > 12 ? i - 12 : i;
      return {
        label: `${displayHour}:00${ampm}`,
        value: i
      };
    });
  }, []);

  // Time line offset position (based on current time)
  const timeLineOffset = useMemo(() => {
    const isThisWeek = days.some(d => d.isToday);
    if (!isThisWeek) return null;

    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    // Each hour row is rowHeight px height
    return (hour * rowHeight) + (minute / 60) * rowHeight;
  }, [currentTime, days, rowHeight]);

  // Scroll to starting hour on load (e.g. 8:00am is index 8)
  useEffect(() => {
    if (gridContainerRef.current) {
      // 8:00am starts at 8 * rowHeight
      gridContainerRef.current.scrollTop = 8 * rowHeight;
    }
  }, []);

  return (
    <div className="w-full h-full bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
      {/* Days Header */}
      <div className="flex border-b border-gray-100 bg-white shrink-0 no-print">
        {/* Time column spacer */}
        <div className="w-20 shrink-0 border-r border-gray-100" />
        
        {days.map((day, idx) => (
          <div 
            key={idx} 
            className="flex-1 py-4 flex items-center justify-center border-l border-gray-50 first:border-l-0"
          >
            {day.isToday ? (
              <div className="px-4 py-2 bg-[#10B981] text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-sm animate-in zoom-in-95 duration-200">
                {day.shortName} {day.month}/{day.date}
              </div>
            ) : (
              <div className={`text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer py-2 ${
                day.isSelected 
                  ? "text-[#0A0A0A] border-b-2 border-[#0A0A0A] font-black" 
                  : "text-gray-400 hover:text-black"
              }`}>
                {day.shortName} {day.month}/{day.date}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scrollable Grid Body */}
      <div 
        ref={gridContainerRef}
        className="flex-1 overflow-y-auto relative scrollbar-none select-none"
        id="planner-grid"
      >
        {/* Current Time Indicator Line */}
        {timeLineOffset !== null && (
          <div 
            className="absolute left-20 right-0 h-px bg-red-500 z-30 pointer-events-none"
            style={{ top: `${timeLineOffset}px` }}
          >
            <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
          </div>
        )}

        {/* 24 Hour Rows */}
        {hours.map((hour, hIdx) => (
          <div key={hIdx} className="flex border-b border-gray-100 group/row" style={{ minHeight: `${rowHeight}px` }}>
            {/* Time label cell */}
            <div className="w-20 shrink-0 flex items-start justify-center pt-3.5 border-r border-gray-100 bg-gray-50/10 no-print">
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tighter">
                {hour.label}
              </span>
            </div>

            {/* Day columns for this hour */}
            {days.map((day, dIdx) => {
              const cellPosts = groupedPosts[`${day.full}-${hour.value}`] || [];
              const percentage = getBestTimePercentage(dIdx, hour.value);
              const heatmapBg = getHeatmapBg(percentage);

              return (
                <div 
                  key={dIdx} 
                  onClick={() => onCellClick(day.raw, hour.value)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const dataStr = e.dataTransfer.getData("text/plain");
                    if (dataStr) {
                      try {
                        const fileData = JSON.parse(dataStr);
                        if (fileData.source === 'google-drive' && onCellDrop) {
                          onCellDrop(day.raw, hour.value, fileData);
                        }
                      } catch (err) {
                        console.error('Failed to parse drag drop metadata:', err);
                      }
                    }
                  }}
                  style={{ backgroundColor: heatmapBg }}
                  className="flex-1 border-l border-gray-100 first:border-l-0 transition-all hover:bg-red-100/30 cursor-pointer p-1.5 relative flex flex-col justify-start min-w-[100px]"
                >
                  {/* Heatmap Percentage Background Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                    <span className="text-[10px] font-black text-red-900/10 tracking-tight">
                      {percentage}%
                    </span>
                  </div>

                  {/* Scheduled Posts rendering */}
                  <div className="space-y-1.5 z-10 w-full">
                    {cellPosts.map(post => {
                      const displayTime = post.scheduledAt 
                        ? new Date(post.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) 
                        : '';
                      
                      const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
                      const thumbUrl = buildMediaUrl(post.thumbnail);
                      const isFailed = post.status?.toUpperCase() === 'FAILED';

                      const platform = post.platforms?.[0]?.toUpperCase() || 'YOUTUBE';

                      return (
                        <div 
                          key={post.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onPostClick) onPostClick(post);
                          }}
                          style={{ borderLeftColor: PLATFORM_COLORS[platform] || '#9CA3AF' }}
                          className="bg-white border border-gray-100 hover:border-gray-200/80 rounded-md p-2.5 shadow-[0_1.5px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.06)] transition-all border-l-[3.5px] text-left flex flex-col space-y-1.5 w-full group/card"
                        >
                          {/* Top Header Row */}
                          <div className="flex items-center justify-between">
                            {renderPlatformIcon(platform, "w-3.5 h-3.5")}
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">
                              {displayTime}
                            </span>
                          </div>

                          {/* Title / Description */}
                          <div className="flex-1">
                            <p className={`text-[11px] font-medium leading-normal ${
                              isFailed 
                                ? "line-through decoration-red-500 decoration-1 text-gray-400" 
                                : "text-gray-700"
                            } line-clamp-3`}>
                              {post.caption || post.title || "Untitled Post"}
                            </p>
                          </div>

                          {/* Media Preview/Thumbnail */}
                          {hasMedia && (
                            <div className="mt-1 flex items-center">
                              <div className="w-10 h-10 rounded-md bg-gray-50 overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 relative">
                                {thumbUrl ? (
                                  <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[9px] text-gray-400 font-medium">
                                    [Media]
                                  </div>
                                )}
                                {/* Multi-media Indicator Overlay */}
                                {post.mediaUrls.length > 1 && (
                                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-[9px] font-black text-white">
                                    +{post.mediaUrls.length - 1}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Multi-platform target list */}
                          {post.platforms && post.platforms.length > 1 && (
                            <div className="flex -space-x-1.5 items-center pt-1 mt-1 border-t border-gray-50">
                              {post.platforms.map((plt, pIdx) => (
                                <div 
                                  key={pIdx} 
                                  className="w-4 h-4 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm"
                                  title={plt}
                                >
                                  {renderPlatformIcon(plt, "w-2.5 h-2.5")}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
