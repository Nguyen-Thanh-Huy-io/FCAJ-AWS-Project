import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Youtube, Instagram, Facebook, PlayCircle, Linkedin,
  TrendingUp, Users, Eye, MessageSquare, Share2, Calendar,
  Info, X, Diamond, Download, ExternalLink, BarChart2, Loader2
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell
} from "recharts";
import brandService from "../../services/brand.service";
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
  const [activeTab, setActiveTab] = useState("community");
  const [showInfo, setShowInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const brandsRes = await brandService.getBrands();
        if (brandsRes.data && brandsRes.data.length > 0) {
          const brand = brandsRes.data[0];
          setActiveBrand(brand);
          
          const metricsRes = await socialService.getMetrics(brand.id);
          const platformType = platform.toUpperCase() === 'X' ? 'TWITTER_X' : platform.toUpperCase();
          const platformMetrics = metricsRes.data?.find(m => m.platform === platformType);
          setMetrics(platformMetrics || null);
        }
      } catch (error) {
        console.error("Failed to load platform metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [platform]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-300" size={40} />
      </div>
    );
  }

  const getAnalyticsData = () => {
    if (!metrics?.analytics?.[0]?.socialAnalytics?.audienceDemographicsJson) return MOCK_YT_DATA;
    try {
      const raw = JSON.parse(metrics.analytics[0].socialAnalytics.audienceDemographicsJson);
      
      // Transform Demographics
      const ageMap = {};
      const genderMap = { Male: 0, Female: 0 };
      raw.demographics.forEach(([age, gender, percentage]) => {
        ageMap[age] = (ageMap[age] || 0) + percentage;
        if (gender === 'male') genderMap.Male += percentage;
        if (gender === 'female') genderMap.Female += percentage;
      });

      const age = Object.entries(ageMap).map(([name, value]) => ({ name: name.replace('age', ''), value: Math.round(value) }));
      const gender = [
        { name: 'Male', value: Math.round(genderMap.Male), color: '#818CF8' },
        { name: 'Female', value: Math.round(genderMap.Female), color: '#F472B6' }
      ];

      // Transform Traffic Source
      const trafficSource = raw.trafficSource.map(([source, views, time]) => ({
        name: source.replace('insightTrafficSourceType', '').replace(/_/g, ' '),
        value: views,
        percentage: `${Math.round((views / raw.trafficSource.reduce((a, b) => a + b[1], 0)) * 100)}%`,
        color: '#818CF8'
      }));

      // Transform Countries
      const countries = raw.geographic.map(([code, views]) => ({
        name: code, // Ideally map ISO code to Name
        value: Math.round((views / raw.geographic.reduce((a, b) => a + b[1], 0)) * 100),
        flag: '📍',
        progress: Math.round((views / raw.geographic.reduce((a, b) => a + b[1], 0)) * 100)
      }));

      // Transform Growth & Balance
      const growth = raw.growth.map(([day, views, gained, lost]) => ({
        name: day.split('-').slice(1).join('/'),
        value: views,
        new: gained,
        lost: lost
      }));

      return {
        demographics: { age, gender, countries, trafficSource },
        balance: growth,
        growth: growth
      };
    } catch (e) {
      console.error("Error parsing analytics data:", e);
      return MOCK_YT_DATA;
    }
  };

  const realData = getAnalyticsData();

  const getYouTubeStats = () => {
    if (!metrics || !metrics.youtubeChannel) return { subscribers: 0, views: 0, videos: 0 };
    return {
      subscribers: metrics.youtubeChannel.subscribersCount,
      views: metrics.youtubeChannel.totalViewsCount,
      videos: metrics.youtubeChannel.totalVideosCount
    };
  };

  const stats = getYouTubeStats();

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F7]">
      {/* Sub-Navigation (Tabs) ... (rest of layout using realData instead of MOCK_YT_DATA) */}
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
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50/50">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-[11px] font-medium text-gray-600">Last 30 Days</span>
              <div className="w-4 h-4 rounded-full bg-[#E9D5FF] flex items-center justify-center">
                 <Diamond size={10} className="text-[#7E22CE]" />
              </div>
           </div>
           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
             <Download size={16} />
           </button>
        </div>
      </div>

      <div className="p-6 max-w-[1200px] mx-auto space-y-6 pb-12">
        {/* Tab Content Header */}
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-[#0A0A0A] capitalize tracking-tight">{activeTab}</h2>
           <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-[#0A0A0A]">{metrics?.displayName || 'Not Connected'}</span>
                <span className="text-[10px] font-medium text-gray-400">{metrics?.username || '@channel'}</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100">
                {metrics?.profilePictureUrl ? (
                  <img src={metrics.profilePictureUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#E1306C] text-white text-xs font-bold">
                    {activeBrand?.name?.charAt(0) || 'B'}
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Upgrade Banner - Integrated in flow, not fixed */}
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
            {/* Dynamic Content based on Tab */}
            {activeTab === "community" && (
              <div className="space-y-6">
                 {/* Growth Metrics */}
                 <div className="grid grid-cols-5 gap-4">
                    {[
                      { label: "Subscribers", value: stats.subscribers.toLocaleString(), color: "#818CF8" },
                      { label: "Total Views", value: stats.views.toLocaleString(), color: "#4ADE80" },
                      { label: "Videos", value: stats.videos.toLocaleString(), color: "#F472B6" },
                      { label: "Engagement", value: "3.2%", color: "#FBBF24" },
                      { label: "Watch Time", value: "142h", color: "#22D3EE" },
                    ].map((stat, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center group hover:border-[#D9F99D] transition-all">
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</div>
                         <div className="text-2xl font-bold text-[#0A0A0A]">{stat.value}</div>
                         <div className="w-full h-1 rounded-full mt-4 bg-gray-50">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: '70%', backgroundColor: stat.color }} />
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    {/* Growth Chart */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth (Views)</h3>
                          <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-[#818CF8]" />
                              <span className="text-[10px] font-bold text-gray-500">VIEWS</span>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={realData.growth}>
                              <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818CF8" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} />
                              <Tooltip cursor={{ stroke: '#818CF8', strokeWidth: 1 }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                              <Area type="monotone" dataKey="value" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Balance of Subscribers */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Balance of Subscribers</h3>
                          <div className="flex gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                                <span className="text-[10px] font-bold text-gray-500">GAINED</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
                                <span className="text-[10px] font-bold text-gray-500">LOST</span>
                              </div>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={realData.balance}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} />
                              <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                              <Bar dataKey="new" fill="#4ADE80" radius={[4, 4, 0, 0]} barSize={20} />
                              <Bar dataKey="lost" fill="#F87171" radius={[4, 4, 0, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "demographics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Gender Pie Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Gender</h3>
                    <div className="h-[250px] flex flex-col items-center justify-center">
                         <div className="w-40 h-40 rounded-full border-[15px] border-[#F472B6] border-l-[#818CF8] rotate-45 mb-8" />
                         <div className="flex gap-4">
                            {realData.demographics.gender.map(g => (
                              <div key={g.name} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">{g.name} {g.value}%</span>
                              </div>
                            ))}
                         </div>
                    </div>
                  </div>

                  {/* Age Bar Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm col-span-2">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Age</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={realData.demographics.age}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} />
                        <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none" }} />
                        <Bar dataKey="value" fill="#818CF8" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   {/* Viewers by Country */}
                   <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Viewers by Country</h3>
                      <div className="space-y-4">
                        {realData.demographics.countries.map((c) => (
                          <div key={c.name} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{c.flag}</span>
                                <span className="text-sm font-bold text-[#0A0A0A]">{c.name}</span>
                              </div>
                              <span className="text-sm font-bold text-gray-500">{c.value}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                              <div className="h-full bg-[#D9F99D] rounded-full" style={{ width: `${c.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Traffic Source */}
                   <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Traffic Source</h3>
                      <div className="space-y-4">
                        {realData.demographics.trafficSource.map((s) => (
                          <div key={s.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                              <span className="text-sm font-bold text-[#0A0A0A]">{s.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className="text-sm font-bold text-[#0A0A0A]">{s.value.toLocaleString()}</span>
                               <span className="text-xs font-bold text-gray-400 w-16 text-right">{s.percentage}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "published" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center gap-4">
                       <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List of videos</h3>
                       <div className="relative">
                          <input type="text" placeholder="Search videos..." className="pl-8 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-[#D9F99D]/50 transition-all" />
                          <BarChart2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-gray-400">Items per page:</span>
                       <select className="text-[10px] font-bold bg-transparent focus:outline-none">
                          <option>10</option>
                          <option>20</option>
                          <option>50</option>
                       </select>
                    </div>
                 </div>
                 <table className="w-full">
                    <thead>
                       <tr className="bg-white border-b border-gray-100">
                          {["Video", "Status", "Date", "Views", "Time", "Watch Time", "Likes", "Comments"].map(h => (
                            <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {[
                         { title: "Mô phỏng thuật toán Selection Sort", status: "Published", date: "May 22, 2026", time: "12:20 PM", views: "1,245", duration: "0:42", watchTime: "12.4h", likes: "245", comments: "12" },
                         { title: "React Router v7 Deep Dive", status: "Published", date: "May 20, 2026", time: "09:15 AM", views: "852", duration: "12:15", watchTime: "115.8h", likes: "89", comments: "5" },
                         { title: "Modern SaaS Architecture 2026", status: "Scheduled", date: "May 25, 2026", time: "10:00 AM", views: "—", duration: "45:20", watchTime: "—", likes: "—", comments: "—" },
                         { title: "Building a Metricool Clone", status: "Draft", date: "—", time: "—", views: "—", duration: "—", watchTime: "—", likes: "—", comments: "—" },
                       ].map((item, i) => (
                         <tr key={i} className="hover:bg-[#F8F8F7]/50 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-4">
                                  <div className="w-16 h-10 bg-gray-100 rounded-lg overflow-hidden relative shadow-sm border border-gray-100 shrink-0">
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                        <PlayCircle size={16} className="text-white" />
                                     </div>
                                     <div className="absolute bottom-1 right-1 bg-black/70 text-[8px] font-bold text-white px-1 rounded-sm">{item.duration}</div>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#0A0A0A] truncate max-w-[200px]">{item.title}</span>
                                    <span className="text-[10px] font-medium text-gray-400">#tutorial #coding</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                 item.status === 'Published' ? 'bg-green-100 text-green-700' : 
                                 item.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                               }`}>
                                  {item.status}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                 <span className="text-xs font-bold text-[#0A0A0A]">{item.date}</span>
                                 <span className="text-[10px] text-gray-400">{item.time}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-[#0A0A0A]">{item.views}</td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-500">{item.duration}</td>
                            <td className="px-6 py-4 text-xs font-bold text-[#0A0A0A]">{item.watchTime}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">{item.likes}</td>
                            <td className="px-6 py-4 text-xs text-gray-500">{item.comments}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 <div className="px-6 py-4 bg-gray-50/30 flex items-center justify-between border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing 1-4 of 4 videos</span>
                    <div className="flex gap-2">
                       <button className="px-3 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:bg-white transition-all">Previous</button>
                       <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-[#0A0A0A] shadow-sm">1</button>
                       <button className="px-3 py-1 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 hover:bg-white transition-all">Next</button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === "competitors" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List of competitors</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white rounded-xl text-[10px] font-bold hover:bg-black/90 transition-all shadow-md">
                    ADD COMPETITOR
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                   <table className="w-full">
                      <thead className="bg-gray-50/50">
                        <tr>
                           {["Competitor", "Subscribers", "Views", "Videos", "Likes", "Comments", "Avg. Views/Video"].map(h => (
                             <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                           ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {[
                          { name: "Google", handle: "@google", subs: "864.67K", views: "14.1M", videos: "56", likes: "1.8K", comments: "102", avg: "250K", color: "#4285F4" },
                          { name: "YouTube", handle: "@youtube", subs: "120M", views: "5.4B", videos: "1,245", likes: "85K", comments: "12K", avg: "4.3M", color: "#FF0000" },
                          { name: "Meta", handle: "@meta", subs: "1.2M", views: "45M", videos: "312", likes: "12K", comments: "1.2K", avg: "144K", color: "#0668E1" },
                        ].map((comp, i) => (
                          <tr key={i} className="hover:bg-[#F8F8F7]/50 transition-colors">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: comp.color }}>
                                      {comp.name.charAt(0)}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-sm font-bold text-[#0A0A0A]">{comp.name}</span>
                                      <span className="text-[10px] font-medium text-gray-400">{comp.handle}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-sm font-bold text-[#0A0A0A]">{comp.subs}</td>
                             <td className="px-6 py-4 text-sm font-bold text-gray-500">{comp.views}</td>
                             <td className="px-6 py-4 text-sm font-bold text-gray-500">{comp.videos}</td>
                             <td className="px-6 py-4 text-sm font-bold text-gray-500">{comp.likes}</td>
                             <td className="px-6 py-4 text-sm font-bold text-gray-500">{comp.comments}</td>
                             <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                   <span className="text-sm font-bold text-[#0A0A0A]">{comp.avg}</span>
                                   <div className="w-20 h-1 bg-gray-100 rounded-full">
                                      <div className="h-full bg-[#D9F99D] rounded-full" style={{ width: '65%' }} />
                                   </div>
                                </div>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

            {/* Viewed Tab Placeholder */}
            {activeTab === "viewed" && (
               <div className="h-96 flex flex-col items-center justify-center text-center bg-white border border-gray-100 rounded-3xl shadow-sm px-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                     <BarChart2 size={40} className="text-gray-200" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0A0A]">No viewed videos data</h3>
                  <p className="text-sm text-gray-500 mt-2 mb-8 max-w-sm">Viewed videos analytics will appear here once you start tracking specific video performance.</p>
                  <button className="px-8 py-3 bg-[#0A0A0A] text-white rounded-xl text-sm font-bold hover:bg-black/90 transition-all shadow-md">
                    Start Tracking
                  </button>
               </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
