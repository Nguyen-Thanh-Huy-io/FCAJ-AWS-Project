import React from "react";
import { GenericDashboardTab } from "./GenericDashboardTab";

export function FacebookPostsTab({ realData = {} }) {
  const postsData = realData.postsPeriod || [];
  const summary = realData.summary || {};

  const totalViews = postsData.reduce((sum, d) => sum + (d.views || 0), 0);
  const totalReactions = postsData.reduce((sum, d) => sum + (d.reactions || 0), 0);

  // Chart 1 config
  const viewedConfig = [
    {
      key: "views",
      label: "Views",
      color: "bg-[#EC4899] text-white",
      chartColor: "#EC4899",
      type: "area",
      value: totalViews
    },
    {
      key: "reactions",
      label: "Reactions",
      color: "bg-[#F59E0B] text-white",
      chartColor: "#F59E0B",
      type: "line",
      value: totalReactions
    }
  ];

  // Chart 2 config
  const publishedConfig = [
    {
      key: "views",
      label: "Views",
      color: "bg-[#A855F7] text-white",
      chartColor: "#A855F7",
      type: "line",
      value: totalViews
    },
    {
      key: "reactions",
      label: "Interactions",
      color: "bg-[#4ADE80] text-gray-900",
      chartColor: "#4ADE80",
      type: "line",
      value: totalReactions
    },
    {
      key: "totalContent",
      label: "Posts",
      color: "bg-[#F59E0B] text-white",
      chartColor: "#F59E0B",
      type: "bar",
      yAxisId: "right",
      value: summary.totalContent || 0
    }
  ];

  return (
    <div className="space-y-8">
      <GenericDashboardTab
        title="Posts viewed in period"
        description="Lượt hiển thị và lượng tương tác của các bài viết trong khoảng thời gian"
        data={postsData}
        metricConfig={viewedConfig}
      />

      <GenericDashboardTab
        title="Posts published in period"
        description="Sự tương quan giữa số lượng bài đăng và lượng tương tác mang lại"
        data={postsData}
        metricConfig={publishedConfig}
      />
    </div>
  );
}
