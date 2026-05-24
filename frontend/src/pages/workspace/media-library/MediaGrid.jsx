import React from "react";
import { MoreHorizontal } from "lucide-react";

export function MediaGrid({ filteredMedia, setDetail, selected, toggleSelect, clearFilters }) {
  if (filteredMedia.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 16px",
          gap: 8,
          background: "#FFF",
          borderRadius: 12,
          border: "0.5px solid #E5E7EB"
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: "#6B7280" }}>No media files found</span>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>Try adjusting your search query or file type filter.</span>
        <button
          onClick={clearFilters}
          className="mt-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
          style={{ border: "0.5px solid #E5E7EB", background: "#FFF", color: "#0A0A0A" }}
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
      {filteredMedia.map((item) => (
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
            {item.thumbnail ? (
              <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              item.emoji
            )}
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
                  borderRadius: 4
                }}
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
                background: item.used ? "#16A34A" : "#9CA3AF"
              }}
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item.id);
                  }}
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: selected.has(item.id) ? "#0A0A0A" : "#FFF",
                    border: "1.5px solid #FFF",
                    cursor: "pointer"
                  }}
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
                    border: "none"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Use in Post
                </button>
                <button
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#FFF",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontSize: 11, color: "#0A0A0A", marginBottom: 2 }} className="truncate">
              {item.name}
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>
              {item.size} · {item.date}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
