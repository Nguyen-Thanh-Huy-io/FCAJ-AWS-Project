import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, ChevronLeft, Globe, PlayCircle, Settings, 
  Copy, Eye, EyeOff, Check, Image as ImageIcon,
  Upload, Info, AlertTriangle, Monitor, Radio,
  ChevronDown, Settings2, Users, MessageSquare, Shield, ChevronRight
} from "lucide-react";
import { PlatformIcon } from "../../components/shared/PlatformIcon";
import { MetricToggle } from "../../components/shared/MetricToggle";

// Specific configuration fields for YouTube
function YouTubeConfig() {
  return (
    <div className="p-5 bg-gray-50 border-t border-gray-100 space-y-5 animate-in fade-in slide-in-from-top-2">
       <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Shield size={12}/> Privacy</label>
             <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs bg-white shadow-sm font-bold cursor-pointer">
                <option>Public</option><option>Unlisted</option><option>Private</option>
             </select>
          </div>
          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Users size={12}/> Audience</label>
             <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs bg-white shadow-sm font-bold cursor-pointer">
                <option>No, it's not made for kids</option><option>Yes, it's made for kids</option>
             </select>
          </div>
       </div>
       <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare size={12}/> Live Chat Rules</h4>
          <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-700">Enable Live Chat</span>
             <MetricToggle on={true} />
          </div>
          <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-700">Subscribers-only mode</span>
             <MetricToggle on={false} />
          </div>
          <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-700">Slow mode (60 seconds)</span>
             <MetricToggle on={false} />
          </div>
       </div>
    </div>
  )
}

// Specific configuration fields for Facebook
function FacebookConfig() {
  return (
    <div className="p-5 bg-gray-50 border-t border-gray-100 space-y-5 animate-in fade-in slide-in-from-top-2">
       <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Globe size={12}/> Stream Target</label>
             <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs bg-white shadow-sm font-bold cursor-pointer">
                <option>TechVN Page</option><option>Personal Timeline</option><option>TechVN Community Group</option>
             </select>
          </div>
          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Shield size={12}/> Privacy</label>
             <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs bg-white shadow-sm font-bold cursor-pointer">
                <option>Public</option><option>Friends</option><option>Only Me</option>
             </select>
          </div>
       </div>
       <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Settings2 size={12}/> Crossposting</label>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
             <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Select pages for crossposting</span>
             <ChevronRight size={16} className="text-gray-400" />
          </div>
       </div>
    </div>
  )
}

