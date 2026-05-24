import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Youtube, Instagram, Facebook, PlayCircle, Linkedin,
  Info, Download, Loader2, Diamond, X, BarChart2
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import { GrowthChart } from "./dashboard/GrowthChart";
import { BalanceChart } from "./dashboard/BalanceChart";
import { DemographicsTab } from "./dashboard/DemographicsTab";
import { PublishedVideosTab } from "./dashboard/PublishedVideosTab";
import { CompetitorsTab } from "./dashboard/CompetitorsTab";
import { TrackedVideosTab } from "./dashboard/TrackedVideosTab";
import { usePlatformDashboard } from "../../hooks/usePlatformDashboard";
import { DateRangeFilter } from "../../components/app/DateRangeFilter";
import socialService from "../../services/social.service";

const PLATFORM_CONFIG = {
  youtube: { name: "YouTube", color: "#FF0000", icon: <Youtube size={20} /> },
  instagram: { name: "Instagram", color: "#E1306C", icon: <Instagram size={20} /> },
  facebook: { name: "Facebook", color: "#1877F2", icon: <Facebook size={20} /> },
  tiktok: { name: "TikTok", color: "#000", icon: <PlayCircle size={20} /> },
  linkedin: { name: "LinkedIn", color: "#0A66C2", icon: <Linkedin size={20} /> },
};

const YT_TABS = [
  { id: "community", label: "COMMUNITY" },
  { id: "demographics", label: "DEMOGRAPHICS" },
  { id: "published", label: "PUBLISHED VIDEOS" },
  { id: "viewed", label: "VIEWED VIDEOS" },
  { id: "competitors", label: "COMPETITORS" },
];

