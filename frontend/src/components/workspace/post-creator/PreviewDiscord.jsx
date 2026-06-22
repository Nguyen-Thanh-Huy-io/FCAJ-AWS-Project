import * as React from "react";
import { MessageSquare, ShieldAlert } from "lucide-react";
import { PreviewShell } from "./PreviewShell";

export function PreviewDiscord({ 
  caption, 
  videoFileUrl, 
  previewDevice = "mobile",
  pageName = "general",
  imageTransform = null
}) {
  const displayCaption = caption || "This is a message sent to a Discord channel.";

  return (
    <PreviewShell
      videoFileUrl={videoFileUrl}
      previewDevice={previewDevice}
      imageTransform={imageTransform}
      layout="chat"
      aspectRatioClass="aspect-video"
      fallbackLabel="Discord Message"
      dark={true}
    >
      <div className="flex flex-col h-full bg-[#313338] text-white p-4 font-sans text-left">
        {/* Discord Channel Header */}
        <div className="flex items-center gap-2 border-b border-[#1f2023] pb-3 mb-3 shrink-0">
          <MessageSquare size={16} className="text-[#949ba4]" />
          <span className="text-xs font-bold text-white leading-tight">{pageName}</span>
          <span className="text-[10px] text-[#949ba4] font-medium">| Webhook channel</span>
        </div>

        {/* Discord Chat Area */}
        <div className="flex-1 flex flex-col justify-end space-y-3">
          <div className="flex items-start gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-sm font-semibold shadow-sm shrink-0">
              PC
            </div>

            {/* Message Body */}
            <div className="flex-1 min-w-0">
              {/* User Meta Row */}
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-xs font-semibold hover:underline cursor-pointer text-white">
                  PubliCast Webhook
                </span>
                <span className="bg-[#5865F2] text-[9px] font-bold px-1 py-0.5 rounded text-white uppercase tracking-wider scale-90">
                  Bot
                </span>
                <span className="text-[9px] text-[#949ba4] font-medium ml-1">
                  Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Content */}
              <p className="text-[12px] text-[#dbdee1] leading-relaxed whitespace-pre-wrap select-text break-words">
                {displayCaption}
              </p>

              {/* Discord-style Embed notice if media is present but handled by shell */}
              {videoFileUrl && (
                <div className="mt-2 text-[10px] text-[#949ba4] flex items-center gap-1 bg-[#2b2d31] p-2 rounded border border-[#1f2023] max-w-fit">
                  <ShieldAlert size={12} className="text-[#5865F2]" />
                  <span>Media asset attached above</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}
