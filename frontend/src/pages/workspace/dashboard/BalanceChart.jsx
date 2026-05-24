import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Bar } from 'recharts';
import { MetricCard } from './MetricCard';

export function BalanceChart({ 
  stats, 
  totalPeriodGained, 
  selectedBalanceMetrics, 
  handleBalanceMetricToggle, 
  communityGrowthData 
}) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <h3 className="text-base font-bold text-[#0A0A0A]">Balance of Subscribers</h3>
          
          {/* Summary Cards */}
          <div className="flex flex-wrap gap-3 z-10">
             {[
               { key: "gained", label: "Gained", value: totalPeriodGained || 0, color: "bg-[#8E9BEE]" },
               { key: "lost", label: "Lost", value: "0", color: "bg-[#F7A6E0]" },
               { key: "videos", label: "Videos", value: stats.videos || 3, color: "bg-[#E6A34A]", trend: "↓", trendValue: "2" },
             ].map((c, i) => (
               <MetricCard
                 key={i}
                 isActive={selectedBalanceMetrics[c.key]}
                 color={c.color}
                 value={c.value}
                 label={c.label}
                 trend={c.trend}
                 trendValue={c.trendValue}
                 onClick={() => handleBalanceMetricToggle(c.key)}
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
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
               />
               <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
               {selectedBalanceMetrics.gained && (
                 <Area 
                   type="monotone" 
                   dataKey="new" 
                   stroke="#8E9BEE" 
                   strokeWidth={3} 
                   fill="none"
                   dot={{ fill: '#8E9BEE', strokeWidth: 2, r: 4, stroke: '#fff' }}
                   activeDot={{ r: 6 }}
                   connectNulls={true}
                 />
               )}
               {selectedBalanceMetrics.lost && (
                 <Area 
                   type="monotone" 
                   dataKey="lost" 
                   stroke="#F7A6E0" 
                   strokeWidth={3} 
                   fill="none"
                   dot={{ fill: '#F7A6E0', strokeWidth: 2, r: 4, stroke: '#fff' }}
                   activeDot={{ r: 6 }}
                   connectNulls={true}
                 />
               )}
               {selectedBalanceMetrics.videos && (
                 <Bar dataKey="videos" fill="#E6A34A" radius={[4, 4, 0, 0]} barSize={20} opacity={0.8} />
               )}
            </ComposedChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
}
