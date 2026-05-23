import { useState, useEffect } from "react";
import { Play, Download, Share2, Search } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFilters } from "../../hooks/useFilters";
import { useDebounce } from "../../hooks/useDebounce";
import apiService from "../../services/api";
import { toast } from "sonner";

const PLATFORM_COLORS = {
  YouTube: "#FF0000", Facebook: "#1877F2", TikTok: "#010101",
  Instagram: "#E1306C", Twitch: "#9146FF", LinkedIn: "#0A66C2", X: "#000000" };

function PlatformIcon({ platform, size = 14 }) {
  const labels = { YouTube: "YT", Facebook: "FB", TikTok: "TT", Instagram: "IG", Twitch: "TW", LinkedIn: "LI", X: "X" };
  return (
    <div className="flex items-center justify-center rounded shrink-0"
      style={{ width: size, height: size, background: PLATFORM_COLORS[platform] || "#888", fontSize: size * 0.45, color: "#FFF", fontWeight: 700 }}
    >
      {labels[platform] || "?"}
    </div>
  );
}

const timelineData = Array.from({ length: 24 }, (_, i) => ({
  t: `${Math.floor(i * 3.5)}m`,
  viewers: Math.max(0, 12000 + Math.floor(Math.sin(i * 0.4) * 5000 + i * 500 - (i > 14 ? (i - 14) * 800 : 0))) }));

