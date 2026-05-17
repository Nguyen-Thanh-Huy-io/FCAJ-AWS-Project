import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { X, Plus } from "lucide-react";

const hashtagSets = [
  {
    name: "Fitness Motivation",
    count: 24,
    tags: ["#fitnessmotivation", "#workout", "#gym", "#fitlife", "#healthylifestyle", "#personaltrainer", "#fitnesschallenge", "#bodybuilding"],
    more: 16,
    reach: "12.4K",
    platforms: ["IG", "TK"],
  },
  {
    name: "Tech Reviews",
    count: 18,
    tags: ["#techreview", "#gadgets", "#technology", "#smartphone", "#apple", "#android", "#unboxing", "#tech"],
    more: 10,
    reach: "8.1K",
    platforms: ["YT", "TK", "X"],
  },
  {
    name: "Business Growth",
    count: 31,
    tags: ["#entrepreneur", "#business", "#startup", "#marketing", "#digitalmarketing", "#growthhacking", "#socialmedia", "#branding"],
    more: 23,
    reach: "5.6K",
    platforms: ["LI", "IG"],
  },
];

const discoverTags = [
  { tag: "#fitness", posts: "2.4M", trend: "up" },
  { tag: "#motivation", posts: "1.8M", trend: "up" },
  { tag: "#gym", posts: "3.1M", trend: "stable" },
  { tag: "#workout", posts: "2.7M", trend: "up" },
  { tag: "#health", posts: "4.2M", trend: "stable" },
  { tag: "#bodybuilding", posts: "1.2M", trend: "down" },
  { tag: "#lifestyle", posts: "5.1M", trend: "up" },
  { tag: "#mindset", posts: "890K", trend: "up" },
  { tag: "#nutrition", posts: "1.4M", trend: "stable" },
  { tag: "#yoga", posts: "2.1M", trend: "up" },
];

const topHashtagsData = [
  { tag: "#fitness", reach: 82000 },
  { tag: "#workout", reach: 65000 },
  { tag: "#gym", reach: 54000 },
  { tag: "#motivation", reach: 48000 },
  { tag: "#health", reach: 41000 },
];

const categories = ["Trending", "Fitness", "Food", "Tech", "Travel", "Fashion", "Business"];
const platformColors: Record<string, string> = { YT: "#FF0000", IG: "#E1306C", TK: "#000000", LI: "#0A66C2", X: "#0A0A0A" };

