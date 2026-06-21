import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Share2, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Eye, 
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { PlatformIcon } from "../../components/shared/PlatformIcon";

// Simulated Generated Reports
const INITIAL_REPORTS = [
  { id: "rep-1", title: "Báo cáo Hiệu suất Tháng 5 - 2025", type: "PDF", size: "2.4 MB", date: "31/05/2025", creator: "Nguyen Minh", downloads: 14, platforms: ["YouTube", "Facebook", "Instagram"] },
  { id: "rep-2", title: "Bảng tính Chi tiêu & ROI Quảng cáo Tuần 22", type: "Excel", size: "480 KB", date: "24/05/2025", creator: "Nguyen Minh", downloads: 8, platforms: ["Facebook", "Google"] },
  { id: "rep-3", title: "Báo cáo Tăng trưởng Kênh TikTok Q2", type: "PDF", size: "5.1 MB", date: "15/05/2025", creator: "David Chen", downloads: 22, platforms: ["TikTok"] },
  { id: "rep-4", title: "Tổng hợp Tương tác Thương hiệu Custom Range", type: "PDF", size: "1.8 MB", date: "02/05/2025", creator: "Nguyen Minh", downloads: 5, platforms: ["YouTube", "Facebook", "TikTok", "LinkedIn", "X"] }
];

