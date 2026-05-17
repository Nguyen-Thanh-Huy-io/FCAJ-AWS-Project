import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavbarProps {
  onNavigate?: (page: string) => void;
}

const productDropdownData = {
  col1: {
    title: "Planner & Publish",
    icon: "📅",
    items: [
      { name: "Planner", desc: "Visual content calendar" },
      { name: "Post Creator", desc: "Rich editor for all platforms" },
      { name: "Approval System", desc: "Team review workflows" },
      { name: "SmartLinks", desc: "Bio link management" },
      { name: "AI Assistant", desc: "AI-powered content help" },
    ],
  },
  col2: {
    title: "Livestream",
    icon: "📡",
    items: [
      { name: "Stream Scheduler", desc: "Plan your live sessions" },
      { name: "Live Monitor", desc: "Real-time stream control" },
      { name: "Multi-Platform Streaming", desc: "Go live everywhere at once" },
      { name: "VOD History", desc: "Past stream recordings" },
    ],
  },
  col3: {
    title: "Analytics & Grow",
    icon: "📊",
    items: [
      { name: "Analytics", desc: "Unified performance data" },
      { name: "Reports", desc: "Client-ready reports" },
      { name: "Competitors", desc: "Benchmark your growth" },
      { name: "Ads", desc: "Ad campaign tracking" },
      { name: "Inbox", desc: "All messages in one place" },
    ],
  },
};

export function Navbar({ onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductOpen(false);
        setPlatformsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      style={{ fontFamily: "'DM Sans', sans-serif", borderBottom: "0.5px solid #E5E7EB" }}
      className="sticky top-0 z-50 bg-white"
    >
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between" ref={dropdownRef}>
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">S</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>StreamHub</span>
        </div>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Product Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 transition-colors duration-150"
              style={{ fontSize: 13, color: productOpen ? "#0A0A0A" : "#6B7280" }}
              onMouseEnter={() => { setProductOpen(true); setPlatformsOpen(false); }}
            >
              Product <ChevronDown size={12} />
            </button>
            {productOpen && (
              <div
                className="absolute top-8 left-0 bg-white rounded-xl p-4 z-50"
                style={{ border: "0.5px solid #E5E7EB", width: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                onMouseLeave={() => setProductOpen(false)}
              >
                <div className="grid grid-cols-3 gap-4">
                  {Object.values(productDropdownData).map((col) => (
                    <div key={col.title}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs">{col.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF" }}>{col.title}</span>
                      </div>
                      {col.items.map((item) => (
                        <button
                          key={item.name}
                          className="block w-full text-left px-2 py-1.5 rounded-md hover:bg-[#F8F8F7] transition-colors duration-150"
                        >
                          <div style={{ fontSize: 13, color: "#0A0A0A" }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Platforms Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 transition-colors duration-150"
              style={{ fontSize: 13, color: platformsOpen ? "#0A0A0A" : "#6B7280" }}
              onMouseEnter={() => { setPlatformsOpen(true); setProductOpen(false); }}
            >
              Platforms <ChevronDown size={12} />
            </button>
            {platformsOpen && (
              <div
                className="absolute top-8 left-0 bg-white rounded-xl p-3 z-50"
                style={{ border: "0.5px solid #E5E7EB", width: 180, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                onMouseLeave={() => setPlatformsOpen(false)}
              >
                {["YouTube", "Instagram", "TikTok", "Facebook", "Twitch", "LinkedIn", "X / Twitter"].map((p) => (
                  <button key={p} className="block w-full text-left px-2 py-1.5 rounded-md hover:bg-[#F8F8F7] transition-colors" style={{ fontSize: 13, color: "#0A0A0A" }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {["Pricing", "Agencies", "Blog"].map((link) => (
            <button
              key={link}
              className="hover:text-[#0A0A0A] transition-colors duration-150"
              style={{ fontSize: 13, color: "#6B7280" }}
              onClick={() => link === "Pricing" && onNavigate?.("pricing")}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="hover:text-[#0A0A0A] transition-colors duration-150"
            style={{ fontSize: 13, color: "#0A0A0A" }}
            onClick={() => onNavigate?.("login")}
          >
            Log in
          </button>
          <button
            className="bg-[#0A0A0A] text-white hover:bg-[#1E1E1E] transition-colors duration-150"
            style={{ fontSize: 12, fontWeight: 500, height: 36, padding: "0 16px", borderRadius: 12 }}
            onClick={() => onNavigate?.("signup")}
          >
            Get started free →
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-4" style={{ borderTop: "0.5px solid #E5E7EB" }}>
          {["Product", "Platforms", "Pricing", "Agencies", "Blog"].map((link) => (
            <button key={link} className="block w-full text-left py-3" style={{ fontSize: 14, color: "#0A0A0A", borderBottom: "0.5px solid #F3F4F6" }}>
              {link}
            </button>
          ))}
          <div className="flex gap-3 mt-4">
            <button className="flex-1 py-2 rounded-lg text-center" style={{ fontSize: 13, color: "#0A0A0A", border: "0.5px solid #E5E7EB" }}>Log in</button>
            <button className="flex-1 py-2 rounded-lg bg-[#0A0A0A] text-white text-center" style={{ fontSize: 13 }}>Get started free</button>
          </div>
        </div>
      )}
    </nav>
  );
}
