import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, LayoutGrid, Volume2, VolumeX, Layers, MicOff, Mic, Radio } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { PlatformIcon } from "../../components/shared/PlatformIcon";

const viewerData = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}m`,
  viewers: 8000 + Math.floor(Math.sin(i * 0.5) * 2000 + Math.random() * 1500) }));

const chatMessages = [
  { platform: "YouTube", color: "#FF0000", user: "tech_fan99", msg: "Amazing stream! 🔥", time: "14:22" },
  { platform: "Facebook", color: "#1877F2", user: "maria_vn", msg: "Love the content!", time: "14:22" },
  { platform: "YouTube", color: "#FF0000", user: "devmaster", msg: "Can you show the code?", time: "14:23" },
  { platform: "Instagram", color: "#E1306C", user: "creativevn", msg: "❤️❤️❤️", time: "14:23" },
  { platform: "YouTube", color: "#FF0000", user: "coding_life", msg: "Great explanation!", time: "14:23" },
  { platform: "Facebook", color: "#1877F2", user: "hoanganh123", msg: "How long will this stream go?", time: "14:24" },
  { platform: "Instagram", color: "#E1306C", user: "designpro", msg: "This UI looks gorgeous", time: "14:24" },
  { platform: "YouTube", color: "#FF0000", user: "viet_dev", msg: "Subscribed! Keep going 💪", time: "14:25" },
  { platform: "Facebook", color: "#1877F2", user: "minh_creator", msg: "Đỉnh quá anh ơi!", time: "14:25" },
];

export function LiveMonitorPage() {
  const navigate = useNavigate();
  const [chatFilter, setChatFilter] = useState("All");
  const [muted, setMuted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [runtime] = useState("01:23:47");

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F8F8F7" }}>
      {/* Full-width header */}
      <div
        className="flex items-center px-6 shrink-0"
        style={{ height: 50, background: "#0A0A0A", gap: 16 }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              background: "#DC2626",
              color: "#FFF",
              padding: "2px 6px",
              borderRadius: 4,
              letterSpacing: "0.5px",
              animation: "pulse 1.5s ease-in-out infinite" }}
          >
            LIVE
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#FFF" }}>
            Tech Review Q2 2025 – Official Livestream
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <span
          style={{ fontFamily: "monospace", fontSize: 18, color: "#FFF", letterSpacing: 2 }}
        >
          {runtime}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => navigate("/live/setup")}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "0.5px solid #333",
            background: "#FFF",
            color: "#0A0A0A",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6 }}
        >
          <Radio size={13} /> Setup New Stream
        </button>
        <button
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "0.5px solid #333",
            background: "transparent",
            color: "#FFF",
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6 }}
        >
          <Share2 size={13} /> Share
        </button>
        <button
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            background: "#DC2626",
            color: "#FFF",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer" }}
        >
          End Stream
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: 16, padding: 16 }}>
        {/* Left - Stream Preview */}
        <div className="flex flex-col gap-3" style={{ flex: "0 0 70%" }}>
          {/* Video Preview */}
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ background: "#111", height: 260, border: "0.5px solid #222", borderRadius: 12 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 60, height: 60, background: "#222", cursor: "pointer" }}
              >
                <span style={{ fontSize: 24 }}>▶</span>
              </div>
              <span style={{ fontSize: 12, color: "#666" }}>Live Preview</span>
            </div>
          </div>

          {/* Platform Status Cards */}
          <div className="flex gap-3">
            {[
              { platform: "YouTube", live: true, viewers: "12,483", quality: "1080p" },
              { platform: "Facebook", live: true, viewers: "7,291", quality: "720p" },
              { platform: "TikTok", live: false, viewers: "—", quality: "" },
              { platform: "Instagram", live: true, viewers: "2,140", quality: "720p" },
            ].map((p) => (
              <div
                key={p.platform}
                className="flex-1 flex items-center gap-2 rounded-xl"
                style={{
                  padding: "10px 12px",
                  background: "#FFFFFF",
                  border: "0.5px solid #E5E7EB",
                  borderRadius: 10 }}
              >
                <PlatformIcon platform={p.platform} size={20} />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A" }}>{p.platform}</div>
                  <div className="flex items-center gap-1">
                    <div
                      className="rounded-full"
                      style={{
                        width: 6,
                        height: 6,
                        background: p.live ? "#DC2626" : "#9CA3AF",
                        animation: p.live ? "pulse 1.5s infinite" : "none" }}
                    />
                    <span style={{ fontSize: 10, color: "#6B7280" }}>
                      {p.live ? "LIVE" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A" }}>{p.viewers}</div>
                  {p.quality && <div style={{ fontSize: 9, color: "#9CA3AF" }}>{p.quality}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Metrics */}
          <div className="flex gap-3">
            {[
              { label: "Total Viewers", value: "21,914" },
              { label: "Peak Viewers", value: "24,102" },
              { label: "Avg Watch Time", value: "14:32" },
              { label: "New Followers", value: "+142" },
            ].map((m) => (
              <div
                key={m.label}
                className="flex-1 rounded-xl"
                style={{ padding: "10px 12px", background: "#FFFFFF", border: "0.5px solid #E5E7EB", borderRadius: 10 }}
              >
                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A" }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Viewer Chart */}
          <div
            style={{ background: "#FFFFFF", border: "0.5px solid #E5E7EB", borderRadius: 12, padding: 16 }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>Live Viewer Count</div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={viewerData}>
                <defs>
                  <linearGradient id="viewerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EF" />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0A0A0A", border: "none", borderRadius: 8, fontSize: 10, color: "#FFF" }}
                />
                <Area type="monotone" dataKey="viewers" stroke="#0A0A0A" strokeWidth={2} fill="url(#viewerGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right - Chat + Controls */}
        <div className="flex flex-col gap-3" style={{ flex: 1, minWidth: 0 }}>
          {/* Live Chat */}
          <div
            className="flex flex-col"
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #E5E7EB",
              borderRadius: 12,
              flex: 1,
              overflow: "hidden" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "0.5px solid #E5E7EB" }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", flex: 1 }}>Live Chat</span>
              <div className="flex items-center gap-1">
                {["All", "YT", "FB", "IG"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setChatFilter(f)}
                    className="cursor-pointer"
                    style={{
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: 10,
                      background: chatFilter === f ? "#0A0A0A" : "transparent",
                      color: chatFilter === f ? "#FFF" : "#9CA3AF",
                      border: chatFilter === f ? "none" : "0.5px solid #E5E7EB" }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="rounded-full shrink-0"
                    style={{ width: 8, height: 8, background: msg.color, marginTop: 4 }}
                  />
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#0A0A0A" }}>{msg.user}</span>
                    <span style={{ fontSize: 11, color: "#6B7280", marginLeft: 4 }}>{msg.msg}</span>
                  </div>
                  <span style={{ fontSize: 9, color: "#9CA3AF", marginLeft: "auto", marginTop: 1, flexShrink: 0 }}>{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Reply input */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderTop: "0.5px solid #E5E7EB" }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Reply to chat..."
                className="flex-1"
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "0.5px solid #E5E7EB",
                  fontSize: 12,
                  outline: "none" }}
              />
              <button
                style={{ padding: "6px 12px", borderRadius: 8, background: "#0A0A0A", color: "#FFF", fontSize: 11, cursor: "pointer", fontWeight: 500 }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Stream Health */}
          <div
            style={{ background: "#FFFFFF", border: "0.5px solid #E5E7EB", borderRadius: 12, padding: "12px 16px" }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", marginBottom: 10 }}>Stream Health</div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Bitrate", value: "4,500 kbps", color: "#16A34A" },
                { label: "Frame Rate", value: "60 fps", color: "#16A34A" },
                { label: "Latency", value: "Low", color: "#16A34A" },
              ].map((h) => (
                <div key={h.label} className="flex items-center gap-2">
                  <span style={{ fontSize: 11, color: "#6B7280", width: 70 }}>{h.label}</span>
                  <div style={{ flex: 1, height: 4, background: "#F0F0EF", borderRadius: 2 }}>
                    <div style={{ width: "80%", height: 4, background: h.color, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 10, color: h.color, width: 70, textAlign: "right" }}>{h.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{ background: "#FFFFFF", border: "0.5px solid #E5E7EB", borderRadius: 12, padding: "12px 16px" }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", marginBottom: 10 }}>Quick Actions</div>
            <div className="flex flex-col gap-2">
              {[
                { icon: <Layers size={13} />, label: "Add Overlay Text" },
                { icon: <LayoutGrid size={13} />, label: "Switch Scene" },
                { icon: muted ? <VolumeX size={13} /> : <Volume2 size={13} />, label: muted ? "Unmute" : "Mute", action: () => setMuted(!muted) },
                { icon: <MicOff size={13} />, label: "End on All Platforms" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex items-center gap-2 cursor-pointer rounded-lg"
                  style={{
                    padding: "7px 10px",
                    border: "0.5px solid #E5E7EB",
                    background: "transparent",
                    color: "#0A0A0A",
                    fontSize: 12,
                    textAlign: "left" }}
                  onMouseEnter={(e) => ((e.currentTarget).style.background = "#F8F8F7")}
                  onMouseLeave={(e) => ((e.currentTarget).style.background = "transparent")}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
