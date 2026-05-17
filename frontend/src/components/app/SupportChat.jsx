import { useState, useRef } from "react";
import { MessageCircle, X, Send, User, BadgeCheck, Paperclip, File, Image as ImageIcon } from "lucide-react";

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "agent", text: "Hi there! 👋 I'm Alex from StreamHub support. How can I help you with your social media management today?", time: "2:30 PM" }
  ]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = (text = input, attachment = null) => {
    if (!text.trim() && !attachment) return;
    
    const userMsg = { 
      role: "user", 
      text: text, 
      time: "Just now",
      attachment: attachment 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate Agent reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "agent",
        text: attachment ? "I've received your file. Let me take a look at it." : "Thanks for reaching out! A Support Specialist will be with you in a few minutes.",
        time: "Just now"
      }]);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      const isImage = file.type.startsWith("image/");
      handleSend("", { name: file.name, type: file.type, isImage });
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
           {/* Header */}
           <div className="bg-[#2D1D35] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center border-2 border-white/20">
                       <User size={20} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2D1D35]" />
                 </div>
                 <div>
                    <div className="text-sm font-bold flex items-center gap-1">
                       Alex <BadgeCheck size={14} className="text-blue-400" />
                    </div>
                    <div className="text-[10px] text-white/60">Support Specialist</div>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={20} /></button>
           </div>

           {/* Conversation */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] space-y-1 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#2D1D35] text-white rounded-tr-none shadow-sm' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                        {msg.text && <div>{msg.text}</div>}
                        {msg.attachment && (
                          <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 border ${msg.role === 'user' ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-100'}`}>
                             {msg.attachment.isImage ? <ImageIcon size={16} /> : <File size={16} />}
                             <span className="text-xs truncate max-w-[150px]">{msg.attachment.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-[9px] text-gray-400 px-1">{msg.time}</div>
                   </div>
                </div>
              ))}
              {isUploading && (
                <div className="flex justify-end">
                   <div className="bg-[#2D1D35]/5 px-3 py-2 rounded-lg border border-dashed border-gray-300 flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-gray-500 font-medium">Uploading file...</span>
                   </div>
                </div>
              )}
           </div>

           {/* Input Area */}
           <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2">
                 <div className="relative flex-1">
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..." 
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-pink-500 focus:bg-white outline-none text-sm transition-all" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                    >
                       <Paperclip size={18} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                 </div>
                 <button 
                   onClick={() => handleSend()}
                   className="p-3 bg-[#2D1D35] text-white rounded-xl hover:opacity-90 transition-all shadow-lg"
                 >
                    <Send size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
        style={{ 
          background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)", 
          color: "#FFF" 
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />}
      </button>
    </div>
  );
}
