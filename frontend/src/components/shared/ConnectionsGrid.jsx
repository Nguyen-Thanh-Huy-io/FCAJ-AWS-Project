import React from "react";
import { 
  Rss, Facebook, Instagram, Twitter, 
  Linkedin, Music2, Globe, Store, 
  Diamond, Check, X, Youtube, PlayCircle
} from "lucide-react";

export const NETWORKS = [
  { 
    id: "web", name: "Web", icon: <Rss size={16} className="text-blue-400" />, 
    btnText: "Connect a web page", btnBg: "bg-blue-400", connected: true, handle: "techvn.io"
  },
  { 
    id: "blog", name: "Blog", icon: <Rss size={16} className="text-blue-300" />, 
    btnText: "Connect a blog", btnBg: "bg-teal-200 opacity-60", 
    note: "In order to connect a blog you need to connect a web page first."
  },
  { 
    id: "facebook", name: "Facebook", icon: <Facebook size={16} className="text-blue-600" />, 
    btnText: "Connect a Facebook page", btnBg: "bg-blue-600", connected: true, handle: "TechVN Studio"
  },
  { 
    id: "instagram", name: "Instagram", icon: <Instagram size={16} className="text-pink-600" />, 
    btnText: "Connect an Instagram professional account", btnBg: "bg-[#FF0069]", connected: false
  },
  { 
    id: "threads", name: "Threads", icon: <Music2 size={16} className="text-black" />, 
    btnText: "Connect a Threads account", btnBg: "bg-black", connected: false
  },
  { 
    id: "x", name: "X", icon: <X size={16} className="text-black" />, 
    btnText: "Connect a Twitter / X account", btnBg: "bg-[#FEFCE8]", btnTextColor: "text-gray-800", isPremium: true, connected: true, handle: "@techvn_io"
  },
  { 
    id: "bluesky", name: "Bluesky", icon: <Globe size={16} className="text-blue-400" />, 
    btnText: "Connect a Bluesky account", btnBg: "bg-blue-500", connected: false
  },
  { 
    id: "linkedin", name: "LinkedIn", icon: <Linkedin size={16} className="text-blue-700" />, 
    btnText: "Connect a LinkedIn account for 15 days for free", btnBg: "bg-[#FEFCE8]", btnTextColor: "text-gray-800", isPremium: true, connected: true, handle: "TechVN Company"
  },
  { 
    id: "pinterest", name: "Pinterest", icon: <Check size={16} className="text-red-600" />, 
    btnText: "Connect a Pinterest account", btnBg: "bg-red-600", connected: false
  },
  { 
    id: "tiktok_personal", name: "TikTok personal", icon: <Music2 size={16} className="text-black" />, 
    btnText: "Connect a TikTok personal account", btnBg: "bg-black", connected: true, handle: "@vothanhnha"
  },
  { 
    id: "tiktok_business", name: "TikTok business", icon: <Music2 size={16} className="text-black" />, 
    btnText: "Connect a TikTok business account", btnBg: "bg-black", connected: false
  },
  { 
    id: "google", name: "Google Business Profile", icon: <Store size={16} className="text-blue-500" />, 
    btnText: "Connect a Google Business Profile account", btnBg: "bg-blue-500", connected: false
  },
  { 
    id: "youtube", name: "YouTube", icon: <Youtube size={16} className="text-red-600" />, 
    btnText: "Connect a YouTube channel", btnBg: "bg-red-600", connected: true, handle: "@techvn_official"
  },
];

export function ConnectionsGrid({ className = "" }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 ${className}`}>
      {NETWORKS.map((net) => (
        <div key={net.id} className="space-y-4 relative group">
           {/* Network Label */}
           <div className="flex items-center gap-2 px-1">
              {net.icon}
              <span className="text-[15px] font-bold text-[#0A0A0A]">{net.name}</span>
           </div>

           {/* Connection Button */}
           <div className="relative">
              <button 
                className={`w-full h-[60px] rounded-2xl flex items-center justify-between px-6 transition-all transform active:scale-95 shadow-sm border border-black/5 ${net.btnBg} ${net.btnTextColor || 'text-white'}`}
              >
                 <div className="flex-1 min-w-0 pr-4">
                    {net.connected ? (
                       <div className="flex flex-col items-start text-left">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${net.btnTextColor || 'text-white'}`}>CONNECTED {net.handle}</span>
                          <span className={`text-[11px] font-bold underline mt-1 opacity-90 hover:opacity-100 ${net.btnTextColor ? 'text-red-600' : 'text-white'}`}>Disconnect</span>
                       </div>
                    ) : (
                       <span className="text-[11px] font-black text-left leading-snug uppercase tracking-[1px]">
                          {net.btnText}
                       </span>
                    )}
                 </div>
                 
                 {net.isPremium ? (
                    <Diamond size={16} className="text-yellow-500 fill-current shrink-0" />
                 ) : (
                    <div className="text-white/40 group-hover:text-white transition-colors shrink-0">
                       {React.cloneElement(net.icon, { size: 20, className: "text-white" })}
                    </div>
                 )}
              </button>

              {/* Tooltip for Blog */}
              {net.note && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-3 bg-white border border-gray-100 rounded-xl shadow-2xl z-10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-y-1 group-hover:translate-y-0">
                   <p className="text-[10px] text-gray-500 text-center leading-relaxed font-medium">
                      {net.note}
                   </p>
                   <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white" />
                </div>
              )}
           </div>
        </div>
      ))}
    </div>
  );
}
