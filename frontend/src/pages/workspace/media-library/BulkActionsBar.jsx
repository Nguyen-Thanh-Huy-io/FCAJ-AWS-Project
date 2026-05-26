import React from "react";
import { X } from "lucide-react";

export function BulkActionsBar({ selected, clearSelection, onDelete }) {
  if (selected.size === 0) return null;

  return (
    <div
      className="flex items-center gap-3 px-6 py-3"
      style={{
        background: "#0A0A0A",
        borderTop: "0.5px solid #222",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40
      }}
    >
      <span style={{ fontSize: 12, color: "#FFF" }}>{selected.size} items selected</span>
      <div style={{ flex: 1 }} />
      <button
        onClick={() => {
          if (window.confirm(`Delete ${selected.size} items?`)) {
            onDelete();
          }
        }}
        style={{
          padding: "6px 14px",
          borderRadius: 6,
          border: "0.5px solid #333",
          background: "transparent",
          color: "#EF4444",
          fontSize: 12,
          cursor: "pointer"
        }}
      >
        Delete
      </button>
      {["Download", "Add to post"].map((a) => (
        <button
          key={a}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "0.5px solid #333",
            background: "transparent",
            color: "#DDD",
            fontSize: 12,
            cursor: "pointer"
          }}
        >
          {a}
        </button>
      ))}
      <button onClick={clearSelection} style={{ color: "#666", cursor: "pointer", background: "none", border: "none" }}>
        <X size={14} />
      </button>
    </div>
  );
}
