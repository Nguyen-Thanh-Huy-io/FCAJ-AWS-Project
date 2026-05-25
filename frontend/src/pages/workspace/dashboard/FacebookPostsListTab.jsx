import React, { useState } from 'react';
import { BarChart2, Loader2, PlayCircle } from 'lucide-react';
import { Button } from "../../../components/ui/button";

export function FacebookPostsListTab({
  publishedVideos,
  isPublishedLoading,
  pageSize,
  setPageSize,
  fetchPublishedVideos
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = (publishedVideos || []).filter(post => {
    const text = (post.message || post.title || "").toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List of posts</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[#D9F99D]/50 transition-all" 
            />
            <BarChart2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Items per page:</span>
            <select 
              value={pageSize} 
              onChange={(e) => setPageSize(e.target.value)}
              className="text-[10px] font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>

      {isPublishedLoading ? (
        <div className="h-40 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-200" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  {["Post", "Date", "Reach", "Views", "Engagement", "Reactions", "Comments", "Shares", "Clicks"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-10 text-center text-gray-400 text-xs">No posts found.</td>
                  </tr>
                ) : filteredPosts.map((item, i) => (
                  <tr key={i} className="hover:bg-[#F8F8F7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {item.picture ? (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative shadow-sm border border-gray-100 shrink-0">
                            <img src={item.picture} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-black text-sm shrink-0 border border-blue-100">
                            f
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#0A0A0A] line-clamp-2 max-w-[280px]">
                            {item.message || "No content message"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0A0A0A]">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-800">
                      {(item.reach || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-800">
                      {(item.views || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                        {((item.engagementRate || 0) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {(item.reactions || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {(item.comments || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {(item.shares || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {(item.clicks || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/30 flex items-center justify-between border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Showing latest Facebook posts
            </span>
          </div>
        </>
      )}
    </div>
  );
}
