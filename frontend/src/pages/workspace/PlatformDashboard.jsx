import { useParams, useNavigate } from "react-router-dom";
import { 
  Youtube, Instagram, Facebook, PlayCircle, Linkedin,
  Info, Download, Loader2, Diamond, X
} from "lucide-react";
import { GrowthChart } from "./dashboard/GrowthChart";
import { BalanceChart } from "./dashboard/BalanceChart";
import { DemographicsTab } from "./dashboard/DemographicsTab";
import { PublishedVideosTab } from "./dashboard/PublishedVideosTab";
import { CompetitorsTab } from "./dashboard/CompetitorsTab";
import { TrackedVideosTab } from "./dashboard/TrackedVideosTab";
import { usePlatformDashboard } from "../../hooks/usePlatformDashboard";
import { DateRangeFilter } from "../../components/app/DateRangeFilter";

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

const MOCK_YT_DATA = {
  demographics: {
    gender: [
      { name: 'Male', value: 65, color: '#818CF8' },
      { name: 'Female', value: 35, color: '#F472B6' },
    ],
    age: [
      { name: '13-17', value: 5 },
      { name: '18-24', value: 25 },
      { name: '25-34', value: 45 },
      { name: '35-44', value: 15 },
      { name: '45-54', value: 7 },
      { name: '55-64', value: 2 },
      { name: '65+', value: 1 },
    ],
    countries: [
      { name: 'Vietnam', value: 85, flag: '🇻🇳', progress: 85 },
      { name: 'United States', value: 5, flag: '🇺🇸', progress: 15 },
      { name: 'Brazil', value: 3, flag: '🇧🇷', progress: 10 },
      { name: 'India', value: 2, flag: '🇮🇳', progress: 8 },
      { name: 'Others', value: 5, flag: '🌍', progress: 12 },
    ],
    trafficSource: [
      { name: 'YouTube channels', value: 5, percentage: '38.46%', color: '#818CF8' },
      { name: 'Browser features', value: 3, percentage: '23.08%', color: '#4ADE80' },
      { name: 'YouTube search', value: 3, percentage: '23.08%', color: '#F472B6' },
      { name: 'Direct or unknown', value: 1, percentage: '7.69%', color: '#FBBF24' },
      { name: 'Other YouTube features', value: 1, percentage: '7.69%', color: '#22D3EE' },
    ]
  },
  balance: [
    { name: 'May 1', new: 12, lost: 2 },
    { name: 'May 2', new: 15, lost: 1 },
    { name: 'May 3', new: 8, lost: 4 },
    { name: 'May 4', new: 20, lost: 0 },
    { name: 'May 5', new: 18, lost: 3 },
    { name: 'May 6', new: 25, lost: 2 },
    { name: 'May 7', new: 30, lost: 5 },
  ]
};

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
           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
             <Download size={16} />
           </button>
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto space-y-6 pb-12">
        {/* Tab Content Header */}
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-[#0A0A0A] capitalize tracking-tight">{activeTab}</h2>
           
           {/* Channel Badge like Image */}
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

        {/* Upgrade Banner */}
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
                    stats={stats}
                    totalPeriodViews={totalPeriodViews}
                    totalPeriodGained={totalPeriodGained}
                    selectedMetrics={selectedMetrics}
                    handleMetricToggle={handleMetricToggle}
                    communityGrowthData={communityGrowthData}
                  />

                  <BalanceChart
                    stats={stats}
                    totalPeriodGained={totalPeriodGained}
                    selectedBalanceMetrics={selectedBalanceMetrics}
                    handleBalanceMetricToggle={handleBalanceMetricToggle}
                    communityGrowthData={communityGrowthData}
                  />

                 {/* No Data Warning */}
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

    </div>
  );
}
