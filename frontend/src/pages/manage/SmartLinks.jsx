import React, { useState, useEffect } from "react";
import { 
  Link2, 
  Plus, 
  Palette, 
  BarChart3, 
  Eye, 
  MousePointerClick, 
  Trash2, 
  ArrowUpRight,
  Share2,
  X,
  Save,
  Globe,
  Loader2,
  Edit2
} from "lucide-react";
import { toast } from "sonner";
import { useBrand } from "../../context/BrandContext";
import apiService from "../../services/api";

// Bio link themes matched with backend validators
const THEMES = [
  { id: "midnight", name: "Midnight Black", bg: "bg-slate-950", text: "text-white", buttonBg: "bg-slate-800 hover:bg-slate-700", buttonText: "text-white", border: "border-slate-800" },
  { id: "sunset", name: "Sunset Orange", bg: "bg-gradient-to-tr from-amber-500 to-rose-500", text: "text-white", buttonBg: "bg-white/10 hover:bg-white/20 backdrop-blur-sm", buttonText: "text-white", border: "border-white/10" },
  { id: "mint", name: "Mint Glassmorphism", bg: "bg-gradient-to-tr from-teal-50 to-emerald-100", text: "text-slate-800", buttonBg: "bg-white/70 hover:bg-white/90 shadow-sm border border-emerald-200/50", buttonText: "text-slate-800", border: "border-emerald-200" },
  { id: "cyberpunk", name: "Cyberpunk Neon", bg: "bg-[#0c0f1d]", text: "text-[#00ffcc]", buttonBg: "bg-slate-900 hover:bg-slate-850 border border-[#ff0055] shadow-[0_0_8px_rgba(255,0,85,0.4)]", buttonText: "text-[#00ffcc]", border: "border-[#ff0055]" }
];

