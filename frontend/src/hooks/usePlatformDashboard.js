import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { subDays, eachDayOfInterval, format } from "date-fns";
import { toast } from "sonner";
import brandService from "../services/brand.service";
import socialService from "../services/social.service";

export function usePlatformDashboard(platform) {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("community");
  const [showInfo, setShowInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  
  // Date Range State
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [selectedMetrics, setSelectedMetrics] = useState({
    subscribers: true,
    views: true,
    revenue: true,
    videos: true
  });

  const handleMetricToggle = (metricKey) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metricKey]: !prev[metricKey]
    }));
  };

  const [selectedBalanceMetrics, setSelectedBalanceMetrics] = useState({
    gained: true,
    lost: true,
    videos: true
  });

  const handleBalanceMetricToggle = (metricKey) => {
    setSelectedBalanceMetrics(prev => ({
      ...prev,
      [metricKey]: !prev[metricKey]
    }));
  };

  const [trackedVideos, setTrackedVideos] = useState([]);
  const [publishedVideos, setPublishedVideos] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [isPublishedLoading, setIsPublishedLoading] = useState(false);
  const [isCompetitorLoading, setIsCompetitorLoading] = useState(false);
  
  // Pagination States
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [pageSize, setPageSize] = useState("10");

  // Modal States
  const [videoUrl, setVideoUrl] = useState("");
  const [competitorQuery, setCompetitorQuery] = useState("");
  const [searchResults, setSearchChannels] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCompetitorModalOpen, setIsCompetitorModalOpen] = useState(false);

  // Video Detail State
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoAnalytics, setVideoAnalytics] = useState([]);
  const [isVideoDetailLoading, setIsVideoDetailLoading] = useState(false);
  const [isVideoDetailModalOpen, setIsVideoDetailModalOpen] = useState(false);

  const loadMetrics = async (brandId) => {
    try {
      const metricsRes = await socialService.getMetrics(brandId, {
        startDate: dateRange.from?.toISOString().split('T')[0],
        endDate: dateRange.to?.toISOString().split('T')[0]
      });
      const platformType = platform.toUpperCase() === 'X' ? 'TWITTER_X' : platform.toUpperCase();
      const platformMetrics = metricsRes.data?.find(m => m.platform === platformType);
      setMetrics(platformMetrics || null);
    } catch (error) {
      console.error("Failed to load platform metrics:", error);
    }
  };

  const fetchTracked = async () => {
    if (!activeBrand) return;
    setIsTrackingLoading(true);
    try {
      const res = await socialService.getTrackedVideos(activeBrand.id);
      setTrackedVideos(res.data || []);
    } catch (error) {
      console.error("Failed to fetch tracked videos:", error);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const fetchCompetitors = async () => {
    if (!activeBrand) return;
    setIsCompetitorLoading(true);
    try {
      const res = await socialService.getCompetitors(activeBrand.id);
      setCompetitors(res.data || []);
    } catch (error) {
      console.error("Failed to fetch competitors:", error);
    } finally {
      setIsCompetitorLoading(false);
    }
  };

  const fetchPublishedVideos = async (pageToken = null, limit = pageSize) => {
    if (!activeBrand) return;
    setIsPublishedLoading(true);
    try {
      const res = await socialService.getPublishedVideos(activeBrand.id, pageToken, limit);
      setPublishedVideos(res.videos || []);
      setNextPageToken(res.nextPageToken || null);
      setPrevPageToken(res.prevPageToken || null);
    } catch (error) {
      console.error("Failed to fetch published videos:", error);
    } finally {
      setIsPublishedLoading(false);
    }
  };

  const handleVideoClick = async (video) => {
    setSelectedVideo(video);
    setIsVideoDetailModalOpen(true);
    setIsVideoDetailLoading(true);
    try {
      const res = await socialService.getVideoAnalytics(
        activeBrand.id, 
        video.id,
        dateRange.from?.toISOString().split('T')[0],
        dateRange.to?.toISOString().split('T')[0]
      );
      setVideoAnalytics(res.data || []);
    } catch (e) {
      console.error("Failed to fetch video analytics", e);
      toast.error("Failed to load video analytics");
    } finally {
      setIsVideoDetailLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const brandsRes = await brandService.getBrands();
        if (brandsRes.data && brandsRes.data.length > 0) {
          const brand = brandsRes.data[0];
          setActiveBrand(brand);
          await loadMetrics(brand.id);
        }
      } catch (error) {
        console.error("Initial load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [platform]);

  // Reload metrics when dateRange changes
  useEffect(() => {
    if (activeBrand && !loading) {
      loadMetrics(activeBrand.id);
    }
  }, [dateRange]);

  useEffect(() => {
    if (!activeBrand) return;
    if (activeTab === "viewed") fetchTracked();
    if (activeTab === "competitors") fetchCompetitors();
    if (activeTab === "published") fetchPublishedVideos(null, pageSize);
  }, [activeTab, activeBrand, pageSize]);

  const handleTrackVideo = async () => {
    if (!videoUrl) return;
    try {
      await socialService.addTrackedVideo(activeBrand.id, videoUrl);
      toast.success("Video added to tracking list");
      setVideoUrl("");
      setIsVideoModalOpen(false);
      fetchTracked();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to track video");
    }
  };

  const handleSearchCompetitors = async () => {
    if (!competitorQuery) return;
    setIsSearching(true);
    try {
      const res = await socialService.searchChannels(activeBrand.id, competitorQuery);
      setSearchChannels(res.data || []);
    } catch (e) {
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCompetitor = async (channelId) => {
    try {
      await socialService.addCompetitor(activeBrand.id, channelId);
      toast.success("Competitor added");
      setIsCompetitorModalOpen(false);
      setSearchChannels([]);
      setCompetitorQuery("");
      fetchCompetitors();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add competitor");
    }
  };

  const getAnalyticsData = () => {
    if (!metrics?.analytics?.[0]?.socialAnalytics?.audienceDemographicsJson) {
      return {
        demographics: { gender: [], age: [], countries: [], trafficSource: [] },
        balance: [],
        growth: []
      };
    }
    try {
      const raw = JSON.parse(metrics.analytics[0].socialAnalytics.audienceDemographicsJson);
      
      const ageMap = {};
      const genderMap = { Male: 0, Female: 0 };
      raw.demographics?.forEach(([age, gender, percentage]) => {
        ageMap[age] = (ageMap[age] || 0) + percentage;
        if (gender === 'male') genderMap.Male += percentage;
        if (gender === 'female') genderMap.Female += percentage;
      });

      const age = Object.entries(ageMap).map(([name, value]) => ({
        name: name.replace('age', ''),
        value: Math.round(value)
      }));
      const gender = [
        { name: 'Male', value: Math.round(genderMap.Male), color: '#818CF8' },
        { name: 'Female', value: Math.round(genderMap.Female), color: '#F472B6' }
      ];

      const totalTrafficViews = raw.trafficSource?.reduce((a, b) => a + (b[1] || 0), 0) || 1;
      const trafficSource = raw.trafficSource?.map(([source, views, time]) => ({
        name: source.replace('insightTrafficSourceType', '').replace(/_/g, ' '),
        value: views,
        percentage: `${Math.round((views / totalTrafficViews) * 100)}%`,
        color: '#818CF8'
      })) || [];

      const totalGeoViews = raw.geographic?.reduce((a, b) => a + (b[1] || 0), 0) || 1;
      const countries = raw.geographic?.map(([code, views]) => ({
        name: code, 
        value: Math.round((views / totalGeoViews) * 100),
        flag: '📍',
        progress: Math.round((views / totalGeoViews) * 100)
      })) || [];

      const growth = raw.growth?.map(([day, views, gained, lost]) => ({
        name: day.split('-').slice(1).join('/'),
        value: views,
        new: gained,
        lost: lost
      })) || [];

      return {
        demographics: { age, gender, countries, trafficSource },
        balance: growth,
        growth: growth
      };
    } catch (e) {
      console.error("Error parsing analytics data:", e);
      return {
        demographics: { gender: [], age: [], countries: [], trafficSource: [] },
        balance: [],
        growth: []
      };
    }
  };

  const getYouTubeStats = () => {
    if (!metrics || !metrics.youtubeChannel) return { subscribers: 0, views: 0, videos: 0 };
    return {
      subscribers: metrics.youtubeChannel.subscribersCount,
      views: metrics.youtubeChannel.totalViewsCount,
      videos: metrics.youtubeChannel.totalVideosCount
    };
  };

  const stats = getYouTubeStats();
  const realData = getAnalyticsData();

  const totalPeriodViews = realData.growth?.reduce((a, b) => a + b.value, 0) || 0;
  const totalPeriodGained = realData.growth?.reduce((a, b) => a + b.new, 0) || 0;

  const communityGrowthData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return [];
    try {
      const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
      return days.map((day) => {
        const dateString = format(day, "MMM d");
        const searchName = format(day, "MM/dd");
        const realDayData = realData.growth?.find(g => g.name === searchName);

        return {
          name: dateString,
          subscribers: realDayData ? realDayData.new : 0,
          views: realDayData ? realDayData.value : 0,
          revenue: 0,
          videos: undefined, // Default to none unless we track daily uploads
          new: realDayData ? realDayData.new : 0,
          lost: realDayData ? realDayData.lost : 0
        };
      });
    } catch (e) {
      console.error("Error generating community growth data:", e);
      return [];
    }
  }, [dateRange, realData.growth]);

  return {
    activeTab,
    setActiveTab,
    showInfo,
    setShowInfo,
    loading,
    metrics,
    dateRange,
    setDateRange,
    selectedMetrics,
    handleMetricToggle,
    selectedBalanceMetrics,
    handleBalanceMetricToggle,
    trackedVideos,
    publishedVideos,
    competitors,
    isTrackingLoading,
    isPublishedLoading,
    isCompetitorLoading,
    nextPageToken,
    prevPageToken,
    pageSize,
    setPageSize,
    videoUrl,
    setVideoUrl,
    competitorQuery,
    setCompetitorQuery,
    searchResults,
    isSearching,
    isVideoModalOpen,
    setIsVideoModalOpen,
    isCompetitorModalOpen,
    setIsCompetitorModalOpen,
    selectedVideo,
    setSelectedVideo,
    videoAnalytics,
    isVideoDetailLoading,
    isVideoDetailModalOpen,
    setIsVideoDetailModalOpen,
    handleVideoClick,
    stats,
    realData,
    totalPeriodViews,
    totalPeriodGained,
    communityGrowthData,
    handleTrackVideo,
    handleSearchCompetitors,
    handleAddCompetitor,
    fetchPublishedVideos
  };
}
