import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, Bar, PieChart, Pie, Cell } from 'recharts';
import { MetricCard } from './MetricCard';

export function FacebookInteractionsTab({ realData = {} }) {
  const [selectedMetrics, setSelectedMetrics] = useState({
    reactions: true,
    comments: true,
    shares: true
  });

  const handleMetricToggle = (key) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const chartData = realData.growth || [];
  const interactions = realData.interactions || {};

  const cards = [
    { key: "reactions", label: "Reactions", value: interactions.reactions || 0, color: "bg-[#818CF8] text-white" },
    { key: "comments", label: "Comments", value: interactions.comments || 0, color: "bg-[#4ADE80] text-gray-900" },
    { key: "shares", label: "Shared", value: interactions.shares || 0, color: "bg-[#F472B6] text-white" }
  ];

  const dailyAverages = [
    { label: "Daily reactions", value: interactions.dailyReactions || 0 },
    { label: "Reactions per post", value: interactions.reactionsPerPost || 0 },
    { label: "Daily comments", value: interactions.dailyComments || 0 },
    { label: "Comments per post", value: interactions.commentsPerPost || 0 },
    { label: "Shares per day", value: interactions.sharesPerDay || 0 },
    { label: "Shares per post", value: interactions.sharesPerPost || 0 }
  ];

  // Pie Charts Data
  const typesData = [
    { name: "Album", value: interactions.typesBreakdown?.album || 0, color: "#818CF8" },
    { name: "Image", value: interactions.typesBreakdown?.image || 100, color: "#F472B6" }
  ].filter(d => d.value > 0);

  const viewsData = [
    { name: "Organic", value: interactions.viewsBreakdown?.organic || 70, color: "#4ADE80" },
    { name: "Promoted", value: interactions.viewsBreakdown?.promoted || 30, color: "#A855F7" }
  ];

  return (
    <div className="space-y-8">
      {/* Chart Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h3 className="text-base font-bold text-[#0A0A0A]">Interactions</h3>
            <p className="text-xs text-gray-400 mt-1">Lượng tương tác bao gồm thích, bình luận và chia sẻ bài viết</p>
          </div>
          
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

        <div className="relative h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 600 }} 
              />
              <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
              
              {selectedMetrics.reactions && (
                <Area 
                  type="monotone" 
                  dataKey="reactions" 
                  stroke="#818CF8" 
                  strokeWidth={3} 
                  fill="rgba(129, 140, 248, 0.05)"
                  dot={{ fill: '#818CF8', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedMetrics.comments && (
                <Line 
                  type="monotone" 
                  dataKey="comments" 
                  stroke="#4ADE80" 
                  strokeWidth={3} 
                  dot={{ fill: '#4ADE80', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {selectedMetrics.shares && (
                <Line 
                  type="monotone" 
                  dataKey="shares" 
                  stroke="#F472B6" 
                  strokeWidth={3} 
                  dot={{ fill: '#F472B6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of Averages */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dailyAverages.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[90px]">
            <span className="text-xl font-bold text-gray-800">{item.value}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tight">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Breakdown Section: Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Types breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
          <h4 className="text-sm font-bold text-[#0A0A0A] mb-4 self-start">Types</h4>
          <div className="w-full h-48 flex items-center justify-around">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={typesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {typesData.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-xs font-bold text-gray-700">{t.name}: {t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Views breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
          <h4 className="text-sm font-bold text-[#0A0A0A] mb-4 self-start">Views</h4>
          <div className="w-full h-48 flex items-center justify-around">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={viewsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {viewsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {viewsData.map((v, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                  <span className="text-xs font-bold text-gray-700">{v.name}: {v.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
