import * as React from "react";
import { useState } from "react";
import { 
  Search, Filter, MoreHorizontal, Plus, 
  Trash2, CheckCircle, Clock, AlertCircle,
  ExternalLink, Eye, ChevronDown, Youtube, PlayCircle
} from "lucide-react";

const MOCK_LIST_POSTS = [
  { id: 1, title: "Mô phỏng thuật toán Selection Sort", platform: "YouTube", status: "published", date: "May 24, 2026", time: "10:30 AM", creator: "Manager" },
  { id: 2, title: "Hướng dẫn React Pro #Shorts", platform: "TikTok", status: "scheduled", date: "May 25, 2026", time: "02:00 PM", creator: "Manager" },
  { id: 3, title: "Dự án PubliCast - Next Big Thing", platform: "YouTube", status: "draft", date: "—", time: "—", creator: "Sarah" },
  { id: 4, title: "Best AI Tools for Developers", platform: "Instagram", status: "rejected", date: "May 20, 2026", time: "09:00 AM", creator: "Paco" },
];

const STATUS_STYLE = {
  published: "bg-green-50 text-green-700 border-green-100",
  scheduled: "bg-blue-50 text-blue-700 border-blue-100",
  draft: "bg-gray-50 text-gray-500 border-gray-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100"
};

export function ListView() {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1 group">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-500 transition-all" />
               <input 
                 type="text" 
                 placeholder="Search by title, caption..." 
                 className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9F99D]/50 transition-all"
               />
            </div>
            <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all">
               <Filter size={18} />
            </button>
         </div>

         <div className="flex items-center gap-3">
            {selected.length > 0 && (
               <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">{selected.length} selected</span>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-green-600 hover:bg-green-50 transition-all flex items-center gap-1.5"><CheckCircle size={14} /> Approve</button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-1.5"><Trash2 size={14} /> Delete</button>
               </div>
            )}
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[12px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg">
               <Plus size={16} /> Create post
            </button>
         </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-gray-50/30 border-b border-gray-100">
                  <th className="px-6 py-4 w-10">
                     <input 
                       type="checkbox" 
                       className="rounded border-gray-300 text-black focus:ring-black" 
                       onChange={(e) => setSelected(e.target.checked ? MOCK_LIST_POSTS.map(p => p.id) : [])}
                     />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Post Details</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Platform</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Scheduled For</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Status</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Author</th>
                  <th className="px-6 py-4 text-right"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {MOCK_LIST_POSTS.map((post) => (
                 <tr key={post.id} className={`hover:bg-gray-50/50 transition-colors group ${selected.includes(post.id) ? "bg-[#D9F99D]/10" : ""}`}>
                    <td className="px-6 py-5">
                       <input 
                         type="checkbox" 
                         checked={selected.includes(post.id)}
                         onChange={() => toggleSelect(post.id)}
                         className="rounded border-gray-300 text-black focus:ring-black" 
                       />
                    </td>
                    <td className="px-4 py-5">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative group-hover:border-gray-300 transition-all">
                             <div className="w-full h-full flex items-center justify-center text-lg">📝</div>
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                <Eye size={16} className="text-white" />
                             </div>
                          </div>
                          <div className="flex flex-col min-w-0">
                             <span className="text-[13px] font-bold text-[#0A0A0A] truncate max-w-[250px]">{post.title}</span>
                             <span className="text-[11px] text-gray-400 truncate max-w-[250px]">No caption provided...</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-4 py-5">
                       <div className="flex items-center gap-2">
                          {post.platform === "YouTube" ? <Youtube size={16} className="text-[#FF0000]" /> : <PlayCircle size={16} className="text-[#010101]" />}
                          <span className="text-[11px] font-bold text-gray-600">{post.platform}</span>
                       </div>
                    </td>
                    <td className="px-4 py-5">
                       <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-gray-700">{post.date}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-medium">{post.time}</span>
                       </div>
                    </td>
                    <td className="px-4 py-5">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${STATUS_STYLE[post.status]}`}>
                          {post.status}
                       </span>
                    </td>
                    <td className="px-4 py-5">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
                             {post.creator.charAt(0)}
                          </div>
                          <span className="text-[11px] font-medium text-gray-600">{post.creator}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="p-2 text-gray-300 hover:text-black hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm border border-transparent hover:border-gray-100">
                          <MoreHorizontal size={16} />
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
         
         {/* Footer Pagination */}
         <div className="px-6 py-4 bg-gray-50/20 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Showing 4 of 4 results</span>
            <div className="flex gap-2">
               <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-400 opacity-50 cursor-not-allowed">Previous</button>
               <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-400 opacity-50 cursor-not-allowed">Next</button>
            </div>
         </div>
      </div>
    </div>
  );
}
