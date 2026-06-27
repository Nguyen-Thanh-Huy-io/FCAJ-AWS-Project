import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  User, Shield, CreditCard, Globe, 
  Mail, Lock, Smartphone, ExternalLink,
  MessageCircle, Send, Paperclip, CheckCircle2, Search,
  AlertTriangle, Loader2, Plus
} from "lucide-react";
import profileService from "../../services/profile.service";
import apiService from "../../services/api";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";

export function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState("account");

  // State for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [receiveSummary, setReceiveSummary] = useState(true);
  const [customSummaryEmail, setCustomSummaryEmail] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Chat in settings
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "staff", text: "Hello! How can I assist you today?", time: "May 14, 10:00 AM" },
    { role: "user", text: "I have a question about the Pro plan limits.", time: "May 14, 10:05 AM" },
    { role: "staff", text: "Of course! The Pro plan allows up to 10 brands and 500 posts per month.", time: "May 14, 10:10 AM" },
  ]);

  // Handle tab switching from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    
    if (tabParam === "support") setActiveTab("support");
    else if (tabParam === "access") setActiveTab("access");
    else if (tabParam === "billing") setActiveTab("billing");
    else setActiveTab("account");
  }, [location.search]);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await profileService.getUserProfile();
        if (res && res.data) {
          const userData = res.data;
          setFullName(userData.fullName || "");
          setEmail(userData.email || "");
          setAccounts(userData.accounts || []);
        }
      } catch (err) {
        toast.error("Không thể lấy thông tin profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle URL query parameters (e.g. google link callback redirection)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success") === "google_linked") {
      toast.success("Liên kết tài khoản Google thành công!");
      navigate("/settings?tab=access", { replace: true });
    }
  }, [location.search, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileService.editProfile({ fullName });
      toast.success("Cập nhật thành công!");
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkGoogle = async () => {
    try {
      const res = await apiService.get("/auth/google?state=settings");
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Không thể lấy URL liên kết tài khoản Google");
      }
    } catch (err) {
      toast.error(err.message || "Đã xảy ra lỗi khi liên kết Google");
    }
  };

  const handleUnlink = async (provider) => {
    const isConfirmed = await confirm({
      title: "Hủy liên kết tài khoản?",
      description: `Bạn có chắc chắn muốn hủy liên kết tài khoản ${provider}?`,
      confirmText: "Hủy liên kết",
      cancelText: "Hủy",
      variant: "destructive"
    });
    if (!isConfirmed) return;
    try {
      await apiService.delete(`/profile/accounts/${provider.toLowerCase()}`);
      toast.success(`Hủy liên kết tài khoản ${provider} thành công!`);
      // Refresh profile info
      const res = await profileService.getUserProfile();
      if (res && res.data) {
        setAccounts(res.data.accounts || []);
      }
    } catch (err) {
      toast.error(err.message || "Hủy liên kết thất bại");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await apiService.put("/profile/change-password", {
        currentPassword,
        newPassword
      });
      toast.success("Cập nhật mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Không thể cập nhật mật khẩu");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: "user", text: chatInput, time: "Just now" }]);
    setChatInput("");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white font-sans">
      {/* Settings Header */}
      <div className="px-10 py-8 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Settings</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">Manage your account settings and support interactions.</p>
      </div>

      {/* Internal Tabs */}
      <div className="px-10 border-b border-gray-100 flex gap-8 sticky top-0 bg-white z-10">
        {[
          { id: "account", label: "Account" },
          { id: "access", label: "Access" },
          { id: "support", label: "Support Chat" },
          { id: "billing", label: "Plans and Billing" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(`/settings?tab=${tab.id}`)}
            data-testid={`settings-tab-${tab.id}`}
            className="py-4 text-sm font-bold tracking-tight transition-all relative"
            style={{ color: activeTab === tab.id ? "#0A0A0A" : "#9CA3AF" }}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0A0A0A]" />}
          </button>
        ))}
      </div>

      <div className="p-10 max-w-4xl space-y-12">
        {activeTab === "account" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Personal Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                <h2 className="text-lg font-bold text-[#0A0A0A]">Personal information</h2>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 animate-pulse">
                  <div className="space-y-2">
                    <div className="w-20 h-3 bg-gray-100 rounded" />
                    <div className="w-full h-11 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      data-testid="profile-fullname-input"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium" 
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Preferences */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pt-4">
                <Globe size={18} className="text-gray-400" />
                <h2 className="text-lg font-bold text-[#0A0A0A]">Preferences</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Language</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none text-sm bg-white cursor-pointer font-medium">
                    <option>English</option><option>Vietnamese</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timezone</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none text-sm bg-white cursor-pointer font-medium">
                    <option>Asia/Ho_Chi_Minh</option><option>UTC +00:00</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">First day of the week</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none text-sm bg-white cursor-pointer font-medium">
                    <option>Sunday</option><option>Monday</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Monthly Summary */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pt-4">
                <Mail size={18} className="text-gray-400" />
                <h2 className="text-lg font-bold text-[#0A0A0A]">Monthly summary</h2>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#0A0A0A]">Receive monthly summary</div>
                    <p className="text-xs text-gray-500 mt-0.5">Get a detailed report of your brand's performance every month.</p>
                  </div>
                  <div 
                    onClick={() => setReceiveSummary(!receiveSummary)}
                    data-testid="toggle-monthly-summary"
                    className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-all ${receiveSummary ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-all ${receiveSummary ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Custom e-mail for the monthly summary</label>
                  <input 
                    placeholder="Enter email"
                    value={customSummaryEmail}
                    onChange={(e) => setCustomSummaryEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none text-sm font-medium" 
                  />
                  <p className="text-[10px] text-gray-400 italic">When this field is empty the monthly summary is sent to <b>{email}</b></p>
                </div>
              </div>
            </section>

            <button 
              onClick={handleSave}
              disabled={isSaving || isLoading}
              data-testid="profile-save-btn"
              className="px-10 py-3 bg-[#0A0A0A] text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
            >
              {isSaving && <Loader2 size={18} className="animate-spin" />}
              Save All Changes
            </button>
          </div>
        )}

        {activeTab === "access" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <Shield size={18} className="text-gray-400" />
                 <h2 className="text-lg font-bold text-[#0A0A0A]">Access information</h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                 This is your access information. You'll need to introduce your password to perform any change.
              </p>
            </div>

            <div className="space-y-6 max-w-md">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail</label>
                <input value={email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm font-medium" />
              </div>

              {accounts.some(acc => acc.provider === 'LOCAL') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mật khẩu hiện tại</label>
                    <Link 
                      to={`/forgot-password?email=${encodeURIComponent(email)}`}
                      className="text-[10px] font-bold text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="Nhập mật khẩu hiện tại" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      data-testid="profile-current-password-input"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none text-sm font-medium" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {accounts.some(acc => acc.provider === 'LOCAL') ? "Mật khẩu mới" : "Thiết lập mật khẩu mới"}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder={accounts.some(acc => acc.provider === 'LOCAL') ? "Nhập mật khẩu mới" : "Tạo mật khẩu đăng nhập trực tiếp"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    data-testid="profile-new-password-input"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none text-sm font-medium" 
                  />
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  {accounts.some(acc => acc.provider === 'LOCAL') 
                    ? "Nhập mật khẩu mới có độ dài tối thiểu 6 ký tự để thay đổi mật khẩu hiện tại."
                    : "Tài khoản của bạn đang đăng nhập bằng Google. Hãy thiết lập mật khẩu tại đây nếu bạn muốn đăng nhập song song bằng Email & Mật khẩu."
                  }
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Smartphone size={18} className="text-blue-600" />
                       <span className="text-sm font-bold text-[#0A0A0A]">Two factor authentication</span>
                    </div>
                    <div 
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-all ${twoFactor ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-all ${twoFactor ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                 </div>
                 <p className="text-[11px] text-blue-700/70 leading-relaxed font-medium">
                    To increase the security of your account you can enable 2-factor authentication (2FA) with your mobile device.
                 </p>
              </div>
              
              <button 
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                data-testid="profile-update-password-btn"
                className="px-8 py-3 bg-[#0A0A0A] text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
              >
                {isUpdatingPassword && <Loader2 size={16} className="animate-spin" />}
                Update Access
              </button>
            </div>

            {/* Linked Accounts Section */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0A0A0A]">Liên kết tài khoản mạng xã hội</h3>
                <p className="text-xs text-gray-500 mt-1">Liên kết với tài khoản Google để đăng nhập nhanh chóng bằng 1-click.</p>
              </div>

              <div className="space-y-3 max-w-xl">
                {/* Local Email/Password Method */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-xl">
                      <Mail size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0A0A0A]">Email & Mật khẩu</div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">{email}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-green-100">
                    Đang hoạt động
                  </span>
                </div>

                {/* Google OAuth Method */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 rounded-xl">
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8 12.57c0-3.3 2.685-5.97 5.99-5.97 1.5 0 2.87.55 3.94 1.45l3.12-3.12C19.18 3.12 16.27 2 13.99 2A10.57 10.57 0 0 0 3.42 12.57a10.57 10.57 0 0 0 10.57 10.57c5.83 0 10.13-4.1 10.13-10.27 0-.7-.08-1.2-.2-1.585H12.24z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0A0A0A]">Tài khoản Google</div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">
                        {accounts.some(acc => acc.provider === "GOOGLE") 
                          ? `Đã liên kết (ID: ${accounts.find(acc => acc.provider === "GOOGLE")?.providerId || "N/A"})`
                          : "Chưa liên kết tài khoản Google"
                        }
                      </div>
                    </div>
                  </div>

                  {accounts.some(acc => acc.provider === "GOOGLE") ? (
                    <button
                      onClick={() => handleUnlink("GOOGLE")}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs font-bold rounded-xl transition-all active:scale-95"
                    >
                      Hủy liên kết
                    </button>
                  ) : (
                    <button
                      onClick={handleLinkGoogle}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Liên kết ngay
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div>
                <h2 className="text-lg font-bold text-[#0A0A0A]">Support History</h2>
                <p className="text-sm text-gray-500 mt-1">Review your conversations with our support team.</p>
             </div>

             <div className="border border-gray-100 rounded-3xl overflow-hidden flex flex-col h-[500px] bg-gray-50/50 shadow-inner">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                   {chatMessages.map((msg, i) => (
                     <div key={i} data-testid="chat-message" className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#0A0A0A] text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                           {msg.text}
                           <div className={`text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-white/40' : 'text-gray-400'}`}>{msg.time}</div>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-4 bg-white border-t border-gray-100">
                   <div className="flex gap-2">
                      <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..." 
                        data-testid="support-chat-input"
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-black outline-none text-sm transition-all" 
                      />
                      <button 
                        onClick={handleSendMessage} 
                        data-testid="support-chat-send-btn"
                        className="p-2.5 bg-[#0A0A0A] text-white rounded-xl hover:bg-gray-800 transition-all"
                      >
                         <Send size={18} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="animate-in fade-in duration-300">
             <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center">
                <CreditCard size={48} className="text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-[#0A0A0A]">Billing portal</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">Manage your current subscription, invoices and payment methods.</p>
                <button 
                  onClick={() => navigate("/pricing")} 
                  data-testid="billing-upgrade-btn"
                  className="mt-6 px-8 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
                >
                   View Plans & Upgrade <ExternalLink size={14} />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
