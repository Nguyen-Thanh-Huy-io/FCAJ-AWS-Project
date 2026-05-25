import React from "react";
import { FacebookOverviewTab } from "./FacebookOverviewTab";
import { FacebookFollowersTab } from "./FacebookFollowersTab";
import { FacebookClicksTab } from "./FacebookClicksTab";
import { FacebookPostsTab } from "./FacebookPostsTab";
import { FacebookInteractionsTab } from "./FacebookInteractionsTab";
import { FacebookPostsListTab } from "./FacebookPostsListTab";

export function FacebookDashboard({
  metrics,
  dateRange,
  setDateRange,
  realData,
  activeTab,
  setActiveTab,
  publishedVideos,
  isPublishedLoading,
  pageSize,
  setPageSize,
  fetchPublishedVideos,
}) {
  return (
    <>
      {activeTab === "overview" && (
        <FacebookOverviewTab realData={realData} />
      )}

      {activeTab === "followers" && (
        <FacebookFollowersTab realData={realData} />
      )}

      {activeTab === "clicks" && (
        <FacebookClicksTab realData={realData} />
      )}

      {activeTab === "posts" && (
        <FacebookPostsTab realData={realData} />
      )}

      {activeTab === "interactions" && (
        <FacebookInteractionsTab realData={realData} />
      )}

      {activeTab === "posts_list" && (
        <FacebookPostsListTab
          publishedVideos={publishedVideos}
          isPublishedLoading={isPublishedLoading}
          pageSize={pageSize}
          setPageSize={setPageSize}
          fetchPublishedVideos={fetchPublishedVideos}
        />
      )}
    </>
  );
}
