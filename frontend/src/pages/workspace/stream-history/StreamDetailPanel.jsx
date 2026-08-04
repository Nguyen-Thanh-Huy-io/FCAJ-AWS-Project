import React from "react";
import { Download, Share2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PlatformIcon, PLATFORM_COLORS } from "./PlatformIcon";

const timelineData = Array.from({ length: 24 }, (_, i) => ({
  t: `${Math.floor(i * 3.5)}m`,
  viewers: Math.max(0, 12000 + Math.floor(Math.sin(i * 0.4) * 5000 + i * 500 - (i > 14 ? (i - 14) * 800 : 0)))
}));

export function StreamDetailPanel({ selected, setSelected, detailTab, setDetailTab }) {
  if (!selected) return null;

  return (
    <div
      style={{
        width: 380,
        background: "#FFF",
        borderLeft: "0.5px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 2, maxWidth: 260 }} className="truncate">
            {selected.title}
          </div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>
            {selected.date} · {selected.duration}
          </div>
        </div>
        <button
          onClick={() => setSelected(null)}
          style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}
        >
          ×
        </button>
      </div>

      <div className="flex px-5 py-2 gap-1" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
        {["Overview", "Timeline", "Chat", "Health"].map((tab) => (
          <button
            key={tab}
            onClick={() => setDetailTab(tab)}
            className="cursor-pointer"
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 11,
              background: detailTab === tab ? "#0A0A0A" : "transparent",
              color: detailTab === tab ? "#FFF" : "#6B7280",
              border: detailTab === tab ? "none" : "0.5px solid #E5E7EB"
            }}
          >
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
                { label: "Platforms", value: selected.platforms.length.toString() }
              ].map((m) => (
                <div key={m.label} style={{ background: "#F8F8F7", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A" }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>
                Platform Breakdown
              </div>
              {selected.platforms.map((p) => (
                <div key={p} className="flex items-center gap-2 mb-2">
                  <PlatformIcon platform={p} size={16} />
                  <span style={{ fontSize: 11, color: "#0A0A0A", flex: 1 }}>{p}</span>
                  <span
                    style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#F0FDF4", color: "#16A34A" }}
                  >
                    Recorded
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {detailTab === "Timeline" && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>
              Viewer Count Over Time
            </div>
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
                <Tooltip
                  contentStyle={{ background: "#0A0A0A", border: "none", borderRadius: 8, fontSize: 10, color: "#FFF" }}
                />
                <Area type="monotone" dataKey="viewers" stroke="#0A0A0A" strokeWidth={2} fill="url(#grad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {detailTab === "Chat" && (
          <div className="flex flex-col gap-2">
            {[
              { platform: "YouTube", user: "tech_fan", msg: "Great stream!", time: "0:05" },
              { platform: "Facebook", user: "maria_vn", msg: "Love this content!", time: "0:12" }
            ].map((msg, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: PLATFORM_COLORS[msg.platform] || "#888",
                    marginTop: 4,
                    flexShrink: 0
                  }}
                />
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
              { label: "Dropped Frames", value: "0.2%", ok: true }
            ].map((h) => (
              <div
                key={h.label}
                className="flex items-center gap-3"
                style={{ padding: "10px 12px", borderRadius: 8, background: "#F8F8F7" }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: h.ok ? "#16A34A" : "#DC2626",
                    flexShrink: 0,
                    display: "block"
                  }}
                />
                <span style={{ fontSize: 12, color: "#6B7280", flex: 1 }}>{h.label}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>{h.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 px-5 py-3" style={{ borderTop: "0.5px solid #E5E7EB" }}>
        <button
          style={{
            flex: 1,
            padding: "7px 0",
            borderRadius: 8,
            border: "0.5px solid #E5E7EB",
            fontSize: 11,
            color: "#6B7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "transparent"
          }}
        >
          <Download size={12} /> Download VOD
        </button>
        <button
          style={{
            flex: 1,
            padding: "7px 0",
            borderRadius: 8,
            border: "0.5px solid #E5E7EB",
            fontSize: 11,
            color: "#6B7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "transparent"
          }}
        >
          <Share2 size={12} /> Share
        </button>
      </div>
    </div>
  );
}