export function ReportsPage() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Custom Report Builder States
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("PDF");
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    YouTube: true, Facebook: true, TikTok: false, Google: false, LinkedIn: false, X: false
  });
  const [dateRange, setDateRange] = useState("Tháng này");
  const [brandLogo, setBrandLogo] = useState(true);

  // Toggle Platform selection
  const handleTogglePlatform = (p) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [p]: !prev[p]
    }));
  };

  // Trigger Report Generation
  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      toast.error("Vui lòng nhập tên báo cáo");
      return;
    }

    const enabledPlatforms = Object.keys(selectedPlatforms).filter(k => selectedPlatforms[k]);
    if (enabledPlatforms.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 mạng xã hội hoặc tài khoản quảng cáo");
      return;
    }

    const newReport = {
      id: `rep-${Date.now()}`,
      title: reportTitle,
      type: reportType,
      size: reportType === "PDF" ? "1.5 MB" : "320 KB",
      date: new Date().toLocaleDateString("vi-VN"),
      creator: "Nguyen Minh",
      downloads: 0,
      platforms: enabledPlatforms
    };

    setReports(prev => [newReport, ...prev]);
    toast.success(`Đang khởi tạo báo cáo "${reportTitle}"... Đã hoàn thành!`);
    setIsModalOpen(false);
    setReportTitle("");
  };

  // Delete Report
  const handleDeleteReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast.success("Đã xóa báo cáo khỏi hệ thống lưu trữ.");
  };

  // Download Simulation
  const handleDownload = (title) => {
    toast.success(`Bắt đầu tải xuống file: ${title}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8F9FA] p-6 space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1F36] flex items-center gap-2">
            <FileText className="text-[#3B82F6] w-6 h-6" />
            Automated Analytics Reports
          </h1>
          <p className="text-sm text-[#8792A2] mt-0.5">
            Lập lịch, xuất báo cáo PDF/Excel định kỳ hoặc tạo báo cáo tùy chỉnh đa kênh lập tức.
          </p>
        </div>

        {/* Generate Trigger */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-[#222] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 shrink-0"
        >
          <Plus size={16} />
          Tạo báo cáo tùy chỉnh
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Reports List Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-[#1A1F36]">Kho lưu trữ báo cáo (Reports Archive)</h4>
              <p className="text-xs text-[#8792A2] mt-0.5">Danh sách báo cáo đã được xuất và lưu trữ</p>
            </div>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              {reports.length} Báo cáo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Định dạng</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Tên tài liệu</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Kênh xuất</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Ngày tạo / Tác giả</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider">Dung lượng</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#8792A2] uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Document Icon format */}
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        r.type === "PDF" 
                          ? "bg-red-50 text-red-600 border border-red-100" 
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {r.type}
                      </span>
                    </td>

                    {/* Title & Stats */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-sm text-[#1A1F36] max-w-[220px] truncate" title={r.title}>
                        {r.title}
                      </div>
                      <div className="text-xs text-[#8792A2] mt-0.5">Tải xuống: {r.downloads} lần</div>
                    </td>

                    {/* Channels */}
                    <td className="py-4 px-6">
                      <div className="flex -space-x-1.5 items-center">
                        {r.platforms.map((p) => (
                          <div 
                            key={p} 
                            className="w-5.5 h-5.5 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm"
                            title={p}
                          >
                            <PlatformIcon platform={p} size={11} />
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Date / Author */}
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-[#1A1F36]">{r.date}</div>
                      <div className="text-xs text-[#8792A2]">{r.creator}</div>
                    </td>

                    {/* File Size */}
                    <td className="py-4 px-6 text-sm text-[#4F5B66]">
                      {r.size}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-1">
                      <button 
                        onClick={() => handleDownload(r.title)}
                        className="text-[#8792A2] hover:text-[#0A0A0A] p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 transition-all inline-flex items-center cursor-pointer"
                        title="Tải xuống"
                      >
                        <Download size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteReport(r.id)}
                        className="text-[#8792A2] hover:text-red-500 p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-red-50 transition-all inline-flex items-center cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Live Report Preview Simulation */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#1A1F36] flex items-center gap-2">
              <Eye size={18} className="text-[#3B82F6]" />
              Xem trước báo cáo (Live Preview)
            </h4>
            <p className="text-xs text-[#8792A2] mt-0.5">Trang đầu tiên của báo cáo PDF kết xuất</p>
          </div>

          {/* Document page mock */}
          <div className="bg-slate-100/60 rounded-2xl p-5 border border-dashed border-[#E5E7EB] my-6 flex flex-col gap-4 relative overflow-hidden select-none">
            
            {/* Page header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                {brandLogo ? (
                  <div className="w-6 h-6 bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] rounded-lg">
                    PC
                  </div>
                ) : (
                  <div className="w-6 h-6 border border-slate-200 rounded-lg" />
                )}
                <span className="text-[10px] font-bold text-slate-800">PubliCast Media Report</span>
              </div>
              <span className="text-[8px] text-[#8792A2] font-mono">Q2 - 2025</span>
            </div>

            {/* Document Title */}
            <div className="space-y-1">
              <div className="h-4 bg-slate-800 rounded-md w-3/4 animate-pulse" />
              <div className="h-3 bg-slate-300 rounded-md w-1/2" />
            </div>

            {/* Platform summary lines */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[8px] text-[#8792A2] font-semibold">TỔNG LƯỢT TIẾP CẬN</span>
                <div className="h-3.5 bg-slate-700 rounded w-2/3" />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[8px] text-[#8792A2] font-semibold">TỶ LỆ TƯƠNG TÁC AVG</span>
                <div className="h-3.5 bg-slate-700 rounded w-1/3" />
              </div>
            </div>

            {/* Visual chart mock inside page */}
            <div className="border border-slate-200 rounded-xl bg-white p-3 space-y-2">
              <div className="h-2 bg-slate-300 rounded w-1/3" />
              <div className="flex gap-2 items-end justify-between h-20 pt-4 px-2">
                <div className="w-6 bg-slate-800 rounded-t h-[40%]" />
                <div className="w-6 bg-slate-800 rounded-t h-[65%]" />
                <div className="w-6 bg-slate-800 rounded-t h-[50%]" />
                <div className="w-6 bg-slate-800 rounded-t h-[85%]" />
                <div className="w-6 bg-slate-800 rounded-t h-[75%]" />
              </div>
            </div>

            {/* Page Footer */}
            <div className="text-center text-[7px] text-[#8792A2] border-t border-slate-200 pt-2 font-mono">
              Trang 1 / 14 | Powered by PubliCast AI Engine
            </div>

          </div>

          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-[#E5E7EB] text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <CheckCircle2 size={14} />
              Báo cáo tự động được cấu hình
            </div>
            <p className="text-[11px] text-[#8792A2] leading-relaxed">
              Hệ thống sẽ gửi file PDF báo cáo phân tích tổng quan vào Email Nguyen Minh lúc 08:00 sáng Thứ Hai hàng tuần.
            </p>
          </div>

        </div>

      </div>

      {/* Modal: Custom Report Generator */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl border border-[#E5E7EB]">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#8792A2] hover:text-[#0a0a0a] cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#1A1F36] flex items-center gap-2 mb-4">
              <Sparkles className="text-amber-500 w-5 h-5 animate-pulse" />
              Khởi tạo báo cáo tùy chỉnh mới
            </h3>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Tên báo cáo</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Báo cáo tăng trưởng kênh Marketing Q2"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Định dạng file</label>
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none cursor-pointer bg-white"
                  >
                    <option value="PDF">Tài liệu PDF (.pdf)</option>
                    <option value="Excel">Bảng tính Excel (.xlsx)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Khoảng thời gian (Date Range)</label>
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1F36] focus:border-[#0A0A0A] outline-none cursor-pointer bg-white"
                  >
                    <option value="Tháng này">Tháng này (Tháng 5 - 2025)</option>
                    <option value="Tháng trước">Tháng trước (Tháng 4 - 2025)</option>
                    <option value="7 ngày qua">7 ngày qua</option>
                    <option value="30 ngày qua">30 ngày qua</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F5B66] uppercase mb-1.5">Các tài khoản tích hợp vào báo cáo</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {Object.keys(selectedPlatforms).map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handleTogglePlatform(platform)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedPlatforms[platform] 
                          ? "border-[#0A0A0A] bg-slate-50 text-[#0A0A0A]" 
                          : "border-[#E5E7EB] hover:bg-slate-50/50 text-[#8792A2]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms[platform]}
                        onChange={() => {}} // handled by button click
                        className="accent-black w-3.5 h-3.5"
                      />
                      <PlatformIcon platform={platform} size={14} />
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced configuration */}
              <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1A1F36]">Tích hợp Logo Thương hiệu</span>
                  <span className="text-[11px] text-[#8792A2]">Tự động thêm logo PubliCast vào tiêu đề báo cáo</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBrandLogo(!brandLogo)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                    brandLogo ? "bg-[#10B981]" : "bg-[#D1D5DB]"
                  }`}
                >
                  <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                    brandLogo ? "translate-x-4.5" : "translate-x-0"
                  }`} />
                </button>
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
                  Xuất dữ liệu ngay
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
