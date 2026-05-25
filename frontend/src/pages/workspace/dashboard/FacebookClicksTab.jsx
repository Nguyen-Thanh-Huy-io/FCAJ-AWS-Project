import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, Bar } from 'recharts';
import { MetricCard } from './MetricCard';

export function FacebookClicksTab({ realData = {} }) {
  const [selectedMetrics, setSelectedMetrics] = useState({
    totalClicks: true,
    pageVisits: true,
    totalContent: true
  });

  const handleMetricToggle = (key) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clicksData = realData.clicks || [];
  const summary = realData.summary || {};

  const totalClicks = clicksData.reduce((sum, d) => sum + (d.totalClicks || 0), 0);
  const totalPageVisits = clicksData.reduce((sum, d) => sum + (d.pageVisits || 0), 0);

  const cards = [
    { key: "totalClicks", label: "Clicks", value: totalClicks, color: "bg-[#86EFAC] text-gray-900" },
    { key: "pageVisits", label: "Page visits", value: totalPageVisits, color: "bg-[#E9D5FF] text-gray-900" },
    { key: "totalContent", label: "Total content", value: summary.totalContent || 0, color: "bg-[#FEF08A] text-gray-900" }
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h3 className="text-base font-bold text-[#0A0A0A]">Clicks on page</h3>
          <p className="text-xs text-gray-400 mt-1">Lượt click vào các nút hành động, thông tin liên hệ và lượt truy cập trang</p>
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
          <ComposedChart data={clicksData}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
              dy={10} 
              interval={
                clicksData.length <= 7 ? 0 :
                clicksData.length <= 14 ? 1 :
                clicksData.length <= 31 ? 2 :
                Math.floor(clicksData.length / 10)
              }
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
            />
            <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
            
            {selectedMetrics.totalClicks && (
              <Area 
                type="monotone" 
                dataKey="totalClicks" 
                stroke="#4ADE80" 
                strokeWidth={3} 
                fill="rgba(74, 222, 128, 0.05)"
                dot={{ fill: '#4ADE80', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            )}
            {selectedMetrics.pageVisits && (
              <Line 
                type="monotone" 
                dataKey="pageVisits" 
                stroke="#A855F7" 
                strokeWidth={3} 
                dot={{ fill: '#A855F7', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            )}
            {selectedMetrics.totalContent && (
              <Bar 
                dataKey="totalContent" 
                fill="#EAB308" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
                opacity={0.8} 
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