export function SmartLinksPage() {
  const { activeBrand } = useBrand();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [smartLinkId, setSmartLinkId] = useState(null);
  const [slug, setSlug] = useState("");
  const [activeTab, setActiveTab] = useState("editor"); // editor | themes | analytics
  
  // Profile Meta
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [totalClicksCount, setTotalClicksCount] = useState(0);

  const [links, setLinks] = useState([]);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);

  // New Link Builder States
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, newSetUrl] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Fetch SmartLink
  const fetchSmartLink = async () => {
    if (!activeBrand) return;
    setLoading(true);
    try {
      const res = await apiService.get(`/smart-links?brandId=${activeBrand.id}`);
      const data = res.data.data;
      if (data) {
        setSmartLinkId(data.id);
        setSlug(data.slug);
        setProfileName(data.pageTitle);
        setProfileBio(data.bio || "");
        setAvatarUrl(data.profileImageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80");
        setIsPublished(data.isPublished);
        setUniqueVisitors(data.uniqueVisitors || 0);
        setTotalClicksCount(data.totalClicks || 0);
        setLinks(data.links || []);
        
        // Find saved theme
        const matchedTheme = THEMES.find(t => t.id === data.backgroundValue);
        if (matchedTheme) {
          setActiveTheme(matchedTheme);
        }
      } else {
        // Auto-create initial SmartLink config
        await createInitialSmartLink();
      }
    } catch (err) {
      console.error("Error fetching SmartLink:", err);
      toast.error("Không thể tải cấu hình SmartLink");
    } finally {
      setLoading(false);
    }
  };

  const createInitialSmartLink = async () => {
    try {
      const initialSlug = `${activeBrand.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = {
        brandId: activeBrand.id,
        slug: initialSlug,
        pageTitle: activeBrand.name,
        bio: "Chào mừng bạn đến với trang liên kết của chúng tôi!",
        profileImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        backgroundType: "THEME",
        backgroundValue: "midnight",
        buttonStyle: "rounded-xl",
        isPublished: true,
        links: []
      };
      
      const res = await apiService.post("/smart-links", payload);
      const data = res.data.data;
      if (data) {
        setSmartLinkId(data.id);
        setSlug(data.slug);
        setProfileName(data.pageTitle);
        setProfileBio(data.bio || "");
        setAvatarUrl(data.profileImageUrl || "");
        setIsPublished(data.isPublished);
        setLinks(data.links || []);
        toast.success("Đã khởi tạo trang SmartLink mặc định!");
      }
    } catch (err) {
      console.error("Error creating initial SmartLink:", err);
      toast.error("Không thể tự động khởi tạo SmartLink");
    }
  };

  useEffect(() => {
    fetchSmartLink();
  }, [activeBrand]);

  // Save changes to server
  const handleSaveChanges = async () => {
    if (!smartLinkId) return;
    setSaving(true);
    try {
      const payload = {
        brandId: activeBrand.id,
        slug,
        pageTitle: profileName,
        bio: profileBio,
        profileImageUrl: avatarUrl,
        backgroundType: "THEME",
        backgroundValue: activeTheme.id,
        buttonStyle: activeTheme.buttonBg,
        isPublished,
        links: links.map((l, index) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          emoji: l.emoji,
          iconUrl: l.iconUrl,
          isActive: l.isActive !== undefined ? l.isActive : l.active,
          position: index
        }))
      };

      const res = await apiService.put(`/smart-links/${smartLinkId}`, payload);
      if (res.data.data) {
        toast.success("Đã lưu mọi thay đổi thành công!");
        setLinks(res.data.data.links || []);
      }
    } catch (err) {
      console.error("Error saving SmartLink:", err);
      toast.error(err.message || "Không thể lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

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
      url: newUrl,
      isActive: true,
      clicks: 0
    };

    setLinks(prev => [...prev, newLinkItem]);
    toast.success("Đã thêm liên kết vào danh sách tạm!");
    setIsAddOpen(false);
    setNewTitle("");
    newSetUrl("");
  };

  // Toggle Link visibility
  const handleToggleLink = (id) => {
    setLinks(prev => prev.map(l => 
      l.id === id ? { ...l, isActive: l.isActive !== undefined ? !l.isActive : !l.active } : l
    ));
  };

  // Delete Link
  const handleDeleteLink = (id) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleShareClick = () => {
    if (!slug) return;
    const publicUrl = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Đã sao chép đường dẫn SmartLink vào clipboard!");
  };

  if (!activeBrand) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8F9FA]">
        <div className="p-4 bg-white rounded-3xl shadow-md border border-[#E5E7EB] max-w-sm">
          <Link2 className="text-gray-400 w-12 h-12 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Chưa chọn thương hiệu</h3>
          <p className="text-sm text-slate-500 mt-1">
            Vui lòng chọn hoặc tạo thương hiệu trong Workspace của bạn để sử dụng tính năng SmartLinks.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#10B981] w-8 h-8" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Đang tải cấu hình...</span>
        </div>
      </div>
    );
  }

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

        <div className="flex items-center gap-3 shrink-0">
          {/* Save Button */}
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Lưu thay đổi
          </button>

          {/* Share Bio Link */}
          <button 
            onClick={handleShareClick}
            className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-[#222] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95"
          >
            <Share2 size={16} />
            Chia sẻ SmartLink
          </button>
        </div>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Tên thương hiệu</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Tên thương hiệu..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Slug liên kết công khai</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs text-[#8792A2] font-mono">/s/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="slug-url"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E7EB] text-sm font-mono text-[#1A1F36] focus:border-[#0A0A0A] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-start pt-2">
                  <div className="flex flex-col items-center shrink-0">
                    <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">URL Ảnh đại diện</label>
                      <input
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Tiểu sử ngắn (Bio)</label>
                      <textarea
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        placeholder="Tiểu sử ngắn..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-[#1A1F36]">Trạng thái trang Bio Link</span>
                  <div className="flex items-center gap-2">
                    <Globe size={16} className={isPublished ? "text-emerald-500 animate-pulse" : "text-slate-400"} />
                    <button
                      onClick={() => setIsPublished(!isPublished)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        isPublished 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      {isPublished ? "Đang xuất bản (Công khai)" : "Bản nháp (Riêng tư)"}
                    </button>
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
                  {links.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-[#E5E7EB] rounded-2xl text-sm text-slate-400">
                      Chưa có liên kết nào. Hãy nhấn "Thêm liên kết" để bắt đầu!
                    </div>
                  ) : (
                    links.map((link) => {
                      const active = link.isActive !== undefined ? link.isActive : link.active;
                      return (
                        <div 
                          key={link.id} 
                          className={`border rounded-2xl p-4 flex justify-between items-center gap-3 transition-colors ${
                            active ? "bg-white border-[#E5E7EB]" : "bg-slate-50 border-slate-100 opacity-60"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {link.emoji && <span className="text-base">{link.emoji}</span>}
                              <div className="font-semibold text-sm text-[#1A1F36] truncate">{link.title}</div>
                            </div>
                            <div className="text-xs text-[#8792A2] truncate font-mono mt-0.5">{link.url}</div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Toggle active */}
                            <button
                              onClick={() => handleToggleLink(link.id)}
                              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                                active ? "bg-[#10B981]" : "bg-[#D1D5DB]"
                              }`}
                            >
                              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                                active ? "translate-x-4.5" : "translate-x-0"
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
                      );
                    })
                  )}
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
                    <span className="text-xs text-[#8792A2] font-semibold block">Lượt khách ghé thăm</span>
                    <span className="text-xl font-bold text-[#1A1F36]">{uniqueVisitors}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB] flex items-center gap-3">
                  <span className="p-3 bg-white text-blue-500 rounded-xl shadow-sm">
                    <MousePointerClick size={20} />
                  </span>
                  <div>
                    <span className="text-xs text-[#8792A2] font-semibold block">Tổng lượt xem trang</span>
                    <span className="text-xl font-bold text-[#1A1F36]">{totalClicksCount}</span>
                  </div>
                </div>
              </div>

              {/* Individual Links Performance */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#1A1F36] uppercase tracking-wider">Hiệu suất click từng liên kết</h3>
                <div className="space-y-3">
                  {links.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">Chưa có liên kết để thống kê</div>
                  ) : (
                    links.map((link) => {
                      const clicks = link.clicks || 0;
                      const ctr = totalClicksCount > 0 ? (clicks / totalClicksCount) * 100 : 0;
                      return (
                        <div key={link.id} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-[#4F5B66]">
                            <span className="flex items-center gap-1">
                              {link.emoji} {link.title}
                            </span>
                            <span>{clicks} clicks ({ctr.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-slate-800 rounded-full transition-all duration-500"
                              style={{ width: `${ctr}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
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
                <img src={avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-md mb-2" />
                <h4 className="text-sm font-bold tracking-tight">{profileName || activeBrand.name}</h4>
                <p className="text-[10px] opacity-75 mt-0.5 px-3 max-w-[200px] leading-relaxed">{profileBio || "Chưa có tiểu sử"}</p>
              </div>

              {/* Links rendering */}
              <div className="w-full flex-1 flex flex-col gap-2.5">
                {links
                  .filter(l => (l.isActive !== undefined ? l.isActive : l.active))
                  .map((link) => (
                    <button
                      key={link.id}
                      className={`w-full rounded-2xl py-3 px-4 text-xs font-bold text-center border transition-all transform active:scale-95 duration-200 flex justify-between items-center group cursor-pointer ${activeTheme.buttonBg} ${activeTheme.buttonText} ${activeTheme.border}`}
                    >
                      <span className="w-4 h-4 text-left">{link.emoji || "🔗"}</span>
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
