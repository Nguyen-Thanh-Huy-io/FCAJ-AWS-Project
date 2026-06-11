import { useState, useEffect } from "react";
import { Bell, Radio, CheckCircle, XCircle, AlertTriangle, Users, TrendingUp, CreditCard, FileText, Loader2 } from "lucide-react";
import { useFilters } from "../../hooks/useFilters";
import apiService from "../../services/api";
import { toast } from "sonner";

const TYPE_ICONS = {
  stream: <Radio size={14} style={{ color: "#FFF" }} />,
  content: <FileText size={14} style={{ color: "#FFF" }} />,
  team: <Users size={14} style={{ color: "#FFF" }} />,
  platform: <AlertTriangle size={14} style={{ color: "#FFF" }} />,
  system: <CreditCard size={14} style={{ color: "#FFF" }} />,
  milestone: <TrendingUp size={14} style={{ color: "#FFF" }} />
};

export function NotificationsPage() {
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    category: "all",
    page: "1"
  });

  const activeCategory = filters.category || "all";
  const [notifData, setNotifData] = useState({ data: [], meta: { categoryCounts: {} } });
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/notifications?${searchParamsString}`);
        setNotifData(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [searchParamsString]);

  const markAsRead = async (id) => {
    try {
      await apiService.post(`/notifications/${id}/read`);
      // Optimistic update
      setNotifData(prev => ({
        ...prev,
        data: prev.data.map(n => n.id === id ? { ...n, isRead: true } : n)
      }));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      await apiService.post(`/notifications/read-all`);
      setNotifData(prev => ({
        ...prev,
        data: prev.data.map(n => ({ ...n, isRead: true }))
      }));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const notifications = notifData.data || [];
  const counts = notifData.meta?.categoryCounts || {};

  const categories = [
    { label: "All Notifications", count: counts.all || 0, key: "all" },
    { label: "Livestream Alerts", count: counts.stream || 0, key: "stream" },
    { label: "Content Approvals", count: counts.content || 0, key: "content" },
    { label: "Team Activity", count: counts.team || 0, key: "team" },
    { label: "Platform", count: counts.platform || 0, key: "platform" },
    { label: "System", count: counts.system || 0, key: "system" },
  ];

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#F8F8F7" }}>
      {/* Left sidebar */}
      <div style={{ width: 220, background: "#FFF", borderRight: "0.5px solid #E5E7EB", padding: "12px 0", flexShrink: 0 }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => updateFilters({ category: cat.key })}
            className="flex items-center justify-between w-full text-left px-4 py-2.5 cursor-pointer transition-all"
            style={{
              borderLeft: activeCategory === cat.key ? "2px solid #0A0A0A" : "2px solid transparent",
              background: activeCategory === cat.key ? "#F8F8F7" : "transparent" }}
          >
            <span style={{ fontSize: 12, color: activeCategory === cat.key ? "#0A0A0A" : "#6B7280", fontWeight: activeCategory === cat.key ? 500 : 400 }}>
              {cat.label}
            </span>
            {cat.count > 0 && (
              <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 9999, background: activeCategory === cat.key ? "#0A0A0A" : "#F3F4F6", color: activeCategory === cat.key ? "#FFF" : "#6B7280" }}>
                {cat.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "20px 24px" }}>
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>Notifications</span>
          <button 
            onClick={markAllRead}
            style={{ fontSize: 12, color: "#2563EB", cursor: "pointer", background: "none", border: "none" }}
          >
            Mark all read
          </button>
        </div>

        {loading ? (
           <div className="flex flex-col gap-3 animate-pulse">
             {[1, 2, 3].map((n) => (
               <div
                 key={n}
                 className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4 h-20"
               >
                 <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
                 <div className="flex-1 space-y-2">
                   <div className="w-32 h-3.5 bg-gray-100 rounded" />
                   <div className="w-48 h-3 bg-gray-50 rounded" />
                 </div>
               </div>
             ))}
           </div>
        ) : notifications.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-300 gap-2">
              <Bell size={40} />
              <span className="text-[11px] font-bold uppercase tracking-widest">No notifications found</span>
           </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 transition-all"
                style={{
                  background: "#FFF",
                  border: "0.5px solid #E5E7EB",
                  borderRadius: 12,
                  padding: 14,
                  opacity: notif.isRead ? 0.7 : 1,
                  borderLeft: notif.isRead ? "0.5px solid #E5E7EB" : `3px solid ${notif.bg}` }}
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 32, height: 32, background: notif.bg }}
                >
                  {TYPE_ICONS[notif.category] || <Bell size={14} color="#FFF" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, fontWeight: notif.isRead ? 400 : 500, color: "#0A0A0A", marginBottom: 2 }}>{notif.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{notif.desc}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{notif.time}</div>
                </div>
                {!notif.isRead && (
                   <button 
                    onClick={() => markAsRead(notif.id)}
                    className="p-1 text-gray-300 hover:text-blue-500 transition-colors"
                   >
                      <CheckCircle size={16} />
                   </button>
                )}
                {notif.action && (
                  <button
                    style={{ padding: "5px 12px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#0A0A0A", cursor: "pointer", background: "#FFF", flexShrink: 0 }}
                    onClick={() => {
                       if (notif.actionUrl) window.location.href = notif.actionUrl;
                       markAsRead(notif.id);
                    }}
                  >
                    {notif.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
