import React from "react";
import { Play } from "lucide-react";
import { PlatformIcon } from "./PlatformIcon";

export function StreamGrid({ filteredStreams, setSelected }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {filteredStreams.map((stream) => (
        <div
          key={stream.id}
          className="cursor-pointer"
          onClick={() => setSelected(stream)}
          style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Thumbnail */}
          <div
            style={{
              height: 100,
              background: "linear-gradient(135deg, #111, #1a1a2e)",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {stream.thumbnail ? (
              <img
                src={stream.thumbnail}
                alt={stream.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
              />
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <Play size={16} color="#FFF" />
              </div>
            )}
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0,0,0,0.6)",
                color: "#FFF",
                fontSize: 9,
                padding: "2px 6px",
                borderRadius: 4
              }}
            >
              {stream.duration}
            </span>
          </div>

          <div style={{ padding: 12 }}>
            <div className="flex gap-1 mb-2">
              {stream.platforms.map((p) => (
                <PlatformIcon key={p} platform={p} size={12} />
              ))}
            </div>
            <div
              style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", marginBottom: 4, lineHeight: 1.4 }}
              className="line-clamp-2"
            >
              {stream.title}
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 8 }}>
              {stream.date} · {stream.start}
            </div>
            <div className="flex items-center gap-4">
              <div style={{ fontSize: 11, color: "#6B7280" }}>👁 {stream.peak.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>▶ {stream.views.toLocaleString()}</div>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 9,
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: stream.status === "completed" ? "#F0FDF4" : "#FFF9F9",
                  color: stream.status === "completed" ? "#16A34A" : "#DC2626"
                }}
              >
                {stream.status === "completed" ? "Completed" : stream.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
