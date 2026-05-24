import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export function CompetitorsTab({
  isCompetitorModalOpen,
  setIsCompetitorModalOpen,
  competitorQuery,
  setCompetitorQuery,
  handleSearchCompetitors,
  isSearching,
  searchResults,
  handleAddCompetitor,
  isCompetitorLoading,
  competitors
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List of competitors</h3>
        
        <Dialog open={isCompetitorModalOpen} onOpenChange={setIsCompetitorModalOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white rounded-xl text-[10px] font-bold hover:bg-black/90 transition-all shadow-md">
              ADD COMPETITOR
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add YouTube Competitor</DialogTitle>
              <DialogDescription>Search for a channel to compare metrics.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter channel name or handle..." 
                  value={competitorQuery}
                  onChange={(e) => setCompetitorQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchCompetitors()}
                />
                <Button onClick={handleSearchCompetitors} disabled={isSearching}>
                  {isSearching ? <Loader2 className="animate-spin" size={16} /> : "Search"}
                </Button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {searchResults.map((channel) => (
                  <div key={channel.channelId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-3">
                        <img src={channel.thumbnail} className="w-8 h-8 rounded-full" />
                        <span className="text-xs font-bold truncate max-w-[150px]">{channel.title}</span>
                     </div>
                     <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => handleAddCompetitor(channel.channelId)}>Add</Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
         {isCompetitorLoading ? (
           <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-gray-200" /></div>
         ) : (
          <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  {["Competitor", "Subscribers", "Views", "Videos", "Added At"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {competitors.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-xs">No competitors added yet.</td></tr>
                ) : competitors.map((comp, i) => (
                  <tr key={i} className="hover:bg-[#F8F8F7]/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={comp.competitorAvatarUrl} className="w-10 h-10 rounded-full border border-gray-100" />
                          <div className="flex flex-col">
                              <span className="text-sm font-bold text-[#0A0A0A]">{comp.competitorDisplayName}</span>
                              <span className="text-[10px] font-medium text-gray-400">{comp.competitorHandle}</span>
                          </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#0A0A0A]">{comp.followersCount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#0A0A0A]">{comp.totalViews?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#0A0A0A]">{comp.totalVideos?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-4 text-[10px] font-medium text-gray-400">{new Date(comp.addedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
          </table>
         )}
      </div>

      {/* Latest Videos Section */}
      {!isCompetitorLoading && competitors.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LATEST VIDEOS COMPARISON</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((comp) => (
              <div key={comp.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  {/* Competitor Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-50 mb-3">
                    <img src={comp.competitorAvatarUrl} className="w-8 h-8 rounded-full border border-gray-100 object-cover" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#0A0A0A] truncate">{comp.competitorDisplayName}</h4>
                      <p className="text-[9px] text-gray-400 truncate">{comp.competitorHandle}</p>
                    </div>
                  </div>
                  
                  {/* Videos list */}
                  <div className="space-y-3">
                    {!comp.latestVideos || comp.latestVideos.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-8">No recent videos found.</p>
                    ) : (
                      comp.latestVideos.map((vid) => (
                        <div key={vid.id} className="flex gap-3 hover:bg-[#F8F8F7]/50 p-2 rounded-2xl transition-all border border-transparent hover:border-gray-100">
                          <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100 relative bg-gray-50 shadow-sm">
                            <img src={vid.thumbnailUrl} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <h5 className="text-[10px] font-bold text-[#0A0A0A] line-clamp-1 leading-snug" title={vid.title}>
                              {vid.title}
                            </h5>
                            <div className="flex items-center gap-2 text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                              <span className="text-[#16A34A]">{vid.views?.toLocaleString()} views</span>
                              <span>•</span>
                              <span>{new Date(vid.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
