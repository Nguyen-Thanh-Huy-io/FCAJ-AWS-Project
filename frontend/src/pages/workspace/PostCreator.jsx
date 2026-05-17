import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, Smile, Hash, AtSign, Link2, Folder, 
  ChevronDown, Plus, Image as ImageIcon, Video, 
  Monitor, Smartphone, MessageSquare, Heart, 
  Share, Repeat, AlignLeft, ArrowLeft, ArrowRight,
  Maximize2, Settings, Calendar, Globe, Send, Check,
  Camera, Briefcase, Bot
} from "lucide-react";
import { usePostCreator } from "../../context/PostCreatorContext";
import { PlatformIcon } from "../../components/shared/PlatformIcon";
import { WorkplaceHeader } from "../../components/shared/WorkplaceHeader";
import { ALL_PLATFORMS } from "../../utils/constants";

const PUBLISH_OPTIONS = [
  { id: "draft", label: "SAVE AS DRAFT", sub: "Save and publish at a later time" },
  { id: "review", label: "SEND TO REVIEW", sub: "Select reviewers" },
  { id: "schedule", label: "SAVE AND SCHEDULE", sub: "Save changes to this post" },
  { id: "now", label: "PUBLISH NOW", sub: "Publish with current date and time" },
];

const REVIEWERS = [
  { id: 1, name: "Sophie Rau", initial: "SO", color: "#10B981" },
  { id: 2, name: "Martín De La Cruz Delgado", initial: "MA", color: "#F59E0B" },
  { id: 3, name: "Paco Sánchez", initial: "PA", color: "#EC4899" },
  { id: 4, name: "Stephan Pichlmeier", initial: "ST", color: "#000000" },
  { id: 5, name: "Ana Lopez Briones", initial: "AN", color: "#065F46" },
];

function PreviewInstagram({ caption }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-[320px] mx-auto shadow-sm font-sans text-left">
      <div className="p-4 flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">MC</div>
        <div className="flex-1">
           <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-black">Metricool</span>
              <span className="text-[11px] text-gray-500">@Metricool · 1h</span>
           </div>
           <div className="text-sm text-gray-800 mt-1 leading-normal whitespace-pre-wrap">
              {caption}
           </div>
           <div className="flex items-center justify-between mt-4 max-w-[280px]">
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors"><MessageSquare size={16} /><span className="text-xs">0</span></button>
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-500 transition-colors"><Repeat size={16} /><span className="text-xs">0</span></button>
              <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors"><Heart size={16} /><span className="text-xs">0</span></button>
              <button className="text-gray-400 hover:text-blue-500 transition-colors"><Share size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}