export function LiveSetupPage() {
  const navigate = useNavigate();
  const [showKey, setShowPass] = useState(false);
  const [copied, setCopied] = useState(null);
  
  const [selectedDestinations, setSelectedDestinations] = useState(["YouTube"]);
  const [expandedConfigs, setExpandedConfigs] = useState(["YouTube"]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Just Chatting",
  });

  const streamKey = "sk_live_v1_9a382bcd-8e74-4f2a-b9c1-42e5d9f018a2";
  const rtmpUrl = "rtmps://live-api-s.streamhub.com:443/rtmp/";

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleDestination = (platform) => {
    if (selectedDestinations.includes(platform)) {
      setSelectedDestinations(selectedDestinations.filter(p => p !== platform));
      setExpandedConfigs(expandedConfigs.filter(p => p !== platform));
    } else {
      setSelectedDestinations([...selectedDestinations, platform]);
      setExpandedConfigs([...expandedConfigs, platform]);
    }
  };

  const toggleConfig = (platform, e) => {
    e.stopPropagation();
    if (expandedConfigs.includes(platform)) {
      setExpandedConfigs(expandedConfigs.filter(p => p !== platform));
    } else {
      setExpandedConfigs([...expandedConfigs, platform]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F7] font-sans">
      {/* Header */}
      <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate("/live")}
             className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-500"
           >
              <ChevronLeft size={20} />
           </button>
           <div>
             <h1 className="text-xl font-black text-[#0A0A0A]">Pre-stream Studio</h1>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Configure your stream before going live</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase">Offline</span>
           </div>
           <button 
             disabled={selectedDestinations.length === 0}
             className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-[2px] transition-all ${selectedDestinations.length > 0 ? 'bg-[#0A0A0A] text-white shadow-xl hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
           >
              Go Live
           </button>
        </div>
      </div>

      <div className="p-10 grid grid-cols-12 gap-10 max-w-[1400px] mx-auto">
        
        {/* LEFT COLUMN: STREAM DETAILS */}
        <div className="col-span-7 space-y-10">
           {/* Basic Info */}
           <section className="space-y-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                 <Info size={14} /> Global Stream Details
              </h2>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stream Title</label>
                    <input 
                      placeholder="Enter a catchy title for your stream"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:border-black outline-none transition-all text-sm font-bold shadow-inner bg-gray-50/30" 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      placeholder="Tell your viewers what this stream is about..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:border-black outline-none text-sm font-medium h-32 resize-none bg-gray-50/30" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                       <select className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 focus:border-black outline-none text-sm font-bold bg-white shadow-sm">
                          <option>Just Chatting</option><option>Technology</option><option>Gaming</option><option>Education</option>
                       </select>
                    </div>
                    <div className="space-y-2 text-right">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">Thumbnail</label>
                       <div className="h-[52px] rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-all text-gray-400 hover:text-black">
                          <Upload size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Upload JPG/PNG</span>
                       </div>
                    </div>
                 </div>
              </div>
           </section>

           {/* Platform Specific Configurations */}
           <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                   <Globe size={14} /> Destinations & Configurations
                </h2>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">{selectedDestinations.length} Active</span>
              </div>
              
              <div className="space-y-4">
                 {["YouTube", "Facebook", "TikTok", "Instagram"].map(p => {
                   const isSelected = selectedDestinations.includes(p);
                   const isExpanded = expandedConfigs.includes(p);
                   
                   return (
                     <div 
                       key={p} 
                       className={`rounded-3xl border overflow-hidden transition-all ${isSelected ? 'border-[#0A0A0A] bg-white shadow-md' : 'border-gray-100 bg-gray-50/30'}`}
                     >
                        <div 
                          onClick={() => toggleDestination(p)}
                          className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                           <div className="flex items-center gap-4">
                              <PlatformIcon platform={p} size={24} />
                              <div>
                                 <span className={`text-sm font-bold block ${isSelected ? 'text-[#0A0A0A]' : 'text-gray-400'}`}>{p}</span>
                                 {isSelected && <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Ready to stream</span>}
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-4">
                              {isSelected && (p === "YouTube" || p === "Facebook") && (
                                <button 
                                  onClick={(e) => toggleConfig(p, e)}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-bold text-gray-600"
                                >
                                   <Settings2 size={14} /> {isExpanded ? 'Hide Setup' : 'Configure'} {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                                </button>
                              )}
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black shadow-lg scale-110' : 'border-gray-200'}`}>
                                 {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                              </div>
                           </div>
                        </div>

                        {isSelected && isExpanded && (
                           <>
                              {p === "YouTube" && <YouTubeConfig />}
                              {p === "Facebook" && <FacebookConfig />}
                              {(p === "TikTok" || p === "Instagram") && (
                                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Uses standard global settings</div>
                              )}
                           </>
                        )}
                     </div>
                   );
                 })}
              </div>
           </section>
        </div>

        {/* RIGHT COLUMN: TECHNICAL CONFIG */}
        <div className="col-span-5 space-y-8">
           {/* Preview Box */}
           <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl relative border-4 border-white">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                 <Monitor size={48} className="text-gray-800 mb-4 animate-pulse" />
                 <h3 className="text-white font-black text-sm uppercase tracking-[3px]">Waiting for signal...</h3>
                 <p className="text-[10px] text-gray-500 mt-2 max-w-[200px] font-bold uppercase tracking-widest leading-relaxed">Please configure OBS with the settings below to start previewing.</p>
              </div>
           </div>

           {/* Stream Keys */}
           <section className="bg-[#1A1A1A] p-8 rounded-[32px] shadow-2xl space-y-8">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[2px] flex items-center gap-2">
                 <Settings size={14} /> Technical Configuration
              </h2>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Stream Server URL (RTMP)</label>
                    <div className="relative">
                       <input 
                         readOnly
                         value={rtmpUrl}
                         className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-mono outline-none" 
                       />
                       <button onClick={() => handleCopy(rtmpUrl, 'url')} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white">
                          {copied === 'url' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                       </button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Stream Key</label>
                    <div className="relative">
                       <input type={showKey ? "text" : "password"} readOnly value={streamKey} className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-mono outline-none" />
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button onClick={() => setShowPass(!showKey)} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
                             {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button onClick={() => handleCopy(streamKey, 'key')} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
                             {copied === 'key' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                       </div>
                    </div>
                    <div className="flex items-start gap-2 mt-3 px-1 text-amber-500/80">
                       <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                       <p className="text-[9px] font-bold uppercase leading-tight tracking-wider">Warning: Never share your stream key. Anyone with this key can broadcast to your account.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-4">
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[3px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Radio size={14} /> Open StreamHub Encoder
                 </button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
