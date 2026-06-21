import React, { useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  BarChart3, 
  Flame, 
  Share2, 
  MessageCircle, 
  ThumbsUp, 
  Globe,
  Trash2,
  X
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { toast } from "sonner";
import { PlatformIcon } from "../../components/shared/PlatformIcon";

// Initial Brand Benchmarking Data
const INITIAL_COMPETITORS = [
  { id: "our", name: "Thương hiệu của bạn (PubliCast)", handle: "@publicast_app", followers: 45000, postsPerWeek: 12, engagementRate: 4.8, growth: 12.5, isSelf: true },
  { id: "comp-1", name: "Buffer Tech", handle: "@buffer_hq", followers: 185000, postsPerWeek: 24, engagementRate: 2.1, growth: 3.2, isSelf: false },
  { id: "comp-2", name: "Hootsuite Social", handle: "@hootsuite", followers: 320000, postsPerWeek: 35, engagementRate: 1.8, growth: 1.5, isSelf: false },
  { id: "comp-3", name: "Later Media", handle: "@latermedia", followers: 410000, postsPerWeek: 18, engagementRate: 5.6, growth: 14.8, isSelf: false }
];

// Followers Growth History for Recharts
const GROWTH_DATA = [
  { month: "Jan", "PubliCast": 25000, "Buffer Tech": 178000, "Hootsuite Social": 315000, "Later Media": 350000 },
  { month: "Feb", "PubliCast": 28000, "Buffer Tech": 179000, "Hootsuite Social": 316000, "Later Media": 362000 },
  { month: "Mar", "PubliCast": 32000, "Buffer Tech": 181000, "Hootsuite Social": 318000, "Later Media": 378000 },
  { month: "Apr", "PubliCast": 38000, "Buffer Tech": 183000, "Hootsuite Social": 319000, "Later Media": 395000 },
  { month: "May", "PubliCast": 45000, "Buffer Tech": 185000, "Hootsuite Social": 320000, "Later Media": 410000 },
];

// Top Competitor Posts Data
const INITIAL_TOP_POSTS = [
  {
    id: "post-1",
    author: "Later Media",
    platform: "Instagram",
    content: "3 Social Media trends you CANNOT ignore in 2026. Spoiler: Faceless channels are here to stay! 🤫 Let us know your thoughts below.",
    likes: 12400,
    comments: 890,
    shares: 2300,
    reachRate: 8.4,
    date: "2 ngày trước",
    media: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "post-2",
    author: "Buffer Tech",
    platform: "LinkedIn",
    content: "We just transitioned our entire team to a 4-day work week. Here is the full breakdown of our productivity metrics, customer satisfaction, and revenue impact.",
    likes: 8500,
    comments: 420,
    shares: 1100,
    reachRate: 6.2,
    date: "4 ngày trước",
    media: null
  },
  {
    id: "post-3",
    author: "Later Media",
    platform: "TikTok",
    content: "POV: You are trying to schedule 50 TikTok videos before the weekend starts 🖥️😭 #socialmediamanager #worklife #agencyproblems",
    likes: 45000,
    comments: 1800,
    shares: 5400,
    reachRate: 12.1,
    date: "1 tuần trước",
    media: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=60"
  }
];

export function CompetitorsPage() {
  const [competitors, setCompetitors] = useState(INITIAL_COMPETITORS);
  const [topPosts, setTopPosts] = useState(INITIAL_TOP_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHandle, setSearchHandle] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");

  // Add Competitor
  const handleAddCompetitor = (e) => {
    e.preventDefault();
    if (!searchHandle.trim()) {
      toast.error("Vui lòng nhập handle của đối thủ");
      return;
    }

    const cleanHandle = searchHandle.startsWith("@") ? searchHandle : `@${searchHandle}`;
    const brandName = searchHandle.replace(/[@_.]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const newComp = {
      id: `comp-${Date.now()}`,
      name: brandName,
      handle: cleanHandle,
      followers: Math.floor(20000 + Math.random() * 250000),
      postsPerWeek: Math.floor(5 + Math.random() * 25),
      engagementRate: parseFloat((1.5 + Math.random() * 5.5).toFixed(1)),
      growth: parseFloat((1.2 + Math.random() * 15).toFixed(1)),
      isSelf: false
    };

    setCompetitors(prev => [...prev, newComp]);
    toast.success(`Đã thêm đối thủ cạnh tranh ${cleanHandle} thành công!`);
    setIsModalOpen(false);
    setSearchHandle("");
  };

  // Delete Competitor
  const handleDeleteCompetitor = (id) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
    toast.success("Đã xóa đối thủ cạnh tranh khỏi danh sách theo dõi.");
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8F9FA] p-6 space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36] flex items-center gap-2">
            <BarChart3 className="text-[#3B82F6] w-6 h-6" />
            Competitor Benchmarking
          </h1>
          <p className="text-sm text-[#8792A2] mt-0.5">
            So sánh thương hiệu của bạn với các đối thủ hàng đầu và tìm kiếm cảm hứng từ những nội dung thành công.
          </p>
        </div>

        {/* Add Competitor Trigger */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-[#222] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 shrink-0"
        >
          <Plus size={16} />
          Theo dõi đối thủ mới
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Benchmarking Matrix Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-[#1A1F36]">Chỉ số đối sánh (Benchmarking Matrix)</h4>
              <p className="text-xs text-[#8792A2] mt-0.5">So sánh tổng quan sức mạnh truyền thông</p>
            </div>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              Đang theo dõi {competitors.length - 1} đối thủ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Thương hiệu</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Followers</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Tần suất đăng</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Tỷ lệ tương tác</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Tăng trưởng</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {competitors.map((c) => (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${
                      c.isSelf ? "bg-emerald-50/20" : ""
                    }`}
                  >
                    
                    {/* Brand Meta */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {c.isSelf ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                            P
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-[#4F5B66] flex items-center justify-center font-bold text-xs uppercase">
                            {c.name.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-[#1A1F36] flex items-center gap-1.5">
                            {c.name}
                            {c.isSelf && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold uppercase">
                                Bạn
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#8792A2]">{c.handle}</div>
                        </div>
                      </div>
                    </td>

                    {/* Followers */}
                    <td className="py-4 px-6 text-sm font-semibold text-[#1A1F36]">
                      {c.followers.toLocaleString()}
                    </td>

                    {/* Posts Per Week */}
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-[#1A1F36]">{c.postsPerWeek} bài</div>
                      <div className="text-xs text-[#8792A2]">mỗi tuần</div>
                    </td>

                    {/* Engagement Rate */}
                    <td className="py-4 px-6">
                      <span className={`text-sm font-bold ${
                        c.engagementRate >= 4.0 ? "text-emerald-600" : "text-[#1A1F36]"
                      }`}>
                        {c.engagementRate}%
                      </span>
                    </td>

                    {/* Growth Rate */}
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-[#16A34A] flex items-center gap-0.5">
                        <TrendingUp size={12} /> +{c.growth}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {!c.isSelf && (
                        <button 
                          onClick={() => handleDeleteCompetitor(c.id)}
                          className="text-[#8792A2] hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Followers Growth Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1A1F36] flex items-center gap-2">
              <Users size={18} className="text-[#10B981]" />
              Biểu đồ tăng trưởng Followers
            </h4>
            <p className="text-xs text-[#8792A2] mt-0.5">Tốc độ mở rộng cộng đồng 5 tháng qua</p>
          </div>

          <div className="h-60 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="selfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8792A2" }} />
                <YAxis tick={{ fontSize: 10, fill: "#8792A2" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="PubliCast" stroke="#10B981" strokeWidth={2.5} fill="url(#selfGrad)" name="Bạn" />
                <Area type="monotone" dataKey="Buffer Tech" stroke="#3B82F6" strokeWidth={1.5} fill="none" name="Buffer Tech" />
                <Area type="monotone" dataKey="Later Media" stroke="#F59E0B" strokeWidth={1.5} fill="none" name="Later Media" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Section: Top Performing Competitor Posts */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-base font-bold text-[#1A1F36] flex items-center gap-2">
              <Flame size={18} className="text-[#EF4444] animate-bounce" />
              Bài viết tốt nhất của đối thủ (Top Posts)
            </h4>
            <p className="text-xs text-[#8792A2] mt-0.5">Học hỏi chiến lược nội dung viral từ các đối thủ của bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPosts.map((post) => (
            <div key={post.id} className="border border-[#E5E7EB] rounded-2xl overflow-hidden flex flex-col bg-white hover:shadow-md transition-shadow">
              
              {/* Post Header */}
              <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#FAFAFA]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs uppercase">
                    {post.author.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1F36]">{post.author}</div>
                    <div className="text-[10px] text-[#8792A2]">{post.date}</div>
                  </div>
                </div>
                <PlatformIcon platform={post.platform} size={18} />
              </div>

              {/* Post Image (If any) */}
              {post.media && (
                <div className="h-44 overflow-hidden border-b border-[#E5E7EB]">
                  <img src={post.media} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              )}

              {/* Post Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#4F5B66] leading-relaxed line-clamp-4">
                  {post.content}
                </p>

                {/* Post Footer / Engagement Metrics */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[#8792A2]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px]">
                      <ThumbsUp size={12} className="text-[#3B82F6]" />
                      {(post.likes / 1000).toFixed(1)}k
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MessageCircle size={12} className="text-purple-500" />
                      {post.comments}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Share2 size={12} className="text-emerald-500" />
                      {post.shares}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold bg-[#FAFAFA] border border-[#E5E7EB] text-[#1A1F36] px-2 py-0.5 rounded-md">
                    {post.reachRate}% Engagement
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Competitor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl border border-[#E5E7EB]">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#8792A2] hover:text-[#0a0a0a] cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#1A1F36] flex items-center gap-2 mb-4">
              <Globe className="text-blue-500 w-5 h-5" />
              Theo dõi đối thủ cạnh tranh mới
            </h3>

            <form onSubmit={handleAddCompetitor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Chọn mạng xã hội</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Instagram", "Facebook", "TikTok", "LinkedIn"].map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setSelectedPlatform(platform)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                        selectedPlatform === platform 
                          ? "border-[#0A0A0A] bg-slate-50 text-[#0A0A0A]" 
                          : "border-[#E5E7EB] hover:bg-slate-50/50 text-[#8792A2]"
                      }`}
                    >
                      <PlatformIcon platform={platform} size={16} />
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Username / Handle</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#8792A2] text-sm">@</span>
                  <input
                    type="text"
                    placeholder="buffer_hq"
                    value={searchHandle}
                    onChange={(e) => setSearchHandle(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E5E7EB] hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#0A0A0A] hover:bg-[#222] text-white transition-colors"
                >
                  Tìm & kết nối
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
