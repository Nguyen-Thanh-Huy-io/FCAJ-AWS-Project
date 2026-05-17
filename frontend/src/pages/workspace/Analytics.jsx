import { useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from "recharts";
import { 
  TrendingUp, Users, Eye, MessageSquare, Share2, 
  ChevronDown, Calendar, Filter, Globe, Download
} from "lucide-react";

import { PlatformIcon } from "../../components/shared/PlatformIcon";
import { StatCard } from "../../components/shared/StatCard";

const data = [
  { name: "Mon", yt: 4000, fb: 2400, ig: 2400 },
  { name: "Tue", yt: 3000, fb: 1398, ig: 2210 },
  { name: "Wed", yt: 2000, fb: 9800, ig: 2290 },
  { name: "Thu", yt: 2780, fb: 3908, ig: 2000 },
  { name: "Fri", yt: 1890, fb: 4800, ig: 2181 },
  { name: "Sat", yt: 2390, fb: 3800, ig: 2500 },
  { name: "Sun", yt: 3490, fb: 4300, ig: 2100 },
];

const platformStats = [
  { name: "YouTube", followers: "125K", growth: "+12%", color: "#FF0000" },
  { name: "Facebook", followers: "82K", growth: "+5%", color: "#1877F2" },
  { name: "Instagram", followers: "210K", growth: "+18%", color: "#E1306C" },
  { name: "TikTok", followers: "45K", growth: "+31%", color: "#000000" },
];

export function AnalyticsPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(["YouTube", "Facebook", "Instagram"]);

  const togglePlatform = (p) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter(x => x !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F7]" style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Analytics Overview</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Performance tracking across all connected channels.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Calendar size={14} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Reach" value="1.2M" delta="↑ 8.4%" />
        <StatCard label="Engagements" value="48.2K" delta="↑ 12.1%" />
        <StatCard label="New Followers" value="5,291" delta="↑ 4.2%" />
        <StatCard label="Avg. Watch Time" value="12m 40s" delta="↓ 2.1%" deltaColor="#DC2626" />
      </div>

      {/* Platform Multi-select */}
      <div className="flex gap-2 mb-8">
        {["YouTube", "Facebook", "Instagram", "TikTok", "LinkedIn", "X"].map(p => {
          const isSelected = selectedPlatforms.includes(p);
          return (
            <button 
              key={p}
              onClick={() => togglePlatform(p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold ${isSelected ? 'bg-[#0A0A0A] text-white border-black shadow-md scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
            >
              <PlatformIcon platform={p} size={14} />
              {p}
            </button>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                 <TrendingUp size={18} className="text-gray-400" />
                 <span className="text-sm font-bold text-[#0A0A0A] uppercase tracking-widest">Growth Trend</span>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] font-bold text-gray-400 uppercase">YouTube</span></div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-gray-400 uppercase">Facebook</span></div>
              </div>
           </div>
           <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                   <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF0000" stopOpacity={0.1}/><stop offset="95%" stopColor="#FF0000" stopOpacity={0}/></linearGradient>
                   <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1877F2" stopOpacity={0.1}/><stop offset="95%" stopColor="#1877F2" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EF" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: 11 }}
                  cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="yt" stroke="#FF0000" fillOpacity={1} fill="url(#colorYt)" strokeWidth={3} />
                <Area type="monotone" dataKey="fb" stroke="#1877F2" fillOpacity={1} fill="url(#colorFb)" strokeWidth={3} />
              </AreaChart>
           </ResponsiveContainer>
        </div>

        <div className="col-span-4 flex flex-col gap-8">
           {/* Audience Breakdown */}
           <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm flex-1">
              <h3 className="text-sm font-bold text-[#0A0A0A] mb-8 uppercase tracking-widest">Follower Reach</h3>
              <div className="space-y-6">
                 {platformStats.map(ps => (
                   <div key={ps.name} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-2">
                            <PlatformIcon platform={ps.name} size={16} />
                            <span className="font-bold text-[#0A0A0A]">{ps.name}</span>
                         </div>
                         <div className="flex gap-2">
                            <span className="font-black text-[#0A0A0A]">{ps.followers}</span>
                            <span className="text-green-500 font-bold">{ps.growth}</span>
                         </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-50 overflow-hidden">
                         <div className="h-full rounded-full" style={{ width: '60%', background: ps.color }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Engagement Table */}
      <div className="mt-8 bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">
         <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-widest">Recent Performance by Post</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All Content →</button>
         </div>
         <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               <tr>
                  <th className="px-8 py-4">Content</th>
                  <th className="px-8 py-4">Network</th>
                  <th className="px-8 py-4">Reach</th>
                  <th className="px-8 py-4">Engagement</th>
                  <th className="px-8 py-4">Date</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {[1,2,3,4].map(i => (
                 <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100" />
                          <div className="text-xs font-bold text-[#0A0A0A]">Tech Review #{i+102}...</div>
                       </div>
                    </td>
                    <td className="px-8 py-4"><PlatformIcon platform="YouTube" size={18} /></td>
                    <td className="px-8 py-4 text-xs font-bold">12.4K</td>
                    <td className="px-8 py-4 text-xs font-bold text-green-600">8.2%</td>
                    <td className="px-8 py-4 text-xs text-gray-400">May 12, 2026</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
