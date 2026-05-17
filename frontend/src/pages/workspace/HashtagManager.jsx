import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { X, Plus, Hash, Layers, BarChart2, Compass } from "lucide-react";

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
const platformColors = { YT: "#FF0000", IG: "#E1306C", TK: "#000000", LI: "#0A66C2", X: "#0A0A0A" };

export function HashtagManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [activeTab, setActiveTab] = useState("sets");
  const [selectedSet, setSelectedSet] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [customTags, setCustomTags] = useState(["#myhashtag", "#example"]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam === "discover") setActiveTab("discover");
    else if (tabParam === "stats") setActiveTab("stats");
    else setActiveTab("sets");
  }, [location.search]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`${location.pathname}?tab=${tabKey}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white font-sans">
      {/* Header */}
      <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Hashtag Manager</h1>
          <p className="text-gray-500 mt-1">Organize your hashtags into sets and discover new trending ones.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative hidden md:block">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search sets..." className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-black transition-all" />
          </div>
          <button className="px-6 py-2 rounded-xl bg-[#0A0A0A] text-white text-sm font-bold shadow-lg hover:bg-gray-800 transition-all">+ Create Set</button>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="px-10 border-b border-gray-100 flex gap-10">
        {[
          { id: "sets", label: "My Sets", icon: <Layers size={16} /> },
          { id: "discover", label: "Discover", icon: <Compass size={16} /> },
          { id: "stats", label: "Performance", icon: <BarChart2 size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className="py-4 text-sm font-bold tracking-tight transition-all relative flex items-center gap-2"
            style={{ color: activeTab === tab.id ? "#0A0A0A" : "#9CA3AF" }}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0A0A0A]" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-10 max-w-[1200px]">
        {activeTab === "sets" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {hashtagSets.map((set) => (
              <div key={set.name} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0A0A0A]">{set.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-50 text-[10px] font-bold text-gray-400 border border-gray-100">{set.count} tags</span>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-6 min-h-[60px]">
                  {set.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-gray-50 text-[#0A0A0A] text-[11px] font-medium border border-gray-100">{tag}</span>
                  ))}
                  {set.more > 0 && <span className="text-[11px] text-gray-400 mt-1">+{set.more} more</span>}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">↑ {set.reach} reach</div>
                  <div className="flex gap-1">
                    {set.platforms.map((p) => (
                      <div key={p} className="w-5 h-5 rounded-md flex items-center justify-center shadow-sm" style={{ backgroundColor: platformColors[p] }}>
                        <span className="text-[8px] text-white font-black">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSet(set.name)}
                  className="w-full mt-6 py-2.5 rounded-xl bg-gray-50 text-[#6B7280] text-xs font-bold hover:bg-black hover:text-white transition-all"
                >
                  Edit Tags
                </button>
              </div>
            ))}

            {/* Create new dashed card */}
            <div className="border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-gray-200 transition-all group min-h-[220px]">
               <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                  <Plus size={24} />
               </div>
               <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Create New Set</span>
            </div>
          </div>
        )}

        {activeTab === "discover" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex gap-2 mb-8 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${activeCategory === c ? "bg-[#0A0A0A] text-white border-black" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {discoverTags.map((tag) => (
                <div key={tag.tag} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                  <div className="font-bold text-[#0A0A0A] mb-1">{tag.tag}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-3">{tag.posts} posts</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${tag.trend === "up" ? "text-green-500" : tag.trend === "down" ? "text-red-500" : "text-gray-400"}`}>
                      {tag.trend === "up" ? "TRENDING ↑" : tag.trend === "down" ? "DOWN ↓" : "STABLE →"}
                    </span>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline">+ Save</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-[#0A0A0A] mb-8 uppercase tracking-widest">Performance by Reach</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topHashtagsData}>
                  <XAxis dataKey="tag" tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="reach" fill="#0A0A0A" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    {["Hashtag", "Usage Frequency", "Avg Reach", "Platform", ""].map((h) => (
                      <th key={h} className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topHashtagsData.map((row) => (
                    <tr key={row.tag} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4 text-sm font-bold text-[#0A0A0A]">{row.tag}</td>
                      <td className="px-8 py-4 text-sm text-gray-500">{Math.floor(Math.random() * 50 + 10)} times</td>
                      <td className="px-8 py-4 text-sm font-bold text-[#0A0A0A]">{(row.reach / 1000).toFixed(1)}K</td>
                      <td className="px-8 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-pink-50 text-[#E1306C] text-[10px] font-black uppercase tracking-tighter">Instagram</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                         <button className="text-blue-600 text-xs font-bold hover:underline">Analysis →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Slide-in Editor (Simplified for brevity) */}
      {selectedSet && (
        <div className="fixed inset-0 z-[100] flex justify-end">
           <div className="absolute inset-0 bg-black/20" onClick={() => setSelectedSet(null)} />
           <div className="w-[480px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                 <h3 className="font-bold text-[#0A0A0A]">Edit Set: {selectedSet}</h3>
                 <button onClick={() => setSelectedSet(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Hashtags</label>
                    <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                       {customTags.map(t => (
                         <span key={t} className="px-3 py-1 bg-white rounded-lg text-xs font-bold flex items-center gap-2 border border-gray-200">
                            {t} <button onClick={() => setCustomTags(prev => prev.filter(x => x !== t))}><X size={12} /></button>
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                 <button className="w-full py-3 bg-[#0A0A0A] text-white rounded-xl font-bold">Save Changes</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
}
