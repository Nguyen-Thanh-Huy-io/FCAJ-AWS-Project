import { useState } from "react";
import { Send, Paperclip } from "lucide-react";

const quickPrompts = [
  { emoji: "✨", text: "Write a caption for my product launch" },
  { emoji: "🔁", text: "Repurpose my YouTube script to Instagram" },
  { emoji: "#", text: "Suggest hashtags for fitness content" },
  { emoji: "🎯", text: "Write 5 hook variations for TikTok" },
  { emoji: "📊", text: "Analyze my top-performing post style" },
  { emoji: "🌐", text: "Translate this caption to Vietnamese" },
];

const initialMessages = [
  {
    role: "ai",
    content: "Hi! I'm StreamHub AI, powered by Claude. I can help you write captions, suggest hashtags, repurpose content across platforms, and more. What would you like to create today?",
    timestamp: "2:30 PM",
  },
  {
    role: "user",
    content: "Write a caption for a product launch post for a new fitness app.",
    timestamp: "2:31 PM",
  },
  {
    role: "ai",
    content: `Here are 3 caption options for your fitness app launch:\n\n**Option 1 (Energetic):**\nThe wait is OVER. 🔥 Introducing [App Name] — your all-in-one fitness companion that adapts to YOUR goals, YOUR schedule, and YOUR lifestyle. Download it today. Link in bio.\n\n**Option 2 (Benefit-focused):**\nWhat if your fitness app actually understood you? [App Name] is here — personalized workouts, real-time coaching, and progress tracking that finally makes sense. Free download now open.\n\n**Option 3 (Community):**\nWe built something for you. 🙌 [App Name] — because fitness is better when it's personal. Join 10,000+ members already crushing their goals. Link in bio!`,
    timestamp: "2:31 PM",
  },
];

const platforms = ["Instagram", "Facebook", "TikTok", "LinkedIn"];
const tones = ["Professional", "Casual", "Funny", "Inspirational", "Urgent", "Educational"];

