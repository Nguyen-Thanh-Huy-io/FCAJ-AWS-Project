import { useState } from "react";
import { X, Plus } from "lucide-react";

const autoLists = [
  {
    name: "Daily Fitness Tips",
    status: "active",
    platforms: ["IG", "TK"],
    cadence: "Daily at 9AM, 3PM",
    activeDays: [0, 1, 2, 3, 4],
    queueSize: 12,
    lastPosted: "2 hours ago",
    lowQueue: false,
  },
  {
    name: "Weekly Tech Reviews",
    status: "active",
    platforms: ["YT", "LI"],
    cadence: "Mon Wed Fri 10:00",
    activeDays: [0, 2, 4],
    queueSize: 2,
    lastPosted: "1 day ago",
    lowQueue: true,
  },
  {
    name: "Monthly Business Insights",
    status: "paused",
    platforms: ["LI", "X"],
    cadence: "3× per week",
    activeDays: [1, 3],
    queueSize: 8,
    lastPosted: "5 days ago",
    lowQueue: false,
  },
];

const platformColors = { YT: "#FF0000", IG: "#E1306C", TK: "#000000", LI: "#0A66C2", X: "#0A0A0A" };
const days = ["M", "T", "W", "T", "F", "S", "S"];

export function AutoLists() {
  const [selectedList, setSelectedList] = useState(null);
  const [activeRecycle, setActiveRecycle] = useState(false);
  const [useAITimes, setUseAITimes] = useState(false);

  return (
    <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>AutoLists</h1>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            Create repeating content queues. Posts are pulled from your queue and scheduled automatically.
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-white flex items-center gap-1" style={{ fontSize: 12 }}>
          <Plus size={12} /> Create AutoList
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {autoLists.map((list) => (
          <div key={list.name} className="bg-white rounded-xl p-5" style={{ border: "0.5px solid #E5E7EB" }}>
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A" }}>{list.name}</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${list.status === "active" ? "bg-[#DCFCE7]" : "bg-[#F3F4F6]"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${list.status === "active" ? "bg-[#16A34A]" : "bg-[#9CA3AF]"}`} />
                  <span style={{ fontSize: 10, color: list.status === "active" ? "#16A34A" : "#9CA3AF" }}>{list.status}</span>
                </div>
              </div>
              <button style={{ fontSize: 16, color: "#9CA3AF" }}>⋯</button>
            </div>

            {/* Platforms */}
            <div className="flex gap-1.5 mb-3">
              {list.platforms.map((p) => (
                <div key={p} className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: platformColors[p] }}>
                  <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>{p}</span>
                </div>
              ))}
            </div>

            {/* Schedule */}
            <div className="mb-3">
              <span className="px-2 py-0.5 rounded mr-2" style={{ fontSize: 10, backgroundColor: "#F3F4F6", color: "#6B7280" }}>Posts</span>
              <span style={{ fontSize: 12, color: "#0A0A0A" }}>{list.cadence}</span>
              <div className="flex gap-1 mt-2">
                {days.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: list.activeDays.includes(i) ? "#0A0A0A" : "#F3F4F6" }}
                    >
                      <span style={{ fontSize: 9, color: list.activeDays.includes(i) ? "#fff" : "#9CA3AF", fontWeight: 500 }}>{d}</span>
                    </div>
                    {list.activeDays.includes(i) && <span style={{ fontSize: 8, color: "#9CA3AF", marginTop: 2 }}>9AM</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Queue status */}
            <div className="mb-4">
              {list.lowQueue ? (
                <div className="flex items-center gap-2 p-2 rounded-lg mb-2" style={{ backgroundColor: "#FFFBEB", border: "0.5px solid #D97706" }}>
                  <span style={{ fontSize: 11, color: "#D97706" }}>⚠ Queue running low. Add posts.</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 11, color: "#6B7280" }}>{list.queueSize} posts in queue</span>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>Last posted: {list.lastPosted}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F3F4F6]">
                <div className="h-full rounded-full bg-[#0A0A0A]" style={{ width: `${Math.min(list.queueSize * 5, 100)}%` }} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedList(list.name)}
                className="flex-1 py-1.5 rounded-lg hover:bg-[#F8F8F7] transition-colors"
                style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#6B7280" }}
              >
                View Queue ({list.queueSize})
              </button>
              <button
                className="flex-1 py-1.5 rounded-lg hover:bg-[#F8F8F7] transition-colors"
                style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#0A0A0A" }}
              >
                Add Posts
              </button>
            </div>
          </div>
        ))}

        {/* Create new (dashed) */}
        <div
          className="bg-white rounded-xl p-5 flex items-center justify-center cursor-pointer hover:bg-[#F8F8F7] transition-colors"
          style={{ border: "0.5px dashed #D1D5DB", minHeight: 200 }}
        >
          <div className="text-center">
            <Plus size={24} color="#D1D5DB" className="mx-auto mb-2" />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>Create AutoList</span>
          </div>
        </div>
      </div>

      {/* Editor panel */}
      {selectedList && (
        <div className="fixed right-0 top-0 bottom-0 bg-white flex flex-col z-40" style={{ width: 400, borderLeft: "0.5px solid #E5E7EB" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>Edit AutoList</span>
            <button onClick={() => setSelectedList(null)}><X size={16} color="#9CA3AF" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Settings */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Settings</div>
              <input defaultValue={selectedList} className="w-full px-3 py-2 rounded-lg mb-3" style={{ fontSize: 13, border: "0.5px solid #E5E7EB", color: "#0A0A0A" }} />
              <div className="flex flex-wrap gap-2">
                {Object.entries(platformColors).map(([p, color]) => (
                  <button key={p} className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: color }}>
                    <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>{p}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Schedule</div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {days.map((d, i) => (
                  <button key={i} className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: i < 5 ? "#0A0A0A" : "#F3F4F6" }}>
                    <span style={{ fontSize: 10, color: i < 5 ? "#fff" : "#9CA3AF", fontWeight: 500 }}>{d}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 12, color: "#6B7280" }}>Use AI best times</span>
                <div
                  className="w-9 h-5 rounded-full cursor-pointer flex items-center transition-colors"
                  style={{ 
                    backgroundColor: useAITimes ? "#0A0A0A" : "#E5E7EB",
                    justifyContent: useAITimes ? "flex-end" : "flex-start", 
                    padding: "0 2px" 
                  }}
                  onClick={() => setUseAITimes(!useAITimes)}
                >
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              {useAITimes && <p style={{ fontSize: 11, color: "#6B7280" }}>Posts will be timed for max engagement per platform</p>}
            </div>

            {/* Queue */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Queue</div>
              {["Product launch teaser", "Behind the scenes", "User testimonial", "Feature spotlight"].map((post) => (
                <div key={post} className="flex items-center gap-3 py-2" style={{ borderBottom: "0.5px solid #F3F4F6" }}>
                  <div className="w-8 h-8 rounded-md bg-[#F3F4F6]" />
                  <span style={{ fontSize: 12, color: "#0A0A0A", flex: 1 }} className="truncate">{post}</span>
                  <button style={{ fontSize: 12, color: "#9CA3AF" }}>×</button>
                </div>
              ))}
              <button className="mt-3 w-full py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px dashed #D1D5DB", color: "#6B7280" }}>Add posts to queue</button>
              <div className="flex items-center justify-between mt-3">
                <span style={{ fontSize: 12, color: "#6B7280" }}>Recycle queue when empty</span>
                <div
                  className="w-9 h-5 rounded-full cursor-pointer flex items-center transition-colors"
                  style={{ 
                    backgroundColor: activeRecycle ? "#0A0A0A" : "#E5E7EB",
                    justifyContent: activeRecycle ? "flex-end" : "flex-start", 
                    padding: "0 2px" 
                  }}
                  onClick={() => setActiveRecycle(!activeRecycle)}
                >
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 py-4 flex gap-2" style={{ borderTop: "0.5px solid #E5E7EB" }}>
            <button className="flex-1 py-2 rounded-lg bg-[#0A0A0A] text-white" style={{ fontSize: 12 }}>Save Changes</button>
            <button className="px-4 py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Pause List</button>
          </div>
        </div>
      )}
    </div>
  );
}
