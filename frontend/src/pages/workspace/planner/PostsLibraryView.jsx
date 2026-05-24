import * as React from "react";
import { 
  Search, Filter, Plus, Diamond, 
  Grid3X3, List as ListIcon, MoreHorizontal,
  Youtube, PlayCircle, Instagram, Image as ImageIcon
} from "lucide-react";

const MOCK_LIBRARY = [
  { id: 1, title: "Summer Campaign Template", platform: "Instagram", type: "Image", used: 12 },
  { id: 2, title: "Product Unboxing Intro", platform: "YouTube", type: "Video", used: 5 },
  { id: 3, title: "Daily Motivation Quote", platform: "TikTok", type: "Short", used: 28 },
  { id: 4, title: "Tech Review Background", platform: "YouTube", type: "Video", used: 2 },
];

export function PostsLibraryView() {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#0A0A0A]">Posts Library</h2>
            <div className="px-3 py-1 bg-[#D9F99D] rounded-full flex items-center gap-1.5 shadow-sm border border-[#BEF264]">
               <Diamond size={12} className="text-black" />
               <span className="text-[10px] font-bold text-black uppercase tracking-wider">Premium Feature</span>
            </div>
         </div>
         <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[12px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg">
            <Plus size={16} /> Add to library
         </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {MOCK_LIBRARY.map((item) => (
           <div key={item.id} className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
                 <div className="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                    {item.type === "Video" ? "🎬" : "🖼️"}
                 </div>
                 <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm border border-white/50">
                    {item.platform === "YouTube" ? <Youtube size={14} className="text-[#FF0000]" /> : <PlayCircle size={14} />}
                 </div>
              </div>
              <div className="p-5 space-y-3">
                 <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[13px] font-bold text-[#0A0A0A] line-clamp-1">{item.title}</h3>
                    <button className="text-gray-300 hover:text-black transition-colors"><MoreHorizontal size={14} /></button>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.type}</span>
                    <span className="text-[10px] font-bold text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded-md">Used {item.used} times</span>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Empty State Overlay for Non-Premium (Visual only for now) */}
      <div className="mt-12 bg-[#2D1D35] rounded-[32px] p-12 text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9F99D]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
         <div className="relative z-10 space-y-4">
            <Diamond size={48} className="text-[#D9F99D] mx-auto mb-6 drop-shadow-lg" />
            <h3 className="text-2xl font-bold text-white">Organize your best content</h3>
            <p className="text-gray-400 max-w-md mx-auto text-sm">Save your top-performing posts as templates and reuse them with one click. Unlock the library with our Pro plan.</p>
            <button className="mt-6 px-10 py-3 bg-[#D9F99D] text-[#0A0A0A] rounded-2xl text-sm font-bold hover:scale-105 transition-all shadow-xl">Upgrade Now</button>
         </div>
      </div>
    </div>
  );
}
