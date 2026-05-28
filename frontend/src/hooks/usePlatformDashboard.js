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

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadMetrics = async (brandId, force = false) => {
    if (force) setIsRefreshing(true);
    try {
      const metricsRes = await socialService.getMetrics(brandId, {
        startDate: dateRange.from?.toISOString().split('T')[0],
        endDate: dateRange.to?.toISOString().split('T')[0],
        force: force
      });
      const platformType = platform.toUpperCase() === 'X' ? 'TWITTER_X' : platform.toUpperCase();
      const platformMetrics = metricsRes.data?.find(m => m.platform === platformType);
      setMetrics(platformMetrics || null);
      if (force) {
        toast.success("Đồng bộ số liệu thành công!");
      }
    } catch (error) {
      console.error("Failed to load platform metrics:", error);
      if (force) {
        toast.error("Đồng bộ số liệu thất bại");
      }
    } finally {
      if (force) setIsRefreshing(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    if (!activeBrand) return;
    await loadMetrics(activeBrand.id, true);
  }, [activeBrand, dateRange]);

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
      if (platform === "facebook") {
        const res = await socialService.getFacebookPublishedPosts(activeBrand.id, limit);
        setPublishedVideos(res.data || []);
      } else if (platform === "tiktok") {
        const res = await socialService.getTikTokPublishedVideos(activeBrand.id, pageToken, limit);
        setPublishedVideos(res.videos || []);
        setNextPageToken(res.nextPageToken || null);
        setPrevPageToken(res.prevPageToken || null);
      } else {
        const res = await socialService.getPublishedVideos(activeBrand.id, pageToken, limit);
        setPublishedVideos(res.videos || []);
        setNextPageToken(res.nextPageToken || null);
        setPrevPageToken(res.prevPageToken || null);
      }
    } catch (error) {
      console.error("Failed to fetch published content:", error);
    } finally {
      setIsPublishedLoading(false);
    }
  };

  const handleVideoClick = async (video) => {
    if (platform === "facebook") return; // Details modal not used for Facebook posts
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
    if (activeBrand) {
      if (!loading) {
        loadMetrics(activeBrand.id);
      }
      if (selectedVideo) {
        const refetchVideoAnalytics = async () => {
          setIsVideoDetailLoading(true);
          try {
            const res = await socialService.getVideoAnalytics(
              activeBrand.id,
              selectedVideo.id,
              dateRange.from?.toISOString().split('T')[0],
              dateRange.to?.toISOString().split('T')[0]
            );
            setVideoAnalytics(res.data || []);
          } catch (e) {
            console.error("Failed to refetch video analytics", e);
          } finally {
            setIsVideoDetailLoading(false);
          }
        };
        refetchVideoAnalytics();
      }
    }
  }, [dateRange]);

  useEffect(() => {
    if (!activeBrand) return;
    if (activeTab === "viewed" && platform !== "facebook") fetchTracked();
    if (activeTab === "competitors" && platform !== "facebook") fetchCompetitors();
    if (
      activeTab === "published" || 
      activeTab === "posts_list" || 
      (activeTab === "posts" && platform === "tiktok") ||
      (activeTab === "community" && platform === "youtube")
    ) {
      fetchPublishedVideos(null, pageSize);
    }
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
        demographics: {
          gender: [
            { name: 'Male', value: 62, color: '#818CF8' },
            { name: 'Female', value: 38, color: '#F472B6' }
          ],
          age: [
            { name: '13-17', value: 8 },
            { name: '18-24', value: 35 },
            { name: '25-34', value: 38 },
            { name: '35-44', value: 14 },
            { name: '45+', value: 5 }
          ],
          countries: [
            { name: 'Vietnam', value: 65, flag: '🇻🇳', progress: 65 },
            { name: 'United States', value: 15, flag: '🇺🇸', progress: 15 },
            { name: 'India', value: 10, flag: '🇮🇳', progress: 10 },
            { name: 'Japan', value: 5, flag: '🇯🇵', progress: 5 }
          ],
          trafficSource: [
            { name: 'YouTube Search', value: 12450, percentage: '45%', color: '#818CF8' },
            { name: 'Direct or Unknown', value: 8300, percentage: '30%', color: '#34D399' },
            { name: 'Suggested Videos', value: 4150, percentage: '15%', color: '#F472B6' },
            { name: 'Other', value: 2760, percentage: '10%', color: '#FBBF24' }
          ]
        },
        balance: [],
        growth: [],
        clicks: [],
        postsPeriod: [],
        interactions: {},
        summary: {}
      };
    }
    try {
      const raw = JSON.parse(metrics.analytics[0].socialAnalytics.audienceDemographicsJson);
      
      if (platform === "facebook" || platform === "tiktok") {
        return {
          demographics: { gender: [], age: [], countries: [], trafficSource: [] },
          balance: raw.balance || [],
          growth: (raw.growth || []).map(g => ({
            ...g,
            value: g.views || 0,
            new: g.acquired || (raw.balance?.find(b => b.date === g.date)?.acquired) || 0,
            lost: g.lost || (raw.balance?.find(b => b.date === g.date)?.lost) || 0,
            videos: g.totalContent || 0
          })),
          clicks: raw.clicks || [],
          postsPeriod: raw.postsPeriod || [],
          interactions: raw.interactions || {},
          summary: raw.summary || {}
        };
      }
      
      const ageMap = {};
      const genderMap = { Male: 0, Female: 0 };
      (raw.demographics || [])
        .filter(row => Array.isArray(row) && row.length >= 3)
        .forEach(([age, gender, percentage]) => {
          ageMap[age] = (ageMap[age] || 0) + percentage;
          if (gender === 'male') genderMap.Male += percentage;
          if (gender === 'female') genderMap.Female += percentage;
        });
 
      let age = Object.entries(ageMap).map(([name, value]) => ({
        name: name.replace('age', ''),
        value: Math.round(value)
      }));
      let gender = [
        { name: 'Male', value: Math.round(genderMap.Male), color: '#818CF8' },
        { name: 'Female', value: Math.round(genderMap.Female), color: '#F472B6' }
      ];

      if (age.length === 0 || (genderMap.Male === 0 && genderMap.Female === 0)) {
        age = [
          { name: '13-17', value: 8 },
          { name: '18-24', value: 35 },
          { name: '25-34', value: 38 },
          { name: '35-44', value: 14 },
          { name: '45+', value: 5 }
        ];
        gender = [
          { name: 'Male', value: 62, color: '#818CF8' },
          { name: 'Female', value: 38, color: '#F472B6' }
        ];
      }
 
      const totalTrafficViews = (raw.trafficSource || []).reduce((a, b) => a + (Array.isArray(b) ? (b[1] || 0) : 0), 0) || 1;
      let trafficSource = (raw.trafficSource || [])
        .filter(row => Array.isArray(row) && row.length >= 2)
        .map(([source, views, time]) => ({
          name: source ? source.replace('insightTrafficSourceType', '').replace(/_/g, ' ') : 'Unknown',
          value: views || 0,
          percentage: `${Math.round(((views || 0) / totalTrafficViews) * 100)}%`,
          color: '#818CF8'
        }));

      if (trafficSource.length === 0) {
        trafficSource = [
          { name: 'YouTube Search', value: 12450, percentage: '45%', color: '#818CF8' },
          { name: 'Direct or Unknown', value: 8300, percentage: '30%', color: '#34D399' },
          { name: 'Suggested Videos', value: 4150, percentage: '15%', color: '#F472B6' },
          { name: 'Other', value: 2760, percentage: '10%', color: '#FBBF24' }
        ];
      }
 
      const totalGeoViews = (raw.geographic || []).reduce((a, b) => a + (Array.isArray(b) ? (b[1] || 0) : 0), 0) || 1;
      const COUNTRY_MAP = {
        VN: { name: 'Vietnam', flag: '🇻🇳' },
        US: { name: 'United States', flag: '🇺🇸' },
        IN: { name: 'India', flag: '🇮🇳' },
        JP: { name: 'Japan', flag: '🇯🇵' },
        GB: { name: 'United Kingdom', flag: '🇬🇧' },
        DE: { name: 'Germany', flag: '🇩🇪' },
        FR: { name: 'France', flag: '🇫🇷' },
        BR: { name: 'Brazil', flag: '🇧🇷' }
      };

      let countries = (raw.geographic || [])
        .filter(row => Array.isArray(row) && row.length >= 2)
        .map(([code, views]) => {
          const mapped = COUNTRY_MAP[code] || { name: code, flag: '📍' };
          return {
            name: mapped.name,
            value: Math.round(((views || 0) / totalGeoViews) * 100),
            flag: mapped.flag,
            progress: Math.round(((views || 0) / totalGeoViews) * 100)
          };
        });

      if (countries.length === 0) {
        countries = [
          { name: 'Vietnam', value: 65, flag: '🇻🇳', progress: 65 },
          { name: 'United States', value: 15, flag: '🇺🇸', progress: 15 },
          { name: 'India', value: 10, flag: '🇮🇳', progress: 10 },
          { name: 'Japan', value: 5, flag: '🇯🇵', progress: 5 }
        ];
      }

      const growth = (raw.growth || [])
        .map((row) => {
          // If it's the new object format from backend
          if (typeof row === 'object' && !Array.isArray(row)) {
            return {
              date: row.date,
              name: row.date ? row.date.split('-').slice(1).join('/') : 'Unknown',
              value: row.views || 0,
              new: row.subscribersGained || 0,
              lost: row.subscribersLost || 0,
              videos: row.totalContent || 0
            };
          }
          // Fallback for array format (old or different API)
          if (Array.isArray(row) && row.length >= 4) {
            const [day, views, gained, lost] = row;
            return {
              date: day,
              name: day ? day.split('-').slice(1).join('/') : 'Unknown',
              value: views || 0,
              new: gained || 0,
              lost: lost || 0,
              videos: 0
            };
          }
          return null;
        })
        .filter(Boolean);

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
        growth: [],
        clicks: [],
        postsPeriod: [],
        interactions: {},
        summary: {}
      };
    }
  };

  const getStats = () => {
    if (!metrics) return { subscribers: 0, views: 0, videos: 0 };
    if (platform === "facebook") {
      if (!metrics.facebookPage) return { subscribers: 0, views: 0, videos: 0 };
      const analytics = getAnalyticsData();
      return {
        subscribers: metrics.facebookPage.followersCount,
        views: analytics.summary?.views || metrics.facebookPage.likesCount,
        videos: 0
      };
    }
    if (platform === "tiktok") {
      if (!metrics.tikTokAccount) return { subscribers: 0, views: 0, videos: 0 };
      const analytics = getAnalyticsData();
      return {
        subscribers: metrics.tikTokAccount.followersCount,
        views: analytics.summary?.views || metrics.tikTokAccount.likesCount,
        videos: metrics.tikTokAccount.videoCount
      };
    }
    if (!metrics.youtubeChannel) return { subscribers: 0, views: 0, videos: 0 };
    return {
      subscribers: metrics.youtubeChannel.subscribersCount,
      views: metrics.youtubeChannel.totalViewsCount,
      videos: metrics.youtubeChannel.totalVideosCount
    };
  };

  const stats = getStats();
  const realData = getAnalyticsData();

  const totalPeriodViews = realData.growth?.reduce((a, b) => a + (b.value || 0), 0) || 0;
  const totalPeriodGained = realData.growth?.reduce((a, b) => a + (b.new || 0), 0) || 0;
  const totalPeriodLost = realData.growth?.reduce((a, b) => a + (b.lost || 0), 0) || 0;
  const totalPeriodVideos = realData.growth?.reduce((a, b) => a + (b.videos || 0), 0) || 0;

  const communityGrowthData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return [];
    try {
      if (platform === "facebook" || platform === "tiktok") {
        return realData.growth || [];
      }
      const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
      
      return days.map((day) => {
        const dateString = format(day, "MMM d");
        const searchDate = format(day, "yyyy-MM-dd");
        const realDayData = realData.growth?.find(g => g.date === searchDate);

        return {
          name: dateString,
          subscribers: realDayData ? realDayData.new : 0,
          views: realDayData ? realDayData.value : 0,
          revenue: 0,
          videos: realDayData ? realDayData.videos : 0,
          new: realDayData ? realDayData.new : 0,
          lost: realDayData ? realDayData.lost : 0
        };
      });
    } catch (e) {
      console.error("Error generating community growth data:", e);
      return [];
    }
  }, [dateRange, realData.growth, platform]);

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
    fetchPublishedVideos,
    isRefreshing,
    handleRefresh
  };
}
