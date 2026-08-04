import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Copy, RefreshCw } from "lucide-react";
import { PlatformIcon } from "../../components/shared/PlatformIcon";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [12, 13, 14, 15, 16, 17, 18];
const TIMES = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

const streamEvents = [
  { day: 0, timeStart: "09:00", duration: 2, title: "Morning Tech Review", platforms: ["YouTube", "Facebook"], status: "completed" },
  { day: 1, timeStart: "14:00", duration: 4, title: "Product Demo", platforms: ["YouTube", "Instagram"], status: "upcoming" },
  { day: 3, timeStart: "10:00", duration: 2, title: "Team Q&A Session", platforms: ["Facebook", "LinkedIn"], status: "upcoming" },
  { day: 4, timeStart: "15:00", duration: 4, title: "Live Stream Event", platforms: ["YouTube", "Facebook", "TikTok"], status: "live" },
  { day: 5, timeStart: "11:00", duration: 6, title: "Weekend Coding Stream", platforms: ["Twitch", "YouTube"], status: "draft" },
];

const STATUS_DOT = {
  live: "#DC2626",
  upcoming: "#D97706",
  completed: "#16A34A",
  draft: "#9CA3AF" };

const ALL_PLATFORMS = ["YouTube", "Facebook", "TikTok", "Instagram", "Twitch", "LinkedIn", "X"];
const QUALITY = {
  YouTube: ["1080p", "720p", "480p"],
  Facebook: ["720p", "480p"],
  TikTok: ["720p"],
  Instagram: ["720p"],
  Twitch: ["1080p", "720p"],
  LinkedIn: ["720p"],
  X: ["480p"] };

