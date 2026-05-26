import * as React from "react";
import { 
  Heart, MessageCircle, Bookmark, Share2, 
  Search, Music, ChevronLeft, Plus, Play
} from "lucide-react";

export function PreviewTikTok({ 
  caption, 
  videoFileUrl, 
  previewDevice = "mobile",
  pageName = "nhvthanh77",
  imageTransform = null
}) {
  const displayCaption = caption || "What's on your mind?";
  const isVideo = videoFileUrl && (videoFileUrl.endsWith('.mp4') || videoFileUrl.endsWith('.mov') || videoFileUrl.endsWith('.avi'));

  const getImageStyle = (transform) => {
    if (!transform) return {};
    const { rotation = 0, flipH = false, flipV = false } = transform;
    return {
      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
      transition: 'transform 0.3s ease'
    };
  };

  const getImageFilterClass = (filterId) => {
    switch (filterId) {
      case 'grayscale': return 'grayscale';
      case 'sepia': return 'sepia';
      case 'invert': return 'invert';
      case 'blur': return 'blur-[2px]';
      case 'warm': return 'sepia-[0.3] saturate-[1.3] hue-rotate-[-10deg]';
      case 'cool': return 'saturate-[0.9] hue-rotate-[10deg] brightness-[1.05]';
      case 'dramatic': return 'contrast-[1.2] brightness-[0.9]';
      default: return '';
    }
  };

  return (
    <div className="w-[300px] h-[533px] bg-black rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between font-sans text-white mx-auto animate-in fade-in duration-300 border border-gray-800">
      
      {/* Background Media */}
      {videoFileUrl ? (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          {isVideo ? (
            <video src={videoFileUrl} muted autoPlay loop className="w-full h-full object-cover" />
          ) : (
            <img 
              src={videoFileUrl} 
              style={getImageStyle(imageTransform)}
              className={`w-full h-full object-cover ${getImageFilterClass(imageTransform?.filter)}`}
              alt="TikTok preview" 
            />
          )}
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#111827] via-[#1F2937] to-[#030712] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/40 mb-3 animate-pulse border border-white/10">
            <Play size={28} className="fill-current ml-1 text-white/60" />
          </div>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">TikTok Video Preview</p>
          <p className="text-[9px] text-white/40 mt-1 max-w-[180px] leading-normal font-medium">Upload a video or photo to preview your TikTok post.</p>
        </div>
      )}

      {/* Dark overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 pointer-events-none" />

      {/* Top Header Navigation Overlay */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-4">
        <button className="text-white/80 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-4 text-xs font-semibold text-white/60">
          <span className="cursor-pointer hover:text-white transition-colors">Following</span>
          <span className="text-white border-b-2 border-white pb-1 font-bold">For You</span>
        </div>
        <button className="text-white/80 hover:text-white transition-colors">
          <Search size={18} />
        </button>
      </div>

      {/* Right Drawer Action Icons */}
      <div className="absolute right-3 bottom-12 z-20 flex flex-col items-center gap-4">
        {/* User avatar with Red Plus button */}
        <div className="relative mb-2">
          <div className="w-10 h-10 rounded-full border-2 border-white bg-black/50 flex items-center justify-center font-bold text-xs shadow-lg">
            {pageName.substring(0, 2).toUpperCase()}
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FE2C55] rounded-full flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-110 transition-transform">
            <Plus size={10} strokeWidth={3} />
          </div>
        </div>

        {/* Like Button */}
        <button className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all">
            <Heart size={20} className="text-white group-hover:scale-110 transition-transform group-hover:text-[#FE2C55] group-hover:fill-[#FE2C55]" />
          </div>
          <span className="text-[9px] font-bold text-white/90">0</span>
        </button>

        {/* Comment Button */}
        <button className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all">
            <MessageCircle size={20} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[9px] font-bold text-white/90">0</span>
        </button>

        {/* Favorites/Bookmark Button */}
        <button className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all">
            <Bookmark size={20} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[9px] font-bold text-white/90">0</span>
        </button>

        {/* Share Button */}
        <button className="flex flex-col items-center gap-1 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all">
            <Share2 size={20} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[9px] font-bold text-white/90">0</span>
        </button>

        {/* Spinning CD Disk Icon */}
        <div className="w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center animate-spin duration-3000 mt-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-gray-700 to-black flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Bottom Info details Panel */}
      <div className="relative z-20 p-4 space-y-2 mt-auto flex flex-col justify-end text-left max-w-[210px]">
        {/* Username */}
        <span className="text-[12px] font-bold hover:underline cursor-pointer">
          @{pageName}
        </span>

        {/* Caption */}
        <p className="text-[10px] font-medium leading-normal text-white/90 whitespace-pre-wrap max-h-[70px] overflow-hidden text-ellipsis line-clamp-3">
          {displayCaption}
        </p>

        {/* Music Line */}
        <div className="flex items-center gap-1.5 text-[9px] font-semibold text-white/80 bg-black/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm truncate max-w-[180px]">
          <Music size={10} className="shrink-0 animate-pulse" />
          <span className="truncate">Original Sound - @{pageName}</span>
        </div>
      </div>

      {/* TikTok Bottom Navigation Bar Simulation */}
      <div className="relative z-20 h-10 border-t border-white/5 bg-black/80 flex items-center justify-around px-2 text-[9px] font-bold text-white/60">
        <span className="text-white">Home</span>
        <span>Friends</span>
        {/* Post Plus button */}
        <div className="relative w-9 h-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#FE2C55] rounded-lg -translate-x-0.5" />
          <div className="absolute inset-0 bg-[#25F4EE] rounded-lg translate-x-0.5" />
          <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center text-black">
            <Plus size={14} strokeWidth={3} />
          </div>
        </div>
        <span>Inbox</span>
        <span>Profile</span>
      </div>

    </div>
  );
}
