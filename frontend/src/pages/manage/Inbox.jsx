import { useState } from "react";
import { Search, Edit3, Send, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";

const PLATFORM_COLORS = {
  YouTube: "#FF0000", Facebook: "#1877F2", TikTok: "#010101",
  Instagram: "#E1306C", Twitch: "#9146FF", LinkedIn: "#0A66C2", X: "#000000" };

const conversations = [
  { id: 1, platform: "Instagram", user: "tech_fan99", avatar: "TF", preview: "Love your latest stream! When is the...", time: "2m", unread: 3, assigned: "Me" },
  { id: 2, platform: "YouTube", user: "coding_master", avatar: "CM", preview: "Can you make a tutorial on TypeScript?", time: "15m", unread: 1, assigned: null },
  { id: 3, platform: "Facebook", user: "hoa_nguyen", avatar: "HN", preview: "Cảm ơn anh đã chia sẻ! Rất hay ạ", time: "1h", unread: 0, assigned: "John" },
  { id: 4, platform: "X", user: "devjourney_x", avatar: "DX", preview: "Great content as always! 🔥", time: "2h", unread: 0, assigned: null },
  { id: 5, platform: "LinkedIn", user: "minh_professional", avatar: "MP", preview: "Hi, I'd like to collaborate with your team", time: "3h", unread: 0, assigned: "Me" },
  { id: 6, platform: "TikTok", user: "tiktok_creator", avatar: "TC", preview: "Your video went viral! Amazing 🚀", time: "5h", unread: 2, assigned: null },
  { id: 7, platform: "Instagram", user: "design_lover", avatar: "DL", preview: "Do you have design resources available?", time: "1d", unread: 0, assigned: null },
];

const threadMessages = [
  { from: "them", text: "Hi! Love your content. Quick question about your setup?", time: "14:18" },
  { from: "them", text: "Specifically wondering about your streaming software.", time: "14:19" },
  { from: "me", text: "Hey! Thanks for the kind words 😊 I use OBS Studio for streaming, it's free and super powerful!", time: "14:22" },
  { from: "them", text: "Awesome! Do you have any tutorial on getting started with it?", time: "14:23" },
  { from: "them", text: "Love your latest stream! When is the next one?", time: "14:25" },
];

export function InboxPage() {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [platformFilter, setPlatformFilter] = useState("All");
  const [tabFilter, setTabFilter] = useState("All");
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState("open");

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
              onClick={() => setTabFilter(t)}
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
              onClick={() => setPlatformFilter(p)}
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
            style={{ width: "100%", padding: "5px 8px 5px 24px", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, outline: "none" }}
          />
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full text-left"
              onClick={() => setActiveConv(conv)}
              style={{
                padding: "10px 12px",
                borderBottom: "0.5px solid #F0F0EF",
                borderLeft: `3px solid ${activeConv.id === conv.id ? PLATFORM_COLORS[conv.platform] : "transparent"}`,
                background: activeConv.id === conv.id ? "#EEF" : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-start",
                gap: 8 }}
              onMouseEnter={(e) => { if (activeConv.id !== conv.id) (e.currentTarget).style.background = "#F8F8F7"; }}
              onMouseLeave={(e) => { if (activeConv.id !== conv.id) (e.currentTarget).style.background = "transparent"; }}
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#374151", flexShrink: 0 }}>
                {conv.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, fontWeight: conv.unread ? 600 : 400, color: "#0A0A0A" }}>{conv.user}</span>
                  <span style={{ fontSize: 9, color: "#9CA3AF" }}>{conv.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span style={{ fontSize: 11, color: "#9CA3AF", flex: 1 }} className="truncate">{conv.preview}</span>
                  {conv.unread > 0 && (
                    <span style={{ background: "#0A0A0A", color: "#FFF", fontSize: 9, borderRadius: 9999, padding: "1px 5px", flexShrink: 0 }}>
                      {conv.unread}
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
          ))}
        </div>
      </div>

      {/* Center – Thread */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "#FFF" }}>
        {/* Thread header */}
        <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
          <div
            style={{ width: 8, height: 8, borderRadius: "50%", background: PLATFORM_COLORS[activeConv.platform], flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>{activeConv.user}</span>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>via {activeConv.platform}</span>
          <button style={{ marginLeft: "auto", fontSize: 11, color: "#2563EB", cursor: "pointer", background: "none", border: "none" }}>
            Open in {activeConv.platform} ↗
          </button>
        </div>

        {/* Post preview */}
        <div className="px-5 py-3" style={{ borderBottom: "0.5px solid #E5E7EB", background: "#FAFAFA" }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: 6, background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              🖼️
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A" }}>Tech Review Q2 2025</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>Published May 15, 2025</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {threadMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
              {msg.from === "them" && (
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, color: "#374151", marginRight: 8, flexShrink: 0 }}>
                  {activeConv.avatar}
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
          ))}
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
      </div>

      {/* Right – Details */}
      <div style={{ width: 260, background: "#FFF", borderLeft: "0.5px solid #E5E7EB", padding: 16, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flexShrink: 0 }}>
        {/* Contact */}
        <div className="flex flex-col items-center gap-2 py-3" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#374151" }}>
            {activeConv.avatar}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>{activeConv.user}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>via {activeConv.platform} · 12.4K followers</div>
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
            {["VIP", "Question"].map((tag) => (
              <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#F3F4F6", color: "#6B7280" }}>{tag}</span>
            ))}
            <button style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "0.5px dashed #E5E7EB", color: "#9CA3AF", cursor: "pointer", background: "transparent" }}>
              + Add
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Internal Notes</div>
          <textarea
            placeholder="Add a note (not visible to user)..."
            rows={3}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "0.5px solid #E5E7EB", fontSize: 11, resize: "none", outline: "none", fontFamily: "inherit" }}
          />
          <button style={{ width: "100%", marginTop: 4, padding: "5px 0", borderRadius: 6, border: "0.5px solid #E5E7EB", fontSize: 11, color: "#6B7280", cursor: "pointer", background: "transparent" }}>
            Add note
          </button>
        </div>

        <button
          style={{ width: "100%", padding: "7px 0", borderRadius: 8, border: "0.5px solid #BBF7D0", fontSize: 12, color: "#16A34A", cursor: "pointer", background: "#F0FDF4" }}
        >
          ✓ Mark Resolved
        </button>
      </div>
    </div>
  );
}