export function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("Casual");
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("Instagram");
  const [credits] = useState(847);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input, timestamp: "now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Great question! Based on your ${tone.toLowerCase()} tone preference, here's what I'd suggest:\n\nI'd tailor this content specifically for your audience. Let me generate a detailed response for you — this would include platform-specific optimizations, character limit considerations, and engagement hooks designed for maximum reach.\n\n*Note: This is a demo. Connect your Claude API key for full AI capabilities.*`,
          timestamp: "now",
        },
      ]);
    }, 1500);
  };

  return (
    <div className="p-6 h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>AI Assistant</h1>
          <p style={{ fontSize: 12, color: "#6B7280" }}>Generate captions, suggest hashtags, repurpose content across platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Clear chat</button>
          <div className="flex flex-col items-end gap-1">
            <span style={{ fontSize: 10, color: "#9CA3AF" }}>{credits} / 1000 credits</span>
            <div className="w-28 h-1.5 rounded-full bg-[#E5E7EB]">
              <div className="h-full bg-[#0A0A0A] rounded-full" style={{ width: `${(credits / 1000) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 h-[calc(100vh-200px)]">
        {/* Left – Chat (60%) */}
        <div className="col-span-3 flex flex-col">
          <div className="bg-white rounded-xl flex flex-col flex-1" style={{ border: "0.5px solid #E5E7EB" }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
              <div className="w-7 h-7 rounded-full bg-[#0A0A0A] flex items-center justify-center">
                <span style={{ fontSize: 12 }}>✨</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>StreamHub AI</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Powered by Claude</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[85%]"
                    style={{
                      backgroundColor: msg.role === "user" ? "#0A0A0A" : "#fff",
                      color: msg.role === "user" ? "#fff" : "#0A0A0A",
                      borderRadius: 12,
                      padding: "10px 14px",
                      border: msg.role === "ai" ? "0.5px solid #E5E7EB" : "none",
                      fontSize: 13,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                    {msg.role === "ai" && (
                      <div className="flex gap-2 mt-3">
                        <button className="px-2 py-1 rounded bg-[#0A0A0A] text-white text-xs">Use this caption</button>
                        <button className="px-2 py-1 rounded text-xs" style={{ border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Try another</button>
                        <button className="px-2 py-1 rounded text-xs" style={{ border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Copy</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-xl" style={{ border: "0.5px solid #E5E7EB", backgroundColor: "#fff" }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#9CA3AF]"
                          style={{ animation: `bounce 1s ${i * 0.2}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick prompts (empty state) */}
              {messages.length === 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {quickPrompts.map((p) => (
                    <button
                      key={p.text}
                      onClick={() => setInput(p.text)}
                      className="text-left p-3 rounded-lg hover:bg-[#F8F8F7] transition-colors"
                      style={{ border: "0.5px solid #E5E7EB", fontSize: 12, color: "#0A0A0A" }}
                    >
                      <span className="mr-2">{p.emoji}</span>{p.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3" style={{ borderTop: "0.5px solid #E5E7EB" }}>
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Ask AI to write, improve, or transform your content..."
                    className="w-full resize-none rounded-lg px-3 py-2.5 outline-none"
                    style={{ fontSize: 13, border: "0.5px solid #E5E7EB", minHeight: 40, maxHeight: 120, color: "#0A0A0A" }}
                    rows={1}
                  />
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <button><Paperclip size={13} color="#9CA3AF" /></button>
                    <div className="relative">
                      <button onClick={() => setShowToneMenu(!showToneMenu)} style={{ fontSize: 11, color: "#9CA3AF" }}>
                        🎨 {tone} ▾
                      </button>
                      {showToneMenu && (
                        <div className="absolute bottom-6 left-0 bg-white rounded-lg shadow-sm z-10" style={{ border: "0.5px solid #E5E7EB", minWidth: 140 }}>
                          {tones.map((t) => (
                            <button key={t} onClick={() => { setTone(t); setShowToneMenu(false); }} className="block w-full text-left px-3 py-2 hover:bg-[#F8F8F7]" style={{ fontSize: 12, color: "#0A0A0A" }}>{t}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  className="w-9 h-9 rounded-lg bg-[#0A0A0A] flex items-center justify-center hover:bg-[#1E1E1E] transition-colors"
                  disabled={!input.trim()}
                >
                  <Send size={14} color="#fff" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right – Context & Output (40%) */}
        <div className="col-span-2 space-y-4 overflow-y-auto">
          {/* Context */}
          <div className="bg-white rounded-xl p-4" style={{ border: "0.5px solid #E5E7EB" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>Tell AI about your brand</div>
            <textarea
              placeholder="Our brand is..."
              className="w-full resize-none rounded-lg px-3 py-2 outline-none mb-3"
              style={{ fontSize: 12, border: "0.5px solid #E5E7EB", height: 60, color: "#0A0A0A" }}
            />
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["25-34 women", "fitness enthusiasts", "professionals"].map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded" style={{ fontSize: 11, backgroundColor: "#F3F4F6", color: "#6B7280" }}>{tag} ×</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["Instagram", "TikTok", "LinkedIn"].map((p) => (
                <button key={p} className="px-2 py-1 rounded-md" style={{ fontSize: 11, backgroundColor: "#0A0A0A", color: "#fff" }}>{p}</button>
              ))}
              {["Facebook", "YouTube"].map((p) => (
                <button key={p} className="px-2 py-1 rounded-md" style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#9CA3AF" }}>{p}</button>
              ))}
            </div>
            <button style={{ fontSize: 11, color: "#6B7280", border: "0.5px solid #E5E7EB", borderRadius: 6, padding: "4px 12px" }}>Save voice</button>
          </div>

          {/* Generated Content */}
          <div className="bg-white rounded-xl p-4" style={{ border: "0.5px solid #E5E7EB" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>Latest output</div>
            <div className="flex gap-1.5 mb-3">
              {platforms.map((p) => (
                <button key={p} onClick={() => setActiveTab(p)} className="px-2.5 py-1 rounded-md" style={{ fontSize: 11, backgroundColor: activeTab === p ? "#0A0A0A" : "#F3F4F6", color: activeTab === p ? "#fff" : "#6B7280" }}>{p}</button>
              ))}
            </div>
            <textarea
              defaultValue={`The wait is OVER. 🔥 Introducing [App Name] — your all-in-one fitness companion that adapts to YOUR goals. Download now. Link in bio.`}
              className="w-full resize-none rounded-lg px-3 py-2 outline-none mb-2"
              style={{ fontSize: 12, border: "0.5px solid #E5E7EB", height: 80, color: "#0A0A0A" }}
            />
            <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 12 }}>138 / 2,200 chars · Instagram</div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-[#0A0A0A] text-white" style={{ fontSize: 11 }}>Insert into post</button>
              <button className="px-3 py-1.5 rounded-lg" style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Save to drafts</button>
              <button className="px-3 py-1.5 rounded-lg" style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Copy</button>
            </div>
          </div>

          {/* Hashtag Suggestions */}
          <div className="bg-white rounded-xl p-4" style={{ border: "0.5px solid #E5E7EB" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>Hashtag Suggestions</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["#fitnessapp", "#workoutmotivation", "#fitlife", "#gymlife", "#healthylifestyle", "#personaltrainer", "#fitnesschallenge"].map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full cursor-pointer" style={{ fontSize: 11, backgroundColor: "#0A0A0A", color: "#fff" }}>
                  {tag}
                </span>
              ))}
              {["#trending 🔥", "#viral 🔥"].map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full cursor-pointer" style={{ fontSize: 11, backgroundColor: "#0A0A0A", color: "#fff" }}>
                  {tag}
                </span>
              ))}
            </div>
            <button style={{ fontSize: 11, color: "#6B7280" }}>Refresh suggestions</button>
          </div>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
}
