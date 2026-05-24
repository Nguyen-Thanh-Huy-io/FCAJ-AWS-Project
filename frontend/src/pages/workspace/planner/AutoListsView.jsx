import * as React from "react";
import { 
  Plus, MoreHorizontal, Play, Pause, 
  RefreshCw, Layers, Calendar, ChevronRight
} from "lucide-react";

const MOCK_AUTOLISTS = [
  { id: 1, name: "Daily Tech News", platform: "YouTube", status: "Active", progress: 65, total: 20, published: 13 },
  { id: 2, name: "Funny Shorts Queue", platform: "TikTok", status: "Active", progress: 30, total: 50, published: 15 },
  { id: 3, name: "Product Showcase", platform: "Instagram", status: "Paused", progress: 100, total: 10, published: 10 },
];

export function AutoListsView() {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-[#0A0A0A]">Autolists</h2>
         <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[12px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg">
            <Plus size={16} /> Create autolist
         </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {MOCK_AUTOLISTS.map((list) => (
           <div key={list.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-8 hover:shadow-md transition-all group">
              {/* Circular Progress like Metricool */}
              <div className="relative w-16 h-16 shrink-0">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="#F3F4F6" strokeWidth="6" />
                    <circle 
                      cx="32" cy="32" r="28" fill="transparent" 
                      stroke={list.status === "Active" ? "#D9F99D" : "#E5E7EB"} 
                      strokeWidth="6" 
                      strokeDasharray={175.9} 
                      strokeDashoffset={175.9 * (1 - list.progress / 100)} 
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-black text-gray-700">{list.progress}%</span>
                 </div>
              </div>

              <div className="flex-1 space-y-1">
                 <div className="flex items-center gap-3">
                    <h3 className="text-[15px] font-bold text-[#0A0A0A]">{list.name}</h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${list.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                       {list.status}
                    </span>
                 </div>
                 <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5">
                       <Layers size={14} />
                       <span className="text-[11px] font-medium">{list.published} / {list.total} posts</span>
                    </div>
                    <div className="w-px h-3 bg-gray-200" />
                    <div className="flex items-center gap-1.5">
                       <Calendar size={14} />
                       <span className="text-[11px] font-medium">Daily at 9:00 AM</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black transition-all">
                    {list.status === "Active" ? <Pause size={18} /> : <Play size={18} />}
                 </button>
                 <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black transition-all">
                    <RefreshCw size={18} />
                 </button>
                 <button className="p-2 text-gray-300 hover:text-black transition-colors">
                    <ChevronRight size={24} />
                 </button>
              </div>
           </div>
         ))}
      </div>

      {/* Helper Card */}
      <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-3xl p-6 flex items-start gap-4">
         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
            <RefreshCw size={20} />
         </div>
         <div>
            <h4 className="text-[14px] font-bold text-[#1E1B4B]">How do Autolists work?</h4>
            <p className="text-[12px] text-[#4338CA] leading-relaxed mt-1">Autolists allow you to automate your content queue. Simply upload your posts and set a frequency. Metricool will handle the publishing for you automatically.</p>
         </div>
      </div>
    </div>
  );
}
