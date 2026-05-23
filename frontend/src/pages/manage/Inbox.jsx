import { useState, useEffect } from "react";
import { Search, Edit3, Send, CheckCircle, XCircle, MoreHorizontal, Loader2 } from "lucide-react";
import { useFilters } from "../../hooks/useFilters";
import { useDebounce } from "../../hooks/useDebounce";
import apiService from "../../services/api";
import { toast } from "sonner";

const PLATFORM_COLORS = {
  YouTube: "#FF0000", Facebook: "#1877F2", TikTok: "#010101",
  Instagram: "#E1306C", Twitch: "#9146FF", LinkedIn: "#0A66C2", X: "#000000" };

export function InboxPage() {
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    tab: "All",
    platform: "All",
    search: ""
  });

  const tabFilter = filters.tab || "All";
  const platformFilter = filters.platform || "All";
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [inboxData, setInboxData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);
  const [activeConv, setActiveConv] = useState(null);
  const [thread, setThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState("open");

  // Sync debounced search to URL params
  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // Sync input value back
  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  // Fetch conversations
  useEffect(() => {
    const fetchInbox = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/inbox?${searchParamsString}`);
        setInboxData(response.data);
        
        // Auto-select first conversation if none selected
        if (response.data.data?.length > 0 && !activeConv) {
          setActiveConv(response.data.data[0]);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load inbox");
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [searchParamsString]);

  // Fetch thread for active conversation
  useEffect(() => {
    if (!activeConv) return;

    const fetchThread = async () => {
      setThreadLoading(true);
      try {
        const response = await apiService.get(`/inbox/${activeConv.id}`);
        setThread(response.data.thread);
        setStatus(activeConv.status || "open");
      } catch (error) {
        toast.error("Failed to load message thread");
      } finally {
        setThreadLoading(false);
      }
    };

    fetchThread();
  }, [activeConv?.id]);

  const conversations = inboxData.data || [];

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#F8F8F7" }}>
      {/* Left – Conversation List */}
      <div style={{ width: 280, background: "#F8F8F7", borderRight: "0.5px solid #E5E7EB", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#FFF", borderBottom: "0.5px solid #E5E7EB" }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", flex: 1 }}>Inbox</span>
          <button style={{ color: "#6B7280", cursor: "pointer", background: "none", border: "none" }}>
            <Edit3 size={14} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex overflow-x-auto px-3 py-2 gap-1" style={{ borderBottom: "0.5px solid #E5E7EB", background: "#FFF" }}>
          {["All", "Unread", "Comments", "DMs", "Mentions"].map((t) => (
            <button
              key={t}
              onClick={() => updateFilters({ tab: t })}
              className="cursor-pointer whitespace-nowrap"
              style={{
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: 10,
                background: tabFilter === t ? "#0A0A0A" : "transparent",
                color: tabFilter === t ? "#FFF" : "#6B7280",
                border: tabFilter === t ? "none" : "0.5px solid #E5E7EB" }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Platform filters */}
        <div className="flex gap-1.5 px-3 py-2" style={{ borderBottom: "0.5px solid #E5E7EB", background: "#FFF" }}>
          {["All", "YouTube", "Facebook", "Instagram", "TikTok", "X"].map((p) => (
            <button
              key={p}
              onClick={() => updateFilters({ platform: p })}
              style={{
                width: p === "All" ? "auto" : 22,
                height: 22,
                borderRadius: "50%",
                background: platformFilter === p ? (p === "All" ? "#0A0A0A" : PLATFORM_COLORS[p]) : "#F3F4F6",
                color: platformFilter === p ? "#FFF" : "#6B7280",
                fontSize: p === "All" ? 9 : 8,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                padding: p === "All" ? "0 6px" : 0 }}
            >
              {p === "All" ? "All" : p.slice(0, 2).toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative px-3 py-2" style={{ background: "#FFF", borderBottom: "0.5px solid #E5E7EB" }}>
          <Search size={11} style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "5px 8px 5px 24px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, outline: "none" }}
          />
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-gray-300" size={20} />
             </div>
          ) : conversations.length === 0 ? (
             <div className="text-center py-10 text-[11px] text-gray-400 uppercase tracking-widest font-bold">No results</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full text-left"
                onClick={() => setActiveConv(conv)}
                style={{
                  padding: "10px 12px",
                  borderBottom: "0.5px solid #F0F0EF",
                  borderLeft: `3px solid ${activeConv?.id === conv.id ? PLATFORM_COLORS[conv.platform] || "#0A0A0A" : "transparent"}`,
                  background: activeConv?.id === conv.id ? "#EEF" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8 }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#FFF", flexShrink: 0, overflow: 'hidden' }}>
                  {conv.avatar && conv.avatar.length > 2 ? <img src={conv.avatar} alt="" className="w-full h-full object-cover" /> : (conv.avatar || conv.user.charAt(0))}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 12, fontWeight: conv.unread ? 600 : 400, color: "#0A0A0A" }}>{conv.user}</span>
                    <span style={{ fontSize: 9, color: "#9CA3AF" }}>{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span style={{ fontSize: 11, color: "#9CA3AF", flex: 1 }} className="truncate">{conv.preview}</span>
                    {conv.unread && (
                      <span style={{ background: "#0A0A0A", color: "#FFF", fontSize: 9, borderRadius: 9999, padding: "1px 5px", flexShrink: 0 }}>
                        ●
                      </span>
                    )}
                  </div>
                  {conv.assigned && (
                    <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, background: "#F3F4F6", color: "#6B7280", marginTop: 2, display: "inline-block" }}>
                      {conv.assigned}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Center – Thread */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "#FFF" }}>
        {!activeConv ? (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center">
                 <Send size={32} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest">Select a conversation to start</span>
           </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
              <div
                style={{ width: 8, height: 8, borderRadius: "50%", background: PLATFORM_COLORS[activeConv.platform] || "#0A0A0A", flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>{activeConv.user}</span>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>via {activeConv.platform}</span>
              <button style={{ marginLeft: "auto", fontSize: 11, color: "#2563EB", cursor: "pointer", background: "none", border: "none" }}>
                Open in {activeConv.platform} ↗
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {threadLoading ? (
                 <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-200" size={32} />
                 </div>
              ) : (
                thread.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                    {msg.from === "them" && (
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, color: "#FFF", marginRight: 8, flexShrink: 0, overflow: 'hidden' }}>
                        {msg.avatar ? <img src={msg.avatar} alt="" className="w-full h-full object-cover" /> : msg.author.charAt(0)}
                      </div>
                    )}
                    <div style={{ maxWidth: "70%" }}>
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: msg.from === "me" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                          background: msg.from === "me" ? "#0A0A0A" : "#F3F4F6",
                          color: msg.from === "me" ? "#FFF" : "#0A0A0A",
                          fontSize: 12,
                          lineHeight: 1.5 }}
                      >
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2, textAlign: msg.from === "me" ? "right" : "left" }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick replies */}
            <div className="flex gap-2 px-5 pb-2">
              {["Thank you! 🙏", "Please DM us 📩", "We'll check this!"].map((qr) => (
                <button
                  key={qr}
                  onClick={() => setReplyText(qr)}
                  style={{ padding: "4px 10px", borderRadius: 9999, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#6B7280", cursor: "pointer", background: "#FFF", whiteSpace: "nowrap" }}
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Reply composer */}
            <div className="flex items-center gap-2 px-5 py-3" style={{ borderTop: "0.5px solid #E5E7EB" }}>
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1"
                style={{ padding: "8px 12px", borderRadius: 8, border: "0.5px solid #E5E7EB", fontSize: 12, outline: "none" }}
              />
              <button
                style={{ padding: "8px 14px", borderRadius: 8, background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Send size={12} /> Reply
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right – Details */}
      {activeConv && (
        <div style={{ width: 260, background: "#FFF", borderLeft: "0.5px solid #E5E7EB", padding: 16, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flexShrink: 0 }}>
          {/* Contact */}
          <div className="flex flex-col items-center gap-2 py-3" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#FFF", overflow: 'hidden' }}>
              {activeConv.avatar && activeConv.avatar.length > 2 ? <img src={activeConv.avatar} alt="" className="w-full h-full object-cover" /> : activeConv.user.charAt(0)}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>{activeConv.user}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>via {activeConv.platform}</div>
            </div>
          </div>

          {/* Assign */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Assign to</div>
            <select style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "0.5px solid #E5E7EB", fontSize: 11, outline: "none", cursor: "pointer" }}>
              <option>Unassigned</option>
              <option selected>Me</option>
              <option>Sarah (Admin)</option>
              <option>Maria (Editor)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Status</div>
            <div className="flex gap-1">
              {(["open", "resolved", "spam"]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="cursor-pointer capitalize flex-1"
                  style={{
                    padding: "5px 0",
                    borderRadius: 6,
                    fontSize: 11,
                    background: status === s ? "#0A0A0A" : "transparent",
                    color: status === s ? "#FFF" : "#6B7280",
                    border: "0.5px solid #E5E7EB" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Tags</div>
            <div className="flex flex-wrap gap-1">
              <button style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "0.5px dashed #E5E7EB", color: "#9CA3AF", cursor: "pointer", background: "transparent" }}>
                + Add Tag
              </button>
            </div>
          </div>

          <button
            style={{ width: "100%", padding: "7px 0", borderRadius: 8, border: "0.5px solid #BBF7D0", fontSize: 12, color: "#16A34A", cursor: "pointer", background: "#F0FDF4" }}
          >
            ✓ Mark Resolved
          </button>
        </div>
      )}
    </div>
  );
}
