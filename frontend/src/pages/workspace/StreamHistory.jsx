import { useState } from "react";
import { Play, Download, Share2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const STREAMS = [
  { id: 1, title: "Tech Review Q2 2025", date: "May 15, 2025", start: "15:00", duration: "1h 24m", platforms: ["YouTube", "Facebook", "Instagram"], peak: 24102, views: 89340, status: "completed" },
  { id: 2, title: "Product Launch Livestream", date: "May 12, 2025", start: "14:00", duration: "58m", platforms: ["YouTube", "TikTok"], peak: 18449, views: 52180, status: "completed" },
  { id: 3, title: "Morning Stream #45", date: "May 10, 2025", start: "09:00", duration: "2h 05m", platforms: ["YouTube", "Facebook"], peak: 12883, views: 38920, status: "completed" },
  { id: 4, title: "Weekly Q&A Session", date: "May 8, 2025", start: "20:00", duration: "1h 30m", platforms: ["Twitch", "YouTube"], peak: 9241, views: 27450, status: "completed" },
  { id: 5, title: "Community Hangout", date: "May 5, 2025", start: "18:00", duration: "45m", platforms: ["Facebook", "LinkedIn"], peak: 6782, views: 18230, status: "partially-failed" },
  { id: 6, title: "Coding Session Live", date: "May 2, 2025", start: "21:00", duration: "3h 10m", platforms: ["Twitch", "YouTube"], peak: 4921, views: 12840, status: "completed" },
];

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
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [detailTab, setDetailTab] = useState("Overview");

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#F8F8F7" }}>
      <div className={`flex flex-col ${selected ? "flex-1" : "flex-1"} overflow-hidden`}>
        {/* Stats */}
        <div className="flex gap-3 px-6 py-4">
          {[
            { label: "Total Streams", value: STREAMS.length.toString() },
            { label: "Total Stream Hours", value: "152h 30m" },
            { label: "Total Viewers (all-time)", value: "238,960" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A" }}>{s.value}</div>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div className="flex items-center overflow-hidden rounded-lg" style={{ border: "0.5px solid #E5E7EB" }}>
              {(["grid", "list"]).map((v) => (
                <button key={v} onClick={() => setView(v)} className="cursor-pointer capitalize px-3 py-2"
                  style={{ background: view === v ? "#0A0A0A" : "#FFF", fontSize: 11, color: view === v ? "#FFF" : "#9CA3AF" }}>
                  {v === "grid" ? "⊞" : "≡"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {STREAMS.map((stream) => (
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
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Play size={16} color="#FFF" />
                    </div>
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
                        {stream.status === "completed" ? "Completed" : "Partially Failed"}
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
                  {STREAMS.map((stream) => (
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
                          {stream.status === "completed" ? "Completed" : "Partial"}
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
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ width: 380, background: "#FFF", borderLeft: "0.5px solid #E5E7EB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 2, maxWidth: 260 }} className="truncate">{selected.title}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{selected.date} · {selected.duration}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>

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
                  { platform: "YouTube", user: "devmaster", msg: "Can you explain that again?", time: "0:18" },
                  { platform: "Instagram", user: "design_lover", msg: "❤️❤️❤️", time: "0:25" },
                ].map((msg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="rounded-full" style={{ width: 8, height: 8, background: PLATFORM_COLORS[msg.platform], marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#0A0A0A" }}>{msg.user}</span>
                      <span style={{ fontSize: 11, color: "#6B7280", marginLeft: 4 }}>{msg.msg}</span>
                    </div>
                    <span style={{ fontSize: 9, color: "#9CA3AF", marginLeft: "auto", flexShrink: 0 }}>{msg.time}</span>
                  </div>
                ))}
              </div>
            )}
            {detailTab === "Health" && (
              <div className="flex flex-col gap-3">
                {[
                  { label: "Avg Bitrate", value: "4,200 kbps", ok: true },
                  { label: "Dropped Frames", value: "0.2%", ok: true },
                  { label: "Reconnections", value: "0", ok: true },
                  { label: "Avg Latency", value: "1.8s", ok: true },
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
