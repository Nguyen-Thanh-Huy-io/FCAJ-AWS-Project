import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Area, Bar } from 'recharts';
import { MetricCard } from './MetricCard';

export function FacebookOverviewTab({ realData = {} }) {
  const [selectedMetrics, setSelectedMetrics] = useState({
    followers: true,
    views: false,
    pageVisits: false,
    totalContent: true
  });

  const handleMetricToggle = (key) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const growthData = realData.growth || [];
  const summary = realData.summary || {};

  const cards = [
    { key: "followers", label: "Followers", value: summary.followers || 0, color: "bg-[#86EFAC] text-gray-900" },
    { key: "views", label: "Views", value: summary.views || 0, color: "bg-[#FBCFE8] text-gray-900" },
    { key: "pageVisits", label: "Page visits", value: summary.pageVisits || 0, color: "bg-[#E9D5FF] text-gray-900" },
    { key: "totalContent", label: "Total content", value: summary.totalContent || 0, color: "bg-[#FEF08A] text-gray-900" }
  ];

  return (
    <div className="space-y-6">
      {/* Chart Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h3 className="text-base font-bold text-[#0A0A0A]">Growth</h3>
            <p className="text-xs text-gray-400 mt-1">Thống kê sự tăng trưởng của trang qua thời gian</p>
          </div>
          
          {/* Summary Cards */}
          <div className="flex flex-wrap gap-3 z-10">
            {cards.map((c, i) => (
              <MetricCard
                key={i}
                isActive={selectedMetrics[c.key]}
                color={c.color}
                value={c.value}
                label={c.label}
                onClick={() => handleMetricToggle(c.key)}
              />
            ))}
          </div>
        </div>

        <div className="relative h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={growthData}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
                dy={10} 
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
                hide={!selectedMetrics.totalContent}
              />
              <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
              
              {selectedMetrics.totalContent && (
                <Bar 
                  yAxisId="right"
                  dataKey="totalContent" 
                  fill="#FEF08A"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              )}
              {selectedMetrics.followers && (
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="followers" 
                  stroke="#4ADE80" 
                  strokeWidth={3} 
                  fill="rgba(74, 222, 128, 0.05)"
                  dot={{ fill: '#4ADE80', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedMetrics.views && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="views" 
                  stroke="#EC4899" 
                  strokeWidth={3} 
                  dot={{ fill: '#EC4899', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedMetrics.pageVisits && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="pageVisits" 
                  stroke="#A855F7" 
                  strokeWidth={3} 
                  dot={{ fill: '#A855F7', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gray Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Average daily new followers", value: summary.averageDailyNewFollowers || 0 },
          { label: "Daily page views", value: summary.dailyPageViews || 0 },
          { label: "Daily posts", value: summary.dailyPosts || 0 },
          { label: "Posts per week", value: summary.postsPerWeek || 0 }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[90px]">
            <span className="text-xl font-bold text-gray-800">{item.value}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
