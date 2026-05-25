import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, Bar } from 'recharts';
import { MetricCard } from './MetricCard';

export function FacebookFollowersTab({ realData = {} }) {
  const [selectedMetrics, setSelectedMetrics] = useState({
    acquired: true,
    lost: true,
    totalContent: true
  });

  const handleMetricToggle = (key) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const balanceData = realData.balance || [];
  const summary = realData.summary || {};

  const totalAcquired = balanceData.reduce((sum, d) => sum + (d.acquired || 0), 0);
  const totalLost = balanceData.reduce((sum, d) => sum + (d.lost || 0), 0);

  const cards = [
    { key: "acquired", label: "Acquired", value: totalAcquired, color: "bg-[#818CF8] text-white" },
    { key: "lost", label: "Lost", value: totalLost, color: "bg-[#F472B6] text-white" },
    { key: "totalContent", label: "Total content", value: summary.totalContent || 0, color: "bg-[#F59E0B] text-white" }
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h3 className="text-base font-bold text-[#0A0A0A]">Balance of Followers</h3>
          <p className="text-xs text-gray-400 mt-1">Biến động của số lượng người theo dõi qua các ngày</p>
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
          <ComposedChart data={balanceData}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
              dy={10} 
              interval={
                balanceData.length <= 7 ? 0 :
                balanceData.length <= 14 ? 1 :
                balanceData.length <= 31 ? 2 :
                Math.floor(balanceData.length / 10)
              }
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
            />
            <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
            
            {selectedMetrics.acquired && (
              <Area 
                type="monotone" 
                dataKey="acquired" 
                stroke="#818CF8" 
                strokeWidth={3} 
                fill="rgba(129, 140, 248, 0.05)"
                dot={{ fill: '#818CF8', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            )}
            {selectedMetrics.lost && (
              <Line 
                type="monotone" 
                dataKey="lost" 
                stroke="#F472B6" 
                strokeWidth={3} 
                dot={{ fill: '#F472B6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            )}
            {selectedMetrics.totalContent && (
              <Bar 
                dataKey="totalContent" 
                fill="#F59E0B" 
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
