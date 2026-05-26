import * as React from "react";
import { Play, Pause, RefreshCw, ChevronRight, Layers, Calendar } from "lucide-react";

export function AutoListCard({ list, onToggle, onRefresh, onNavigate }) {
  const progress = list.totalPostsCount > 0 
    ? Math.round((list.publishedPostsCount / list.totalPostsCount) * 100) 
    : 0;

  // Calculating SVG dash array
  const radius = 28;
  const circumference = 2 * Math.PI * radius; // ~175.9
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group text-left">
      {/* Circular Progress */}
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r={radius} fill="transparent" stroke="#F3F4F6" strokeWidth="5" />
          <circle 
            cx="32" cy="32" r={radius} fill="transparent" 
            stroke={list.isActive ? "url(#activeGradient)" : "#E5E7EB"} 
            strokeWidth="5" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3E635" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-black text-gray-700">{progress}%</span>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-bold text-[#0A0A0A] truncate leading-snug">{list.name}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
            list.isActive 
              ? "bg-[#D9F99D]/40 text-[#4D7C0F] border border-[#D9F99D]/60" 
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}>
            {list.isActive ? "Active" : "Paused"}
          </span>
          {list.loopEnabled && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 shadow-sm">
              <RefreshCw size={10} className="text-indigo-500" />
              Repeat
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-gray-400 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Layers size={13} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span>{list.publishedPostsCount} / {list.totalPostsCount} posts</span>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar size={13} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span>
              {list.scheduleType === 'INTERVAL' 
                ? `Every ${list.intervalMinutes}m` 
                : 'Specific Times'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <button 
          onClick={() => onToggle(list.id)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border cursor-pointer ${
            list.isActive 
              ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-100" 
              : "bg-gray-900 text-white hover:bg-black border-transparent"
          }`}
          title={list.isActive ? "Pause autolist" : "Activate autolist"}
        >
          {list.isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button 
          onClick={() => onRefresh && onRefresh(list.id)}
          className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-200 transition-all duration-300 cursor-pointer shadow-sm active:rotate-180"
          title="Recalculate queue scheduling"
        >
          <RefreshCw size={16} />
        </button>
        
        <button 
          onClick={() => onNavigate(list.id)}
          className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-900 border border-gray-100 hover:border-transparent flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
          title="Edit settings"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
