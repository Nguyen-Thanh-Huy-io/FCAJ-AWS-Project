import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, Bar } from 'recharts';
import { MetricCard } from './MetricCard';

export function FacebookPostsTab({ realData = {} }) {
  const [viewedMetrics, setViewedMetrics] = useState({
    views: true,
    reactions: true
  });

  const [publishedMetrics, setPublishedMetrics] = useState({
    views: true,
    reactions: true,
    posts: true
  });

  const postsData = realData.postsPeriod || [];
  const summary = realData.summary || {};

  const totalViews = postsData.reduce((sum, d) => sum + (d.views || 0), 0);
  const totalReactions = postsData.reduce((sum, d) => sum + (d.reactions || 0), 0);

  const viewedCards = [
    { key: "views", label: "Views", value: totalViews, color: "bg-[#EC4899] text-white" },
    { key: "reactions", label: "Reactions", value: totalReactions, color: "bg-[#F59E0B] text-white" }
  ];

  const publishedCards = [
    { key: "views", label: "Views", value: totalViews, color: "bg-[#A855F7] text-white" },
    { key: "reactions", label: "Interactions", value: totalReactions, color: "bg-[#4ADE80] text-gray-900" },
    { key: "posts", label: "Posts", value: summary.totalContent || 0, color: "bg-[#F59E0B] text-white" }
  ];

  return (
    <div className="space-y-8">
      {/* Chart 1: Viewed Posts */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h3 className="text-base font-bold text-[#0A0A0A]">Posts viewed in period</h3>
            <p className="text-xs text-gray-400 mt-1">Lượt hiển thị và lượng tương tác của các bài viết trong khoảng thời gian</p>
          </div>
          
          <div className="flex flex-wrap gap-3 z-10">
            {viewedCards.map((c, i) => (
              <MetricCard
                key={i}
                isActive={viewedMetrics[c.key]}
                color={c.color}
                value={c.value}
                label={c.label}
                onClick={() => setViewedMetrics(prev => ({ ...prev, [c.key]: !prev[c.key] }))}
              />
            ))}
          </div>
        </div>

        <div className="relative h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={postsData}>
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
              
              {viewedMetrics.views && (
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#EC4899" 
                  strokeWidth={3} 
                  fill="rgba(236, 72, 153, 0.05)"
                  dot={{ fill: '#EC4899', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {viewedMetrics.reactions && (
                <Line 
                  type="monotone" 
                  dataKey="reactions" 
                  stroke="#F59E0B" 
                  strokeWidth={3} 
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Published Posts */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h3 className="text-base font-bold text-[#0A0A0A]">Posts published in period</h3>
            <p className="text-xs text-gray-400 mt-1">Sự tương quan giữa số lượng bài đăng và lượng tương tác mang lại</p>
          </div>
          
          <div className="flex flex-wrap gap-3 z-10">
            {publishedCards.map((c, i) => (
              <MetricCard
                key={i}
                isActive={publishedMetrics[c.key]}
                color={c.color}
                value={c.value}
                label={c.label}
                onClick={() => setPublishedMetrics(prev => ({ ...prev, [c.key]: !prev[c.key] }))}
              />
            ))}
          </div>
        </div>

        <div className="relative h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={postsData}>
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
              
              {publishedMetrics.views && (
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#A855F7" 
                  strokeWidth={3} 
                  dot={{ fill: '#A855F7', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {publishedMetrics.reactions && (
                <Line 
                  type="monotone" 
                  dataKey="reactions" 
                  stroke="#4ADE80" 
                  strokeWidth={3} 
                  dot={{ fill: '#4ADE80', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              )}
              {publishedMetrics.posts && (
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
    </div>
  );
}