function SelectReviewersView({ onCancel, onSend }) {
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [approvalRule, setApprovalRule] = useState("at_least_one");

  const toggleReviewer = (id) => {
    setSelectedReviewers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
         <h2 className="text-xl font-medium text-gray-800">Select reviewers</h2>
         <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
         <div className="space-y-4">
            <div className="space-y-2">
               {REVIEWERS.map(user => (
                 <div key={user.id} onClick={() => toggleReviewer(user.id)} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: user.color }}>{user.initial}</div>
                       <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedReviewers.includes(user.id) ? 'bg-black border-black' : 'border-gray-200'}`}>
                       {selectedReviewers.includes(user.id) && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="space-y-4 pt-4 border-t border-gray-50">
            <h3 className="text-xs font-bold text-gray-400">Approval policy</h3>
            <div className="space-y-3">
               {["at_least_one", "all"].map(rule => (
                 <label key={rule} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" checked={approvalRule === rule} onChange={() => setApprovalRule(rule)} className="accent-black" />
                    <span className="text-sm text-gray-600 font-medium">{rule === 'all' ? 'All reviewers must approve' : 'At least one reviewer must approve'}</span>
                 </label>
               ))}
            </div>
         </div>
      </div>
      <div className="p-8 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
         <button onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-500">Cancel</button>
         <button onClick={onSend} className="px-10 py-2.5 rounded-xl bg-[#0A0A0A] text-white text-sm font-bold shadow-lg">Send</button>
      </div>
    </div>
  );
}

export function PostCreatorPage() {
  const { isOpen, closePostCreator } = usePostCreator();
  const [caption, setCaption] = useState("Happy December!\n\nWhat are you looking forward to the most this month?");
  const [showGalleryMenu, setShowGalleryMenu] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("mobile");
  const [isReviewing, setIsReviewing] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(["YouTube", "Facebook", "Instagram"]);
  
  const [selectedPublishId, setSelectedPublishId] = useState("schedule");
  const [showPublishMenu, setShowPublishMenu] = useState(false);

  if (!isOpen) return null;

  const currentOption = PUBLISH_OPTIONS.find(o => o.id === selectedPublishId);

  const galleryItems = [
    { label: "Add image", icon: <Camera size={14} /> },
    { label: "Add video", icon: <Video size={14} /> },
    { label: "Stock images", icon: <ImageIcon size={14} /> },
    { label: "Stock videos", icon: <Video size={14} /> },
    { label: "GIFs gallery", icon: <span className="text-[10px] font-black border border-current rounded px-0.5 leading-none">GIF</span> },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex bg-white font-sans overflow-hidden animate-in slide-in-from-bottom duration-500">
      
      <div className="flex-[1.2] flex flex-col border-r border-gray-200">
         <div className="flex-1 overflow-hidden">
            {isReviewing ? (
              <SelectReviewersView onCancel={() => setIsReviewing(false)} onSend={closePostCreator} />
            ) : (
              <div className="h-full overflow-y-auto pb-10">
                 <div className="px-8 pt-8 pb-4">
                    <h1 className="text-2xl font-black text-[#0A0A0A] mb-8">Create new post</h1>
                    <WorkplaceHeader platforms={selectedPlatforms} className="mb-10" />
                 </div>

                 <div className="px-8 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       {ALL_PLATFORMS.map(p => (
                         <button 
                           key={p.id} 
                           onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                           className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${selectedPlatforms.includes(p.id) ? 'bg-[#0A0A0A] border-black text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}
                         >
                            <span className="text-[10px] font-black">{p.icon}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="px-8 mb-4">
                    <div className="border border-gray-200 rounded-[32px] overflow-hidden focus-within:border-black transition-all shadow-sm bg-gray-50/20">
                       <textarea 
                         value={caption}
                         onChange={(e) => setCaption(e.target.value)}
                         className="w-full p-8 text-sm font-medium leading-relaxed outline-none min-h-[300px] resize-none bg-transparent"
                         placeholder="What's on your mind?"
                       />
                       <div className="px-8 py-5 flex items-center justify-between bg-white border-t border-gray-100">
                          <div className="flex items-center gap-6 relative">
                             {/* Gallery Toggle */}
                             <div className="relative">
                                <button onClick={() => setShowGalleryMenu(!showGalleryMenu)} className="text-gray-400 hover:text-black transition-colors flex items-center gap-1">
                                   <ImageIcon size={20} />
                                   <Plus size={10} className="absolute -top-1 -right-1" strokeWidth={4} />
                                </button>
                                {showGalleryMenu && (
                                  <div className="absolute bottom-full left-0 mb-4 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-3 z-10 animate-in fade-in slide-in-from-bottom-2">
                                     {galleryItems.map(item => (
                                       <button key={item.label} className="w-full flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                          <span className="text-gray-400">{item.icon}</span>
                                          {item.label}
                                       </button>
                                     ))}
                                  </div>
                                )}
                             </div>
                             <button className="text-gray-400 hover:text-black transition-colors"><Smile size={20} /></button>
                             <button className="text-gray-400 hover:text-black transition-colors"><Link2 size={20} /></button>
                             <button className="text-gray-400 hover:text-black transition-colors"><Bot size={20} /></button>
                             <button className="text-gray-400 hover:text-black transition-colors"><Folder size={20} /></button>
                          </div>
                          <div className="flex items-center gap-3 bg-black rounded-full px-5 py-2 shadow-xl">
                             <Plus size={16} className="text-white" /><ArrowLeft size={16} className="text-white" /><ArrowRight size={16} className="text-white" />
                             <div className="w-px h-4 bg-gray-700" /><ChevronDown size={16} className="text-white" />
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-end mt-3 px-4"><span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{caption.length} / 280 X</span></div>
                 </div>
              </div>
            )}
         </div>

         {!isReviewing && (
           <div className="h-24 bg-white border-t border-gray-100 flex items-center justify-between px-10 shrink-0 relative">
              <button onClick={closePostCreator} className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] hover:text-black transition-colors">Cancel</button>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-2.5 cursor-pointer hover:bg-gray-100 transition-all shadow-sm">
                 <Calendar size={18} className="text-gray-400" />
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Nov 29, 2026 · 10:00 AM</span>
                 <ChevronDown size={14} className="text-gray-400" />
              </div>
              <div className="flex items-center relative">
                 <div className="flex rounded-2xl overflow-hidden shadow-2xl">
                    <button onClick={() => selectedPublishId === 'review' ? setIsReviewing(true) : closePostCreator()} className="px-10 py-3.5 bg-[#0A0A0A] text-white text-[10px] font-black uppercase tracking-[2px] hover:bg-gray-800 transition-all min-w-[200px]">{currentOption.label}</button>
                    <button onClick={() => setShowPublishMenu(!showPublishMenu)} className="px-4 bg-[#0A0A0A] text-white border-l border-white/10 hover:bg-gray-800 transition-all"><ChevronDown size={18} /></button>
                 </div>
                 {showPublishMenu && (
                    <div className="absolute bottom-[calc(100%+16px)] right-0 w-[280px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-3 z-[1100] animate-in slide-in-from-bottom-2">
                       {PUBLISH_OPTIONS.map((opt) => (
                          <button key={opt.id} onClick={() => { setSelectedPublishId(opt.id); setShowPublishMenu(false); }} className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all text-left ${selectedPublishId === opt.id ? 'bg-gray-50' : ''}`}>
                             <div className="flex-1">
                                <div className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-1">{opt.label}</div>
                                <div className="text-[9px] text-gray-400 font-bold">{opt.sub}</div>
                             </div>
                             {selectedPublishId === opt.id && <Check size={18} className="text-black ml-4" strokeWidth={4} />}
                          </button>
                       ))}
                    </div>
                 )}
              </div>
           </div>
         )}
      </div>

      <div className="flex-1 bg-[#F8F9FB] flex flex-col">
         <div className="flex justify-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-2xl scale-110"><span className="text-white font-black text-2xl tracking-tighter">X</span></div>
         </div>
         <div className="flex-1 flex items-center justify-center p-12">
            <div className="scale-110 shadow-2xl rounded-3xl overflow-hidden"><PreviewInstagram caption={caption} /></div>
         </div>
         <div className="p-10 flex items-center justify-center gap-10 border-t border-gray-100 bg-white/40 backdrop-blur-md">
            <button onClick={() => setPreviewDevice("mobile")} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] transition-all ${previewDevice === 'mobile' ? 'text-black scale-110' : 'text-gray-300 hover:text-gray-400'}`}><Smartphone size={18} /> Mobile</button>
            <button onClick={() => setPreviewDevice("desktop")} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] transition-all ${previewDevice === 'desktop' ? 'text-black scale-110' : 'text-gray-300 hover:text-gray-400'}`}><Monitor size={18} /> Desktop</button>
         </div>
      </div>
    </div>
  );
}
