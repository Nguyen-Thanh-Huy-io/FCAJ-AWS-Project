import React from "react";
import { Play, Download, Share2 } from "lucide-react";
import { PlatformIcon } from "./PlatformIcon";

export function StreamListTable({ filteredStreams, setSelected }) {
  return (
    <div style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#FAFAFA", borderBottom: "0.5px solid #E5E7EB" }}>
            {["", "Title", "Date", "Duration", "Platforms", "Peak Viewers", "Total Views", "Status", ""].map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "8px 12px",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  textAlign: "left"
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredStreams.map((stream) => (
            <tr
              key={stream.id}
              style={{ borderBottom: "0.5px solid #F0F0EF", cursor: "pointer" }}
              onClick={() => setSelected(stream)}
            >
              <td style={{ padding: "8px 12px" }}>
                <div
                  style={{
                    width: 56,
                    height: 40,
                    borderRadius: 6,
                    background: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Play size={12} color="#666" />
                </div>
              </td>
              <td style={{ padding: "8px 12px", fontSize: 12, fontWeight: 500, color: "#0A0A0A", maxWidth: 180 }}>
                <div className="truncate">{stream.title}</div>
              </td>
              <td style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280", whiteSpace: "nowrap" }}>
                {stream.date}
              </td>
              <td style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280" }}>{stream.duration}</td>
              <td style={{ padding: "8px 12px" }}>
                <div className="flex gap-1">
                  {stream.platforms.map((p) => (
                    <PlatformIcon key={p} platform={p} size={12} />
                  ))}
                </div>
              </td>
              <td style={{ padding: "8px 12px", fontSize: 11, color: "#0A0A0A" }}>{stream.peak.toLocaleString()}</td>
              <td style={{ padding: "8px 12px", fontSize: 11, color: "#0A0A0A" }}>{stream.views.toLocaleString()}</td>
              <td style={{ padding: "8px 12px" }}>
                <span
                  style={{
                    fontSize: 9,
                    padding: "2px 7px",
                    borderRadius: 4,
                    background: stream.status === "completed" ? "#F0FDF4" : "#FFF9F9",
                    color: stream.status === "completed" ? "#16A34A" : "#DC2626"
                  }}
                >
                  {stream.status === "completed" ? "Completed" : stream.status}
                </span>
              </td>
              <td style={{ padding: "8px 12px" }}>
                <div className="flex gap-1">
                  <button
                    style={{
                      padding: 4,
                      borderRadius: 4,
                      border: "0.5px solid #E5E7EB",
                      cursor: "pointer",
                      background: "transparent"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={11} color="#9CA3AF" />
                  </button>
                  <button
                    style={{
                      padding: 4,
                      borderRadius: 4,
                      border: "0.5px solid #E5E7EB",
                      cursor: "pointer",
                      background: "transparent"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 size={11} color="#9CA3AF" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
