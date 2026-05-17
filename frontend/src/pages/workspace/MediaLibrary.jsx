import { useState } from "react";
import { Search, Upload, X, Download, MoreHorizontal, LayoutGrid, List } from "lucide-react";

const MEDIA = [
  { id: 1, name: "tech-review-thumbnail.jpg", type: "image", size: "2.4 MB", dim: "1280×720", date: "May 15", used: true, emoji: "🖼️", aspect: "16/9" },
  { id: 2, name: "product-demo-video.mp4", type: "video", size: "148 MB", dim: "1920×1080", date: "May 14", used: true, emoji: "🎬", duration: "12:34", aspect: "16/9" },
  { id: 3, name: "brand-logo-white.png", type: "image", size: "0.3 MB", dim: "400×400", date: "May 12", used: false, emoji: "🖼️", aspect: "1/1" },
  { id: 4, name: "team-photo.jpg", type: "image", size: "3.1 MB", dim: "1600×900", date: "May 10", used: true, emoji: "🖼️", aspect: "16/9" },
  { id: 5, name: "tutorial-react.mp4", type: "video", size: "230 MB", dim: "1920×1080", date: "May 8", used: false, emoji: "🎬", duration: "28:15", aspect: "16/9" },
  { id: 6, name: "infographic-2025.png", type: "image", size: "1.8 MB", dim: "800×1200", date: "May 7", used: true, emoji: "🖼️", aspect: "2/3" },
  { id: 7, name: "event-banner.jpg", type: "image", size: "2.9 MB", dim: "1200×630", date: "May 5", used: false, emoji: "🖼️", aspect: "19/10" },
  { id: 8, name: "community-gif.gif", type: "gif", size: "4.2 MB", dim: "480×270", date: "May 3", used: true, emoji: "🎞️", aspect: "16/9" },
  { id: 9, name: "live-stream-cover.jpg", type: "image", size: "1.6 MB", dim: "1280×720", date: "May 1", used: false, emoji: "🖼️", aspect: "16/9" },
  { id: 10, name: "short-clip-tiktok.mp4", type: "video", size: "85 MB", dim: "1080×1920", date: "Apr 28", used: true, emoji: "🎬", duration: "0:58", aspect: "9/16" },
  { id: 11, name: "podcast-cover.png", type: "image", size: "0.8 MB", dim: "1000×1000", date: "Apr 25", used: false, emoji: "🖼️", aspect: "1/1" },
  { id: 12, name: "announcement.jpg", type: "image", size: "1.2 MB", dim: "1080×1080", date: "Apr 20", used: true, emoji: "🖼️", aspect: "1/1" },
];

