import React, { useState } from "react";
import { 
  Link2, 
  Plus, 
  Smartphone, 
  Palette, 
  BarChart3, 
  Eye, 
  MousePointerClick, 
  Settings, 
  Trash2, 
  ChevronRight, 
  Check, 
  ArrowUpRight,
  TrendingUp,
  Share2,
  X
} from "lucide-react";
import { toast } from "sonner";

// Bio link themes
const THEMES = [
  { id: "midnight", name: "Midnight Black", bg: "bg-slate-950", text: "text-white", buttonBg: "bg-slate-800 hover:bg-slate-700", buttonText: "text-white", border: "border-slate-800" },
  { id: "sunset", name: "Sunset Orange", bg: "bg-gradient-to-tr from-amber-500 to-rose-500", text: "text-white", buttonBg: "bg-white/10 hover:bg-white/20 backdrop-blur-sm", buttonText: "text-white", border: "border-white/10" },
  { id: "mint", name: "Mint Glassmorphism", bg: "bg-gradient-to-tr from-teal-50 to-emerald-100", text: "text-slate-800", buttonBg: "bg-white/70 hover:bg-white/90 shadow-sm border border-emerald-200/50", buttonText: "text-slate-800", border: "border-emerald-200" },
  { id: "cyberpunk", name: "Cyberpunk Neon", bg: "bg-[#0c0f1d]", text: "text-[#00ffcc]", buttonBg: "bg-slate-900 hover:bg-slate-850 border border-[#ff0055] shadow-[0_0_8px_rgba(255,0,85,0.4)]", buttonText: "text-[#00ffcc]", border: "border-[#ff0055]" }
];

const INITIAL_LINKS = [
  { id: "l-1", title: "Website chính thức", url: "https://publicast.app", active: true, clicks: 1240 },
  { id: "l-2", title: "Khóa học Video Creation Masterclass", url: "https://academy.publicast.app", active: true, clicks: 890 },
  { id: "l-3", title: "Nhận tài liệu Ebook miễn phí 📚", url: "https://ebook.publicast.app", active: true, clicks: 560 },
  { id: "l-4", title: "Theo dõi kênh YouTube của chúng tôi", url: "https://youtube.com/c/publicast", active: false, clicks: 210 }
];

