import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

const recentItems = [
  { label: "Dashboard", hint: "Last visited 2m ago", icon: "🏠" },
  { label: "Stream Monitor — Tech Review Q2", hint: "Last visited 1h ago", icon: "📡" },
];

const actions = [
  { label: "Start Livestream Now", icon: "⚡", shortcut: ["⌘", "⇧", "L"] },
  { label: "Create New Post", icon: "📝", shortcut: ["⌘", "N"] },
  { label: "Schedule Stream", icon: "📅", shortcut: ["⌘", "⇧", "S"] },
  { label: "Invite Team Member", icon: "📤", shortcut: [] },
  { label: "Export Report", icon: "📊", shortcut: [] },
  { label: "Create SmartLink", icon: "🔗", shortcut: [] },
  { label: "Open AI Assistant", icon: "🤖", shortcut: ["⌘", "⇧", "A"] },
];

const navItems = [
  { label: "Dashboard", breadcrumb: "Home", icon: "🏠", page: "dashboard" },
  { label: "Content Planner", breadcrumb: "Plan", icon: "📅", page: "planner" },
  { label: "Live Monitor", breadcrumb: "Livestream", icon: "📡", page: "live" },
  { label: "Analytics", breadcrumb: "Insights", icon: "📊", page: "analytics" },
  { label: "Inbox", breadcrumb: "Messages", icon: "💬", page: "inbox" },
  { label: "Team Settings", breadcrumb: "Settings", icon: "👥", page: "team" },
  { label: "AI Assistant", breadcrumb: "Tools", icon: "🤖", page: "ai-assistant" },
  { label: "Hashtag Manager", breadcrumb: "Tools", icon: "🔍", page: "hashtag-manager" },
  { label: "AutoLists", breadcrumb: "Automation", icon: "🔄", page: "autolists" },
  { label: "Reports", breadcrumb: "Analytics", icon: "📄", page: "reports" },
];

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredNav = query
    ? navItems.filter((n) => n.label.toLowerCase().includes(query.toLowerCase()))
    : navItems;

  const filteredActions = query
    ? actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : actions;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-[18vh]"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full flex flex-col"
        style={{
          maxWidth: 560,
          maxHeight: 480,
          borderRadius: 16,
          border: "0.5px solid #E5E7EB",
          animation: "paletteIn 100ms ease-out",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
          <Search size={16} color="#9CA3AF" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions, users, posts..."
            className="flex-1 outline-none bg-transparent"
            style={{ fontSize: 14, color: "#0A0A0A" }}
          />
          <span
            className="px-2 py-0.5 rounded"
            style={{ fontSize: 10, backgroundColor: "#F3F4F6", color: "#9CA3AF" }}
          >
            ESC
          </span>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 py-2">
          {!query && (
            <>
              {/* Recent */}
              <div className="px-4 py-1.5">
                <span style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  RECENT
                </span>
              </div>
              {recentItems.map((item, i) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#F8F8F7] transition-colors"
                  style={{ borderRadius: 6 }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: "#0A0A0A" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{item.hint}</span>
                </button>
              ))}
            </>
          )}

          {/* Actions */}
          {filteredActions.length > 0 && (
            <>
              <div className="px-4 py-1.5 mt-1">
                <span style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  ACTIONS
                </span>
              </div>
              {filteredActions.map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#F8F8F7] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#F3F4F6" }}>
                      <span style={{ fontSize: 13 }}>{action.icon}</span>
                    </div>
                    <span style={{ fontSize: 13, color: "#0A0A0A" }}>{action.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {action.shortcut.map((key, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "#F3F4F6", color: "#6B7280", fontSize: 10 }}>
                        {key}
                      </span>
                    ))}
                    <span className="hidden group-hover:inline ml-2" style={{ fontSize: 12, color: "#9CA3AF" }}>→</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Navigate */}
          {filteredNav.length > 0 && (
            <>
              <div className="px-4 py-1.5 mt-1">
                <span style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  NAVIGATE
                </span>
              </div>
              {filteredNav.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#F8F8F7] transition-colors"
                  onClick={() => {
                    onNavigate?.(item.page);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 13 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: "#0A0A0A" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{item.breadcrumb}</span>
                </button>
              ))}
            </>
          )}

          {/* Empty state */}
          {query && filteredNav.length === 0 && filteredActions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search size={20} color="#D1D5DB" />
              <p style={{ fontSize: 13, color: "#6B7280", marginTop: 8 }}>No results for "{query}"</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                Try 'create post', 'analytics', or a team member's name
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes paletteIn {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
