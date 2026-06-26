import React from "react";
import { PlatformIcon as CentralPlatformIcon } from "../../../components/shared/PlatformIcon";

export const PLATFORM_COLORS = {
  YouTube: "#FF0000",
  Facebook: "#1877F2",
  TikTok: "#000000",
  Instagram: "#E1306C",
  Twitch: "#9146FF",
  LinkedIn: "#0A66C2",
  X: "#000000"
};

export function PlatformIcon({ platform, size = 14 }) {
  return <CentralPlatformIcon platform={platform} size={size} />;
}
