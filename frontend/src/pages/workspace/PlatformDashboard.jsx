import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Youtube, Instagram, Facebook, PlayCircle, Linkedin,
  TrendingUp, Users, Eye, MessageSquare, Share2, Calendar,
  Info, X, Diamond, Download, ExternalLink, BarChart2
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell
} from "recharts";

const PLATFORM_CONFIG = {
  youtube: { name: "YouTube", color: "#FF0000", icon: <Youtube size={20} /> },
  instagram: { name: "Instagram", color: "#E1306C", icon: <Instagram size={20} /> },
  facebook: { name: "Facebook", color: "#1877F2", icon: <Facebook size={20} /> },
  tiktok: { name: "TikTok", color: "#000", icon: <PlayCircle size={20} /> },
  linkedin: { name: "LinkedIn", color: "#0A66C2", icon: <Linkedin size={20} /> },
};

const YT_TABS = [
  { id: "community", label: "COMMUNITY" },
  { id: "published", label: "PUBLISHED VIDEOS" },
  { id: "viewed", label: "VIEWED VIDEOS" },
  { id: "competitors", label: "COMPETITORS" },
];

const dummyGrowthData = [
  { name: "17 Apr", value: 10 },
  { name: "24 Apr", value: 45 },
  { name: "01 May", value: 30 },
  { name: "08 May", value: 85 },
  { name: "15 May", value: 142 },
];

