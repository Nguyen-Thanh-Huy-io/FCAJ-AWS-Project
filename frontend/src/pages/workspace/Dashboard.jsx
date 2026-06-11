import { useNavigate, useLocation } from "react-router-dom";
import { Radio, TrendingUp, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from "recharts";

import { PlatformIcon } from "../../components/shared/PlatformIcon";
import { StatCard } from "../../components/shared/StatCard";
import { MetricToggle } from "../../components/shared/MetricToggle";
import brandService from "../../services/brand.service";
import socialService from "../../services/social.service";

const PLATFORM_COLORS = {
  YouTube: "#FF0000",
  Facebook: "#1877F2",
  TikTok: "#010101",
  Instagram: "#E1306C",
  Twitch: "#9146FF",
  LinkedIn: "#0A66C2",
  X: "#000000" 
};

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success") === "google_login") {
      toast.success("Đăng nhập bằng Google thành công!");
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const brandsRes = await brandService.getBrands();
        if (brandsRes.data && brandsRes.data.length > 0) {
          const brand = brandsRes.data[0]; // For now, use the first brand
          setActiveBrand(brand);
          
          const metricsRes = await socialService.getMetrics(brand.id);
          setMetrics(metricsRes.data || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getYouTubeStats = () => {
    const ytAccount = metrics.find(m => m.platform === 'YOUTUBE');
    if (!ytAccount || !ytAccount.youtubeChannel) return { subscribers: 0, views: 0, videos: 0 };
    return {
      subscribers: ytAccount.youtubeChannel.subscribersCount,
      views: ytAccount.youtubeChannel.totalViewsCount,
      videos: ytAccount.youtubeChannel.totalVideosCount
    };
  };

  const stats = getYouTubeStats();

  const viewersByPlatform = [
    { platform: "YouTube", viewers: stats.subscribers, pct: Math.min((stats.subscribers / 100000) * 100, 100) },
    { platform: "Facebook", viewers: 0, pct: 0 },
    { platform: "TikTok", viewers: 0, pct: 0 },
    { platform: "Instagram", viewers: 0, pct: 0 },
    { platform: "Twitch", viewers: 0, pct: 0 },
    { platform: "LinkedIn", viewers: 0, pct: 0 },
    { platform: "X", viewers: 0, pct: 0 },
  ];

  const weeklyData = [
    { day: "Mon", viewers: stats.subscribers * 0.8 },
    { day: "Tue", viewers: stats.subscribers * 0.85 },
    { day: "Wed", viewers: stats.subscribers * 0.9 },
    { day: "Thu", viewers: stats.subscribers * 0.92 },
    { day: "Fri", viewers: stats.subscribers * 0.95 },
    { day: "Sat", viewers: stats.subscribers * 0.98 },
    { day: "Sun", viewers: stats.subscribers },
  ];

  if (loading) {
    return (
      <div
        className="flex-1 overflow-y-auto bg-[#F8F8F7] animate-pulse"
        style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}
      >
        {/* Stat Cards Row Skeleton */}
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[110px] space-y-3">
              <div className="w-20 h-3 bg-gray-100 rounded" />
              <div className="w-28 h-6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Weekly Viewers Chart Skeleton */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-[200px] space-y-4">
          <div className="flex justify-between">
            <div className="w-32 h-4 bg-gray-100 rounded" />
            <div className="w-20 h-4 bg-gray-100 rounded" />
          </div>
          <div className="w-full h-[120px] bg-gray-50/50 rounded-xl" />
        </div>

        {/* Two Column Skeleton */}
        <div className="grid grid-cols-12 gap-6">
          {/* Live Streams Panel Skeleton */}
          <div className="col-span-7 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-[320px] space-y-4">
            <div className="flex justify-between">
              <div className="w-24 h-4 bg-gray-100/80 rounded" />
              <div className="w-16 h-4 bg-gray-100/80 rounded" />
            </div>
            {[1, 2].map((n) => (
              <div key={n} className="border border-gray-50 rounded-2xl h-24 bg-gray-50/30" />
            ))}
          </div>

          {/* Right Column Skeleton */}
          <div className="col-span-5 flex flex-col gap-6">
            <div className="bg-gray-200/50 rounded-3xl p-6 h-[200px]" />
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-[200px] space-y-3">
              <div className="w-32 h-4 bg-gray-100 rounded" />
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-full h-4 bg-gray-50/50 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto font-sans"
      style={{ background: "#F8F8F7", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}
    >
      {/* Stat Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Subscribers"
          value={stats.subscribers.toLocaleString()}
          delta="Real-time"
          deltaColor="#16A34A"
        />
        <StatCard
          label="Total Views"
          value={stats.views.toLocaleString()}
          note="YouTube Channel"
        />
        <StatCard
          label="Videos"
          value={stats.videos.toLocaleString()}
          note="Total uploaded"
        />
        <StatCard
          label="Active Brand"
          value={activeBrand?.name || "N/A"}
          delta="Selected"
          deltaColor="#16A34A"
        />
      </div>

      {/* Weekly Viewers Chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <TrendingUp size={16} className="text-gray-400" />
             <span className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">Viewer Trend</span>
          </div>
          <span onClick={() => navigate("/analytics")} className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">View Analytics →</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EF" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF", fontWeight: 700 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0A0A0A", border: "none", borderRadius: 12, fontSize: 11, color: "#FFF", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              cursor={{ stroke: "#E5E7EB" }}
            />
            <Line type="monotone" dataKey="viewers" stroke="#0A0A0A" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-12 gap-6">
        {/* Live Streams Panel */}
        <div className="col-span-7 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">Live Streams</span>
            <button
              onClick={() => navigate("/live")}
              className="text-xs font-bold text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
            >
              View All →
            </button>
          </div>

          {[
            {
              title: "Tech Review Q2 2025 – Official",
              viewers: "12,483",
              platforms: ["YouTube", "Facebook", "Instagram"] },
            {
              title: "Product Launch Livestream",
              viewers: "7,291",
              platforms: ["YouTube", "TikTok"] },
          ].map((stream, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden cursor-pointer border border-gray-50 hover:border-gray-200 transition-all shadow-sm group"
              onClick={() => navigate("/live")}
            >
              <div
                className="relative flex items-end justify-between px-4 pb-3"
                style={{ height: 100, background: "linear-gradient(135deg, #111 0%, #1a1a2e 100%)" }}
              >
                <span className="text-[10px] font-black bg-[#DC2626] text-white px-2 py-0.5 rounded-md tracking-widest uppercase animate-pulse">LIVE</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">👁 {stream.viewers}</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#0A0A0A] group-hover:text-blue-600 transition-colors">{stream.title}</span>
                <div className="flex items-center gap-1.5">
                  {stream.platforms.map((p) => (
                    <PlatformIcon key={p} platform={p} size={18} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* Multi-Platform Control */}
          <div className="bg-[#0A0A0A] rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-bold text-white uppercase tracking-widest">Live Control</span>
              <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            </div>
            <div className="flex flex-col gap-1">
              {[
                { name: "YouTube", quality: "1080p" },
                { name: "Facebook", quality: "720p" },
                { name: "TikTok", quality: "720p" },
                { name: "Instagram", quality: "720p" },
                { name: "Twitch", quality: "1080p" },
                { name: "LinkedIn", quality: "720p" },
                { name: "X", quality: "480p" },
              ].map((p, i, arr) => {
                const isConnected = metrics.some(m => m.platform === p.name.toUpperCase() || (p.name === 'X' && m.platform === 'TWITTER_X'));
                return (
                  <div
                    key={p.name}
                    className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <PlatformIcon platform={p.name} size={20} />
                    <span className="text-xs font-bold text-gray-200 flex-1">{p.name}</span>
                    <span className="text-[9px] font-black text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase">{p.quality}</span>
                    <MetricToggle on={isConnected} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Viewers by Platform */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex-1">
            <div className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider mb-6">Reach by Network</div>
            <div className="flex flex-col gap-4">
              {viewersByPlatform.map((item) => (
                <div key={item.platform} className="flex items-center gap-3">
                  <PlatformIcon platform={item.platform} size={16} />
                  <span className="text-[10px] font-bold text-gray-400 w-16 shrink-0 uppercase">{item.platform}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-gray-50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.pct}%`,
                        background: PLATFORM_COLORS[item.platform] || "#888" }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#0A0A0A] w-10 text-right shrink-0">
                    {item.viewers.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