export function HashtagManager() {
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [activeTab, setActiveTab] = useState("sets");
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [customTags, setCustomTags] = useState<string[]>(["#myhashtag", "#example"]);

  return (
    <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>Hashtag Manager</h1>
        </div>
        <div className="flex gap-2">
          <input placeholder="Search sets..." style={{ fontSize: 12, border: "0.5px solid #E5E7EB", borderRadius: 8, padding: "6px 12px", width: 200, color: "#0A0A0A" }} />
          <button className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-white" style={{ fontSize: 12 }}>Create Set</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {[{ key: "sets", label: "My Sets" }, { key: "discover", label: "Discover" }, { key: "stats", label: "My Stats" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-4 py-2 rounded-lg"
            style={{ fontSize: 12, backgroundColor: activeTab === t.key ? "#0A0A0A" : "#F3F4F6", color: activeTab === t.key ? "#fff" : "#6B7280" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "sets" && (
        <div className="grid grid-cols-3 gap-4 relative">
          {hashtagSets.map((set) => (
            <div key={set.name} className="bg-white rounded-xl p-4" style={{ border: "0.5px solid #E5E7EB" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A" }}>{set.name}</span>
                  <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 10, backgroundColor: "#F3F4F6", color: "#9CA3AF" }}>{set.count} tags</span>
                </div>
                <button style={{ fontSize: 16, color: "#9CA3AF" }}>⋯</button>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {set.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md" style={{ fontSize: 11, backgroundColor: "#F3F4F6", color: "#6B7280" }}>{tag}</span>
                ))}
                {set.more > 0 && <span style={{ fontSize: 11, color: "#9CA3AF" }}>+{set.more} more</span>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: 10, color: "#16A34A" }}>↑ {set.reach} avg reach</span>
                </div>
                <div className="flex gap-1">
                  {set.platforms.map((p) => (
                    <div key={p} className="w-4 h-4 rounded-sm flex items-center justify-center" style={{ backgroundColor: platformColors[p] }}>
                      <span style={{ fontSize: 7, color: "#fff", fontWeight: 700 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedSet(set.name)}
                className="w-full mt-3 py-1.5 rounded-lg hover:bg-[#F8F8F7] transition-colors"
                style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#6B7280" }}
              >
                Use in post
              </button>
            </div>
          ))}

          {/* Create new (dashed) */}
          <div
            className="bg-white rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-[#F8F8F7] transition-colors"
            style={{ border: "0.5px dashed #D1D5DB", minHeight: 160 }}
          >
            <div className="text-center">
              <Plus size={20} color="#D1D5DB" className="mx-auto mb-2" />
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>Create New Set</span>
            </div>
          </div>

          {/* Editor slide-in panel */}
          {selectedSet && (
            <div
              className="fixed right-0 top-0 bottom-0 bg-white flex flex-col z-40"
              style={{ width: 420, borderLeft: "0.5px solid #E5E7EB" }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A" }}>Edit Set — {selectedSet}</span>
                <button onClick={() => setSelectedSet(null)}><X size={16} color="#9CA3AF" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {/* Tags input */}
                <div style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>Hashtags</div>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-lg mb-3" style={{ border: "0.5px solid #E5E7EB", minHeight: 80 }}>
                  {customTags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ fontSize: 11, backgroundColor: "#0A0A0A", color: "#fff" }}>
                      {tag} <button onClick={() => setCustomTags((prev) => prev.filter((t) => t !== tag))}><X size={10} /></button>
                    </span>
                  ))}
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTag.trim()) {
                        const tag = newTag.startsWith("#") ? newTag : `#${newTag}`;
                        setCustomTags((prev) => [...prev, tag]);
                        setNewTag("");
                      }
                    }}
                    placeholder="Type and press Enter..."
                    style={{ fontSize: 11, outline: "none", minWidth: 80, color: "#0A0A0A" }}
                  />
                </div>

                {/* Performance table */}
                <div style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>Performance</div>
                <table className="w-full mb-4">
                  <thead>
                    <tr style={{ borderBottom: "0.5px solid #E5E7EB" }}>
                      {["Tag", "Avg Reach", "Competition"].map((h) => (
                        <th key={h} className="text-left py-1.5" style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customTags.map((tag) => (
                      <tr key={tag} style={{ borderBottom: "0.5px solid #F3F4F6" }}>
                        <td className="py-1.5" style={{ fontSize: 11, color: "#0A0A0A" }}>{tag}</td>
                        <td className="py-1.5" style={{ fontSize: 11, color: "#6B7280" }}>{Math.floor(Math.random() * 90 + 10)}K</td>
                        <td className="py-1.5">
                          <span style={{ fontSize: 10, color: "#16A34A" }}>Low</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 flex gap-2" style={{ borderTop: "0.5px solid #E5E7EB" }}>
                <button className="flex-1 py-2 rounded-lg bg-[#0A0A0A] text-white" style={{ fontSize: 12 }}>Save Set</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "discover" && (
        <div>
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className="px-3 py-1.5 rounded-full"
                style={{ fontSize: 12, backgroundColor: activeCategory === c ? "#0A0A0A" : "#F3F4F6", color: activeCategory === c ? "#fff" : "#6B7280" }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-3">
            {discoverTags.map((tag) => (
              <div key={tag.tag} className="bg-white rounded-xl p-3" style={{ border: "0.5px solid #E5E7EB" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 4 }}>{tag.tag}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>{tag.posts} posts</div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: tag.trend === "up" ? "#16A34A" : tag.trend === "down" ? "#DC2626" : "#9CA3AF" }}>
                    {tag.trend === "up" ? "↑" : tag.trend === "down" ? "↓" : "→"}
                  </span>
                  <button style={{ fontSize: 10, color: "#6B7280" }}>+ Save</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5" style={{ border: "0.5px solid #E5E7EB" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 16 }}>Top Hashtags by Reach</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topHashtagsData}>
                <XAxis dataKey="tag" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "0.5px solid #E5E7EB" }} />
                <Bar dataKey="reach" fill="#0A0A0A" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: "0.5px solid #E5E7EB" }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#F8F8F7", borderBottom: "0.5px solid #E5E7EB" }}>
                  {["Hashtag", "Total Posts Used", "Total Reach", "Best Platform"].map((h) => (
                    <th key={h} className="text-left px-4 py-3" style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topHashtagsData.map((row) => (
                  <tr key={row.tag} style={{ borderBottom: "0.5px solid #F3F4F6" }}>
                    <td className="px-4 py-2.5" style={{ fontSize: 12, color: "#0A0A0A" }}>{row.tag}</td>
                    <td className="px-4 py-2.5" style={{ fontSize: 12, color: "#6B7280" }}>{Math.floor(Math.random() * 50 + 10)}</td>
                    <td className="px-4 py-2.5" style={{ fontSize: 12, color: "#0A0A0A" }}>{(row.reach / 1000).toFixed(1)}K</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded" style={{ fontSize: 10, backgroundColor: "#FFF0F6", color: "#E1306C" }}>Instagram</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
