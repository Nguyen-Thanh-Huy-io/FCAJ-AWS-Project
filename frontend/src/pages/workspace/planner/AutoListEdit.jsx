import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, AlertTriangle, Settings, 
  Trash2, Plus, FileUp, Download, 
  Sparkles, Rss, Youtube, PlayCircle,
  Diamond, ChevronDown, Loader2, Instagram, Facebook, Linkedin
} from "lucide-react";
import { Switch } from "../../../components/ui/switch";
import brandService from "../../../services/brand.service";
import socialService from "../../../services/social.service";
import autoListService from "../../../services/auto-list.service";
import { toast } from "sonner";

const PLATFORM_ICONS = {
  YOUTUBE: <Youtube size={18} className="text-[#FF0000]" />,
  TIKTOK: <PlayCircle size={18} className="text-[#010101]" />,
  INSTAGRAM: <Instagram size={18} className="text-[#E1306C]" />,
  FACEBOOK: <Facebook size={18} className="text-[#1877F2]" />,
  LINKEDIN: <Linkedin size={18} className="text-[#0A66C2]" />,
};

export function AutoListEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [name, setName] = useState("New autolist 1");
  const [repeat, setRepeat] = useState(false);
  const [selectedDays, setSelectedDays] = useState(['Mo', 'Tu', 'We', 'Th', 'Fr']);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBrand, setActiveBrand] = useState(null);

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const brandsRes = await brandService.getBrands();
        if (brandsRes.data?.length > 0) {
          const brand = brandsRes.data[0];
          setActiveBrand(brand);
          
          // Load connected platforms
          const metricsRes = await socialService.getMetrics(brand.id);
          const platforms = (metricsRes.data || []).map(m => ({
            id: m.platform,
            name: m.platform.charAt(0) + m.platform.slice(1).toLowerCase(),
            icon: PLATFORM_ICONS[m.platform] || <PlayCircle size={18} />
          }));
          setConnectedPlatforms(platforms);

          // Load list details if editing
          if (!isNew) {
            const listRes = await autoListService.getAutoListDetails(id);
            if (listRes.data) {
              const list = listRes.data;
              setName(list.name);
              setRepeat(list.loopEnabled);
              setSelectedPlatforms(list.targetPlatforms.split(','));
              setSelectedDays(list.activeDays.split(','));
            }
          }
        }
      } catch (e) {
        console.error("Failed to initialize", e);
        toast.error("Failed to load autolist details");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [id, isNew]);

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]
    );
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white min-h-screen">
         <Loader2 className="animate-spin text-gray-200" size={40} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen animate-in slide-in-from-right duration-300">
      {/* Sub-Header */}
      <div className="px-8 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
        <h2 className="text-sm font-bold text-gray-800">{isNew ? "Create autolist" : "Edit autolist"}</h2>
        <button 
          onClick={() => navigate("/planner/autolists")}
          className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Error Alert */}
        {selectedPlatforms.length === 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              <AlertTriangle size={14} />
            </div>
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-tight">You must select at least one network.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-10">
            {/* Name */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Name</h3>
              <div className="relative">
                <label className="absolute -top-2 left-4 px-1 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest z-10">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl text-xs font-bold focus:border-black outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Configuration</h3>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/30">
                <div className="flex items-center gap-3">
                  <Settings size={16} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">Global presets</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Repeat</span>
                    <Switch checked={repeat} onCheckedChange={setRepeat} />
                  </div>
                  <ChevronDown size={16} className="text-gray-300" />
                </div>
              </div>
            </div>

            {/* Timing */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Timing</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Asia/Ho_Chi_Minh</p>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                   <span className="text-xs font-bold text-gray-700">5</span>
                   <ChevronDown size={10} className="text-gray-400" />
                   <span className="text-gray-300 mx-0.5">:</span>
                   <span className="text-xs font-bold text-gray-700">28</span>
                   <ChevronDown size={10} className="text-gray-400" />
                </div>
                
                <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
                   <button className="px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all text-gray-400">AM</button>
                   <button className="px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all bg-white text-blue-600 shadow-sm">PM</button>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all border ${
                        selectedDays.includes(day) 
                          ? 'bg-[#F3F4F6] text-black border-transparent shadow-sm' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <button className="ml-2 w-9 h-9 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-orange-500/20 cursor-pointer">
                   <Trash2 size={16} />
                </button>
              </div>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm mt-4">
                 <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">Where to publish?</h3>
            <div className="flex flex-col gap-3">
               {connectedPlatforms.map((p) => (
                 <button 
                   key={p.id}
                   onClick={() => togglePlatform(p.id)}
                   className={`flex items-center gap-3 px-5 py-3 border rounded-2xl transition-all group cursor-pointer ${
                     selectedPlatforms.includes(p.id) ? 'border-black bg-gray-50/50' : 'border-gray-100 bg-white hover:border-gray-300'
                   }`}
                 >
                    {p.icon}
                    <span className={`text-xs font-bold ${selectedPlatforms.includes(p.id) ? 'text-black' : 'text-gray-700'}`}>{p.name}</span>
                 </button>
               ))}
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 my-8" />

        {/* Content */}
        <div className="space-y-6 text-left pb-20">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">Content of the autolist</h3>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl transition-all group cursor-pointer">
               <Plus size={14} className="text-gray-400 group-hover:text-black" />
               <span className="text-[11px] font-bold text-gray-600 group-hover:text-black">Insert post</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl transition-all group cursor-pointer">
               <Sparkles size={14} className="text-gray-400 group-hover:text-black" />
               <span className="text-[11px] font-bold text-gray-600 group-hover:text-black">Add posts with AI</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl transition-all group cursor-pointer">
               <FileUp size={14} className="text-gray-400 group-hover:text-black" />
               <span className="text-[11px] font-bold text-gray-600 group-hover:text-black">Add from file (CSV)</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#D9F99D]/30 rounded-xl transition-all group cursor-pointer">
               <Download size={14} className="text-gray-400 group-hover:text-black" />
               <span className="text-[11px] font-bold text-gray-600 group-hover:text-black">Download CSV</span>
               <div className="bg-[#D9F99D] p-1 rounded-full border border-[#BEF264]">
                 <Diamond size={8} className="text-black" />
               </div>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 opacity-30 cursor-not-allowed">
               <Trash2 size={14} />
               <span className="text-[11px] font-bold">Delete all</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl transition-all group cursor-pointer">
               <Rss size={14} className="text-gray-400 group-hover:text-black" />
               <span className="text-[11px] font-bold text-gray-600 group-hover:text-black">Linked RSS feed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
