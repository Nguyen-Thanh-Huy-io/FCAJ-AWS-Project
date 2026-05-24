import React from "react";

export const PLATFORM_COLORS = {
  YouTube: "#FF0000",
  Facebook: "#1877F2",
  TikTok: "#010101",
  Instagram: "#E1306C",
  Twitch: "#9146FF",
  LinkedIn: "#0A66C2",
  X: "#000000"
};

export function PlatformIcon({ platform, size = 14 }) {
  const labels = {
    YouTube: "YT",
    Facebook: "FB",
    TikTok: "TT",
    Instagram: "IG",
    Twitch: "TW",
    LinkedIn: "LI",
    X: "X"
  };
  return (
    <div
      className="flex items-center justify-center rounded shrink-0"
      style={{
        width: size,
        height: size,
        background: PLATFORM_COLORS[platform] || "#888",
        fontSize: size * 0.45,
        color: "#FFF",
        fontWeight: 700
      }}
    >
      {labels[platform] || "?"}
    </div>
  );
}
