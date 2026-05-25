import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, Bar } from 'recharts';
import { MetricCard } from './MetricCard';

export function GrowthChart({ 
  stats = {}, 
  totalPeriodViews = 0, 
  totalPeriodGained = 0, 
  selectedMetrics = {}, 
  handleMetricToggle = () => {}, 
  communityGrowthData = [] 
}) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <h3 className="text-base font-bold text-[#0A0A0A]">Growth</h3>
          
          {/* Summary Cards */}
          <div className="flex flex-wrap gap-3 z-10">
             {[
               { key: "subscribers", label: "Subscribers", value: stats.subscribers || totalPeriodGained || 12, color: "bg-[#8E9BEE]" },
               { key: "views", label: "Video views", value: totalPeriodViews || 13, color: "bg-[#86EFAC]" },
               { key: "revenue", label: "Revenue", value: "0", color: "bg-[#C084FC]" },
               { key: "videos", label: "Videos", value: stats.videos || 3, color: "bg-[#E6A34A]", trend: "↓", trendValue: "2" },
             ].map((c, i) => (
               <MetricCard
                 key={i}
                 isActive={selectedMetrics[c.key]}
                 color={c.color}
                 value={c.value}
                 label={c.label}
                 trend={c.trend}
                 trendValue={c.trendValue}
                 onClick={() => handleMetricToggle(c.key)}
               />
             ))}
          </div>
       </div>

       <div className="relative h-[300px] w-full">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-[0.03] select-none">
             <span className="text-6xl font-black rotate-[-15deg]">publicast</span>
             <span className="text-6xl font-black rotate-[-15deg] hidden lg:block">publicast</span>
             <span className="text-6xl font-black rotate-[-15deg] hidden xl:block">publicast</span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={communityGrowthData}>
               <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
               <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
                 dy={10} 
                 interval={
                   communityGrowthData.length <= 7 ? 0 :
                   communityGrowthData.length <= 14 ? 1 :
                   communityGrowthData.length <= 31 ? 2 :
                   Math.floor(communityGrowthData.length / 10)
                 }
               />
               <YAxis 
                 yAxisId="left"
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
               />
               <YAxis 
                 yAxisId="right"
                 orientation="right"
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
                 hide={!selectedMetrics.videos}
               />
               <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
               {selectedMetrics.subscribers && (
                 <Area 
                   yAxisId="left" 
                   type="monotone" 
                   dataKey="subscribers" 
                   stroke="#8E9BEE" 
                   fill="rgba(142, 155, 238, 0.1)" 
                   strokeWidth={3} 
                   dot={{ fill: '#8E9BEE', strokeWidth: 2, r: 4, stroke: '#fff' }} 
                   activeDot={{ r: 6 }} 
                   connectNulls={true} 
                 />
               )}
               {selectedMetrics.views && (
                 <Line yAxisId="left" type="monotone" dataKey="views" stroke="#86EFAC" strokeWidth={2} dot={{ fill: '#86EFAC', r: 4, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls={true} />
               )}
               {selectedMetrics.revenue && (
                 <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#C084FC" strokeWidth={2} dot={{ fill: '#C084FC', r: 4, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls={true} />
               )}
               {selectedMetrics.videos && (
                 <Bar yAxisId="right" dataKey="videos" fill="#E6A34A" radius={[4, 4, 0, 0]} barSize={20} opacity={0.8} />
               )}
            </ComposedChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
}
