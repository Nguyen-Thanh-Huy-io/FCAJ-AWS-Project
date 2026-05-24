import * as React from "react";
import { useState } from "react";
import { 
  X, Smile, Link2, Plus, Image as ImageIcon, 
  FileText, Loader2, RotateCw, Copy, ChevronDown, 
  Calendar, Youtube, PlayCircle, Smartphone, Monitor, Info, MessageSquare,
  Languages, Settings
} from "lucide-react";
import { usePostCreatorForm } from "../../hooks/usePostCreatorForm";
import { ShortsIcon } from "../../components/workspace/post-creator/ShortsIcon";
import { MediaDropdown } from "../../components/workspace/post-creator/MediaDropdown";
import { EmojiPickerPopover } from "../../components/workspace/post-creator/EmojiPickerPopover";
import { FirstCommentModal } from "../../components/workspace/post-creator/FirstCommentModal";
import { UTMGeneratorPopover } from "../../components/workspace/post-creator/UTMGeneratorPopover";
import { PreviewStrategies } from "../../components/workspace/post-creator/PreviewStrategies";
import { GoogleDrivePickerModal } from "../../components/workspace/post-creator/GoogleDrivePickerModal";
import { toast } from "sonner";

const PUBLISH_OPTIONS = [
  { id: "draft", label: "SAVE AS DRAFT", sub: "Save and publish at a later time" },
  { id: "review", label: "SEND TO REVIEW", sub: "Select reviewers" },
  { id: "schedule", label: "SAVE AND SCHEDULE", sub: "Save changes to this post" },
  { id: "now", label: "PUBLISH NOW", sub: "Publish with current date and time" },
];

