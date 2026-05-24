import * as React from "react";
import { 
  Folder, ThumbsUp, MessageSquare, Share2, Download, MoreHorizontal 
} from "lucide-react";
import { ShortsIcon } from "./ShortsIcon";

function ThumbsDown({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.99-2.28l.83-8.29A2 2 0 0 1 5.01 2h10.75a2 2 0 0 1 2 2v10.29a2 2 0 0 1-.58 1.41l-3.92 3.92a2.38 2.38 0 0 1-3.26 0z" />
    </svg>
  );
}

export function PreviewYouTube({ 
  caption, 
  videoFileUrl, 
  youtubeType = "video", 
  youtubeTitle = "", 
  youtubePlaylistId = "", 
  playlists = [], 
  youtubeTags = "", 
  youtubeFirstComment = "", 
  globalFirstComment = "", 
  previewDevice = "mobile",
  channelName = "CodeChick" 
}) {
  const activePlaylist = playlists.find(p => p.id === youtubePlaylistId);
  const tagsList = youtubeTags ? youtubeTags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const displayTitle = youtubeTitle || "New Video Title";
  const firstCommentText = youtubeFirstComment || globalFirstComment;

  // Nếu youtubeType là 'short'
  if (youtubeType === 'short') {
    if (previewDevice === 'mobile') {
      return (
        <div className="w-[280px] aspect-[9/16] bg-black rounded-[32px] overflow-hidden relative shadow-2xl border-4 border-black font-sans text-white mx-auto animate-in fade-in duration-300">
          {videoFileUrl ? (
            <video src={videoFileUrl} controls className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500 p-4 text-center">
              <ShortsIcon size={40} className="text-red-500 mb-2 animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Short Preview</span>
            </div>
          )}
          
          {/* Right Overlay Actions */}
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4 z-10">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"><ThumbsUp size={16}/></div>
              <span className="text-[9px] font-bold mt-1">Like</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                <ThumbsDown size={16} />
              </div>
              <span className="text-[9px] font-bold mt-1">Dislike</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"><MessageSquare size={16}/></div>
              <span className="text-[9px] font-bold mt-1">{firstCommentText ? "1" : "0"}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"><Share2 size={16}/></div>
              <span className="text-[9px] font-bold mt-1">Share</span>
            </div>
          </div>

          {/* Left Bottom Overlay Text */}
          <div className="absolute left-4 bottom-4 right-16 text-left z-10 space-y-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center text-[8px] font-black text-white">C</div>
              <span className="text-[11px] font-black tracking-wide">@{channelName}</span>
              <span className="px-2 py-0.5 bg-red-600 rounded-full text-[8px] font-black uppercase">Subscribe</span>
            </div>
            <p className="text-[11px] font-bold leading-snug line-clamp-2 text-gray-100">{displayTitle}</p>
            {caption && <p className="text-[9px] text-gray-300 line-clamp-1 font-medium">{caption}</p>}
            {tagsList.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tagsList.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[9px] font-bold text-blue-300">#{t}</span>
                ))}
              </div>
            )}
            {activePlaylist && (
              <span className="inline-flex items-center gap-1 text-[8px] font-black text-yellow-400 bg-yellow-400/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                <Folder size={8}/> {activePlaylist.title}
              </span>
            )}
          </div>
        </div>
      );
    } else {
      // Desktop (Shorts)
      return (
        <div className="flex items-end gap-5 justify-center max-w-[360px] mx-auto font-sans animate-in fade-in duration-300">
          <div className="w-[230px] aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-gray-800 text-white">
            {videoFileUrl ? (
              <video src={videoFileUrl} controls className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500 p-4 text-center">
                <ShortsIcon size={36} className="text-red-500 mb-2 animate-bounce" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Short Preview</span>
              </div>
            )}
            {/* Bottom Overlay inside video container */}
            <div className="absolute left-3 bottom-3 right-3 text-left z-10 bg-gradient-to-t from-black/80 to-transparent p-2.5 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-[7px] font-bold">C</div>
                <span className="text-[9px] font-bold">@{channelName}</span>
              </div>
              <p className="text-[10px] font-bold line-clamp-2">{displayTitle}</p>
            </div>
          </div>
          {/* Interaction panel on the right (outside the video card) */}
          <div className="flex flex-col gap-4 text-gray-600 shrink-0 pb-4">
            {[
              { icon: <ThumbsUp size={16}/>, label: "Like" },
              { icon: <ThumbsDown size={16} />, label: "Dislike" },
              { icon: <MessageSquare size={16}/>, label: firstCommentText ? "1" : "0" },
              { icon: <Share2 size={16}/>, label: "Share" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer transition-colors text-black">
                  {item.icon}
                </div>
                <span className="text-[8px] font-bold mt-1 text-gray-400 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  // Nếu youtubeType là 'video'
  if (previewDevice === 'mobile') {
    return (
      <div className="w-[300px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 font-sans text-left mx-auto animate-in fade-in duration-300">
        <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
           {videoFileUrl ? (
             <video src={videoFileUrl} controls className="w-full h-full object-cover" />
           ) : (
             <span className="text-white text-xs font-medium">Video preview not available</span>
           )}
        </div>
        <div className="p-4 space-y-3.5">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">{displayTitle}</h3>
            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">0 views · May 24, 2026</span>
            {caption && (
              <p className="text-[10px] text-gray-600 leading-relaxed whitespace-pre-wrap mt-2 bg-gray-50 p-2 rounded-xl border border-gray-100/50 line-clamp-3">
                {caption}
              </p>
            )}
          </div>

          {activePlaylist && (
            <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
              <Folder size={12} className="text-gray-400" />
              <span className="text-[9px] font-bold text-gray-600 truncate">Playlist: {activePlaylist.title}</span>
            </div>
          )}

          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {tagsList.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-bold">#{t}</span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between border-t border-b border-gray-50 py-2.5">
             <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white text-[9px] font-bold">C</div>
                <span className="text-[10px] font-bold text-gray-800">{channelName}</span>
             </div>
             <button className="px-3.5 py-1 bg-black text-white rounded-full text-[9px] font-bold">Subscribe</button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
             {[
               { icon: <ThumbsUp size={12}/>, label: "0" },
               { icon: <ThumbsDown size={12} />, label: "" },
               { icon: <Share2 size={12}/>, label: "Share" },
               { icon: <Download size={12}/>, label: "Download" }
             ].map((btn, idx) => (
               <div key={idx} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 rounded-full text-gray-500 whitespace-nowrap text-[9px] font-bold">
                  {btn.icon}
                  {btn.label && <span>{btn.label}</span>}
               </div>
             ))}
             <div className="p-1.5 bg-gray-50 rounded-full text-gray-500"><MoreHorizontal size={12}/></div>
          </div>

          {/* Comment Preview */}
          {firstCommentText && (
            <div className="pt-2 border-t border-gray-50 space-y-1.5">
              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">First Comment Preview</span>
              <div className="p-3 bg-gray-50 rounded-2xl flex items-start gap-2.5 border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white text-[8px] font-bold shrink-0">C</div>
                <div className="space-y-0.5">
                  <span className="block text-[9px] font-black text-gray-700">@{channelName}</span>
                  <p className="text-[10px] font-semibold text-gray-600 leading-normal">{firstCommentText}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // Desktop (Video)
    return (
      <div className="w-full max-w-[460px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 font-sans text-left mx-auto p-4 space-y-4 animate-in fade-in duration-300">
        {/* Video Screen */}
        <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden rounded-2xl">
           {videoFileUrl ? (
             <video src={videoFileUrl} controls className="w-full h-full object-cover" />
           ) : (
             <span className="text-white text-xs font-medium">Video preview not available</span>
           )}
        </div>

        {/* Video Title */}
        <h2 className="text-sm font-bold text-gray-900 leading-snug">{displayTitle}</h2>

        {/* Channel and Interaction Row */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-[10px] font-bold">C</div>
            <div>
              <span className="block text-[11px] font-bold text-gray-800">{channelName}</span>
              <span className="block text-[9px] text-gray-400 font-semibold">120K subscribers</span>
            </div>
            <button className="ml-2 px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-full text-[9px] font-bold transition-all">Subscribe</button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
              <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-200 transition-all text-gray-700 border-r border-gray-200/50 text-[9px] font-bold">
                <ThumbsUp size={11}/> 0
              </button>
              <button className="px-3 py-1.5 hover:bg-gray-200 transition-all text-gray-700">
                <ThumbsDown size={11} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 transition-all text-gray-700 rounded-full text-[9px] font-bold">
              <Share2 size={11}/> Share
            </button>
          </div>
        </div>

        {/* Description & Playlist Box */}
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Video Description Box</div>
          <div className="text-[10px] font-bold text-gray-800 flex items-center gap-2">
            <span>0 views</span>
            <span>May 24, 2026</span>
          </div>
          {caption && <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">{caption}</p>}
          
          {activePlaylist && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-400/10 text-yellow-600 rounded-lg text-[9px] font-bold border border-yellow-400/20 uppercase tracking-wide">
              <Folder size={10}/> Playlist: {activePlaylist.title}
            </div>
          )}

          {tagsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tagsList.map((t, idx) => (
                <span key={idx} className="text-[9px] font-bold text-blue-600 hover:underline cursor-pointer">#{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        {firstCommentText && (
          <div className="space-y-3 pt-1">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">1 Comment</h4>
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">C</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-800">@{channelName}</span>
                  <span className="text-[8px] text-gray-400 font-medium">1 second ago</span>
                </div>
                <p className="text-[11px] font-semibold text-gray-600 leading-normal">{firstCommentText}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
