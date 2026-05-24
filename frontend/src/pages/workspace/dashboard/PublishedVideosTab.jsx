import React from 'react';
import { BarChart2, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from "../../../components/ui/button";

export function PublishedVideosTab({
  publishedVideos,
  isPublishedLoading,
  prevPageToken,
  nextPageToken,
  pageSize,
  setPageSize,
  fetchPublishedVideos
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
       <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-4">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List of videos</h3>
             <div className="relative">
                <input type="text" placeholder="Search videos..." className="pl-8 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[#D9F99D]/50 transition-all" />
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
             <div className="w-px h-4 bg-gray-200 mx-2" />
             <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold" 
                  onClick={() => fetchPublishedVideos(prevPageToken)}
                  disabled={!prevPageToken || isPublishedLoading}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold" 
                  onClick={() => fetchPublishedVideos(nextPageToken)}
                  disabled={!nextPageToken || isPublishedLoading}
                >
                  Next
                </Button>
             </div>
          </div>
       </div>
       {isPublishedLoading ? (
          <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-gray-200" /></div>
       ) : (
          <>
          <table className="w-full">
              <thead>
              <tr className="bg-white border-b border-gray-100">
                  {["Video", "Status", "Date", "Views", "Likes", "Comments"].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
              {publishedVideos.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400 text-xs">No videos found.</td></tr>
              ) : publishedVideos.map((item, i) => (
                  <tr key={i} className="hover:bg-[#F8F8F7]/50 transition-colors group">
                      <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                          <div className="w-16 h-10 bg-gray-100 rounded-lg overflow-hidden relative shadow-sm border border-gray-100 shrink-0">
                              <img src={item.thumbnailUrl} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                  <PlayCircle size={16} className="text-white" />
                              </div>
                          </div>
                          <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#0A0A0A] truncate max-w-[200px]">{item.title}</span>
                          </div>
                      </div>
                      </td>
                      <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                          {item.status}
                      </span>
                      </td>
                      <td className="px-6 py-4">
                      <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#0A0A0A]">{new Date(item.publishedAt).toLocaleDateString()}</span>
                          <span className="text-[10px] text-gray-400">{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0A0A0A]">{parseInt(item.views).toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{parseInt(item.likes).toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{parseInt(item.comments).toLocaleString()}</td>
                  </tr>
              ))}
              </tbody>
          </table>
          <div className="px-6 py-4 bg-gray-50/30 flex items-center justify-between border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing latest videos from your channel</span>
              <div className="flex gap-2">
                 <button 
                   onClick={() => fetchPublishedVideos(prevPageToken)} 
                   disabled={!prevPageToken}
                   className="px-3 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:bg-white transition-all disabled:opacity-30"
                 >
                   Previous
                 </button>
                 <button 
                   onClick={() => fetchPublishedVideos(nextPageToken)} 
                   disabled={!nextPageToken}
                   className="px-3 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:bg-white transition-all disabled:opacity-30"
                 >
                   Next
                 </button>
              </div>
          </div>
          </>
       )}
    </div>
  );
}
