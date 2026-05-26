import { useState, useEffect } from "react";
import { 
  Search, RefreshCw, Youtube, Facebook, Instagram, Filter, MoreHorizontal, 
  Loader2, MessageSquare, AlertCircle, EyeOff, CheckCircle, ExternalLink, Check
} from "lucide-react";
import { useFilters } from "../../hooks/useFilters";
import { useDebounce } from "../../hooks/useDebounce";
import apiService from "../../services/api";
import brandService from "../../services/brand.service";
import { toast } from "sonner";

// SOLID Components
import { ConversationItem, SafeAvatar } from "../../components/inbox/ConversationItem";
import { VideoContextCard } from "../../components/inbox/VideoContextCard";
import { ReplyComposer } from "../../components/inbox/ReplyComposer";

export function InboxPage() {
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    tab: "Unresolved",
    platform: "YouTube",
    search: ""
  });

  const tabFilter = filters.tab || "Unresolved";
  const platformFilter = filters.platform || "YouTube";
  const currentPage = parseInt(filters.page || "1", 10);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [inboxData, setInboxData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);
  const [activeConv, setActiveConv] = useState(null);
  const [thread, setThread] = useState([]);
  const [videoContext, setVideoContext] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeBrand, setActiveBrand] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Load Active Brand
  useEffect(() => {
    const loadBrand = async () => {
      try {
        const res = await brandService.getBrands();
        if (res.data?.length > 0) setActiveBrand(res.data[0]);
      } catch (e) {
        console.error("Failed to load brands:", e);
      }
    };
    loadBrand();
  }, []);

  // Sync debounced search
  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  // Fetch conversations
  const fetchInbox = async () => {
    if (!activeBrand) return;
    setLoading(true);
    try {
      const response = await apiService.get(`/inbox?brandId=${activeBrand.id}&${searchParamsString}`);
      setInboxData(response.data);
    } catch (error) {
      console.error("Inbox load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, [searchParamsString, activeBrand]);

  // Fetch thread for active conversation
  const fetchThread = async () => {
    if (!activeConv) return;
    setThreadLoading(true);
    setVideoContext(null);
    try {
      const response = await apiService.get(`/inbox/${activeConv.id}`);
      setThread(response.data.thread);
      setVideoContext(response.data.videoContext);

      if (activeConv.unread) {
        handleUpdateStatus(activeConv.id, 'READ');
      }
    } catch (error) {
      toast.error("Failed to load message thread");
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [activeConv?.id]);

  const handleSync = async () => {
    if (!activeBrand) return;
    setIsSyncing(true);
    try {
      const platform = platformFilter.toUpperCase();
      await apiService.post('/inbox/sync', { brandId: activeBrand.id, platform });
      toast.success("Inbox synced successfully");
      await fetchInbox();
      if (activeConv) {
        await fetchThread();
      }
    } catch (e) {
      toast.error("Sync failed: " + (e.response?.data?.message || e.message));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      await apiService.patch(`/inbox/${itemId}/status`, { status: newStatus });
      setInboxData(prev => ({
        ...prev,
        data: prev.data.map(item => 
          item.id === itemId ? { ...item, status: newStatus.toLowerCase(), unread: newStatus === 'UNREAD' } : item
        )
      }));
      if (activeConv?.id === itemId) {
        setActiveConv(prev => ({ ...prev, status: newStatus.toLowerCase(), unread: newStatus === 'UNREAD' }));
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleReply = async () => {
    if (!replyText || !activeConv || !activeBrand) return;
    setIsReplying(true);
    try {
      await apiService.post('/inbox/reply', {
        brandId: activeBrand.id,
        itemId: activeConv.id,
        text: replyText
      });
      toast.success("Reply sent");
      setReplyText("");
      await fetchThread();
      await fetchInbox();
    } catch (e) {
      toast.error("Failed to send reply: " + (e.response?.data?.message || e.message));
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="h-[calc(100vh-70px)] w-full flex overflow-hidden bg-[#F8F8F7] p-4 gap-4">
      {/* Sidebar (List) */}
      <div className="w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between gap-4 relative border-b border-gray-50">
            <div className="flex gap-2">
              <button
                onClick={() => updateFilters({ platform: "YouTube" })}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  platformFilter.toLowerCase() === "youtube"
                    ? "bg-red-50 border border-red-100 shadow-sm"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                <Youtube className="text-[#FF0000] fill-[#FF0000]" size={20} />
              </button>
              <button
                onClick={() => updateFilters({ platform: "Facebook" })}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  platformFilter.toLowerCase() === "facebook"
                    ? "bg-blue-50 border border-blue-100 shadow-sm"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                <Facebook className="text-[#1877F2] fill-[#1877F2]" size={20} />
              </button>
              <button
                onClick={() => updateFilters({ platform: "Instagram" })}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  platformFilter.toLowerCase() === "instagram"
                    ? "bg-pink-50 border border-pink-100 shadow-sm"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                <Instagram className="text-[#E1306C]" size={20} />
              </button>
            </div>
           <div className="flex items-center gap-2">
             <button onClick={handleSync} disabled={isSyncing} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400"><RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} /></button>
             <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xl font-light">+</button>
           </div>
        </div>

        <div className="p-4 flex gap-2">
           <div className="relative flex-1 group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" placeholder="Search conversation..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none" />
           </div>
            <div className="relative">
              <button 
                onClick={() => setIsFilterMenuOpen(prev => !prev)}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors ${
                  isFilterMenuOpen || filters.type ? "border-black bg-gray-50" : "border-gray-200"
                }`}
              >
                <Filter size={18} />
              </button>
              
              {isFilterMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setIsFilterMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl py-2.5 z-50 text-left animate-in fade-in slide-in-from-top-3 duration-200 font-medium">
                    <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Filter by type
                    </div>
                    
                    <button
                      onClick={() => {
                        updateFilters({ type: null });
                        setIsFilterMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-xs font-bold text-[#0A0A0A] hover:bg-[#F8F8F7] flex items-center justify-between cursor-pointer border-none bg-transparent"
                    >
                      <span>All messages</span>
                      {(!filters.type || filters.type === 'all') && <Check size={12} className="text-green-500" />}
                    </button>

                    <button
                      onClick={() => {
                        updateFilters({ type: "DIRECT_MESSAGE" });
                        setIsFilterMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-xs font-bold text-[#0A0A0A] hover:bg-[#F8F8F7] flex items-center justify-between cursor-pointer border-none bg-transparent"
                    >
                      <span>Private messages</span>
                      <div className="flex items-center gap-1.5">
                        <Facebook className="text-[#1877F2] fill-[#1877F2]" size={14} />
                        <Instagram className="text-[#E1306C]" size={14} />
                        {filters.type === "DIRECT_MESSAGE" && <Check size={12} className="text-green-500 ml-1" />}
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        updateFilters({ type: "COMMENT" });
                        setIsFilterMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-xs font-bold text-[#0A0A0A] hover:bg-[#F8F8F7] flex items-center justify-between cursor-pointer border-none bg-transparent"
                    >
                      <span>Comments</span>
                      <div className="flex items-center gap-1.5">
                        <Facebook className="text-[#1877F2] fill-[#1877F2]" size={14} />
                        <Youtube className="text-[#FF0000] fill-[#FF0000]" size={14} />
                        <Instagram className="text-[#E1306C]" size={14} />
                        {filters.type === "COMMENT" && <Check size={12} className="text-green-500 ml-1" />}
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
        </div>

        <div className="flex px-2 border-b border-gray-50">
           {["Unresolved", "Unread", "All"].map(t => (
             <button key={t} onClick={() => updateFilters({ tab: t })} className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest relative ${tabFilter === t ? "text-black" : "text-gray-400"}`}>
               {t}
               {tabFilter === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
             </button>
           ))}
           <button className="px-4 text-gray-300 hover:text-gray-600"><MoreHorizontal size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
           {loading ? (
             <div className="h-40 flex flex-col items-center justify-center gap-3"><Loader2 className="animate-spin text-gray-200" size={32} /></div>
           ) : inboxData.data?.length === 0 ? (
             <div className="p-12 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200"><MessageSquare size={32} /></div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">No {tabFilter.toLowerCase()} conversations found.</p>
             </div>
           ) : (
             inboxData.data.map(conv => (
               <ConversationItem key={conv.id} conv={conv} activeConv={activeConv} onSelect={setActiveConv} onUpdateStatus={handleUpdateStatus} />
             ))
           )}
        </div>

        {/* Pagination Footer */}
        {inboxData.meta && inboxData.meta.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between bg-white text-[11px] font-bold text-gray-500">
            <button
              onClick={() => updateFilters({ page: currentPage - 1 })}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-gray-100 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {inboxData.meta.totalPages}
            </span>
            <button
              onClick={() => updateFilters({ page: currentPage + 1 })}
              disabled={currentPage >= inboxData.meta.totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-gray-100 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Main Content (Thread) */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
         {!activeConv ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
              <div className="relative mb-8">
                 <div className="w-64 h-64 bg-[#F8F8F7] rounded-[60px] rotate-12 flex items-center justify-center">
                    <div className="w-48 h-48 bg-white rounded-[50px] -rotate-12 flex items-center justify-center border border-gray-50 shadow-sm">
                       <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200"><AlertCircle size={48} strokeWidth={1.5} /></div>
                    </div>
                 </div>
              </div>
              <h3 className="text-[15px] font-bold text-gray-400 uppercase tracking-[0.1em]">Please select a conversation on the left to begin</h3>
           </div>
         ) : (
           <>
             <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                   <div className="relative shrink-0 w-10 h-10">
                      {activeConv.participants?.length > 1 ? (
                        <>
                           <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-50 absolute top-0 left-0 z-10 flex">
                              <SafeAvatar src={activeConv.participants[0].avatar} name={activeConv.participants[0].name} className="w-full h-full object-cover" />
                           </div>
                           <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm bg-[#4A3AFF] absolute bottom-0 right-0 z-0 flex items-center justify-center text-[8px] font-bold text-white">
                              <SafeAvatar src={activeConv.participants[1].avatar} name={activeConv.participants[1].name} className="w-full h-full object-cover" />
                           </div>
                        </>
                      ) : (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex">
                           <SafeAvatar src={activeConv.avatar} name={activeConv.user} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm z-20">
                         {activeConv.platform?.toLowerCase() === "facebook" ? (
                           <Facebook className="text-[#1877F2] fill-[#1877F2]" size={8} />
                         ) : activeConv.platform?.toLowerCase() === "instagram" ? (
                           <Instagram className="text-[#E1306C]" size={8} />
                         ) : (
                           <Youtube className="text-[#FF0000] fill-[#FF0000]" size={8} />
                         )}
                      </div>
                   </div>
                   <div>
                      <h4 className="text-[13px] font-bold text-[#0A0A0A]">{activeConv.user}</h4>
                      <div className="flex items-center gap-1"><MessageSquare className="text-gray-400" size={10} /><span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{activeConv.type === 'direct_message' ? 'PRIVATE MESSAGE' : 'COMMENT'}</span></div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => handleUpdateStatus(activeConv.id, activeConv.unread ? 'READ' : 'UNREAD')} className={`p-2 transition-colors ${activeConv.unread ? "text-black" : "text-gray-300 hover:text-gray-500"}`}><EyeOff size={18} /></button>
                   <button onClick={() => handleUpdateStatus(activeConv.id, 'RESOLVED')} className={`p-2 transition-colors ${activeConv.status === 'resolved' ? "text-green-500" : "text-gray-300 hover:text-green-500"}`}><CheckCircle size={18} /></button>
                   <div className="w-px h-4 bg-gray-100 mx-1" />
                   {videoContext && (
                     <a href={`https://www.youtube.com/watch?v=${videoContext.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-all"><ExternalLink size={16} /></a>
                   )}
                </div>
             </div>
 
             <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 scrollbar-thin bg-[#FDFDFD]">
                {threadLoading ? (
                  <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-gray-100" size={40} /></div>
                ) : (
                  <>
                    <VideoContextCard videoContext={videoContext} />
                    <div className="flex flex-col gap-8">
                      {thread.map((msg, i) => (
                        <div key={i} className={`flex items-start gap-4 w-full ${msg.from === "me" ? "flex-row-reverse" : ""}`}>
                           <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-gray-50 flex items-center justify-center">
                              {msg.from === "me" ? (
                                <div className="w-full h-full bg-[#FF4F9A] flex items-center justify-center text-white text-[11px] font-bold">{activeBrand?.name?.charAt(0) || "C"}</div>
                              ) : (
                                <SafeAvatar src={msg.avatar} name={msg.author} className="w-full h-full object-cover" />
                              )}
                           </div>
                           <div className={`max-w-[70%] space-y-1.5 flex flex-col ${msg.from === "me" ? "items-end" : "items-start"}`}>
                              <div className={`px-5 py-3 text-[13px] leading-relaxed shadow-sm ${msg.from === "me" ? "bg-[#FEF3C7] text-[#92400E] rounded-2xl rounded-tr-none border border-[#FDE68A] self-end" : "bg-[#EEF2FF] text-[#1E1B4B] rounded-2xl rounded-tl-none border border-[#E0E7FF] self-start"}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
                              <div className={`flex items-center gap-1.5 px-1 ${msg.from === "me" ? "flex-row-reverse" : ""}`}>
                                 <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{msg.from === "me" ? "Manager" : msg.author}</span>
                                 <span className="text-[14px] text-gray-200 leading-none">·</span>
                                 <span className="text-[9px] font-bold text-gray-300 uppercase">{msg.time}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
             </div>

             <ReplyComposer replyText={replyText} setReplyText={setReplyText} onReply={handleReply} isReplying={isReplying} />
           </>
         )}
      </div>
    </div>
  );
}
