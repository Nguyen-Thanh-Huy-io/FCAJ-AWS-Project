import React from "react";
import { X, Download } from "lucide-react";
import { usePostCreator } from "../../../context/PostCreatorContext";

export function MediaDetailPanel({ detail, setDetail, onDelete }) {
  const { openPostCreator } = usePostCreator();
  if (!detail) return null;

  return (
    <div
      style={{
        width: 280,
        background: "#FFF",
        borderLeft: "0.5px solid #E5E7EB",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflowY: "auto"
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>File Details</span>
        <button onClick={() => setDetail(null)} style={{ color: "#9CA3AF", cursor: "pointer", background: "none", border: "none" }}>
          <X size={14} />
        </button>
      </div>
      <div
        style={{
          aspectRatio: "4/3",
          background: "#F3F4F6",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          overflow: "hidden"
        }}
      >
        {detail.thumbnail ? (
          <img src={detail.url} alt="" className="w-full h-full object-cover" />
        ) : (
          detail.emoji
        )}
      </div>
      <div>
        <input
          defaultValue={detail.name}
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 6,
            border: "0.5px solid #E5E7EB",
            fontSize: 11,
            outline: "none"
          }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Type", value: detail.type },
          { label: "Size", value: detail.size },
          { label: "Dimensions", value: detail.dim },
          { label: "Uploaded", value: detail.date }
        ].map((d) => (
          <div key={d.label}>
            <div
              style={{
                fontSize: 9,
                color: "#9CA3AF",
                marginBottom: 2,
                textTransform: "uppercase",
                letterSpacing: "0.6px"
              }}
            >
              {d.label}
            </div>
            <div style={{ fontSize: 11, color: "#0A0A0A" }}>{d.value}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={() => {
            openPostCreator({
              defaultVideoUrl: detail.url,
              defaultVideoPath: detail.url
            });
            setDetail(null);
          }}
          style={{
            padding: "7px 12px",
            borderRadius: 8,
            background: "#0A0A0A",
            color: "#FFF",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            border: "none"
          }}
        >
          Use in Post
        </button>
        <button
          className="flex items-center justify-center gap-2"
          style={{
            padding: "7px 12px",
            borderRadius: 8,
            border: "0.5px solid #E5E7EB",
            fontSize: 12,
            color: "#DC2626",
            cursor: "pointer",
            background: "transparent"
          }}
          onClick={() => {
            if (window.confirm("Delete this file?")) {
              onDelete(detail.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

