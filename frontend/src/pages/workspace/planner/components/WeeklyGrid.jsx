import React, { useEffect, useRef, useMemo } from 'react';
import { Youtube, Facebook } from 'lucide-react';

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

export function WeeklyGrid({
  selectedDate,
  groupedPosts,
  currentTime,
  onCellClick,
  onPostClick,
  onCellDrop
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
        full: d.toISOString().split('T')[0],
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
    // Each hour row is 100px height
    return (hour * 100) + (minute / 60) * 100;
  }, [currentTime, days]);

  // Scroll to starting hour on load (e.g. 8:00am is index 8)
  useEffect(() => {
    if (gridContainerRef.current) {
      // 8:00am starts at 8 * 100px = 800px
      gridContainerRef.current.scrollTop = 800;
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
            {day.isSelected ? (
              <div className="px-5 py-2.5 bg-[#0A0A0A] text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-sm animate-in zoom-in-95 duration-200">
                {day.date} {day.name}
              </div>
            ) : (
              <div className="text-gray-400 hover:text-black text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer py-2">
                {day.date} {day.name}
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
          <div key={hIdx} className="flex min-h-[100px] border-b border-gray-100 group/row">
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
                  className="flex-1 border-l border-gray-100 first:border-l-0 transition-all hover:bg-red-100/30 cursor-pointer p-1.5 relative flex flex-col justify-start"
                >
                  {/* Scheduled Posts rendering */}
                  <div className="space-y-1.5 z-10 w-full">
                    {cellPosts.map(post => {
                      const displayTime = post.scheduledAt 
                        ? new Date(post.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) 
                        : '';
                      
                      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
                      const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
                      const thumbUrl = post.thumbnail 
                        ? (post.thumbnail.startsWith('/') ? `${backendUrl}${post.thumbnail}` : post.thumbnail) 
                        : null;

                      const platform = post.platforms?.[0]?.toUpperCase() || 'YOUTUBE';
                      const isFB = platform === 'FACEBOOK';
                      const borderLeftClass = isFB ? 'border-l-[#1877F2]' : 'border-l-[#FF0000]';
                      const badgeBgColor = isFB ? 'bg-blue-50' : 'bg-red-50';
                      const videoPlaceholderBg = isFB ? 'bg-blue-50/50 text-[#1877F2]' : 'bg-red-50/50 text-[#FF0000]';

                      return (
                        <div 
                          key={post.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onPostClick) onPostClick(post);
                          }}
                          className={`bg-white border border-gray-200/80 rounded-2xl p-2 shadow-sm hover:shadow-md transition-all border-l-4 ${borderLeftClass} text-left flex flex-col justify-between space-y-1.5 w-full group/card`}
                        >
                          {/* Top Header Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className={`p-0.5 ${badgeBgColor} rounded-md`}>
                                {isFB ? (
                                  <Facebook size={10} className="text-[#1877F2] fill-[#1877F2]" />
                                ) : (
                                  <Youtube size={10} className="text-[#FF0000] fill-[#FF0000]" />
                                )}
                              </div>
                              {!isFB && (post.options?.youtubeType === 'short' || post.type === 'SHORT') && (
                                <span className="text-[7px] font-black text-red-600 bg-red-100/50 px-1 py-0.2 rounded uppercase tracking-wider">Short</span>
                              )}
                              {isFB && (post.options?.facebookType === 'reel' || post.type === 'REEL') && (
                                <span className="text-[7px] font-black text-blue-600 bg-blue-100/50 px-1 py-0.2 rounded uppercase tracking-wider">Reel</span>
                              )}
                              {isFB && (post.options?.facebookType === 'story' || post.type === 'STORY') && (
                                <span className="text-[7px] font-black text-purple-600 bg-purple-100/50 px-1 py-0.2 rounded uppercase tracking-wider">Story</span>
                              )}
                            </div>
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-tight">
                              {displayTime}
                            </span>
                          </div>

                          {/* Title / Description */}
                          <div>
                            <p className="text-[9.5px] font-bold text-gray-800 line-clamp-2 leading-snug">
                              {post.caption || (post.title === "Untitled Queue Post" ? "Untitled Post" : post.title) || "Untitled Post"}
                            </p>
                          </div>

                          {/* Media Preview/Thumbnail */}
                          {hasMedia && (
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-100">
                                {thumbUrl ? (
                                  <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover animate-in fade-in" />
                                ) : (
                                  <div className={`w-full h-full ${videoPlaceholderBg} flex items-center justify-center text-[7px] font-black uppercase`}>
                                    Video
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[8px] font-bold text-gray-400">
                                <span className="bg-gray-100 px-1 py-0.5 rounded">1080p</span>
                              </div>
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
