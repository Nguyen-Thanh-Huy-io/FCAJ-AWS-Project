import { Link, useLocation } from "react-router-dom";
import {
  Youtube, Instagram, Facebook, Linkedin,
  TrendingUp, List, Hash, Settings, Search,
  PlayCircle, FileText, Megaphone, Plus
} from "lucide-react";
import { useConnections } from "../context/ConnectionsContext";

const PLATFORMS = [
  { name: "Summary", icon: <List size={18} />, path: "/dashboard", color: "#6B7280" },
  { name: "YouTube", icon: <Youtube size={18} />, path: "/dashboard/youtube", color: "#FF0000", brand: "T" },
  { name: "Facebook", icon: <Facebook size={18} />, path: "/dashboard/facebook", color: "#1877F2", brand: "T" },
  { name: "Instagram", icon: <Instagram size={18} />, path: "/dashboard/instagram", color: "#E1306C", brand: "T" },
  { name: "TikTok", icon: <PlayCircle size={18} />, path: "/dashboard/tiktok", color: "#000000", brand: "T" },
  { name: "LinkedIn", icon: <Linkedin size={18} />, path: "/dashboard/linkedin", color: "#0A66C2", brand: "T" },
  { name: "More connection", icon: <Plus size={18} />, isAction: true, color: "#3B82F6" },
];

const MANAGE_ITEMS = [
  { name: "Brand settings", icon: <Settings size={18} />, path: "/manage/connections?tab=brand-settings" },
  { name: "Hashtag Tracker", icon: <Hash size={18} />, path: "/hashtags" },
  { name: "Reporting", icon: <FileText size={18} />, path: "/manage/reports" },
  { name: "Competitors", icon: <TrendingUp size={18} />, path: "/manage/competitors" },
  { name: "Ads Manager", icon: <Megaphone size={18} />, path: "/manage/ads" },
];

export function SidebarWorkspace() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { openConnections } = useConnections();

  const isManageMode = currentPath.startsWith("/manage") || currentPath.startsWith("/hashtags") || currentPath.startsWith("/settings");

  return (
    <aside
      style={{ width: 220, background: "#FFFFFF", borderRight: "1px solid #E5E7EB" }}
      className="flex flex-col h-full shrink-0 overflow-y-auto"
    >
      <div className="flex-1 py-6 px-3">
        {/* Section Label */}
        <div className="px-3 mb-4 flex items-center justify-between">
           <span style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px" }}>
              {isManageMode ? "Management" : "Analytics"}
           </span>
        </div>

        <nav className="flex flex-col gap-1">
          {(isManageMode ? MANAGE_ITEMS : PLATFORMS).map((item) => {
            const isActive = item.path && currentPath === item.path.split('?')[0];
            
            const content = (
              <>
                <div 
                  className={`shrink-0 transition-colors ${isActive ? "" : "text-gray-400 group-hover:text-gray-600"}`}
                  style={{ color: (isActive || item.isAction) ? (item.color || "#0A0A0A") : undefined }}
                >
                  {item.icon}
                </div>
                <span 
                  style={{ 
                    fontSize: 13, 
                    fontWeight: (isActive || item.isAction) ? 600 : 400,
                    color: (isActive || item.isAction) ? (item.isAction ? item.color : "#0A0A0A") : "#6B7280"
                  }}
                  className="transition-colors group-hover:text-gray-900"
                >
                  {item.name}
                </span>
                {isActive && !item.isAction && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
                )}
              </>
            );

            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  onClick={openConnections}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all no-underline group hover:bg-[#F8F8F7]"
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all no-underline group"
                style={{
                  backgroundColor: isActive ? "#F8F8F7" : "transparent",
                }}
              >
                {content}
              </Link>
            );
          })}
        </nav>

        {!isManageMode && (
          <div className="mt-8">
            <div className="px-3 mb-4">
              <span style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px" }}>
                Tools
              </span>
            </div>
            <Link
              to="/planner"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all no-underline ${
                currentPath.startsWith("/planner") ? "bg-[#F8F8F7] text-[#0A0A0A]" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FileText size={18} style={{ color: currentPath.startsWith("/planner") ? "#0A0A0A" : undefined }} />
              <span style={{ fontSize: 13, fontWeight: currentPath.startsWith("/planner") ? 600 : 400 }}>Content Planner</span>
              {currentPath.startsWith("/planner") && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
              )}
            </Link>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-50">
         <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-green-500" />
               <span className="text-[10px] font-bold text-gray-600 uppercase">Pro Plan</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">Next bill: June 12, 2026</div>
         </div>
      </div>
    </aside>
  );
}
