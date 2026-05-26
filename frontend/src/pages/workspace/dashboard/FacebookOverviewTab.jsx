import React from "react";
import { GenericDashboardTab } from "./GenericDashboardTab";

export function FacebookOverviewTab({ realData = {} }) {
  const growthData = realData.growth || [];
  const summary = realData.summary || {};

  // Config metrics for Growth tab
  const metricConfig = [
    {
      key: "followers",
      label: "Followers",
      color: "bg-[#86EFAC] text-gray-900",
      chartColor: "#4ADE80",
      type: "area",
      value: summary.followers || 0
    },
    {
      key: "views",
      label: "Views",
      color: "bg-[#FBCFE8] text-gray-900",
      chartColor: "#EC4899",
      type: "line",
      value: summary.views || 0,
      initialActive: false
    },
    {
      key: "pageVisits",
      label: "Page visits",
      color: "bg-[#E9D5FF] text-gray-900",
      chartColor: "#A855F7",
      type: "line",
      value: summary.pageVisits || 0,
      initialActive: false
    },
    {
      key: "totalContent",
      label: "Total content",
      color: "bg-[#FEF08A] text-gray-900",
      chartColor: "#FEF08A",
      type: "bar",
      yAxisId: "right",
      value: summary.totalContent || 0
    }
  ];

  // Summary Grid configs
  const summaryGrid = [
    { label: "Average daily new followers", value: summary.averageDailyNewFollowers || 0 },
    { label: "Daily page views", value: summary.dailyPageViews || 0 },
    { label: "Daily posts", value: summary.dailyPosts || 0 },
    { label: "Posts per week", value: summary.postsPerWeek || 0 }
  ];

  return (
    <GenericDashboardTab
      title="Growth"
      description="Thống kê sự tăng trưởng của trang qua thời gian"
      data={growthData}
      metricConfig={metricConfig}
      summaryGrid={summaryGrid}
    />
  );
}