export function PostCreatorPage() {
  const {
    isOpen,
    closePostCreator,
    caption,
    setCaption,
    title,
    setTitle,
    activePlatform,
    setActivePlatform,
    previewDevice,
    setPreviewDevice,
    showPublishMenu,
    setShowPublishMenu,
    selectedPublishId,
    setSelectedPublishId,
    activeBrand,
    isCreating,
    scheduledDate,
    setScheduledDate,
    isLibrary,
    setIsLibrary,
    globalOpen,
    setGlobalOpen,
    youtubeOpen,
    setYoutubeOpen,
    youtubeType,
    setYoutubeType,
    showTypeMenu,
    setShowTypeMenu,
    youtubeTitle,
    setYoutubeTitle,
    youtubeMadeForKids,
    setYoutubeMadeForKids,
    youtubePrivacy,
    setYoutubePrivacy,
    youtubeCategory,
    setYoutubeCategory,
    youtubePlaylistId,
    setYoutubePlaylistId,
    youtubeTags,
    setYoutubeTags,
    youtubeFirstComment,
    setYoutubeFirstComment,
    globalFirstComment,
    setGlobalFirstComment,
    playlists,
    isLoadingPlaylists,
    videoFile,
    videoFileUrl,
    uploadedVideoPath,
    isUploadingVideo,
    activePopover,
    setActivePopover,
    showFirstCommentModal,
    setShowFirstCommentModal,
    isDriveModalOpen,
    setIsDriveModalOpen,
    handleSelectDriveFile,
    textareaRef,
    fileInputRef,
    insertAtCursor,
    handleVideoChange,
    handleRemoveVideo,
    fetchPlaylists,
    editingPost,
    handleCreatePost
  } = usePostCreatorForm();

  if (!isOpen) return null;

  const currentOption = PUBLISH_OPTIONS.find(o => o.id === selectedPublishId);
  const PreviewComponent = PreviewStrategies[activePlatform];

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-[#F8F8F7] animate-in slide-in-from-bottom duration-500">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <h1 className="text-lg font-bold text-[#0A0A0A]">{editingPost ? "Edit scheduled post" : "Create new post"}</h1>
        <button onClick={closePostCreator} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group cursor-pointer">
           <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
           <span className="text-[11px] font-bold uppercase tracking-widest">Close</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Composer */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-white border-r border-gray-100 scrollbar-thin">
           <div className="max-w-[700px] mx-auto w-full space-y-6">
              {/* Platform Header */}
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <button className="text-gray-300 hover:text-[#010101] transition-colors cursor-pointer"><PlayCircle size={24} /></button>
                     <div className="relative">
                        <button 
                          onClick={() => setShowTypeMenu(!showTypeMenu)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all cursor-pointer"
                        >
                           {youtubeType === 'video' ? (
                             <Youtube className="text-[#FF0000] fill-[#FF0000]" size={20} />
                           ) : (
                             <ShortsIcon size={20} className="text-[#FF0000]" />
                           )}
                           <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">
                             {youtubeType === 'video' ? 'Video' : 'Short'}
                           </span>
                           <ChevronDown size={12} className="text-gray-400" />
                        </button>

                        {showTypeMenu && (
                           <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                              <button 
                                onClick={() => { setYoutubeType('video'); setShowTypeMenu(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-all text-left cursor-pointer ${youtubeType === 'video' ? 'bg-gray-50' : ''}`}
                              >
                                 <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
                                    <Youtube size={16} className="text-[#FF0000] fill-[#FF0000]" />
                                 </div>
                                 <div>
                                    <div className="text-[11px] font-bold text-gray-800">Video</div>
                                    <div className="text-[9px] text-gray-400 font-medium">Standard YouTube video</div>
                                 </div>
                              </button>
                              <button 
                                onClick={() => { setYoutubeType('short'); setShowTypeMenu(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-all text-left cursor-pointer ${youtubeType === 'short' ? 'bg-gray-50' : ''}`}
                              >
                                 <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
                                    <ShortsIcon size={16} className="text-[#FF0000]" />
                                 </div>
                                 <div>
                                    <div className="text-[11px] font-bold text-gray-800">Short</div>
                                    <div className="text-[9px] text-gray-400 font-medium">Short-form, vertical video content</div>
                                 </div>
                              </button>
                           </div>
                        )}
                     </div>
                     <button className="w-8 h-8 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all cursor-pointer">
                        <Plus size={16} />
                     </button>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                     <FileText size={16} />
                     <span className="text-[11px] font-bold uppercase tracking-widest">Notes</span>
                  </button>
              </div>

               {/* Text Area Card */}
              <div className="border border-gray-200 rounded-[24px] overflow-hidden focus-within:border-black transition-all shadow-sm bg-white relative">
                  <input type="file" ref={fileInputRef} accept="video/*" onChange={handleVideoChange} className="hidden" />
                  <textarea ref={textareaRef} 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full p-6 text-sm font-medium leading-relaxed outline-none min-h-[350px] resize-none"
                    placeholder="What's on your mind?"
                  />
                  {(videoFile || uploadedVideoPath) && (
                     <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
                       <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                         <Youtube className="text-red-500 fill-red-500" size={16} />
                         <span className="truncate max-w-[300px]">{videoFile ? videoFile.name : uploadedVideoPath.split('/').pop()}</span>
                         {videoFile && <span className="text-[10px] text-gray-400 font-semibold uppercase">({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>}
                         {isUploadingVideo && <span className="text-[10px] text-blue-500 animate-pulse font-bold uppercase">(Uploading...)</span>}
                       </div>
                       <button onClick={handleRemoveVideo} className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer">Remove</button>
                     </div>
                   )}
                  <div className="px-6 py-4 flex items-center justify-between bg-white border-t border-gray-50">
                     <div className="flex items-center gap-5">
                        {/* Media Button */}
                        <div className="relative">
                          <button 
                            onClick={() => setActivePopover(activePopover === 'media' ? null : 'media')}
                            className={`text-gray-400 hover:text-black transition-colors relative p-1.5 rounded-lg cursor-pointer ${activePopover === 'media' ? 'bg-gray-100 text-black' : ''}`}
                          >
                             <ImageIcon size={18} />
                             <Plus size={8} className="absolute -top-0.5 -right-0.5 bg-white rounded-full border border-gray-200" strokeWidth={4} />
                          </button>
                          {activePopover === 'media' && (
                            <MediaDropdown 
                              onClose={() => setActivePopover(null)} 
                              onSelectVideo={() => fileInputRef.current?.click()} 
                              onSelectDrive={() => setIsDriveModalOpen(true)}
                            />
                          )}
                        </div>

                        {/* Emoji Button */}
                        <div className="relative">
                          <button 
                            onClick={() => setActivePopover(activePopover === 'emoji' ? null : 'emoji')}
                            className={`text-gray-400 hover:text-black transition-colors p-1.5 rounded-lg cursor-pointer ${activePopover === 'emoji' ? 'bg-gray-100 text-black' : ''}`}
                          >
                            <Smile size={18} />
                          </button>
                          {activePopover === 'emoji' && (
                            <EmojiPickerPopover 
                              onSelectEmoji={(emoji) => {
                                insertAtCursor(emoji);
                                setActivePopover(null);
                              }}
                              onClose={() => setActivePopover(null)}
                            />
                          )}
                        </div>

                        {/* Message Button (First Comment Modal) */}
                        <button 
                          onClick={() => setShowFirstCommentModal(true)}
                          className={`text-gray-400 hover:text-black transition-colors p-1.5 rounded-lg cursor-pointer ${youtubeFirstComment || globalFirstComment ? 'text-black bg-purple-50' : ''}`}
                        >
                          <MessageSquare size={18} />
                        </button>

                        {/* Campaign URL Link Button */}
                        <div className="relative">
                          <button 
                            onClick={() => setActivePopover(activePopover === 'utm' ? null : 'utm')}
                            className={`text-gray-400 hover:text-black transition-colors p-1.5 rounded-lg cursor-pointer ${activePopover === 'utm' ? 'bg-gray-100 text-black' : ''}`}
                          >
                            <Link2 size={18} />
                          </button>
                          {activePopover === 'utm' && (
                            <UTMGeneratorPopover 
                              onAddUrl={(utmUrl) => {
                                insertAtCursor(utmUrl);
                                setActivePopover(null);
                              }}
                              onClose={() => setActivePopover(null)}
                            />
                          )}
                        </div>

                        {/* Other Static Buttons */}
                        <button className="text-gray-400 hover:text-black transition-colors p-1.5 rounded-lg cursor-pointer"><Languages size={18} /></button>
                        <button className="text-gray-400 hover:text-black transition-colors p-1.5 rounded-lg cursor-pointer"><FileText size={18} /></button>
                     </div>
                     <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input 
                             type="checkbox" 
                             checked={isLibrary}
                             onChange={(e) => setIsLibrary(e.target.checked)}
                             className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" 
                           />
                           <span className="text-[10px] font-bold text-gray-400 group-hover:text-black transition-colors uppercase tracking-widest">Add to library</span>
                        </label>
                        <div className="w-px h-4 bg-gray-200" />
                        <div className="group relative">
                           <span className="text-[10px] font-bold text-gray-300 group-hover:text-gray-500 transition-colors uppercase tracking-widest">{caption.length} / 5000</span>
                           <div className="absolute bottom-full right-0 mb-4 w-64 p-3 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block animate-in fade-in slide-in-from-bottom-2 z-50">
                              <p className="text-[10px] text-gray-500 leading-tight">Limited by the network with less character length support.</p>
                           </div>
                        </div>
                        <div className="w-5 h-5 rounded bg-[#FF0000] flex items-center justify-center">
                           <Youtube size={10} className="text-white fill-white" />
                        </div>
                     </div>
                  </div>
              </div>

              {/* Presets Accordion */}
              <div className="space-y-3">
                 {/* Global Presets Accordion */}
                 <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm transition-all duration-300">
                    <div 
                      onClick={() => setGlobalOpen(!globalOpen)}
                      className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-all cursor-pointer group"
                    >
                       <div className="flex items-center gap-3">
                          <Settings size={18} className="text-gray-400 group-hover:text-black transition-colors" />
                          <span className="text-[12px] font-bold text-gray-700">Global presets</span>
                          <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#065F46] rounded-lg text-[9px] font-bold">New</span>
                       </div>
                       <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${globalOpen ? 'rotate-180 text-black' : ''}`} />
                    </div>
                    
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${globalOpen ? 'max-h-[300px] border-t border-gray-50 p-6' : 'max-h-0'}`}>
                       <div className="space-y-4">
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">First Comment</label>
                             <textarea 
                               value={globalFirstComment}
                               onChange={(e) => setGlobalFirstComment(e.target.value)}
                               placeholder="Write a comment to be posted automatically right after publishing..."
                               className="w-full p-4 border border-gray-200 rounded-2xl text-xs font-medium focus:border-black outline-none resize-none h-20"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* YouTube Presets Accordion */}
                 <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm transition-all duration-300">
                    <div 
                      onClick={() => setYoutubeOpen(!youtubeOpen)}
                      className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-all cursor-pointer group"
                    >
                       <div className="flex items-center gap-3">
                          <Youtube size={18} className="text-[#FF0000]" />
                          <span className="text-[12px] font-bold text-gray-700">YouTube presets</span>
                       </div>
                       <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${youtubeOpen ? 'rotate-180 text-black' : ''}`} />
                    </div>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${youtubeOpen ? 'max-h-[800px] border-t border-gray-50 p-6' : 'max-h-0'}`}>
                       <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-left">
                          
                          {/* Video or Short Title */}
                          <div>
                             <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Video or short title</label>
                             <div className="relative">
                                <input 
                                  type="text"
                                  maxLength={100}
                                  value={youtubeTitle}
                                  onChange={(e) => setYoutubeTitle(e.target.value)}
                                  placeholder="Enter video title..."
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:border-black outline-none"
                                />
                                <span className="block text-right text-[9px] font-bold text-gray-300 mt-1.5 uppercase tracking-widest">
                                   {youtubeTitle.length} / 100
                                </span>
                             </div>
                          </div>

                          {/* Audience configuration */}
                          <div>
                             <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Audience configuration</label>
                             <div className="relative">
                                <select 
                                  value={youtubeMadeForKids ? "true" : "false"}
                                  onChange={(e) => setYoutubeMadeForKids(e.target.value === "true")}
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:border-black outline-none appearance-none cursor-pointer"
                                >
                                   <option value="false">No, it's not made for kids</option>
                                   <option value="true">Yes, it's made for kids</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                             </div>
                          </div>

                          {/* Privacy configuration */}
                          <div>
                             <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Privacy configuration</label>
                             <div className="relative">
                                <select 
                                  value={youtubePrivacy}
                                  onChange={(e) => setYoutubePrivacy(e.target.value)}
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:border-black outline-none appearance-none cursor-pointer"
                                >
                                   <option value="public">Public</option>
                                   <option value="unlisted">Unlisted</option>
                                   <option value="private">Private</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                             </div>
                             <p className="text-[10px] text-gray-400 mt-2 font-medium leading-normal">
                                Privacy status configuration can be modified in YouTube after publishing the video or short.
                             </p>
                          </div>

                          {/* Category */}
                          <div>
                             <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Category</label>
                             <div className="relative">
                                <select 
                                  value={youtubeCategory}
                                  onChange={(e) => setYoutubeCategory(e.target.value)}
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:border-black outline-none appearance-none cursor-pointer"
                                >
                                   <option value="22">People & Blogs</option>
                                   <option value="20">Gaming</option>
                                   <option value="27">Education</option>
                                   <option value="24">Entertainment</option>
                                   <option value="28">Science & Technology</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                             </div>
                          </div>

                          {/* Add to playlist */}
                          <div>
                             <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Add to playlist</label>
                             <div className="flex gap-2">
                                <div className="relative flex-1">
                                   <select 
                                     value={youtubePlaylistId}
                                     onChange={(e) => setYoutubePlaylistId(e.target.value)}
                                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:border-black outline-none appearance-none cursor-pointer"
                                   >
                                      <option value="">Select playlist...</option>
                                      {playlists.map(pl => (
                                        <option key={pl.id} value={pl.id}>{pl.title}</option>
                                      ))}
                                   </select>
                                   <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => fetchPlaylists(true)}
                                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 text-gray-500 hover:text-black transition-all flex items-center justify-center shrink-0 cursor-pointer"
                                >
                                   <RotateCw size={14} className={isLoadingPlaylists ? "animate-spin" : ""} />
                                </button>
                             </div>
                          </div>

                          {/* Tags */}
                          <div>
                             <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Tags</label>
                             <div className="flex gap-2">
                                <input 
                                  type="text"
                                  value={youtubeTags}
                                  onChange={(e) => setYoutubeTags(e.target.value)}
                                  placeholder="Enter tags (comma separated)..."
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-semibold focus:border-black outline-none"
                                />
                                <button 
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(youtubeTags);
                                    toast.success("Tags copied to clipboard");
                                  }}
                                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 text-gray-500 hover:text-black transition-all flex items-center justify-center shrink-0 cursor-pointer"
                                >
                                   <Copy size={14} />
                                </button>
                             </div>
                          </div>

                          {/* First Comment inside YT presets */}
                          <div className="col-span-2">
                             <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">First Comment (Auto post after publishing)</label>
                             <textarea 
                               value={youtubeFirstComment}
                               onChange={(e) => setYoutubeFirstComment(e.target.value)}
                               placeholder="Write a comment to be posted automatically right after publishing..."
                               className="w-full p-4 border border-gray-200 rounded-2xl text-xs font-semibold focus:border-black outline-none resize-none h-16"
                             />
                          </div>

                       </div>
                    </div>
                 </div>
              </div>

              {/* Composition Footer */}
              <div className="pt-4 flex items-center justify-between">
                 <button onClick={closePostCreator} className="px-6 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-black transition-all cursor-pointer">Cancel</button>
                 
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-2.5 hover:bg-gray-50 transition-all relative">
                        <Calendar size={18} className="text-gray-400" />
                        <input 
                          type="datetime-local" 
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="text-[11px] font-bold text-gray-600 uppercase tracking-widest outline-none bg-transparent cursor-pointer border-none p-0"
                        />
                     </div>
                    
                    <div className="flex items-center">
                       <button 
                         onClick={handleCreatePost}
                         disabled={isCreating}
                         className="px-8 py-3 bg-[#0A0A0A] text-white rounded-l-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 cursor-pointer"
                       >
                          {isCreating ? <Loader2 size={16} className="animate-spin" /> : currentOption.label.split(' ')[0]}
                       </button>
                       <div className="relative">
                          <button onClick={() => setShowPublishMenu(!showPublishMenu)} className="px-3 py-3 bg-[#2D1D35] text-white rounded-r-2xl border-l border-white/10 hover:bg-[#1E1B4B] transition-all cursor-pointer">
                             <ChevronDown size={18} />
                          </button>
                          {showPublishMenu && (
                             <div className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-3 z-50 animate-in slide-in-from-bottom-2">
                                {PUBLISH_OPTIONS.map((opt) => (
                                   <button key={opt.id} onClick={() => { setSelectedPublishId(opt.id); setShowPublishMenu(false); }} className={`w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all text-left cursor-pointer ${selectedPublishId === opt.id ? 'bg-gray-50' : ''}`}>
                                      <div>
                                         <div className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{opt.label}</div>
                                         <div className="text-[9px] text-gray-400 font-bold">{opt.sub}</div>
                                      </div>
                                   </button>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="flex-[0.8] flex flex-col bg-[#F3F4F6]">
           {/* Preview Toolbar */}
           <div className="p-6 flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                 <Youtube className="text-[#FF0000] fill-[#FF0000]" size={20} />
              </div>
              <div className="flex gap-2 bg-white/50 p-1 rounded-2xl backdrop-blur-md">
                 <button onClick={() => setPreviewDevice("mobile")} className={`p-2 rounded-xl transition-all cursor-pointer ${previewDevice === 'mobile' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}><Smartphone size={18} /></button>
                 <button onClick={() => setPreviewDevice("desktop")} className={`p-2 rounded-xl transition-all cursor-pointer ${previewDevice === 'desktop' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}><Monitor size={18} /></button>
              </div>
           </div>

           {/* Preview Body */}
           <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
              <div className="w-full max-w-sm">
                 {PreviewComponent && (
                   <PreviewComponent 
                      caption={caption} 
                      videoFileUrl={videoFileUrl} 
                      youtubeType={youtubeType}
                      youtubeTitle={youtubeTitle}
                      youtubePlaylistId={youtubePlaylistId}
                      playlists={playlists}
                      youtubeTags={youtubeTags}
                      youtubeFirstComment={youtubeFirstComment}
                      globalFirstComment={globalFirstComment}
                      previewDevice={previewDevice}
                    />
                 )}
              </div>
              <p className="text-[10px] text-gray-400 text-center max-w-[280px] leading-normal font-medium uppercase tracking-tight">
                  YouTube descriptions and setup parameters are fully simulated and will be included in your post
               </p>
           </div>

           {/* Preview Disclaimer Card */}
           <div className="p-8">
              <div className="bg-[#E0F2FE] border border-[#BAE6FD] rounded-3xl p-5 flex items-start gap-4">
                 <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500">
                    <Info size={20} />
                 </div>
                 <p className="text-[13px] text-blue-900 leading-relaxed font-medium">
                    Previews are an approximation of how your post will look when published. The final post may look slightly different.
                 </p>
              </div>
           </div>
        {showFirstCommentModal && (
          <FirstCommentModal 
            value={youtubeFirstComment || globalFirstComment}
            onAccept={(comment) => {
              setYoutubeFirstComment(comment);
              setGlobalFirstComment(comment);
              setShowFirstCommentModal(false);
              toast.success("First comment set successfully");
            }}
            onCancel={() => setShowFirstCommentModal(false)}
          />
        )}
        <GoogleDrivePickerModal 
          isOpen={isDriveModalOpen}
          onClose={() => setIsDriveModalOpen(false)}
          activeBrand={activeBrand}
          onSelectFile={handleSelectDriveFile}
        />
        </div>
      </div>
    </div>
  );
}
