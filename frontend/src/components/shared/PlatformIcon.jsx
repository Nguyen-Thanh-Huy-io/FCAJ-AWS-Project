import React from "react";

const PLATFORM_COLORS = {
  YouTube: "#FF0000",
  Facebook: "#1877F2",
  TikTok: "#000000",
  Instagram: "#E1306C",
  Twitch: "#9146FF",
  LinkedIn: "#0A66C2",
  X: "#000000"
};

const SVG_PATHS = {
  YouTube: (size) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Facebook: (size) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  TikTok: (size) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.43-.22-.15-.45-.32-.65-.51v6.5c-.02 3.11-1.4 6.27-4.51 7.2-2.91.95-6.35-.1-8.08-2.61-2-2.88-1.07-7.26 2.05-8.83 1.12-.59 2.4-.75 3.65-.67v3.91c-1.12-.22-2.38-.07-3.26.71-.97.83-1.11 2.27-.61 3.4.67 1.57 2.63 2.37 4.21 1.71 1.4-.53 2.14-2.02 2.12-3.51-.01-3.66 0-7.32-.01-10.98.01-1.63-.02-3.26.01-4.89z"/>
    </svg>
  ),
  Instagram: (size) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Twitch: (size) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
    </svg>
  ),
  LinkedIn: (size) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.73C24 .774 23.2 0 22.222 0z"/>
    </svg>
  ),
  X: (size) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
};

export function PlatformIcon({ platform, size = 18, variant = "color", className = "" }) {
  const normPlatform = Object.keys(SVG_PATHS).find(
    (k) => k.toLowerCase() === platform?.toLowerCase()
  ) || "YouTube";

  const renderSvg = SVG_PATHS[normPlatform];
  const bg = PLATFORM_COLORS[normPlatform] || "#888";

  if (variant === "flat") {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 ${className}`} 
        style={{ width: size, height: size, color: bg }}
      >
        {renderSvg(size)}
      </div>
    );
  }

  const innerSize = Math.max(size * 0.55, 10);

  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        color: "#FFF"
      }}
    >
      {renderSvg(innerSize)}
    </div>
  );
}
