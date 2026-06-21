import React, { useState } from "react";
import { 
  TrendingUp, 
  Plus, 
  DollarSign, 
  Eye, 
  MousePointerClick, 
  RefreshCw, 
  CheckCircle2, 
  X,
  Sparkles,
  BarChart3,
  Calendar
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";
import { toast } from "sonner";
import { PlatformIcon } from "../../components/shared/PlatformIcon";

// Simulated Campaign Data
const INITIAL_CAMPAIGNS = {
  Facebook: [
    { id: "fb-1", name: "Summer Apparel Launch - Vietnam", status: true, budget: 150, spent: 1420, clicks: 12400, impressions: 320000, conversions: 420 },
    { id: "fb-2", name: "Retargeting Cart Abandoners", status: true, budget: 80, spent: 780, clicks: 5800, impressions: 98000, conversions: 210 },
    { id: "fb-3", name: "Brand Awareness - Video Series", status: false, budget: 50, spent: 1200, clicks: 8900, impressions: 450000, conversions: 45 },
    { id: "fb-4", name: "Black Friday Early Access Lead Gen", status: true, budget: 200, spent: 2200, clicks: 18400, impressions: 510000, conversions: 650 },
  ],
  Google: [
    { id: "gg-1", name: "Search - High Intent Keywords", status: true, budget: 300, spent: 4500, clicks: 22000, impressions: 180000, conversions: 980 },
    { id: "gg-2", name: "Display Network - Retargeting Banner", status: true, budget: 100, spent: 1100, clicks: 9200, impressions: 840000, conversions: 180 },
    { id: "gg-3", name: "Performance Max - All Products", status: false, budget: 250, spent: 3400, clicks: 19800, impressions: 410000, conversions: 540 },
  ],
  TikTok: [
    { id: "tt-1", name: "Viral Challenge - #PubliCastDance", status: true, budget: 500, spent: 6800, clicks: 94000, impressions: 2400000, conversions: 1120 },
    { id: "tt-2", name: "Influencer Spark Ads - Tech Review", status: true, budget: 150, spent: 1500, clicks: 18200, impressions: 480000, conversions: 310 },
    { id: "tt-3", name: "Direct Response - App Install Campaign", status: false, budget: 200, spent: 900, clicks: 11000, impressions: 350000, conversions: 190 },
  ]
};

// Trend line simulation for sparklines
const SPARKLINE_DATA = [
  { value: 400 }, { value: 430 }, { value: 410 }, { value: 480 }, 
  { value: 520 }, { value: 490 }, { value: 600 }, { value: 580 }, 
  { value: 690 }, { value: 720 }, { value: 780 }, { value: 850 }
];

export function AdsPage() {
  const [activePlatform, setActivePlatform] = useState("Facebook");
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New campaign form state
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignBudget, setNewCampaignBudget] = useState("100");

  // Sum active platform statistics
  const currentCampaigns = campaigns[activePlatform] || [];
  const totalSpend = currentCampaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalImpressions = currentCampaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = currentCampaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalConversions = currentCampaigns.reduce((acc, c) => acc + c.conversions, 0);

  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const avgCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const roiMultiplier = activePlatform === "TikTok" ? 3.4 : activePlatform === "Google" ? 4.2 : 3.8;
  const revenue = totalSpend * roiMultiplier;
  const roi = totalSpend > 0 ? ((revenue - totalSpend) / totalSpend) * 100 : 0;

  // Toggle Campaign Status
  const handleToggleStatus = (id) => {
    setCampaigns(prev => {
      const updated = { ...prev };
      updated[activePlatform] = updated[activePlatform].map(c => 
        c.id === id ? { ...c, status: !c.status } : c
      );
      return updated;
    });
    toast.success("Cập nhật trạng thái chiến dịch thành công!");
  };

  // Edit Campaign Budget
  const handleBudgetChange = (id, newBudget) => {
    const parsed = parseFloat(newBudget);
    if (isNaN(parsed) || parsed < 0) return;
    
    setCampaigns(prev => {
      const updated = { ...prev };
      updated[activePlatform] = updated[activePlatform].map(c => 
        c.id === id ? { ...c, budget: parsed } : c
      );
      return updated;
    });
  };

  // Create Campaign
  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignName.trim()) {
      toast.error("Vui lòng nhập tên chiến dịch");
      return;
    }

    const newCampaign = {
      id: `${activePlatform.toLowerCase().slice(0, 2)}-${Date.now()}`,
      name: newCampaignName,
      status: true,
      budget: parseFloat(newCampaignBudget) || 100,
      spent: 0,
      clicks: 0,
      impressions: 0,
      conversions: 0
    };

    setCampaigns(prev => {
      return {
        ...prev,
        [activePlatform]: [newCampaign, ...prev[activePlatform]]
      };
    });

    toast.success(`Đã khởi tạo chiến dịch "${newCampaignName}" thành công!`);
    setIsModalOpen(false);
    setNewCampaignName("");
    setNewCampaignBudget("100");
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8F9FA] p-6 space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36] flex items-center gap-2">
            <Sparkles className="text-[#FFB800] w-6 h-6 animate-pulse" />
            Ad Accounts Performance
          </h1>
          <p className="text-sm text-[#8792A2] mt-0.5">
            Quản lý chiến dịch, theo dõi ngân sách và tối ưu hóa chuyển đổi đa nền tảng.
          </p>
        </div>

        {/* Create Campaign Trigger */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-[#222] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 shrink-0"
        >
          <Plus size={16} />
          Tạo chiến dịch mới
        </button>
      </div>

      {/* Platform Switcher */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-[#E5E7EB] self-start">
        {["Facebook", "Google", "TikTok"].map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activePlatform === platform 
                ? "bg-[#0A0A0A] text-white shadow-md scale-[1.02]" 
                : "text-[#4F5B66] hover:bg-[#F3F4F6]"
            }`}
          >
            <PlatformIcon platform={platform} size={16} />
            {platform} Ads
          </button>
        ))}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card: Total Spend */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#8792A2] uppercase tracking-wider">Tổng chi tiêu</span>
              <span className="p-2 bg-[#F3F4F6] rounded-xl text-[#0A0A0A]">
                <DollarSign size={16} />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#1A1F36] mt-2">${totalSpend.toLocaleString()}</h3>
            <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp size={12} /> +12.4% vs tháng trước
            </span>
          </div>
          <div className="h-10 mt-4 -mx-5 -mb-5 opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARKLINE_DATA}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={1.5} fill="url(#spendGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card: Impressions */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#8792A2] uppercase tracking-wider">Lượt hiển thị</span>
              <span className="p-2 bg-[#F3F4F6] rounded-xl text-[#0A0A0A]">
                <Eye size={16} />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#1A1F36] mt-2">{totalImpressions.toLocaleString()}</h3>
            <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp size={12} /> +8.2% vs tháng trước
            </span>
          </div>
          <div className="h-10 mt-4 -mx-5 -mb-5 opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARKLINE_DATA.map(d => ({ value: d.value * 0.9 }))}>
                <defs>
                  <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={1.5} fill="url(#impGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card: Average CPC */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#8792A2] uppercase tracking-wider">Avg CPC</span>
              <span className="p-2 bg-[#F3F4F6] rounded-xl text-[#0A0A0A]">
                <MousePointerClick size={16} />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#1A1F36] mt-2">${avgCPC.toFixed(2)}</h3>
            <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-0.5 mt-1">
              -4.3% so với tuần trước
            </span>
          </div>
          <div className="h-10 mt-4 -mx-5 -mb-5 opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARKLINE_DATA.map(d => ({ value: 1000 - d.value }))}>
                <defs>
                  <linearGradient id="cpcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={1.5} fill="url(#cpcGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card: ROI */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-[#8792A2] uppercase tracking-wider font-mono">ROI ước tính</span>
              <span className="p-2 bg-[#F3F4F6] rounded-xl text-[#0A0A0A]">
                <TrendingUp size={16} />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#1A1F36] mt-2">{roi.toFixed(0)}%</h3>
            <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-0.5 mt-1">
              Doanh thu: ${(revenue).toLocaleString()}
            </span>
          </div>
          <div className="h-10 mt-4 -mx-5 -mb-5 opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARKLINE_DATA}>
                <defs>
                  <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={1.5} fill="url(#roiGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Center Layout: Campaigns list + Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Campaigns Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-[#1A1F36]">Chi tiết các chiến dịch</h4>
              <p className="text-xs text-[#8792A2] mt-0.5">Danh sách các nhóm quảng cáo hoạt động trên {activePlatform}</p>
            </div>
            <span className="text-xs text-[#0A0A0A] font-bold bg-[#F3F4F6] px-2.5 py-1 rounded-lg">
              {currentCampaigns.length} Chiến dịch
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Trạng thái</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Chiến dịch</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Ngân sách/ngày</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Chi tiêu</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Click/CTR</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Chuyển đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {currentCampaigns.map((c) => {
                  const ctr = c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* Active switch */}
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => handleToggleStatus(c.id)}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                            c.status ? "bg-[#10B981]" : "bg-[#D1D5DB]"
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                            c.status ? "translate-x-4.5" : "translate-x-0"
                          }`} />
                        </button>
                      </td>

                      {/* Campaign Name */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-sm text-[#1A1F36] max-w-[200px] truncate" title={c.name}>
                          {c.name}
                        </div>
                        <div className="text-xs text-[#8792A2] font-mono mt-0.5">{c.id}</div>
                      </td>

                      {/* Daily Budget (Editable) */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 bg-[#F8F9FA] px-2 py-1 rounded-lg border border-[#E5E7EB] w-24">
                          <span className="text-xs text-[#4F5B66] font-semibold">$</span>
                          <input
                            type="number"
                            value={c.budget}
                            onChange={(e) => handleBudgetChange(c.id, e.target.value)}
                            className="bg-transparent text-xs font-bold text-[#1A1F36] outline-none w-full border-none p-0"
                          />
                        </div>
                      </td>

                      {/* Spent */}
                      <td className="py-4 px-6 text-sm font-semibold text-[#1A1F36]">
                        ${c.spent.toLocaleString()}
                      </td>

                      {/* Clicks & CTR */}
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-[#1A1F36]">{c.clicks.toLocaleString()}</div>
                        <div className="text-xs text-[#8792A2] font-medium">{ctr.toFixed(2)}% CTR</div>
                      </td>

                      {/* Conversions */}
                      <td className="py-4 px-6 text-sm font-semibold text-[#1A1F36]">
                        {c.conversions.toLocaleString()}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Funnel & Performance Graph */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1A1F36] flex items-center gap-2">
              <BarChart3 size={18} className="text-[#3B82F6]" />
              Phễu chuyển đổi (Funnel)
            </h4>
            <p className="text-xs text-[#8792A2] mt-0.5">Tỷ lệ tương tác qua từng giai đoạn khách hàng</p>
          </div>

          <div className="space-y-5 my-6">
            
            {/* Step 1: Impressions */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#4F5B66] mb-1.5">
                <span>1. Tiếp cận (Impressions)</span>
                <span>100%</span>
              </div>
              <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden relative flex items-center px-3 border border-[#E5E7EB]">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500 w-full opacity-80" />
                <span className="relative text-white font-mono text-xs font-black z-10">{totalImpressions.toLocaleString()}</span>
              </div>
            </div>

            {/* Step 2: Clicks */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#4F5B66] mb-1.5">
                <span>2. Tương tác (Clicks)</span>
                <span>{avgCTR.toFixed(2)}% tỷ lệ click (CTR)</span>
              </div>
              <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden relative flex items-center px-3 border border-[#E5E7EB]">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80 transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(10, avgCTR * 8))}%` }}
                />
                <span className="relative text-[#1A1F36] group-hover:text-white font-mono text-xs font-black z-10">
                  {totalClicks.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Step 3: Conversions */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#4F5B66] mb-1.5">
                <span>3. Chuyển đổi (Conversions)</span>
                <span>{totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0}% tỷ lệ mua</span>
              </div>
              <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden relative flex items-center px-3 border border-[#E5E7EB]">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-80 transition-all duration-500" 
                  style={{ width: `${totalClicks > 0 ? Math.min(100, Math.max(5, (totalConversions / totalClicks) * 150)) : 5}%` }}
                />
                <span className="relative text-[#1A1F36] font-mono text-xs font-black z-10">{totalConversions.toLocaleString()}</span>
              </div>
            </div>

          </div>

          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-[#E5E7EB] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8792A2] font-semibold">Giá mỗi Click (CPA):</span>
              <span className="text-[#1A1F36] font-bold">${avgCPA.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8792A2] font-semibold">Tỷ lệ chuyển đổi chung:</span>
              <span className="text-[#1A1F36] font-bold">
                {totalImpressions > 0 ? ((totalConversions / totalImpressions) * 100).toFixed(3) : 0}%
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Create Campaign */}
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
              <PlatformIcon platform={activePlatform} size={20} />
              Tạo chiến dịch {activePlatform} Ads
            </h3>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Tên chiến dịch</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Campaign Tet Holiday 2026"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Ngân sách hàng ngày ($)</label>
                <input
                  type="number"
                  min="5"
                  value={newCampaignBudget}
                  onChange={(e) => setNewCampaignBudget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none transition-colors"
                />
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
                  Kích hoạt ngay
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
