import { useState } from "react";
import { Bell, Radio, CheckCircle, XCircle, AlertTriangle, Users, TrendingUp, CreditCard, FileText } from "lucide-react";

const NOTIF_TYPES = [
  { icon: <Radio size={14} style={{ color: "#FFF" }} />, bg: "#DC2626", title: "Live Started", desc: "Your stream on YouTube is now live · 2 min ago", action: "Monitor", category: "stream" },
  { icon: <AlertTriangle size={14} style={{ color: "#FFF" }} />, bg: "#D97706", title: "Pending Review", desc: "Alex submitted a post for your review · 15 min ago", action: "Review", category: "content" },
  { icon: <CheckCircle size={14} style={{ color: "#FFF" }} />, bg: "#16A34A", title: "Post Approved", desc: "Your post was approved by Sarah · 1h ago", action: "View", category: "content" },
  { icon: <XCircle size={14} style={{ color: "#FFF" }} />, bg: "#DC2626", title: "Post Rejected", desc: "Your post was rejected: 'Please revise caption' · 2h ago", action: "Edit", category: "content" },
  { icon: <FileText size={14} style={{ color: "#FFF" }} />, bg: "#6B7280", title: "Posts Published", desc: "3 posts published successfully at 10:00 AM · 4h ago", action: "View", category: "content" },
  { icon: <AlertTriangle size={14} style={{ color: "#FFF" }} />, bg: "#D97706", title: "Platform Disconnected", desc: "Instagram token expired. Reconnect to continue · 5h ago", action: "Reconnect", category: "platform" },
  { icon: <Users size={14} style={{ color: "#FFF" }} />, bg: "#374151", title: "User Invited", desc: "Maria joined on Brand TechVN · 6h ago", action: "View Team", category: "team" },
  { icon: <TrendingUp size={14} style={{ color: "#FFF" }} />, bg: "#0A0A0A", title: "Viewer Milestone", desc: "Congrats! 10,000 viewers on your YouTube stream · 8h ago", action: null, category: "stream" },
  { icon: <CreditCard size={14} style={{ color: "#FFF" }} />, bg: "#6B7280", title: "Billing Reminder", desc: "Your plan renews in 3 days · 1d ago", action: "Manage Billing", category: "system" },
  { icon: <AlertTriangle size={14} style={{ color: "#FFF" }} />, bg: "#DC2626", title: "Stream Failed", desc: "Facebook stream disconnected unexpectedly · 1d ago", action: "Retry", category: "stream" },
];

const CATEGORIES = [
  { label: "All Notifications", count: 10, key: "all" },
  { label: "Livestream Alerts", count: 3, key: "stream" },
  { label: "Content Approvals", count: 3, key: "content" },
  { label: "Team Activity", count: 1, key: "team" },
  { label: "Publishing", count: 1, key: "content" },
  { label: "Platform", count: 1, key: "platform" },
  { label: "System", count: 1, key: "system" },
];

export function NotificationsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [read, setRead] = useState(new Set([4, 5, 6, 7, 8, 9]));

  const filtered = activeCategory === "all" ? NOTIF_TYPES : NOTIF_TYPES.filter((n) => n.category === activeCategory);

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#F8F8F7" }}>
      {/* Left sidebar */}
      <div style={{ width: 220, background: "#FFF", borderRight: "0.5px solid #E5E7EB", padding: "12px 0", flexShrink: 0 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.key)}
            className="flex items-center justify-between w-full text-left px-4 py-2.5 cursor-pointer"
            style={{
              borderLeft: activeCategory === cat.key ? "2px solid #0A0A0A" : "2px solid transparent",
              background: activeCategory === cat.key ? "#F8F8F7" : "transparent" }}
            onMouseEnter={(e) => { if (activeCategory !== cat.key) (e.currentTarget).style.background = "#F8F8F7"; }}
            onMouseLeave={(e) => { if (activeCategory !== cat.key) (e.currentTarget).style.background = "transparent"; }}
          >
            <span style={{ fontSize: 12, color: activeCategory === cat.key ? "#0A0A0A" : "#6B7280", fontWeight: activeCategory === cat.key ? 500 : 400 }}>
              {cat.label}
            </span>
            <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 9999, background: "#F3F4F6", color: "#6B7280" }}>{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "20px 24px" }}>
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>Notifications</span>
          <button onClick={() => setRead(new Set(NOTIF_TYPES.map((_, i) => i)))} style={{ fontSize: 12, color: "#2563EB", cursor: "pointer", background: "none", border: "none" }}>
            Mark all read
          </button>
        </div>

        {/* Group: Today */}
        <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, padding: "6px 0", borderBottom: "0.5px solid #E5E7EB" }}>
          Today
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {filtered.slice(0, 5).map((notif, i) => {
            const isRead = read.has(i);
            return (
              <div
                key={i}
                className="flex items-start gap-3"
                style={{
                  background: "#FFF",
                  border: "0.5px solid #E5E7EB",
                  borderRadius: 12,
                  padding: 14,
                  borderLeft: isRead ? "0.5px solid #E5E7EB" : `3px solid ${notif.bg}` }}
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 32, height: 32, background: notif.bg }}
                >
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, fontWeight: isRead ? 400 : 500, color: "#0A0A0A", marginBottom: 2 }}>{notif.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{notif.desc}</div>
                </div>
                {notif.action && (
                  <button
                    style={{ padding: "5px 12px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#0A0A0A", cursor: "pointer", background: "#FFF", flexShrink: 0 }}
                    onClick={() => setRead(new Set([...read, i]))}
                  >
                    {notif.action}
                  </button>
                )}
                {!isRead && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0A0A0A", marginTop: 4, flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        {filtered.length > 5 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, padding: "6px 0", borderBottom: "0.5px solid #E5E7EB" }}>
              Yesterday
            </div>
            <div className="flex flex-col gap-3">
              {filtered.slice(5).map((notif, i) => (
                <div
                  key={i + 5}
                  className="flex items-start gap-3"
                  style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, padding: 14 }}
                >
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 32, height: 32, background: notif.bg }}>
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 13, color: "#0A0A0A", marginBottom: 2 }}>{notif.title}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{notif.desc}</div>
                  </div>
                  {notif.action && (
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#6B7280", cursor: "pointer", background: "#FFF", flexShrink: 0 }}>
                      {notif.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