export function StreamHistoryPage() {
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    search: "",
    platform: "",
    status: "",
    view: "grid",
    page: "1",
    limit: "10"
  });

  const view = filters.view || "grid";
  const [selected, setSelected] = useState(null);
  const [detailTab, setDetailTab] = useState("Overview");
  const [streamData, setStreamData] = useState({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } });
  const [loading, setLoading] = useState(false);

  // Keep a local state for the search input
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Sync debounced search to URL params
  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Sync input value back if URL search parameter is cleared externally
  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  // Fetch real data from Backend API
  useEffect(() => {
    const fetchStreams = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/livestreams/history?${searchParamsString}`);
        setStreamData(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to load stream history");
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [searchParamsString]);

  const filteredStreams = streamData.data || [];
  const totalEntries = streamData.meta?.total || 0;
  const totalPages = streamData.meta?.totalPages || 1;
  const currentPage = streamData.meta?.page || 1;

  // Stats are now mostly derived from metadata or can be calculated from current page
  // For a truly accurate 'Max Peak' across all pages, we'd need another API field or aggregation
  const currentTotalViews = filteredStreams.reduce((acc, curr) => acc + curr.views, 0);
  const currentMaxPeak = filteredStreams.reduce((acc, curr) => Math.max(acc, curr.peak), 0);

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#F8F8F7" }}>
      <div className={`flex flex-col ${selected ? "flex-1" : "flex-1"} overflow-hidden`}>
        {/* Stats */}
        <div className="flex gap-3 px-6 py-4 flex-wrap">
          {[
            { label: "Filtered Streams", value: totalEntries.toString() },
            { label: "Peak Viewers (current page)", value: currentMaxPeak.toLocaleString() },
            { label: "Total Views (current page)", value: currentTotalViews.toLocaleString() },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, minWidth: 150, background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A" }}>{s.value}</div>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div className="flex items-center overflow-hidden rounded-lg" style={{ border: "0.5px solid #E5E7EB" }}>
              {(["grid", "list"]).map((v) => (
                <button key={v} onClick={() => updateFilters({ view: v })} className="cursor-pointer capitalize px-3 py-2"
                  style={{ background: view === v ? "#0A0A0A" : "#FFF", fontSize: 11, color: view === v ? "#FFF" : "#9CA3AF", border: "none" }}>
                  {v === "grid" ? "⊞" : "≡"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-3 px-6 pb-4 pt-1 flex-wrap items-center">
          {/* Search Input */}
          <div className="relative flex-1" style={{ minWidth: 200, maxWidth: 300 }}>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
              style={{ padding: "8px 12px 8px 30px" }}
            />
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Platform Select */}
          <select
            value={filters.platform || ""}
            onChange={(e) => updateFilters({ platform: e.target.value })}
            className="text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-black cursor-pointer transition-all"
            style={{ padding: "8px 12px" }}
          >
            <option value="">All Platforms</option>
            <option value="YouTube">YouTube</option>
            <option value="Facebook">Facebook</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitch">Twitch</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>

          {/* Status Select */}
          <select
            value={filters.status || ""}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-black cursor-pointer transition-all"
            style={{ padding: "8px 12px" }}
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Clear Filters Button */}
          {(filters.search || filters.platform || filters.status) && (
            <button
              onClick={() => {
                clearFilters();
                setSearchTerm("");
              }}
              className="text-xs text-gray-500 hover:text-black font-bold uppercase tracking-wider cursor-pointer bg-transparent border-none outline-none"
              style={{ padding: "8px 12px" }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-2xl" style={{ border: "0.5px solid #E5E7EB" }}>
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A0A0A] mb-3" />
               <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Loading history...</span>
             </div>
          ) : filteredStreams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-2xl" style={{ border: "0.5px solid #E5E7EB" }}>
              <Search size={32} className="text-gray-300 mb-3" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">No streams found</span>
            </div>
          ) : view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {filteredStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(stream)}
                  style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}
                  onMouseEnter={(e) => ((e.currentTarget).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget).style.boxShadow = "none")}
                >
                  {/* Thumbnail */}
                  <div style={{ height: 100, background: "linear-gradient(135deg, #111, #1a1a2e)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {stream.thumbnail ? (
                      <img src={stream.thumbnail} alt={stream.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Play size={16} color="#FFF" />
                      </div>
                    )}
                    <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#FFF", fontSize: 9, padding: "2px 6px", borderRadius: 4 }}>
                      {stream.duration}
                    </span>
                  </div>

                  <div style={{ padding: 12 }}>
                    <div className="flex gap-1 mb-2">
                      {stream.platforms.map((p) => <PlatformIcon key={p} platform={p} size={12} />)}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", marginBottom: 4, lineHeight: 1.4 }} className="line-clamp-2">
                      {stream.title}
                    </div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 8 }}>{stream.date} · {stream.start}</div>
                    <div className="flex items-center gap-4">
                      <div style={{ fontSize: 11, color: "#6B7280" }}>👁 {stream.peak.toLocaleString()}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>▶ {stream.views.toLocaleString()}</div>
                      <span style={{
                        marginLeft: "auto", fontSize: 9, padding: "2px 7px", borderRadius: 4,
                        background: stream.status === "completed" ? "#F0FDF4" : "#FFF9F9",
                        color: stream.status === "completed" ? "#16A34A" : "#DC2626" }}>
                        {stream.status === "completed" ? "Completed" : stream.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#FAFAFA", borderBottom: "0.5px solid #E5E7EB" }}>
                    {["", "Title", "Date", "Duration", "Platforms", "Peak Viewers", "Total Views", "Status", ""].map((h, i) => (
                      <th key={i} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStreams.map((stream) => (
                    <tr key={stream.id} style={{ borderBottom: "0.5px solid #F0F0EF", cursor: "pointer" }} onClick={() => setSelected(stream)}>
                      <td style={{ padding: "8px 12px" }}>
                        <div style={{ width: 56, height: 40, borderRadius: 6, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Play size={12} color="#666" />
                        </div>
                      </td>
                      <td style={{ padding: "8px 12px", fontSize: 12, fontWeight: 500, color: "#0A0A0A", maxWidth: 180 }}><div className="truncate">{stream.title}</div></td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280", whiteSpace: "nowrap" }}>{stream.date}</td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280" }}>{stream.duration}</td>
                      <td style={{ padding: "8px 12px" }}><div className="flex gap-1">{stream.platforms.map((p) => <PlatformIcon key={p} platform={p} size={12} />)}</div></td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#0A0A0A" }}>{stream.peak.toLocaleString()}</td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#0A0A0A" }}>{stream.views.toLocaleString()}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: stream.status === "completed" ? "#F0FDF4" : "#FFF9F9", color: stream.status === "completed" ? "#16A34A" : "#DC2626" }}>
                          {stream.status === "completed" ? "Completed" : stream.status}
                        </span>
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <div className="flex gap-1">
                          <button style={{ padding: 4, borderRadius: 4, border: "0.5px solid #E5E7EB", cursor: "pointer", background: "transparent" }}><Download size={11} color="#9CA3AF" /></button>
                          <button style={{ padding: 4, borderRadius: 4, border: "0.5px solid #E5E7EB", cursor: "pointer", background: "transparent" }}><Share2 size={11} color="#9CA3AF" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             Showing {filteredStreams.length} of {totalEntries} streams (Page {currentPage} of {totalPages})
           </span>
           <div className="flex items-center gap-2">
              <button 
                disabled={currentPage <= 1 || loading}
                onClick={() => updateFilters({ page: currentPage - 1 })}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                disabled={currentPage >= totalPages || loading}
                onClick={() => updateFilters({ page: currentPage + 1 })}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Page
              </button>
           </div>
        </div>
      </div>

      {/* Detail panel (unchanged logic, just ensuring layout compatibility) */}
      {selected && (
        <div style={{ width: 380, background: "#FFF", borderLeft: "0.5px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 2, maxWidth: 260 }} className="truncate">{selected.title}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{selected.date} · {selected.duration}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
          {/* ... existing Detail Tabs logic ... */}
          <div className="flex px-5 py-2 gap-1" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
            {(["Overview", "Timeline", "Chat", "Health"]).map((tab) => (
              <button key={tab} onClick={() => setDetailTab(tab)} className="cursor-pointer"
                style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, background: detailTab === tab ? "#0A0A0A" : "transparent", color: detailTab === tab ? "#FFF" : "#6B7280", border: detailTab === tab ? "none" : "0.5px solid #E5E7EB" }}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {detailTab === "Overview" && (
              <div className="flex flex-col gap-4">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Peak Viewers", value: selected.peak.toLocaleString() },
                    { label: "Total Views", value: selected.views.toLocaleString() },
                    { label: "Duration", value: selected.duration },
                    { label: "Platforms", value: selected.platforms.length.toString() },
                  ].map((m) => (
                    <div key={m.label} style={{ background: "#F8F8F7", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A" }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>Platform Breakdown</div>
                  {selected.platforms.map((p) => (
                    <div key={p} className="flex items-center gap-2 mb-2">
                      <PlatformIcon platform={p} size={16} />
                      <span style={{ fontSize: 11, color: "#0A0A0A", flex: 1 }}>{p}</span>
                      <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#F0FDF4", color: "#16A34A" }}>Recorded</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Timeline, Chat, Health tabs logic (simplified for brevity here, but should be preserved) */}
            {detailTab === "Timeline" && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>Viewer Count Over Time</div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EF" />
                    <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0A0A0A", border: "none", borderRadius: 8, fontSize: 10, color: "#FFF" }} />
                    <Area type="monotone" dataKey="viewers" stroke="#0A0A0A" strokeWidth={2} fill="url(#grad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            {detailTab === "Chat" && (
              <div className="flex flex-col gap-2">
                {[
                  { platform: "YouTube", user: "tech_fan", msg: "Great stream!", time: "0:05" },
                  { platform: "Facebook", user: "maria_vn", msg: "Love this content!", time: "0:12" },
                ].map((msg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="rounded-full" style={{ width: 8, height: 8, background: PLATFORM_COLORS[msg.platform] || "#888", marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#0A0A0A" }}>{msg.user}</span>
                      <span style={{ fontSize: 11, color: "#6B7280", marginLeft: 4 }}>{msg.msg}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {detailTab === "Health" && (
              <div className="flex flex-col gap-3">
                {[
                  { label: "Avg Bitrate", value: "4,200 kbps", ok: true },
                  { label: "Dropped Frames", value: "0.2%", ok: true },
                ].map((h) => (
                  <div key={h.label} className="flex items-center gap-3" style={{ padding: "10px 12px", borderRadius: 8, background: "#F8F8F7" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: h.ok ? "#16A34A" : "#DC2626", flexShrink: 0, display: "block" }} />
                    <span style={{ fontSize: 12, color: "#6B7280", flex: 1 }}>{h.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>{h.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 px-5 py-3" style={{ borderTop: "0.5px solid #E5E7EB" }}>
            <button style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "transparent" }}>
              <Download size={12} /> Download VOD
            </button>
            <button style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "transparent" }}>
              <Share2 size={12} /> Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
