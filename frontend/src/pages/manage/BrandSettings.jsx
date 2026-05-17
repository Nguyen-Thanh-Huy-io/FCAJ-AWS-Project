import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronDown, HelpCircle, Plus, Diamond, Share2, 
  Check, Youtube, ChevronUp
} from "lucide-react";
import { ConnectionsGrid } from "../../components/shared/ConnectionsGrid";
import { WorkplaceHeader } from "../../components/shared/WorkplaceHeader";
import { BrandTableOverlay } from "../../components/shared/BrandTableOverlay";

const BRANDS = [
  { id: 1, name: "Empty brand", initial: "C", color: "#E1306C", platforms: ["YouTube"] },
  { id: 2, name: "TechVN Studio", initial: "T", color: "#4F46E5", platforms: ["YouTube", "Facebook", "Instagram"] },
];

export function BrandSettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("brand-settings");
  const [brandName, setBrandName] = useState("Empty brand");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTableOverlayOpen, setIsTableOverlayOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    
    if (tabParam === "connections") setActiveTab("connections");
    else if (tabParam === "ai") setActiveTab("ai-configuration");
    else setActiveTab("brand-settings");
  }, [location.search]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    let query = "";
    if (tabId === "connections") query = "?tab=connections";
    else if (tabId === "ai-configuration") query = "?tab=ai";
    else query = "?tab=brand-settings";
    navigate(`${location.pathname}${query}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white p-8 font-sans">
      <h1 className="text-xl font-medium text-[#0A0A0A] mb-8">Brand settings</h1>

      {/* Brands Selector Section */}
      <div className="bg-[#F8F9FB] rounded-2xl p-6 border border-gray-100 mb-10 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#0A0A0A]">Brands</span>
            <span className="text-xs text-gray-400 font-medium">1 of 1</span>
            <HelpCircle size={14} className="text-gray-300 ml-1" />
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-lg text-xs font-bold text-[#854D0E] hover:bg-[#FEF9C3] transition-all shadow-sm">
            <Plus size={14} /> Add brand <Diamond size={12} className="fill-current" />
          </button>
        </div>

        <div className="max-w-xl relative" ref={dropdownRef}>
           {/* Main Selection Bar */}
           <div 
             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             className={`bg-[#E5E5E5] border border-gray-300 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-gray-400 transition-all ${isDropdownOpen ? 'rounded-b-none border-b-transparent' : ''}`}
           >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-[#E1306C] flex items-center justify-center text-white font-bold text-lg shadow-sm">C</div>
                 <div>
                    <div className="text-sm font-bold text-[#0A0A0A]">{brandName}</div>
                    <div className="flex items-center gap-1 mt-0.5"><Youtube size={12} className="text-red-600" /></div>
                 </div>
              </div>
              {isDropdownOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
           </div>

           {/* Dropdown Menu */}
           {isDropdownOpen && (
             <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-transparent rounded-b-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                {BRANDS.map((brand) => (
                  <div 
                    key={brand.id}
                    onClick={() => { setBrandName(brand.name); setIsDropdownOpen(false); }}
                    className="p-3 flex items-center gap-3 hover:bg-[#E5E7EB] transition-colors cursor-pointer group"
                  >
                     <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm" style={{ backgroundColor: brand.color }}>
                        {brand.initial}
                     </div>
                     <div>
                        <div className="text-sm font-bold text-[#0A0A0A]">{brand.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                           {brand.platforms.includes("YouTube") && <Youtube size={12} className="text-red-600" />}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           )}

           <button 
             onClick={() => setIsTableOverlayOpen(true)}
             className="mt-3 text-xs text-gray-400 hover:text-gray-600 font-medium ml-1 cursor-pointer"
           >
             View as table
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 mb-8">
        <div className="flex gap-10">
          {[
            { id: "brand-settings", label: "Brand settings" },
            { id: "connections", label: "Connections" },
            { id: "ai-configuration", label: "AI Configuration" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`pb-4 text-sm font-black transition-all relative ${activeTab === tab.id ? "text-black" : "text-gray-400"}`}>
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0A0A0A]" />}
            </button>
          ))}
        </div>
        <button className="p-2 text-gray-400 hover:text-[#0A0A0A] transition-colors"><Share2 size={18} /></button>
      </div>

      <div className="max-w-6xl pb-20">
        {activeTab === "brand-settings" && (
          <div className="grid grid-cols-2 gap-x-20 gap-y-10 animate-in fade-in duration-300 max-w-4xl">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">Name</h3>
                <p className="text-sm text-gray-500 mb-4">Define a name to properly identify this brand.</p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand name</label>
                  <input placeholder="Brand name" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none text-sm font-medium" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">Engagement</h3>
                <p className="text-sm text-gray-400 leading-relaxed">You can configure which ratio to use when calculating the engagement metric. This way, your reports will be more aligned with your own business goals.</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">Image</h3>
              <p className="text-sm text-gray-500 mb-4">Choose an image from your connected accounts:</p>
              <div className="w-16 h-16 rounded-xl bg-[#581C2C] flex items-center justify-center relative cursor-pointer border-2 border-transparent hover:border-gray-200 shadow-sm"><div className="w-6 h-6 rounded-full bg-[#34D399] flex items-center justify-center absolute -top-2 -right-2 border-2 border-white shadow-sm"><Check size={14} className="text-white" strokeWidth={3} /></div></div>
            </div>
          </div>
        )}

        {activeTab === "connections" && (
           <div className="animate-in fade-in duration-300">
              <ConnectionsGrid />
           </div>
        )}

        {activeTab === "ai-configuration" && (
           <div className="h-64 border-2 border-dashed border-gray-100 rounded-3xl flex items-center justify-center text-gray-300 font-medium">AI model configuration...</div>
        )}
      </div>

      {/* Table Overlay */}
      <BrandTableOverlay 
        isOpen={isTableOverlayOpen} 
        onClose={() => setIsTableOverlayOpen(false)} 
        onSelect={setBrandName}
      />
    </div>
  );
}
