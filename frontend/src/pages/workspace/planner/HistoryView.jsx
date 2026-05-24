import * as React from "react";
import { useState } from "react";
import { 
  Trash2, RefreshCw, Search, Filter, 
  MoreHorizontal, Eye, Youtube, PlayCircle
} from "lucide-react";

const MOCK_DELETED = [
  { id: 1, title: "Old Promotion Video", platform: "YouTube", deletedAt: "May 20, 2026", author: "Sarah" },
  { id: 2, title: "Mistake Post #1", platform: "TikTok", deletedAt: "May 22, 2026", author: "Manager" },
];

export function HistoryView() {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-[#0A0A0A]">Deleted Posts</h2>
         <div className="flex items-center gap-4 flex-1 max-w-md ml-8">
            <div className="relative flex-1 group">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
               <input type="text" placeholder="Search deleted posts..." className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none" />
            </div>
         </div>
         <button className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest">Empty Trash</button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-gray-50/30 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Post</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Platform</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Deleted At</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Deleted By</th>
                  <th className="px-6 py-4 text-right"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {MOCK_DELETED.map((post) => (
                 <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg grayscale opacity-50">📝</div>
                          <span className="text-[13px] font-bold text-gray-400 line-through">{post.title}</span>
                       </div>
                    </td>
                    <td className="px-4 py-5">
                       <div className="flex items-center gap-2 opacity-50">
                          {post.platform === "YouTube" ? <Youtube size={16} className="text-gray-400" /> : <PlayCircle size={16} className="text-gray-400" />}
                          <span className="text-[11px] font-bold text-gray-400">{post.platform}</span>
                       </div>
                    </td>
                    <td className="px-4 py-5 text-[12px] text-gray-400">{post.deletedAt}</td>
                    <td className="px-4 py-5 text-[12px] text-gray-400 font-medium">{post.author}</td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-white hover:text-black transition-all">Restore</button>
                          <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
