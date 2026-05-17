import React from "react";

const COLORS = {
  YouTube: { bg: "#FF0000", label: "YT" },
  Facebook: { bg: "#1877F2", label: "FB" },
  TikTok: { bg: "#010101", label: "TT" },
  Instagram: { bg: "#E1306C", label: "IG" },
  Twitch: { bg: "#9146FF", label: "TW" },
  LinkedIn: { bg: "#0A66C2", label: "LI" },
  X: { bg: "#222", label: "X" },
};

export function PlatformIcon({ platform, size = 18, className = "" }) {
  const p = COLORS[platform] || { bg: "#888", label: "?" };
  return (
    <div
      className={`flex items-center justify-center rounded shrink-0 ${className}`}
      style={{ 
        width: size, 
        height: size, 
        background: p.bg, 
        fontSize: size * 0.45, 
        color: "#FFF", 
        fontWeight: 700 
      }}
    >
      {p.label}
    </div>
  );
}