export function StreamSchedulerPage() {
  const [showPanel, setShowPanel] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "2025-05-16",
    time: "14:00",
    duration: "1hr",
    platforms: {
      YouTube: true, Facebook: false, TikTok: false, Instagram: false, Twitch: false, LinkedIn: false, X: false
    },
    requireApproval: false });
  const [view, setView] = useState("week");

  const timeIndex = (t) => TIMES.indexOf(t);

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#F8F8F7" }}>
      {/* Calendar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Calendar sub-header */}
        <div
          className="flex items-center px-6 py-3 gap-3"
          style={{ background: "#FFFFFF", borderBottom: "0.5px solid #E5E7EB" }}
        >
          <div className="flex items-center gap-2">
            <button className="cursor-pointer p-1 rounded" style={{ color: "#6B7280" }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", minWidth: 100 }}>May 2025</span>
            <button className="cursor-pointer p-1 rounded" style={{ color: "#6B7280" }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* View toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "0.5px solid #E5E7EB", background: "#F8F8F7" }}
          >
            {(["day", "week", "month"]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="cursor-pointer capitalize"
                style={{
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 400,
                  background: view === v ? "#0A0A0A" : "transparent",
                  color: view === v ? "#FFF" : "#6B7280" }}
              >
                {v}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setShowPanel(true)}
            className="flex items-center gap-2 cursor-pointer rounded-lg"
            style={{ padding: "6px 14px", background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500, borderRadius: 8 }}
          >
            <Plus size={13} />
            Schedule Stream
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="flex min-h-full" style={{ minWidth: 700 }}>
            {/* Time labels */}
            <div style={{ width: 60, background: "#FFFFFF", borderRight: "0.5px solid #E5E7EB", flexShrink: 0 }}>
              <div style={{ height: 44, borderBottom: "0.5px solid #E5E7EB" }} />
              {TIMES.map((t) => (
                <div
                  key={t}
                  style={{
                    height: 40,
                    borderBottom: "0.5px solid #F0F0EF",
                    padding: "2px 8px",
                    fontSize: 10,
                    color: "#9CA3AF" }}
                >
                  {t}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map((day, dayIdx) => (
              <div key={day} className="relative flex-1" style={{ borderRight: "0.5px solid #E5E7EB", minWidth: 80 }}>
                {/* Day header */}
                <div
                  className="flex flex-col items-center justify-center sticky top-0"
                  style={{
                    height: 44,
                    borderBottom: "0.5px solid #E5E7EB",
                    background: "#FFFFFF",
                    zIndex: 10 }}
                >
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>{day}</span>
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 22,
                      height: 22,
                      fontSize: 12,
                      fontWeight: DATES[dayIdx] === 16 ? 600 : 400,
                      color: DATES[dayIdx] === 16 ? "#FFF" : "#0A0A0A",
                      background: DATES[dayIdx] === 16 ? "#0A0A0A" : "transparent" }}
                  >
                    {DATES[dayIdx]}
                  </span>
                </div>

                {/* Time slots */}
                {TIMES.map((t) => (
                  <div
                    key={t}
                    style={{
                      height: 40,
                      borderBottom: "0.5px solid #F0F0EF" }}
                  />
                ))}

                {/* Current time line (only on today) */}
                {dayIdx === 4 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 44 + 40 * 14 + 20,
                      left: 0,
                      right: 0,
                      height: 1.5,
                      background: "#DC2626",
                      zIndex: 5 }}
                  />
                )}

                {/* Events */}
                {streamEvents
                  .filter((e) => e.day === dayIdx)
                  .map((event, ei) => {
                    const top = 44 + timeIndex(event.timeStart) * 40;
                    const height = event.duration * 40 - 2;
                    return (
                      <div
                        key={ei}
                        className="absolute left-1 right-1 rounded cursor-pointer overflow-hidden"
                        style={{
                          top,
                          height,
                          background: "#0A0A0A",
                          zIndex: 3,
                          padding: "4px 6px" }}
                        onMouseEnter={(e) => ((e.currentTarget).style.filter = "brightness(1.3)")}
                        onMouseLeave={(e) => ((e.currentTarget).style.filter = "none")}
                      >
                        <div
                          style={{
                            fontSize: event.status === "live" ? 9 : 10,
                            color: "#FFF",
                            fontWeight: 500,
                            lineHeight: 1.3,
                            marginBottom: 2 }}
                          className="truncate"
                        >
                          {event.title}
                        </div>
                        <div className="flex items-center gap-1">
                          {event.platforms.slice(0, 3).map((p) => (
                            <PlatformIcon key={p} platform={p} size={10} />
                          ))}
                          <div
                            className="rounded-full ml-auto"
                            style={{
                              width: 6,
                              height: 6,
                              background: STATUS_DOT[event.status],
                              animation: event.status === "live" ? "pulse 1.5s ease-in-out infinite" : "none" }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {showPanel && (
        <div
          className="flex flex-col overflow-y-auto"
          style={{
            width: 360,
            background: "#FFFFFF",
            borderLeft: "0.5px solid #E5E7EB",
            flexShrink: 0 }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "0.5px solid #E5E7EB" }}
          >
            <span style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>Schedule Livestream</span>
            <button onClick={() => setShowPanel(false)} className="cursor-pointer" style={{ color: "#6B7280" }}>
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-5 p-5">
            {/* Stream Details */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                Stream Details
              </div>
              <div className="flex flex-col gap-3">
                <input
                  placeholder="Stream title..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full"
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "0.5px solid #E5E7EB",
                    fontSize: 12,
                    color: "#0A0A0A",
                    outline: "none" }}
                />
                <textarea
                  placeholder="Description..."
                  rows={3}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "0.5px solid #E5E7EB",
                    fontSize: 12,
                    color: "#0A0A0A",
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit" }}
                />
                <div
                  className="flex items-center justify-center"
                  style={{
                    border: "0.5px dashed #E5E7EB",
                    borderRadius: 8,
                    padding: 20,
                    cursor: "pointer",
                    color: "#9CA3AF",
                    fontSize: 11,
                    flexDirection: "column",
                    gap: 4 }}
                >
                  <span>📷</span>
                  <span>Drop thumbnail here or Browse</span>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                Date & Time
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: 8,
                    border: "0.5px solid #E5E7EB",
                    fontSize: 12,
                    outline: "none" }}
                />
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  style={{
                    width: 100,
                    padding: "7px 10px",
                    borderRadius: 8,
                    border: "0.5px solid #E5E7EB",
                    fontSize: 12,
                    outline: "none" }}
                />
              </div>
              <div className="flex gap-1">
                {["30min", "1hr", "2hr", "Custom"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setForm({ ...form, duration: d })}
                    className="cursor-pointer"
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 11,
                      background: form.duration === d ? "#0A0A0A" : "transparent",
                      color: form.duration === d ? "#FFF" : "#6B7280",
                      border: "0.5px solid #E5E7EB" }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                Platform Selection
              </div>
              <div className="flex flex-col gap-2">
                {ALL_PLATFORMS.map((platform) => (
                  <div key={platform} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.platforms[platform]}
                      onChange={(e) =>
                        setForm({ ...form, platforms: { ...form.platforms, [platform]: e.target.checked } })
                      }
                      style={{ accentColor: "#0A0A0A", cursor: "pointer" }}
                    />
                    <PlatformIcon platform={platform} size={16} />
                    <span style={{ fontSize: 12, color: "#0A0A0A", flex: 1 }}>{platform}</span>
                    {form.platforms[platform] && (
                      <select
                        style={{
                          padding: "2px 6px",
                          borderRadius: 6,
                          border: "0.5px solid #E5E7EB",
                          fontSize: 10,
                          color: "#6B7280",
                          outline: "none",
                          cursor: "pointer" }}
                      >
                        {QUALITY[platform].map((q) => <option key={q}>{q}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stream Key */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                Stream Key
              </div>
              <div className="flex flex-col gap-2">
                {(["RTMP URL", "Stream Key"]).map((field) => (
                  <div key={field} className="flex items-center gap-2">
                    <input
                      type="password"
                      placeholder={field}
                      defaultValue="rtmp://example.com/live"
                      className="flex-1"
                      style={{
                        padding: "7px 10px",
                        borderRadius: 8,
                        border: "0.5px solid #E5E7EB",
                        fontSize: 12,
                        outline: "none" }}
                    />
                    <button className="cursor-pointer" style={{ color: "#9CA3AF", padding: 4 }}>
                      <Copy size={13} />
                    </button>
                    {field === "Stream Key" && (
                      <button className="cursor-pointer" style={{ color: "#9CA3AF", padding: 4 }}>
                        <RefreshCw size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Approval */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                Approval
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  onClick={() => setForm({ ...form, requireApproval: !form.requireApproval })}
                  style={{
                    width: 30,
                    height: 17,
                    borderRadius: 9999,
                    background: form.requireApproval ? "#0A0A0A" : "#E5E7EB",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: form.requireApproval ? 15 : 2,
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: "#FFF",
                      transition: "left 0.2s" }}
                  />
                </div>
                <span style={{ fontSize: 12, color: "#0A0A0A" }}>Require approval before going live</span>
              </div>
              {form.requireApproval && (
                <select
                  className="w-full"
                  style={{
                    padding: "7px 10px",
                    borderRadius: 8,
                    border: "0.5px solid #E5E7EB",
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer" }}
                >
                  <option>Select reviewer...</option>
                  <option>Nguyen Minh (Owner)</option>
                  <option>Sarah Johnson (Admin)</option>
                  <option>David Chen (Content Manager)</option>
                </select>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between p-5 mt-auto"
            style={{ borderTop: "0.5px solid #E5E7EB" }}
          >
            <button
              onClick={() => setShowPanel(false)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "0.5px solid #E5E7EB", fontSize: 12, color: "#6B7280", cursor: "pointer" }}
            >
              Save Draft
            </button>
            <button
              style={{ padding: "8px 16px", borderRadius: 8, background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
            >
              Schedule Stream
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
