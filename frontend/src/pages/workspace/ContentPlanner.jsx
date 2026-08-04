import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal, Search } from "lucide-react";
import { usePostCreator } from "../../context/PostCreatorContext";
import { useFilters } from "../../hooks/useFilters";
import { useBrand } from "../../context/BrandContext";
import apiService from "../../services/api";
import { toast } from "sonner";
import { PlatformIcon } from "../../components/shared/PlatformIcon";

const PLATFORM_COLORS = {
  YouTube: "#FF0000", Facebook: "#1877F2", TikTok: "#010101",
  Instagram: "#E1306C", Twitch: "#9146FF", LinkedIn: "#0A66C2", X: "#000000" };

const DAYS_HEADER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAY_CALENDAR = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
];

const STATUS_DOT = {
  published: "#16A34A",
  scheduled: "#D97706",
  draft: "#9CA3AF",
  pending: "#F59E0B",
  rejected: "#DC2626" };

export function ContentPlannerPage() {
  const { activeBrand } = useBrand();
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    view: "calendar",
    platform: "All Platforms",
    status: "All",
    page: "1",
    limit: "50" // High limit for calendar view
  });

  const view = filters.view || "calendar";
  const platformFilter = filters.platform || "All Platforms";
  const statusFilter = filters.status || "All";

  const [contextMenu, setContextMenu] = useState(null);
  const [postData, setPostData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { openPostCreator } = usePostCreator();

  // Fetch real data from Backend
  useEffect(() => {
    const fetchPosts = async () => {
      if (!activeBrand?.id) return;
      setLoading(true);
      try {
        const response = await apiService.get(`/posts?brandId=${activeBrand.id}&${searchParamsString}`);
        setPostData(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParamsString, activeBrand?.id]);

  // Process data for calendar view (group by day of month)
  // Assumes we are viewing May 2025 for now to match UI
  const calendarPosts = useMemo(() => {
    const grouped = {};
    postData.data?.forEach(post => {
      if (post.scheduledAt || post.createdAt) {
        const date = new Date(post.scheduledAt || post.createdAt);
        // Only process for May 2025 to match current UI hardcoded calendar
        if (date.getMonth() === 4 && date.getFullYear() === 2025) {
          const day = date.getDate();
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(post);
        }
      }
    });
    return grouped;
  }, [postData.data]);

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "#F8F8F7" }}
      onClick={() => setContextMenu(null)}
    >
      {/* Sub-header */}
      <div className="flex items-center gap-3 px-6 py-3" style={{ background: "#FFF", borderBottom: "0.5px solid #E5E7EB" }}>
        {/* Month nav */}
        <div className="flex items-center gap-2">
          <button className="cursor-pointer p-1" style={{ color: "#6B7280" }}><ChevronLeft size={15} /></button>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", minWidth: 80 }}>May 2025</span>
          <button className="cursor-pointer p-1" style={{ color: "#6B7280" }}><ChevronRight size={15} /></button>
          <button style={{ padding: "3px 10px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#6B7280", cursor: "pointer" }}>
            Today
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center overflow-hidden rounded-lg" style={{ border: "0.5px solid #E5E7EB", background: "#F8F8F7" }}>
          {["calendar", "list"].map((v) => (
            <button key={v} onClick={() => updateFilters({ view: v })} className="cursor-pointer capitalize"
              style={{ padding: "4px 12px", fontSize: 11, background: view === v ? "#0A0A0A" : "transparent", color: view === v ? "#FFF" : "#6B7280", border: "none" }}
            >
              {v}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={openPostCreator}
          className="flex items-center gap-2 cursor-pointer rounded-lg"
          style={{ padding: "6px 14px", background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500, borderRadius: 8 }}
        >
          <Plus size={13} /> Create Post
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 px-6 py-2 flex-wrap" style={{ background: "#FFF", borderBottom: "0.5px solid #E5E7EB" }}>
        {["All Platforms", "Instagram", "Facebook", "TikTok", "YouTube", "X", "LinkedIn", "Twitch"].map((p) => (
          <button
            key={p}
            onClick={() => updateFilters({ platform: p })}
            className="flex items-center gap-1 cursor-pointer"
            style={{
              padding: "3px 10px",
              borderRadius: 6,
              fontSize: 11,
              background: platformFilter === p ? "#0A0A0A" : "#FFF",
              color: platformFilter === p ? "#FFF" : "#6B7280",
              border: "0.5px solid #E5E7EB" }}
          >
            {p !== "All Platforms" && <PlatformIcon platform={p} size={10} />}
            {p}
          </button>
        ))}
        <div style={{ width: 1, height: 16, background: "#E5E7EB", margin: "0 4px" }} />
        {["All", "Scheduled", "Published", "Draft", "Pending", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => updateFilters({ status: s })}
            className="cursor-pointer"
            style={{
              padding: "3px 10px",
              borderRadius: 6,
              fontSize: 11,
              background: statusFilter === s ? "#0A0A0A" : "#FFF",
              color: statusFilter === s ? "#FFF" : "#6B7280",
              border: "0.5px solid #E5E7EB" }}
          >
            {s}
          </button>
        ))}
        {(platformFilter !== "All Platforms" || statusFilter !== "All") && (
          <>
            <div style={{ width: 1, height: 16, background: "#E5E7EB", margin: "0 4px" }} />
            <button
              onClick={clearFilters}
              className="cursor-pointer text-xs text-gray-500 hover:text-black transition-colors"
              style={{ fontSize: 11, fontWeight: 500, background: "none", border: "none", outline: "none" }}
            >
              Clear Filters
            </button>
          </>
        )}
      </div>

      {loading ? (
         <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A0A0A]" />
         </div>
      ) : view === "calendar" ? (
        <div className="flex-1 overflow-auto" style={{ padding: "16px 24px" }}>
          {/* Calendar Grid */}
          <div style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "0.5px solid #E5E7EB" }}>
              {DAYS_HEADER.map((d) => (
                <div key={d} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", textAlign: "center" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {MAY_CALENDAR.map((week, wi) => (
              <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: wi < MAY_CALENDAR.length - 1 ? "0.5px solid #E5E7EB" : "none" }}>
                {week.map((date, di) => {
                  const dayPosts = date ? (calendarPosts[date] || []) : [];
                  const isToday = date === 16;
                  const shown = dayPosts.slice(0, 4);
                  const extra = dayPosts.length - 4;
                  return (
                    <div
                      key={di}
                      style={{
                        minHeight: 120,
                        borderRight: di < 6 ? "0.5px solid #E5E7EB" : "none",
                        padding: "6px 8px",
                        background: date ? "#FFF" : "#FAFAFA",
                        position: "relative" }}
                    >
                      {date && (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="flex items-center justify-center rounded-full"
                              style={{
                                width: 20, height: 20, fontSize: 11, fontWeight: isToday ? 600 : 400,
                                color: isToday ? "#FFF" : "#0A0A0A",
                                background: isToday ? "#0A0A0A" : "transparent" }}
                            >
                              {date}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            {shown.map((post, pi) => (
                              <div
                                key={pi}
                                className="flex items-center gap-1 cursor-pointer"
                                style={{
                                  padding: "2px 5px",
                                  borderRadius: 4,
                                  borderLeft: `2.5px solid ${PLATFORM_COLORS[post.platforms[0]] || "#888"}`,
                                  background: "#F8F8F7",
                                  fontSize: 10,
                                  color: "#374151",
                                  overflow: "hidden" }}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  setContextMenu({ x: e.clientX, y: e.clientY, postIdx: pi });
                                }}
                              >
                                <span className="truncate flex-1">{post.title}</span>
                                <div
                                  className="rounded-full shrink-0"
                                  style={{ width: 5, height: 5, background: STATUS_DOT[post.status] || "#888" }}
                                />
                              </div>
                            ))}
                            {extra > 0 && (
                              <span style={{ fontSize: 9, color: "#9CA3AF", paddingLeft: 4, cursor: "pointer" }}>
                                +{extra} more
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto" style={{ padding: "16px 24px" }}>
          <div style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
              <input type="checkbox" style={{ accentColor: "#0A0A0A" }} />
              <span style={{ fontSize: 11, color: "#9CA3AF", flex: 1 }}>Select all</span>
              {["Approve", "Reject", "Delete", "Reschedule"].map((a) => (
                <button key={a} style={{ padding: "3px 10px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#6B7280", cursor: "pointer", background: "transparent" }}>
                  {a}
                </button>
              ))}
            </div>
            {postData.data?.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 16px", gap: 8, background: "#FFF" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#6B7280" }}>No posts found</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>Try adjusting your platform or status filters.</span>
                <button
                  onClick={clearFilters}
                  className="mt-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
                  style={{ border: "0.5px solid #E5E7EB", background: "#FFF", color: "#0A0A0A" }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#FAFAFA", borderBottom: "0.5px solid #E5E7EB" }}>
                    {["", "Post", "Platforms", "Scheduled", "Status", "Creator", ""].map((h, i) => (
                      <th key={i} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", textAlign: "left" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {postData.data?.map((post, i) => (
                    <tr key={post.id} style={{ borderBottom: "0.5px solid #F0F0EF" }}>
                      <td style={{ padding: "10px 12px", width: 32 }}><input type="checkbox" style={{ accentColor: "#0A0A0A" }} /></td>
                      <td style={{ padding: "10px 12px" }}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: 40, height: 40, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                            {post.thumbnail ? <img src={post.thumbnail} alt="" className="w-full h-full object-cover rounded" /> : "📝"}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>{post.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div className="flex items-center gap-1">
                          {post.platforms.map((p) => <PlatformIcon key={p} platform={p} size={14} />)}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 11, color: "#6B7280" }}>
                        {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString('vi-VN') : '—'}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div className="flex items-center gap-1.5">
                          <div className="rounded-full" style={{ width: 6, height: 6, background: STATUS_DOT[post.status] || "#888" }} />
                          <span style={{ fontSize: 11, color: "#0A0A0A", textTransform: "capitalize" }}>{post.status}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 11, color: "#6B7280" }}>{post.creator}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <button style={{ color: "#9CA3AF", cursor: "pointer", border: "none", background: "none" }}><MoreHorizontal size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            left: contextMenu.x,
            top: contextMenu.y,
            background: "#0A0A0A",
            border: "0.5px solid #222",
            borderRadius: 8,
            zIndex: 100,
            minWidth: 160,
            overflow: "hidden" }}
          onClick={(e) => e.stopPropagation()}
        >
          {["Edit", "Duplicate", "Reschedule", "Send for Review", "Delete"].map((action) => (
            <button
              key={action}
              className="block w-full text-left px-4 py-2 cursor-pointer"
              style={{ fontSize: 12, color: action === "Delete" ? "#EF4444" : "#DDD", border: "none", background: "none" }}
              onMouseEnter={(e) => ((e.currentTarget).style.background = "#161616")}
              onMouseLeave={(e) => ((e.currentTarget).style.background = "transparent")}
              onClick={() => setContextMenu(null)}
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
