import * as React from "react";
import { 
  MoreHorizontal, Globe, ThumbsUp, MessageSquare, Repeat2, Send
} from "lucide-react";
import { PreviewShell } from "./PreviewShell";

export function PreviewLinkedIn({ 
  caption, 
  videoFileUrl, 
  previewDevice = "mobile",
  pageName = "PubliCast Member",
  imageTransform = null
}) {
  const displayCaption = caption || "What do you want to talk about?";

  return (
    <PreviewShell
      videoFileUrl={videoFileUrl}
      previewDevice={previewDevice}
      imageTransform={imageTransform}
      layout="card"
      aspectRatioClass="aspect-video"
      fallbackLabel="LinkedIn Post"
    >
      {/* Header Slot */}
      <div slot="header" className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner">
            {pageName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-gray-900 leading-tight hover:underline cursor-pointer">
              {pageName}
            </span>
            <span className="block text-[10px] text-gray-500 leading-tight">
              Company Page • PubliCast member
            </span>
            <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-0.5">
              <span>Just now</span>
              <span>•</span>
              <Globe size={10} className="text-gray-400" />
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-full transition-all">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Body Details Slot */}
      <div className="px-4 pb-4 space-y-3.5 text-left">
        <p className="text-[11px] font-medium leading-relaxed text-gray-800 whitespace-pre-wrap px-0.5">
          {displayCaption}
        </p>

        {/* Media area is handled by PreviewShell */}

        {/* Analytics Action Counts Bar */}
        <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium border-b border-gray-100 pb-2 px-0.5">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-[#0077B5] flex items-center justify-center text-white ring-1 ring-white">
                <ThumbsUp size={8} className="fill-current text-white" />
              </div>
            </div>
            <span>0</span>
          </div>
          <div className="flex items-center gap-2">
            <span>0 comments</span>
            <span>•</span>
            <span>0 reposts</span>
          </div>
        </div>

        {/* Interactivity Buttons */}
        <div className="flex items-center justify-between pt-0.5 px-1 text-gray-500">
          <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-all cursor-pointer group text-[10px] font-semibold">
            <ThumbsUp size={14} className="group-hover:scale-110 transition-transform group-hover:text-[#0077B5]" />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-all cursor-pointer group text-[10px] font-semibold">
            <MessageSquare size={14} className="group-hover:scale-110 transition-transform" />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-all cursor-pointer group text-[10px] font-semibold">
            <Repeat2 size={14} className="group-hover:scale-110 transition-transform animate-spin-hover" />
            <span>Repost</span>
          </button>
          <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-all cursor-pointer group text-[10px] font-semibold">
            <Send size={14} className="group-hover:scale-110 transition-transform" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </PreviewShell>
  );
}
