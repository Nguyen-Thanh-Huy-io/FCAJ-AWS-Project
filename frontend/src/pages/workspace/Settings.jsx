import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  User, Shield, CreditCard, Globe, 
  Mail, Lock, Smartphone, ExternalLink,
  MessageCircle, Send, Paperclip, CheckCircle2, Search,
  AlertTriangle, Loader2
} from "lucide-react";
import profileService from "../../services/profile.service";
import { toast } from "sonner";

export function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  // State for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [receiveSummary, setReceiveSummary] = useState(true);
  const [customSummaryEmail, setCustomSummaryEmail] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        }
      } catch (err) {
        toast.error("Không thể lấy thông tin profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" placeholder="Enter new password" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none text-sm font-medium" />
                </div>
                <p className="text-[10px] text-gray-400 italic">Enter a new password to change the current one</p>
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
              
              <button className="px-8 py-3 bg-[#0A0A0A] text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">Update Access</button>
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
                     <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-black outline-none text-sm transition-all" 
                      />
                      <button onClick={handleSendMessage} className="p-2.5 bg-[#0A0A0A] text-white rounded-xl hover:bg-gray-800 transition-all">
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
                <button onClick={() => navigate("/pricing")} className="mt-6 px-8 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-md flex items-center gap-2">
                   View Plans & Upgrade <ExternalLink size={14} />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