export function SmartLinksPage() {
  const [activeTab, setActiveTab] = useState("editor"); // editor | themes | analytics
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  
  // Profile Meta
  const [profileName, setProfileName] = useState("PubliCast App");
  const [profileBio, setProfileBio] = useState("Đơn giản hóa quản lý mạng xã hội của bạn 🚀");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80");

  // New Link Builder States
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, newSetUrl] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Link
  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      toast.error("Vui lòng điền tiêu đề và liên kết URL");
      return;
    }

    const newLinkItem = {
      id: `l-${Date.now()}`,
      title: newTitle,
      url: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
      active: true,
      clicks: 0
    };

    setLinks(prev => [...prev, newLinkItem]);
    toast.success("Đã thêm liên kết mới thành công!");
    setIsAddOpen(false);
    setNewTitle("");
    newSetUrl("");
  };

  // Toggle Link visibility
  const handleToggleLink = (id) => {
    setLinks(prev => prev.map(l => 
      l.id === id ? { ...l, active: !l.active } : l
    ));
    toast.success("Đã cập nhật hiển thị liên kết.");
  };

  // Delete Link
  const handleDeleteLink = (id) => {
    setLinks(prev => prev.filter(l => l.id !== id));
    toast.success("Đã xóa liên kết.");
  };

  // Simulate Click in preview
  const handlePreviewClick = (id, url) => {
    setLinks(prev => prev.map(l => 
      l.id === id ? { ...l, clicks: l.clicks + 1 } : l
    ));
    toast.success("Click registered! Mở liên kết ở tab mới.");
    window.open(url, "_blank");
  };

  const totalClicks = links.reduce((acc, l) => acc + l.clicks, 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8F9FA] p-6 space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36] flex items-center gap-2">
            <Link2 className="text-[#10B981] w-6 h-6" />
            SmartLinks (Bio-Link Page)
          </h1>
          <p className="text-sm text-[#8792A2] mt-0.5">
            Tạo trang Bio Link cá nhân hóa đẹp mắt, tập hợp tất cả các liên kết quan trọng của bạn trên một trang duy nhất.
          </p>
        </div>

        {/* Share Bio Link */}
        <button 
          onClick={() => {
            navigator.clipboard.writeText("https://publi.link/publicast");
            toast.success("Đã copy URL Bio Link của bạn vào clipboard!");
          }}
          className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-[#222] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 shrink-0"
        >
          <Share2 size={16} />
          Chia sẻ SmartLink
        </button>
      </div>

      {/* Two Column Workspace (Editor Left, Mobile Frame Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Customizer Tabs & Forms */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Tab Navigation */}
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-[#E5E7EB]">
            {[
              { id: "editor", name: "Trình biên soạn", icon: <Link2 size={16} /> },
              { id: "themes", name: "Giao diện", icon: <Palette size={16} /> },
              { id: "analytics", name: "Phân tích Click", icon: <BarChart3 size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-[#0A0A0A] text-white shadow-md" 
                    : "text-[#4F5B66] hover:bg-[#F3F4F6]"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content 1: Editor */}
          {activeTab === "editor" && (
            <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 space-y-6">
              
              {/* Profile Config */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#1A1F36] uppercase tracking-wider">Cấu hình Profile</h3>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
                  <div className="flex-1 space-y-3 w-full">
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Tên thương hiệu..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none"
                    />
                    <input
                      type="text"
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      placeholder="Tiểu sử ngắn..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-[#E5E7EB]" />

              {/* Links list editor */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#1A1F36] uppercase tracking-wider">Danh sách liên kết</h3>
                  <button 
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <Plus size={14} /> Thêm liên kết
                  </button>
                </div>

                <div className="space-y-3">
                  {links.map((link) => (
                    <div 
                      key={link.id} 
                      className={`border rounded-2xl p-4 flex justify-between items-center gap-3 transition-colors ${
                        link.active ? "bg-white border-[#E5E7EB]" : "bg-slate-50 border-slate-100 opacity-60"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#1A1F36] truncate">{link.title}</div>
                        <div className="text-xs text-[#8792A2] truncate font-mono mt-0.5">{link.url}</div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        
                        {/* Toggle active */}
                        <button
                          onClick={() => handleToggleLink(link.id)}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                            link.active ? "bg-[#10B981]" : "bg-[#D1D5DB]"
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                            link.active ? "translate-x-4.5" : "translate-x-0"
                          }`} />
                        </button>

                        {/* Delete button */}
                        <button 
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-[#8792A2] hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-150 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab Content 2: Themes */}
          {activeTab === "themes" && (
            <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#1A1F36] uppercase tracking-wider">Chọn mẫu giao diện (Themes)</h3>
              <div className="grid grid-cols-2 gap-4">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTheme(t)}
                    className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all ${
                      activeTheme.id === t.id 
                        ? "border-[#0A0A0A] bg-slate-50 scale-[1.02] shadow-sm" 
                        : "border-[#E5E7EB] hover:bg-slate-50/50"
                    }`}
                  >
                    <div className={`w-full h-20 rounded-xl ${t.bg} mb-3 flex items-center justify-center p-3 overflow-hidden border ${t.border}`}>
                      <div className={`w-full rounded-lg ${t.buttonBg} ${t.buttonText} py-1 text-center text-[9px] font-bold`}>
                        Mẫu nút bấm
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#1A1F36]">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 3: Analytics */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 space-y-6">
              
              {/* Analytics Header Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB] flex items-center gap-3">
                  <span className="p-3 bg-white text-[#10B981] rounded-xl shadow-sm">
                    <Eye size={20} />
                  </span>
                  <div>
                    <span className="text-xs text-[#8792A2] font-semibold block">Lượt xem trang</span>
                    <span className="text-xl font-bold text-[#1A1F36]">{(totalClicks * 1.8).toFixed(0)}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB] flex items-center gap-3">
                  <span className="p-3 bg-white text-blue-500 rounded-xl shadow-sm">
                    <MousePointerClick size={20} />
                  </span>
                  <div>
                    <span className="text-xs text-[#8792A2] font-semibold block">Tổng số Click</span>
                    <span className="text-xl font-bold text-[#1A1F36]">{totalClicks}</span>
                  </div>
                </div>
              </div>

              {/* Individual Links Performance */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#1A1F36] uppercase tracking-wider">Hiệu suất từng liên kết</h3>
                <div className="space-y-3">
                  {links.map((link) => {
                    const ctr = totalClicks > 0 ? (link.clicks / totalClicks) * 100 : 0;
                    return (
                      <div key={link.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-[#4F5B66]">
                          <span>{link.title}</span>
                          <span>{link.clicks} clicks ({ctr.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-800 rounded-full transition-all duration-500"
                            style={{ width: `${ctr}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Live Mobile Simulated Preview */}
        <div className="lg:col-span-5 flex justify-center sticky top-6">
          <div className="relative w-72 h-[550px] bg-slate-900 rounded-[40px] shadow-2xl p-3 border-4 border-slate-800 flex flex-col overflow-hidden">
            
            {/* Speaker & Camera notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-850 rounded-full" />
            </div>

            {/* Simulated Screen Inner Container */}
            <div className={`w-full h-full rounded-[30px] overflow-y-auto flex flex-col items-center pt-8 px-4 pb-6 relative transition-all duration-500 ${activeTheme.bg} ${activeTheme.text}`}>
              
              {/* Profile Details */}
              <div className="flex flex-col items-center text-center mt-4 mb-6">
                <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-md mb-2" />
                <h4 className="text-sm font-bold tracking-tight">{profileName}</h4>
                <p className="text-[10px] opacity-75 mt-0.5 px-3 max-w-[200px] leading-relaxed">{profileBio}</p>
              </div>

              {/* Links rendering */}
              <div className="w-full flex-1 flex flex-col gap-2.5">
                {links
                  .filter(l => l.active)
                  .map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handlePreviewClick(link.id, link.url)}
                      className={`w-full rounded-2xl py-3 px-4 text-xs font-bold text-center border transition-all transform active:scale-95 duration-200 flex justify-between items-center group cursor-pointer ${activeTheme.buttonBg} ${activeTheme.buttonText} ${activeTheme.border}`}
                    >
                      <span className="w-4 h-4" /> {/* spacer */}
                      <span>{link.title}</span>
                      <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
              </div>

              {/* Watermark */}
              <div className="text-[8px] opacity-50 font-semibold tracking-wide uppercase mt-8 select-none">
                Powered by PubliCast
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Modal: Add Link */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl border border-[#E5E7EB]">
            
            <button 
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-[#8792A2] hover:text-[#0a0a0a] cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#1A1F36] flex items-center gap-2 mb-4">
              <Plus className="text-emerald-500 w-5 h-5" />
              Thêm liên kết mới vào Bio Page
            </h3>

            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Tiêu đề nút bấm</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đăng ký kênh YouTube của tôi"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Liên kết URL</label>
                <input
                  type="text"
                  placeholder="Ví dụ: youtube.com/c/publicast"
                  value={newUrl}
                  onChange={(e) => newSetUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E5E7EB] hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#0A0A0A] hover:bg-[#222] text-white transition-colors"
                >
                  Thêm ngay
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
