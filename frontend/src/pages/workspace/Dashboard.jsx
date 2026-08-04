import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp, FileText, CheckCircle2, Clock, AlertCircle, AlertTriangle, Plus, ChevronRight, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from "recharts";

import { PlatformIcon } from "../../components/shared/PlatformIcon";
import { StatCard } from "../../components/shared/StatCard";
import { useBrand } from "../../context/BrandContext";
import socialService from "../../services/social.service";
import postService from "../../services/post.service";
import { POST_STATUS } from "../../constants/postStatus";
import { usePostCreator } from "../../context/PostCreatorContext";

const PLATFORM_COLORS = {
  YouTube: "#FF0000",
  Facebook: "#1877F2",
  TikTok: "#010101",
  Instagram: "#E1306C",
  Twitch: "#9146FF",
  LinkedIn: "#0A66C2",
  X: "#000000" 
};

// Cấu hình nhãn tiếng Việt, màu sắc, icon cho từng trạng thái bài viết (tránh magic strings)
const STATUS_CONFIG = {
  [POST_STATUS.DRAFT]: {
    label: "Bản nháp",
    colorClass: "bg-gray-100 text-gray-700 border-gray-200",
    icon: <FileText size={12} className="text-gray-500" />
  },
  [POST_STATUS.PUBLISHED]: {
    label: "Đã đăng",
    colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={12} className="text-emerald-600" />
  },
  [POST_STATUS.SCHEDULED]: {
    label: "Đã lên lịch",
    colorClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock size={12} className="text-blue-600" />
  },
  [POST_STATUS.PENDING_APPROVAL]: {
    label: "Chờ duyệt",
    colorClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <AlertCircle size={12} className="text-amber-600" />
  },
  [POST_STATUS.FAILED]: {
    label: "Thất bại",
    colorClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: <AlertTriangle size={12} className="text-rose-600" />
  }
};