export function PlatformDashboardPage() {
  const { platform } = useParams();
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.youtube;
  const [activeTab, setActiveTab] = useState("community");
  const [showInfo, setShowInfo] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Sub-Navigation (Tabs) */}
      <div className="flex items-center justify-between px-6 border-b border-gray-100" style={{ height: 48 }}>
        <div className="flex gap-8 h-full">
          {YT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="h-full flex items-center text-[10px] font-bold tracking-wider transition-all relative"
              style={{ 
                color: activeTab === tab.id ? "#0A0A0A" : "#9CA3AF",
                borderBottom: activeTab === tab.id ? "2px solid #D9F99D" : "none" // Lime accent like image
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-[11px] font-medium text-gray-600">Apr 17, 2026 - May 16, 2026</span>
              <div className="w-4 h-4 rounded-full bg-[#E9D5FF] flex items-center justify-center">
                 <Diamond size={10} className="text-[#7E22CE]" />
              </div>
           </div>
        </div>
      </div>

      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        {/* Upgrade Banner */}
        <div className="bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
           <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D9F99D] flex items-center justify-center shrink-0">
                 <Diamond size={24} className="text-[#0A0A0A]" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-[#0A0A0A]">Do you need a higher plan?</h3>
                 <p className="text-sm text-gray-500">You need an upgraded plan to view data older than 30 days and without a watermark.</p>
              </div>
           </div>
           <button onClick={() => navigate("/pricing")} className="px-6 py-2 bg-[#2D1D35] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all">
             Upgrade your plan
           </button>
        </div>

        {/* Notification Info Box */}
        {showInfo && (
          <div className="bg-[#F0F9FF] rounded-xl p-4 border border-[#B9E6FE] flex items-center gap-3 relative">
             <Info size={18} className="text-[#026AA2] shrink-0" />
             <p className="text-xs text-[#026AA2] pr-8">
                Some YouTube metrics may not be available for the last 2-3 days. The number of subscribers will only be available from the day the account got connected.
             </p>
             <button onClick={() => setShowInfo(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#026AA2] hover:bg-[#B9E6FE]/50 p-1 rounded-md transition-all">
                <X size={14} />
             </button>
          </div>
        )}

        {/* Tab Content Header */}
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-bold text-[#0A0A0A] capitalize">{activeTab}</h2>
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E1306C] flex items-center justify-center text-white text-[10px] font-bold">C</div>
              <span className="text-xs font-bold text-gray-500">CodeChick</span>
              <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center">
                 <Youtube size={10} className="text-white" />
              </div>
           </div>
        </div>

        {/* Dynamic Content based on Tab */}
        {activeTab === "community" && (
          <div className="space-y-6">
             {/* Growth Metrics */}
             <div className="grid grid-cols-5 gap-4">
                {[
                  { label: "Subscribers", value: "12", color: "#818CF8" },
                  { label: "Total Views", value: "1.2K", color: "#4ADE80" },
                  { label: "Watch Time", value: "48h", color: "#F472B6" },
                  { label: "Shared", value: "24", color: "#FBBF24" },
                  { label: "Comments", value: "89", color: "#22D3EE" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col items-center">
                     <div className="text-2xl font-bold mb-1">{stat.value}</div>
                     <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{stat.label}</div>
                     <div className="w-full h-1 rounded-full mt-3" style={{ backgroundColor: stat.color + "20" }}>
                        <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: stat.color }} />
                     </div>
                  </div>
                ))}
             </div>

             {/* Growth Chart */}
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Growth</h3>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-[#818CF8]" />
                         <span className="text-[10px] font-bold text-gray-500">SUBSCRIBERS</span>
                      </div>
                   </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                   <BarChart data={dummyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                      <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                         {dummyGrowthData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === dummyGrowthData.length - 1 ? "#818CF8" : "#E5E7EB"} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        )}

        {activeTab === "published" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                   <tr>
                      {["Video", "Status", "Date", "Views", "Likes", "Comments"].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {[
                     { title: "React Router v7 Deep Dive", status: "Published", date: "May 14, 2025", views: "1.2K", likes: "245", comments: "12" },
                     { title: "Metricool UI Clone Tutorial", status: "Published", date: "May 10, 2025", views: "4.5K", likes: "892", comments: "45" },
                     { title: "Modern SaaS Architecture", status: "Scheduled", date: "May 20, 2025", views: "—", likes: "—", comments: "—" },
                   ].map((item, i) => (
                     <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-3">
                              <div className="w-16 h-10 bg-gray-200 rounded-md overflow-hidden relative group">
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                    <ExternalLink size={14} className="text-white" />
                                 </div>
                              </div>
                              <span className="text-sm font-bold text-[#0A0A0A]">{item.title}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {item.status}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">{item.date}</td>
                        <td className="px-6 py-5 text-sm font-bold text-[#0A0A0A]">{item.views}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{item.likes}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{item.comments}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === "competitors" && (
          <div className="grid grid-cols-3 gap-6">
             {[
               { name: "SocialHub Pro", subs: "120K", videos: "450", color: "#3B82F6" },
               { name: "Stream Master", subs: "85K", videos: "312", color: "#EC4899" },
               { name: "Content King", subs: "240K", videos: "1.2K", color: "#F59E0B" },
             ].map((comp) => (
               <div key={comp.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">🏢</div>
                     <div>
                        <h4 className="font-bold text-[#0A0A0A]">{comp.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Main Competitor</p>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Subscribers</span>
                        <span className="font-bold">{comp.subs}</span>
                     </div>
                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full" style={{ backgroundColor: comp.color, width: '70%' }} />
                     </div>
                     <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-gray-500">Total Videos</span>
                        <span className="font-bold">{comp.videos}</span>
                     </div>
                  </div>
                  <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                     View Comparison
                  </button>
               </div>
             ))}
             <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-gray-50 transition-all">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                   <Youtube size={24} className="text-gray-300" />
                </div>
                <h4 className="font-bold text-gray-400">Add Competitor</h4>
                <p className="text-xs text-gray-400 mt-1">Track growth against other channels</p>
             </div>
          </div>
        )}

        {/* Viewed Tab Placeholder */}
        {activeTab === "viewed" && (
           <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <BarChart2 size={32} className="text-gray-200" />
              </div>
              <h3 className="font-bold text-[#0A0A0A]">No data to show</h3>
              <p className="text-sm text-gray-500 mt-1">Your viewed videos analytics will appear here once tracked.</p>
           </div>
        )}

      </div>
    </div>
  );
}