export function MediaLibraryPage() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selected, setSelected] = useState(new Set());
  const [detail, setDetail] = useState(null);
  const [dragging, setDragging] = useState(false);

  const filtered = MEDIA.filter((m) => {
    if (typeFilter !== "All" && !m.type.includes(typeFilter.toLowerCase().replace("s", ""))) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "#F8F8F7" }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={() => setDragging(false)}
    >
      {/* Drag overlay */}
      {dragging && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(255,255,255,0.9)", border: "2px dashed #E5E7EB" }}
        >
          <div className="text-center">
            <Upload size={32} style={{ color: "#D1D5DB", margin: "0 auto 8px" }} />
            <div style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A" }}>Drop files to upload</div>
          </div>
        </div>
      )}

      {/* Sub-header */}
      <div className="flex items-center gap-3 px-6 py-3" style={{ background: "#FFF", borderBottom: "0.5px solid #E5E7EB" }}>
        <div className="relative" style={{ flex: "0 0 240px" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "7px 10px 7px 30px", borderRadius: 8, border: "0.5px solid #E5E7EB", fontSize: 12, outline: "none" }}
          />
        </div>
        <div className="flex items-center gap-1">
          {["All", "Images", "Videos", "GIFs"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="cursor-pointer"
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                fontSize: 11,
                background: typeFilter === t ? "#0A0A0A" : "#FFF",
                color: typeFilter === t ? "#FFF" : "#6B7280",
                border: "0.5px solid #E5E7EB" }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <select style={{ padding: "5px 10px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#6B7280", outline: "none", cursor: "pointer" }}>
          <option>Sort: Newest</option>
          <option>Sort: Oldest</option>
          <option>Sort: Name</option>
          <option>Sort: Size</option>
        </select>
        <div className="flex items-center overflow-hidden rounded-lg" style={{ border: "0.5px solid #E5E7EB" }}>
          <button onClick={() => setView("grid")} style={{ padding: "5px 8px", background: view === "grid" ? "#0A0A0A" : "#FFF", cursor: "pointer" }}>
            <LayoutGrid size={13} style={{ color: view === "grid" ? "#FFF" : "#9CA3AF" }} />
          </button>
          <button onClick={() => setView("list")} style={{ padding: "5px 8px", background: view === "list" ? "#0A0A0A" : "#FFF", cursor: "pointer" }}>
            <List size={13} style={{ color: view === "list" ? "#FFF" : "#9CA3AF" }} />
          </button>
        </div>
        <button
          className="flex items-center gap-2 cursor-pointer rounded-lg"
          style={{ padding: "7px 14px", background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500, borderRadius: 8 }}
        >
          <Upload size={13} /> Upload Files
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "16px 24px" }}>
          {view === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden cursor-pointer"
                  style={{ background: "#FFF", border: "0.5px solid #E5E7EB" }}
                  onClick={() => setDetail(item)}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{ background: "#F3F4F6", aspectRatio: "4/3", fontSize: 32 }}
                  >
                    {item.emoji}
                    {item.duration && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 6,
                          right: 6,
                          background: "rgba(0,0,0,0.7)",
                          color: "#FFF",
                          fontSize: 9,
                          padding: "2px 6px",
                          borderRadius: 4 }}
                      >
                        {item.duration}
                      </span>
                    )}
                    <div
                      className="absolute"
                      style={{
                        bottom: 6,
                        left: 6,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: item.used ? "#16A34A" : "#9CA3AF" }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.5)" }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            background: selected.has(item.id) ? "#0A0A0A" : "#FFF",
                            border: "1.5px solid #FFF",
                            cursor: "pointer" }}
                        />
                        <button
                          style={{
                            padding: "5px 12px",
                            borderRadius: 6,
                            background: "#FFF",
                            color: "#0A0A0A",
                            fontSize: 11,
                            fontWeight: 500,
                            cursor: "pointer",
                            border: "none" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Use in Post
                        </button>
                        <button
                          style={{ position: "absolute", top: 8, right: 8, color: "#FFF", background: "transparent", border: "none", cursor: "pointer" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontSize: 11, color: "#0A0A0A", marginBottom: 2 }} className="truncate">{item.name}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>{item.size} · {item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#FAFAFA", borderBottom: "0.5px solid #E5E7EB" }}>
                    {["", "Preview", "Filename", "Type", "Size", "Uploaded", "Used in", ""].map((h, i) => (
                      <th key={i} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", textAlign: "left" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "0.5px solid #F0F0EF", cursor: "pointer" }} onClick={() => setDetail(item)}>
                      <td style={{ padding: "8px 12px" }}>
                        <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} style={{ accentColor: "#0A0A0A" }} onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <div style={{ width: 48, height: 36, borderRadius: 4, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                          {item.emoji}
                        </div>
                      </td>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: "#0A0A0A" }}>{item.name}</td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280", textTransform: "capitalize" }}>{item.type}</td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280" }}>{item.size}</td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280" }}>{item.date}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.used ? "#16A34A" : "#9CA3AF" }} />
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <button style={{ color: "#9CA3AF", cursor: "pointer", background: "none", border: "none" }}>
                          <MoreHorizontal size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {detail && (
          <div style={{ width: 280, background: "#FFF", borderLeft: "0.5px solid #E5E7EB", padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>File Details</span>
              <button onClick={() => setDetail(null)} style={{ color: "#9CA3AF", cursor: "pointer", background: "none", border: "none" }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ aspectRatio: "4/3", background: "#F3F4F6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
              {detail.emoji}
            </div>
            <div>
              <input
                defaultValue={detail.name}
                style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, outline: "none" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Type", value: detail.type },
                { label: "Size", value: detail.size },
                { label: "Dimensions", value: detail.dim },
                { label: "Uploaded", value: detail.date },
              ].map((d) => (
                <div key={d.label}>
                  <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.6px" }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: "#0A0A0A" }}>{d.value}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button style={{ padding: "7px 12px", borderRadius: 8, background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none" }}>
                Use in Post
              </button>
              <button className="flex items-center justify-center gap-2" style={{ padding: "7px 12px", borderRadius: 8, border: "0.5px solid #E5E7EB", fontSize: 12, color: "#6B7280", cursor: "pointer", background: "transparent" }}>
                <Download size={12} /> Download
              </button>
              <button style={{ padding: "7px 12px", borderRadius: 8, border: "0.5px solid #FEE2E2", fontSize: 12, color: "#DC2626", cursor: "pointer", background: "transparent" }}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div
          className="flex items-center gap-3 px-6 py-3"
          style={{ background: "#0A0A0A", borderTop: "0.5px solid #222", position: "sticky", bottom: 0 }}
        >
          <span style={{ fontSize: 12, color: "#FFF" }}>{selected.size} items selected</span>
          <div style={{ flex: 1 }} />
          {["Delete", "Download", "Add to post"].map((a) => (
            <button
              key={a}
              style={{ padding: "6px 14px", borderRadius: 6, border: "0.5px solid #333", background: "transparent", color: a === "Delete" ? "#EF4444" : "#DDD", fontSize: 12, cursor: "pointer" }}
            >
              {a}
            </button>
          ))}
          <button onClick={() => setSelected(new Set())} style={{ color: "#666", cursor: "pointer", background: "none", border: "none" }}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