export function PlatformDashboardPage() {
  const { platform } = useParams();
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.youtube;
  
  const {
    activeTab,
    setActiveTab,
    showInfo,
    setShowInfo,
    loading,
    metrics,
    dateRange,
    setDateRange,
    selectedMetrics,
    handleMetricToggle,
    selectedBalanceMetrics,
    handleBalanceMetricToggle,
    trackedVideos,
    publishedVideos,
    competitors,
    isTrackingLoading,
    isPublishedLoading,
    isCompetitorLoading,
    nextPageToken,
    prevPageToken,
    pageSize,
    setPageSize,
    videoUrl,
    setVideoUrl,
    competitorQuery,
    setCompetitorQuery,
    searchResults,
    isSearching,
    isVideoModalOpen,
    setIsVideoModalOpen,
    isCompetitorModalOpen,
    setIsCompetitorModalOpen,
    selectedVideo,
    videoAnalytics,
    isVideoDetailLoading,
    isVideoDetailModalOpen,
    setIsVideoDetailModalOpen,
    handleVideoClick,
    stats,
    realData,
    totalPeriodViews,
    totalPeriodGained,
    communityGrowthData,
    handleTrackVideo,
    handleSearchCompetitors,
    handleAddCompetitor,
    fetchPublishedVideos
  } = usePlatformDashboard(platform);

  const navigate = useNavigate();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let fileName = `publicast_${platform}_report_${activeTab}`;

    if (activeTab === "published") {
      headers = ["Title", "Published At", "Views", "Likes", "Comments"];
      rows = (publishedVideos || []).map(v => [
        v.title,
        new Date(v.publishedAt).toLocaleDateString(),
        v.views || 0,
        v.likes || 0,
        v.comments || 0
      ]);
    } else if (activeTab === "competitors") {
      headers = ["Competitor Name", "Handle", "Subscribers", "Total Views", "Total Videos", "Added At"];
      rows = (competitors || []).map(c => [
        c.competitorDisplayName,
        c.competitorHandle,
        c.followersCount || 0,
        0, 0,
        new Date(c.addedAt).toLocaleDateString()
      ]);
    }

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-300" size={40} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F7]">
      {/* Sub-Navigation (Tabs) */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 border-b border-gray-100" style={{ height: 48 }}>
        <div className="flex gap-8 h-full">
          {YT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="h-full flex items-center text-[10px] font-bold tracking-wider transition-all relative"
              style={{ 
                color: activeTab === tab.id ? "#0A0A0A" : "#9CA3AF",
                borderBottom: activeTab === tab.id ? "2px solid #D9F99D" : "none" 
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
           <DateRangeFilter date={dateRange} setDate={setDateRange} />
           <button 
             onClick={() => setIsExportModalOpen(true)}
             className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            >
             <Download size={16} />
           </button>
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-[#0A0A0A] capitalize tracking-tight">{activeTab}</h2>
           
           <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-gray-100">
                <img src={metrics?.profilePictureUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-bold text-gray-700">{metrics?.displayName}</span>
              <div className="w-5 h-5 rounded-md bg-[#FF0000] flex items-center justify-center">
                 <Youtube size={10} className="text-white fill-white" />
              </div>
           </div>
        </div>

        {showInfo && (
          <div className="bg-[#2D1D35] rounded-3xl p-5 shadow-sm flex items-center justify-between border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9F99D]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex gap-4 items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#D9F99D] flex items-center justify-center shrink-0 shadow-lg shadow-[#D9F99D]/20">
                  <Diamond size={20} className="text-[#0A0A0A]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Unlock Full Potential</h3>
                  <p className="text-[11px] text-gray-400">Upgrade to learn more about your competitors' strategy and unlock 2 years of historical data.</p>
                </div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
                <button onClick={() => navigate("/pricing")} className="px-5 py-2 bg-[#D9F99D] text-[#0A0A0A] rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-md">
                  Upgrade Now
                </button>
                <button onClick={() => setShowInfo(false)} className="p-1.5 text-gray-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
            </div>
          </div>
        )}

        {!metrics ? (
          <div className="h-96 flex flex-col items-center justify-center text-center bg-white border border-gray-100 rounded-3xl shadow-sm px-6">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <div style={{ color: config.color }}>{config.icon}</div>
             </div>
             <h3 className="text-xl font-bold text-[#0A0A0A]">{config.name} account not connected</h3>
             <p className="text-sm text-gray-500 mt-2 mb-8 max-w-sm">Connect your {config.name} account to see real-time analytics, demographics, and video performance.</p>
             <button 
               onClick={() => navigate("/connect")}
               className="px-8 py-3 bg-[#0A0A0A] text-white rounded-xl text-sm font-bold hover:bg-black/90 transition-all shadow-lg"
             >
               Connect {config.name}
             </button>
          </div>
        ) : (
          <>
            {activeTab === "community" && (
              <div className="space-y-6">
                 <GrowthChart 
                   communityGrowthData={communityGrowthData}
                   stats={stats}
                   totalPeriodViews={totalPeriodViews}
                   selectedMetrics={selectedMetrics}
                   handleMetricToggle={handleMetricToggle}
                 />
                 <BalanceChart 
                   realData={realData}
                   totalPeriodGained={totalPeriodGained}
                   stats={stats}
                   selectedBalanceMetrics={selectedBalanceMetrics}
                   handleBalanceMetricToggle={handleBalanceMetricToggle}
                 />
                 {realData.growth?.length === 0 && (
                   <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
                      <Info className="text-amber-500" size={18} />
                      <p className="text-xs text-amber-700 font-medium">
                        Real-time analytics data (Engagement, Watch Time, etc.) can take up to 48-72 hours to appear after connecting your account.
                      </p>
                   </div>
                 )}
              </div>
            )}

            {activeTab === "demographics" && (
              <DemographicsTab realData={realData} />
            )}

            {activeTab === "published" && (
              <PublishedVideosTab
                publishedVideos={publishedVideos}
                isPublishedLoading={isPublishedLoading}
                prevPageToken={prevPageToken}
                nextPageToken={nextPageToken}
                pageSize={pageSize}
                setPageSize={setPageSize}
                fetchPublishedVideos={fetchPublishedVideos}
                onVideoClick={handleVideoClick}
              />
            )}

            {activeTab === "competitors" && (
              <CompetitorsTab
                isCompetitorModalOpen={isCompetitorModalOpen}
                setIsCompetitorModalOpen={setIsCompetitorModalOpen}
                competitorQuery={competitorQuery}
                setCompetitorQuery={setCompetitorQuery}
                handleSearchCompetitors={handleSearchCompetitors}
                isSearching={isSearching}
                searchResults={searchResults}
                handleAddCompetitor={handleAddCompetitor}
                isCompetitorLoading={isCompetitorLoading}
                competitors={competitors}
              />
            )}

            {activeTab === "viewed" && (
              <TrackedVideosTab
                isVideoModalOpen={isVideoModalOpen}
                setIsVideoModalOpen={setIsVideoModalOpen}
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                handleTrackVideo={handleTrackVideo}
                isTrackingLoading={isTrackingLoading}
                trackedVideos={trackedVideos}
              />
            )}
          </>
        )}
      </div>

      {/* Video Detail Modal */}
      <Dialog open={isVideoDetailModalOpen} onOpenChange={setIsVideoDetailModalOpen}>
        <DialogContent className="sm:max-w-[800px] bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedVideo && (
            <div className="flex flex-col">
              <div className="bg-[#2D1D35] p-6 text-white relative">
                 <div className="flex gap-4 items-center">
                    <img src={selectedVideo.thumbnailUrl} className="w-32 h-20 rounded-xl object-cover border border-white/10" />
                    <div className="flex-1">
                       <h3 className="text-lg font-bold line-clamp-2 leading-snug">{selectedVideo.title}</h3>
                       <div className="flex gap-4 mt-2">
                          <div className="flex flex-col">
                             <span className="text-[10px] text-gray-400 uppercase font-bold">Views</span>
                             <span className="text-base font-bold text-[#BEF264]">{parseInt(selectedVideo.views).toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] text-gray-400 uppercase font-bold">Likes</span>
                             <span className="text-base font-bold text-white">{parseInt(selectedVideo.likes).toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] text-gray-400 uppercase font-bold">Published</span>
                             <span className="text-base font-bold text-white">{new Date(selectedVideo.publishedAt).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setIsVideoDetailModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 space-y-6 bg-[#F8F8F7]">
                 <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth Performance</h4>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#8E9BEE]" />
                          <span className="text-[10px] font-bold text-gray-500">VIEWS OVER TIME</span>
                       </div>
                    </div>
                    
                    {isVideoDetailLoading ? (
                      <div className="h-[300px] flex items-center justify-center"><Loader2 className="animate-spin text-gray-200" /></div>
                    ) : videoAnalytics.length === 0 ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-center">
                         <BarChart2 size={40} className="text-gray-100 mb-4" />
                         <p className="text-sm text-gray-400 font-medium">No historical data available for this range.</p>
                      </div>
                    ) : (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={videoAnalytics}>
                              <defs>
                                <linearGradient id="colorVideoViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8E9BEE" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#8E9BEE" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                              <Area type="monotone" dataKey="views" stroke="#8E9BEE" strokeWidth={3} fillOpacity={1} fill="url(#colorVideoViews)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Avg. Watch Time</span>
                       <span className="text-2xl font-bold text-[#0A0A0A]">{Math.round(videoAnalytics[videoAnalytics.length-1]?.avgWatchTime / 60 || 0)}m</span>
                       <div className="w-full h-1 bg-gray-50 rounded-full mt-4">
                          <div className="h-full bg-[#D1EBD9] rounded-full w-[70%]" />
                       </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Comments</span>
                       <span className="text-2xl font-bold text-[#0A0A0A]">{selectedVideo.comments}</span>
                       <div className="w-full h-1 bg-gray-50 rounded-full mt-4">
                          <div className="h-full bg-[#8E9BEE] rounded-full w-[45%]" />
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
                 <Button onClick={() => setIsVideoDetailModalOpen(false)} className="bg-[#0A0A0A] text-white rounded-xl font-bold px-8">Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-6 bg-white border border-gray-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0A0A0A] tracking-tight">Xuất báo cáo kênh {config.name}</DialogTitle>
            <DialogDescription className="text-xs text-gray-400">Chọn định dạng báo cáo bạn muốn tải xuống.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => {
                handleExportCSV();
                setIsExportModalOpen(false);
              }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-gray-900 bg-white hover:bg-gray-50/50 transition-all text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm group-hover:scale-105 transition-transform">
                CSV
              </div>
              <div className="text-xs font-bold text-[#0A0A0A]">Tải file CSV</div>
              <div className="text-[9px] text-gray-400">Dữ liệu bảng tính chi tiết cho tab {activeTab}</div>
            </button>
            <button
              onClick={() => {
                toast.info("Tính năng xuất PDF đang được phát triển.");
                setIsExportModalOpen(false);
              }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-gray-900 bg-white hover:bg-gray-50/50 transition-all text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-sm group-hover:scale-105 transition-transform">
                PDF
              </div>
              <div className="text-xs font-bold text-[#0A0A0A]">Tải file PDF</div>
              <div className="text-[9px] text-gray-400">Báo cáo trực quan kèm biểu đồ đồ họa</div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
