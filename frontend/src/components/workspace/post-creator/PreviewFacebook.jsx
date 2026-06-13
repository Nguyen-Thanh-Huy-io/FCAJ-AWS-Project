import * as React from "react";
import { 
  MoreHorizontal, Globe, ThumbsUp, MessageSquare, Share2, 
  Heart, Send, Music, Volume2, Play, ChevronLeft, X
} from "lucide-react";

export function PreviewFacebook({ 
  caption, 
  videoFileUrl, 
  previewDevice = "mobile",
  pageName = "PubliCast Fanpage",
  facebookType = "post",
  facebookTitle = "",
  imageTransform = null
}) {
  const displayCaption = caption || "What's on your mind?";
  // Detect video: kiểm tra extension hoặc Cloudinary video path (/video/upload/)
  const isVideo = videoFileUrl && (
    videoFileUrl.endsWith('.mp4') || 
    videoFileUrl.endsWith('.mov') || 
    videoFileUrl.endsWith('.avi') ||
    videoFileUrl.endsWith('.webm') ||
    videoFileUrl.includes('/video/upload/')  // Cloudinary video URL
  );

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

  // Define width depending on device
  const cardWidth = previewDevice === 'mobile' ? 'w-[300px]' : 'w-full max-w-[460px]';

  // Render Post (Standard Facebook Feed Post)
  if (facebookType === 'post') {
    return (
      <div className={`${cardWidth} bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 font-sans text-left mx-auto p-4 space-y-3 animate-in fade-in duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner">
              {pageName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 leading-tight hover:underline cursor-pointer">
                {pageName}
              </span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">
                <span>Just now</span>
                <span>·</span>
                <Globe size={10} className="text-gray-400" />
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-full transition-all">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Caption Text */}
        <p className="text-[11px] font-medium leading-relaxed text-gray-800 whitespace-pre-wrap px-0.5">
          {displayCaption}
        </p>

        {/* Media Attachment Screen */}
        {videoFileUrl && (
          <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden rounded-xl border border-gray-50">
            {isVideo ? (
              <video src={videoFileUrl} controls className="w-full h-full object-cover" />
            ) : (
              <img 
                src={videoFileUrl} 
                style={getImageStyle(imageTransform)}
                className={`w-full h-full object-cover ${getImageFilterClass(imageTransform?.filter)}`}
                alt="Facebook post attachment" 
              />
            )}
          </div>
        )}

        {/* Analytics Action Counts Bar */}
        <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold border-b border-gray-100 pb-2.5 px-0.5">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
              <ThumbsUp size={8} fill="white" stroke="none" />
            </div>
            <span>0</span>
          </div>
          <div className="flex gap-2">
            <span>0 comments</span>
            <span>·</span>
            <span>0 shares</span>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex items-center justify-between pt-1 text-gray-600 font-bold text-[10px] uppercase tracking-wider px-1">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-xl transition-all">
            <ThumbsUp size={14} />
            <span>Like</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-xl transition-all">
            <MessageSquare size={14} />
            <span>Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-xl transition-all">
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </div>
    );
  }

  // Render Facebook Reels (Vertical 9:16)
  if (facebookType === 'reel') {
    return (
      <div className="w-[300px] h-[533px] bg-black rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between font-sans text-white mx-auto animate-in fade-in duration-300 border border-gray-800">
        
        {/* Reel Background Video/Image */}
        {videoFileUrl ? (
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            {isVideo ? (
              <video src={videoFileUrl} muted autoPlay loop className="w-full h-full object-cover" />
            ) : (
              <img 
                src={videoFileUrl} 
                style={getImageStyle(imageTransform)}
                className={`w-full h-full object-cover ${getImageFilterClass(imageTransform?.filter)}`}
                alt="Facebook Reel preview" 
              />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#2E1065]/60 to-[#0F052D] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/40 mb-3 animate-pulse">
              <Play size={28} className="fill-current ml-1" />
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Reel Video Preview</p>
            <p className="text-[9px] text-white/40 mt-1 max-w-[180px] leading-normal font-medium">Upload a video to preview your Facebook Reel.</p>
          </div>
        )}

        {/* Black gradient mask to overlay text elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10 pointer-events-none" />

        {/* Top Header Controls overlay */}
        <div className="relative z-20 flex items-center justify-between p-4">
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-white/90">Reels</span>
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md">
            <Volume2 size={16} />
          </button>
        </div>

        {/* Bottom Metadata & Info Panel */}
        <div className="relative z-20 p-4 space-y-3 mt-auto flex flex-col justify-end">
          
          {/* User Info Line */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px] font-bold shadow-md shrink-0">
              {pageName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="block text-xs font-bold text-white hover:underline cursor-pointer">
                {pageName}
              </span>
              <span className="block text-[8px] text-gray-300 font-bold uppercase tracking-wider">Just now</span>
            </div>
            <button className="ml-2 px-2.5 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-[9px] font-bold transition-all">
              Follow
            </button>
          </div>

          {/* Reel Title (Facebook presets Title) */}
          {facebookTitle && (
            <h4 className="text-xs font-black text-yellow-300 leading-tight">
              {facebookTitle}
            </h4>
          )}

          {/* Caption text */}
          <p className="text-[10px] font-medium leading-relaxed text-gray-100 max-h-[60px] overflow-hidden text-ellipsis line-clamp-3">
            {displayCaption}
          </p>

          {/* Music track simulated info */}
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-300 bg-black/30 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
            <Music size={10} className="animate-spin duration-3000" />
            <span>Original Audio · {pageName}</span>
          </div>

        </div>

        {/* Side Actions Drawer Column */}
        <div className="absolute right-3 bottom-16 z-20 flex flex-col items-center gap-4">
          <button className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all">
              <ThumbsUp size={16} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[8px] font-bold text-white/90">0</span>
          </button>

          <button className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all">
              <MessageSquare size={16} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[8px] font-bold text-white/90">0</span>
          </button>

          <button className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all">
              <Share2 size={16} className="text-white group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[8px] font-bold text-white/90">Share</span>
          </button>
        </div>

      </div>
    );
  }

  // Render Facebook Story (Vertical 9:16 format with progress indicators)
  if (facebookType === 'story') {
    return (
      <div className="w-[300px] h-[533px] bg-black rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between font-sans text-white mx-auto animate-in fade-in duration-300 border border-gray-800">
        
        {/* Story Background Media */}
        {videoFileUrl ? (
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            {isVideo ? (
              <video src={videoFileUrl} muted autoPlay loop className="w-full h-full object-cover" />
            ) : (
              <img 
                src={videoFileUrl} 
                style={getImageStyle(imageTransform)}
                className={`w-full h-full object-cover ${getImageFilterClass(imageTransform?.filter)}`}
                alt="Facebook Story preview" 
              />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0D9488]/40 to-[#111827] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/40 mb-3 animate-pulse border border-white/20">
              <Send size={24} className="text-white/60 ml-0.5" />
            </div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Story Media Preview</p>
            <p className="text-[9px] text-white/40 mt-1 max-w-[180px] leading-normal font-medium">Upload photo/video to preview your Facebook Story.</p>
          </div>
        )}

        {/* Black gradient mask to overlay text elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 pointer-events-none" />

        {/* Top Header controls */}
        <div className="relative z-20 p-3 space-y-2.5">
          {/* Progress Indicators */}
          <div className="flex gap-1">
            <div className="h-0.5 flex-1 bg-white rounded-full" />
            <div className="h-0.5 flex-1 bg-white/30 rounded-full" />
          </div>

          {/* User Details line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Pink outline for active story */}
              <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-pink-500 to-yellow-500 shadow-md">
                <div className="w-full h-full rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px] font-bold">
                  {pageName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold text-white hover:underline cursor-pointer">
                  {pageName}
                </span>
                <span className="block text-[8px] text-gray-300 font-bold uppercase tracking-wider">Just now</span>
              </div>
            </div>
            <button className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 backdrop-blur-md">
              <X size={14} />
            </button>
          </div>
        </div>



        {/* Bottom Send message bar */}
        <div className="relative z-20 p-3 flex items-center gap-3 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Send message..."
              disabled
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold text-white/80 placeholder-white/50 outline-none"
            />
          </div>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <Heart size={16} className="text-white hover:fill-red-500 hover:text-red-500 transition-colors" />
          </button>
        </div>

      </div>
    );
  }

  return null;
}
