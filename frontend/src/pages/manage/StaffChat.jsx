import { useState, useRef } from "react";
import { 
  Search, MessageSquare, User, Clock, CheckCircle, 
  Send, MoreVertical, X, Phone, Video, Info, Filter,
  Paperclip, File, Image as ImageIcon, Download
} from "lucide-react";

const CONVERSATIONS = [
  { id: 1, name: "Nguyen Minh", preview: "Hi Alex, can you help me with...", time: "2m ago", unread: true, status: "online", role: "Owner" },
  { id: 2, name: "Sarah Johnson", preview: "The new YouTube API is great!", time: "15m ago", unread: false, status: "offline", role: "Admin" },
  { id: 3, name: "David Chen", preview: "I found a bug in the planner.", time: "1h ago", unread: false, status: "online", role: "Manager" },
  { id: 4, name: "Maria Garcia", preview: "Thanks for the quick reply!", time: "3h ago", unread: false, status: "offline", role: "Creator" },
];

const INITIAL_MESSAGES = [
  { id: 1, text: "Hi! I'm having trouble connecting my TikTok account.", time: "10:30 AM", sender: "user" },
  { id: 2, text: "Hello Minh! I'd be happy to help. Are you seeing a specific error code?", time: "10:32 AM", sender: "staff" },
  { id: 3, text: "Yes, it says 'Token Expired' right after login.", time: "10:35 AM", sender: "user" },
];

export function StaffChatPage() {
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = (text = input, attachment = null) => {
    if (!text.trim() && !attachment) return;
    const newMsg = { 
      id: Date.now(), 
      text: text, 
      time: "Just now", 
      sender: "staff",
      attachment: attachment
    };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const isImage = file.type.startsWith("image/");
      handleSend("", { name: file.name, type: file.type, isImage });
    }, 1000);
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* Sidebar: Chat List */}
      <div className="w-[320px] border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
           <h2 className="text-lg font-bold text-[#0A0A0A]">Support Inbox</h2>
           <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><Filter size={18} /></button>
        </div>
        
        <div className="p-4">
           <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search conversations..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border-none text-sm outline-none" />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
           {CONVERSATIONS.map((chat) => (
             <button
               key={chat.id}
               onClick={() => setActiveChat(chat)}
               className={`w-full flex items-center gap-4 px-5 py-4 border-b border-gray-50 transition-all text-left ${activeChat.id === chat.id ? "bg-gray-50" : "hover:bg-gray-50/50"}`}
             >
                <div className="relative shrink-0">
                   <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 uppercase">
                      {chat.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   {chat.status === "online" && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#0A0A0A] truncate">{chat.name}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{chat.time}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className={`text-xs truncate ${chat.unread ? "text-[#0A0A0A] font-semibold" : "text-gray-400"}`}>{chat.preview}</p>
                      {chat.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                   </div>
                </div>
             </button>
           ))}
        </div>
      </div>

      {/* Main: Chat View */}
      <div className="flex-1 flex flex-col bg-white">
         {/* Chat Header */}
         <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">{activeChat.name[0]}</div>
               <div>
                  <div className="text-sm font-bold text-[#0A0A0A]">{activeChat.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{activeChat.role} · ID: 19482</div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><Phone size={18} /></button>
               <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><Video size={18} /></button>
               <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><CheckCircle size={18} className="text-green-500" /></button>
               <div className="w-px h-6 bg-gray-100 mx-2" />
               <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><MoreVertical size={18} /></button>
            </div>
         </div>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[70%] space-y-1 flex flex-col ${msg.sender === 'staff' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'staff' ? 'bg-[#2D1D35] text-white rounded-tr-none shadow-md' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm'}`}>
                       {msg.text && <div>{msg.text}</div>}
                       {msg.attachment && (
                          <div className={`mt-3 p-3 rounded-xl flex items-center gap-3 border ${msg.sender === 'staff' ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-100'}`}>
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${msg.sender === 'staff' ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                {msg.attachment.isImage ? <ImageIcon size={16} /> : <File size={16} />}
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-bold truncate">{msg.attachment.name}</div>
                                <div className="text-[9px] opacity-60 uppercase">{msg.attachment.type.split('/')[1]}</div>
                             </div>
                             <button className="p-1.5 hover:bg-black/10 rounded-md transition-colors"><Download size={14} /></button>
                          </div>
                       )}
                    </div>
                    <div className="text-[10px] text-gray-400 px-1 font-medium">{msg.time}</div>
                 </div>
              </div>
            ))}
            {isUploading && (
               <div className="flex justify-end">
                  <div className="bg-[#2D1D35] text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-md">
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span className="text-xs font-medium">Sending file...</span>
                  </div>
               </div>
            )}
         </div>

         {/* Chat Input */}
         <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
               <div className="flex-1 relative">
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder={`Reply to ${activeChat.name.split(' ')[0]}...`}
                    className="w-full pl-4 pr-12 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#2D1D35] focus:bg-white outline-none text-sm transition-all resize-none min-h-[50px] max-h-[200px]"
                    rows={1}
                  />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="p-1 text-gray-400 hover:text-[#2D1D35] transition-colors"
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
               </div>
               <button 
                 onClick={() => handleSend()}
                 className="p-3 bg-[#2D1D35] text-white rounded-xl shadow-lg hover:opacity-90 transition-all shrink-0"
               >
                  <Send size={20} />
               </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-widest">Shift + Enter for new line</p>
         </div>
      </div>

      {/* Right Sidebar: Details */}
      <div className="w-[300px] border-l border-gray-100 p-6 hidden lg:flex flex-col gap-8 shrink-0">
         <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Details</h3>
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-bold text-xl text-[#0A0A0A] shadow-sm mb-3">NM</div>
               <div className="font-bold text-[#0A0A0A]">{activeChat.name}</div>
               <div className="text-xs text-gray-500 mt-1">minh@techvn.io</div>
               <span className="mt-3 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Premium Plan</span>
            </div>
         </div>

         <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Stats</h3>
            <div className="space-y-4">
               {[
                 { label: "Active Brands", value: "3" },
                 { label: "Total Posts", value: "1,240" },
                 { label: "Member Since", value: "Jan 12, 2025" },
               ].map(stat => (
                 <div key={stat.label} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{stat.label}</span>
                    <span className="font-bold text-[#0A0A0A]">{stat.value}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="mt-auto">
            <button className="w-full py-2.5 rounded-xl border border-red-100 text-red-500 text-xs font-bold hover:bg-red-50 transition-all">Close Conversation</button>
         </div>
      </div>
    </div>
  );
}
