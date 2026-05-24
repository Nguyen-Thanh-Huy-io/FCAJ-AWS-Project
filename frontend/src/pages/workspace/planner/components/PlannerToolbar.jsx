import React, { useState } from 'react';
import { 
  Search, ChevronLeft, ChevronRight, Filter, 
  MoreVertical, Plus, Image, Calendar as CalendarIcon,
  ChevronDown, Youtube
} from 'lucide-react';
import { DatePickerPopover } from './DatePickerPopover';

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
  onToggleSidebar
}) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
      <div className="flex gap-2">
        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
          <Filter size={16} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
          <MoreVertical size={16} />
        </button>
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
    </div>
  );
}