const BRAND_PLATFORMS = [
  { name: "YouTube", apiKey: "YOUTUBE", label: "YouTube" },
  { name: "Facebook", apiKey: "FACEBOOK", label: "Facebook" },
  { name: "Instagram", apiKey: "INSTAGRAM", label: "Instagram" },
  { name: "TikTok", apiKey: "TIKTOK", label: "TikTok" },
  { name: "LinkedIn", apiKey: "LINKEDIN", label: "LinkedIn" },
  { name: "Discord", apiKey: "DISCORD", label: "Discord" },
  { name: "Threads", apiKey: "THREADS", label: "Threads" }
];

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [metrics, setMetrics] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeBrand } = useBrand();
  const { openPostCreator } = usePostCreator();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success") === "google_login") {
      toast.success("Đăng nhập bằng Google thành công!");
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (!activeBrand) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [metricsRes, postsRes] = await Promise.all([
          socialService.getMetrics(activeBrand.id),
          postService.getPosts(activeBrand.id, { limit: 5 })
        ]);
        setMetrics(metricsRes.data || []);
        setRecentPosts(postsRes.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeBrand]);

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
    { platform: "LinkedIn", viewers: 0, pct: 0 },
    { platform: "Discord", viewers: 0, pct: 0 },
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
          <div className="col-span-7 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-[320px] space-y-4">
            <div className="flex justify-between">
              <div className="w-24 h-4 bg-gray-100/80 rounded" />
              <div className="w-16 h-4 bg-gray-100/80 rounded" />
            </div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-gray-50 rounded-2xl h-16 bg-gray-50/30" />
            ))}
          </div>

          <div className="col-span-5 flex flex-col gap-6">
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
          label="Tổng người theo dõi"
          value={stats.subscribers.toLocaleString()}
          delta="Thời gian thực"
          deltaColor="#16A34A"
        />
        <StatCard
          label="Tổng lượt xem"
          value={stats.views.toLocaleString()}
          note="Kênh YouTube"
        />
        <StatCard
          label="Tổng video"
          value={stats.videos.toLocaleString()}
          note="Đã tải lên"
        />
        <StatCard
          label="Thương hiệu hiện tại"
          value={activeBrand?.name || "Không xác định"}
          delta="Đang chọn"
          deltaColor="#16A34A"
        />
      </div>

      {/* Weekly Viewers Chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <TrendingUp size={16} className="text-gray-400" />
             <span className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">Xu Hướng Lượng Người Xem</span>
          </div>
          <span onClick={() => navigate("/analytics")} className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">Xem Chi Tiết Báo Cáo →</span>
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
        {/* Recent Posts Queue (Cột trái) */}
        <div className="col-span-7 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5 min-h-[350px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">Hàng chờ bài đăng gần đây</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openPostCreator()}
                className="flex items-center gap-1 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors px-3 py-1.5 rounded-lg border-none cursor-pointer"
              >
                <Plus size={13} />
                Tạo bài đăng
              </button>
              <button
                onClick={() => navigate("/planner")}
                className="text-xs font-bold text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
              >
                Lịch đăng →
              </button>
            </div>
          </div>

          {recentPosts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <FileText size={40} className="text-gray-300 mb-3" />
              <p className="text-xs font-semibold text-gray-500 mb-1">Chưa có bài đăng nào</p>
              <p className="text-[11px] text-gray-400 max-w-[280px] mb-4">Hãy tạo bài đăng đầu tiên để lên lịch hoặc đăng ngay lên các mạng xã hội!</p>
              <button
                onClick={() => openPostCreator()}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-lg border-none cursor-pointer transition-colors"
              >
                Tạo Ngay
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentPosts.map((post) => {
                const statusUpper = post.status ? post.status.toUpperCase() : POST_STATUS.DRAFT;
                const statusInfo = STATUS_CONFIG[statusUpper] || STATUS_CONFIG[POST_STATUS.DRAFT];
                
                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3.5 border border-gray-100 hover:border-gray-200 rounded-2xl bg-white hover:shadow-sm transition-all group cursor-pointer"
                    onClick={() => navigate("/planner")}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Thumbnail or Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={18} className="text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-gray-800 truncate group-hover:text-purple-700 transition-colors mb-1.5">
                          {post.title || "Bài viết không tiêu đề"}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {post.scheduledAt 
                              ? `Lên lịch: ${new Date(post.scheduledAt).toLocaleDateString("vi-VN")}` 
                              : `Tạo lúc: ${new Date(post.createdAt).toLocaleDateString("vi-VN")}`
                            }
                          </span>
                          <span className="text-[10px] text-gray-300">•</span>
                          {/* Target platforms */}
                          <div className="flex items-center gap-1">
                            {post.platforms?.map((plat) => (
                              <PlatformIcon key={plat} platform={plat} size={14} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${statusInfo.colorClass}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Platform Status and Reach (Cột phải) */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* Platform Connections Status */}
          <div className="bg-[#0A0A0A] rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-bold text-white uppercase tracking-widest">Kết Nối Mạng Xã Hội</span>
              <button 
                onClick={() => navigate("/manage/connections")}
                className="text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-wider bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border-none cursor-pointer transition-colors"
              >
                Quản lý
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              {BRAND_PLATFORMS.map((platform, i, arr) => {
                const connected = metrics.some(m => m.platform === platform.apiKey);
                return (
                  <div
                    key={platform.name}
                    className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <PlatformIcon platform={platform.name} size={18} />
                    <span className="text-xs font-bold text-gray-200 flex-1">{platform.label}</span>
                    {connected ? (
                      <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        Đã kết nối
                      </span>
                    ) : (
                      <button
                        onClick={() => navigate("/manage/connections")}
                        className="text-[9px] font-extrabold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border-none px-2 py-0.5 rounded uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        Kết nối
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reach by Network */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex-1">
            <div className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider mb-6">Độ Phủ Theo Nền Tảng</div>
            <div className="flex flex-col gap-4.5">
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
                  <span className="text-[10px] font-black text-[#0A0A0A] w-12 text-right shrink-0">
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
