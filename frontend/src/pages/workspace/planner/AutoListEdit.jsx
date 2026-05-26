import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, AlertTriangle, Settings, 
  Trash2, Plus, FileUp, Download, 
  Sparkles, Rss, Youtube, PlayCircle,
  Diamond, ChevronDown, Loader2, Instagram, Facebook, Linkedin,
  Calendar, Clock, Check, X, FileVideo, FileImage, FileText
} from "lucide-react";
import { Switch } from "../../../components/ui/switch";
import brandService from "../../../services/brand.service";
import socialService from "../../../services/social.service";
import autoListService from "../../../services/auto-list.service";
import postService from "../../../services/post.service";
import { toast } from "sonner";

const PLATFORM_ICONS = {
  YOUTUBE: <Youtube size={18} className="text-[#FF0000]" />,
  TIKTOK: <PlayCircle size={18} className="text-[#010101]" />,
  INSTAGRAM: <Instagram size={18} className="text-[#E1306C]" />,
  FACEBOOK: <Facebook size={18} className="text-[#1877F2]" />,
  LINKEDIN: <Linkedin size={18} className="text-[#0A66C2]" />,
};

const INTERVAL_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
  { value: 360, label: "6 hours" },
  { value: 720, label: "12 hours" },
  { value: 1440, label: "24 hours" },
];

export function AutoListEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [name, setName] = useState("New autolist 1");
  const [repeat, setRepeat] = useState(false);
  const [selectedDays, setSelectedDays] = useState(['Mo', 'Tu', 'We', 'Th', 'Fr']);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduleType, setScheduleType] = useState('INTERVAL'); // INTERVAL or SPECIFIC
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [specificTimes, setSpecificTimes] = useState(['09:00', '18:00']);
  
  // Specific Time Input states
  const [newTime, setNewTime] = useState("12:00");
  
  // Post states
  const [posts, setPosts] = useState([]);
  
  // Modal states
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostMediaUrl, setNewPostMediaUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeBrand, setActiveBrand] = useState(null);

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const init = async () => {
    setIsLoading(true);
    try {
      const brandsRes = await brandService.getBrands();
      if (brandsRes.data?.length > 0) {
        const brand = brandsRes.data[0];
        setActiveBrand(brand);
        
        // Load connected platforms
        const metricsRes = await socialService.getMetrics(brand.id);
        const platforms = (metricsRes.data || []).map(m => ({
          id: m.platform,
          name: m.platform.charAt(0) + m.platform.slice(1).toLowerCase(),
          icon: PLATFORM_ICONS[m.platform] || <PlayCircle size={18} />
        }));
        setConnectedPlatforms(platforms);

        // Load list details if editing
        if (!isNew) {
          const listRes = await autoListService.getAutoListDetails(id);
          if (listRes.data) {
            const list = listRes.data;
            setName(list.name);
            setRepeat(list.loopEnabled);
            setScheduleType(list.scheduleType);
            setIntervalMinutes(list.intervalMinutes || 60);
            
            if (list.specificTimes) {
              setSpecificTimes(list.specificTimes.split(',').filter(Boolean));
            } else {
              setSpecificTimes([]);
            }
            
            setSelectedPlatforms(list.targetPlatforms.split(',').filter(Boolean));
            setSelectedDays(list.activeDays.split(',').filter(Boolean));
            setPosts(list.posts || []);
          }
        } else {
          // Defaults for new autolist
          if (platforms.length > 0) {
            setSelectedPlatforms([platforms[0].id]);
          }
        }
      }
    } catch (e) {
      console.error("Failed to initialize", e);
      toast.error("Failed to load autolist details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [id, isNew]);

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]
    );
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addSpecificTime = () => {
    if (!newTime) return;
    if (specificTimes.includes(newTime)) {
      toast.error("Time already exists");
      return;
    }
    setSpecificTimes(prev => [...prev, newTime].sort());
    toast.success("Time added");
  };

  const removeSpecificTime = (timeToRemove) => {
    setSpecificTimes(prev => prev.filter(t => t !== timeToRemove));
  };

  const handleSave = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("You must select at least one platform");
      return;
    }
    if (selectedDays.length === 0) {
      toast.error("You must select at least one active day");
      return;
    }
    if (scheduleType === 'SPECIFIC' && specificTimes.length === 0) {
      toast.error("You must add at least one specific posting time");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        targetPlatforms: selectedPlatforms.join(','),
        scheduleType,
        intervalMinutes: scheduleType === 'INTERVAL' ? intervalMinutes : null,
        specificTimes: scheduleType === 'SPECIFIC' ? specificTimes.join(',') : null,
        activeDays: selectedDays.join(','),
        loopEnabled: repeat,
        isActive: true
      };

      if (isNew) {
        const created = await autoListService.createAutoList(activeBrand.id, payload);
        toast.success("Autolist created successfully");
        navigate(`/planner/autolist/${created.id}`);
      } else {
        await autoListService.updateAutoList(id, payload);
        toast.success("Autolist updated successfully");
        // Reload list details
        init();
      }
    } catch (e) {
      toast.error("Failed to save autolist");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteList = async () => {
    if (!window.confirm("Are you sure you want to delete this autolist? All queued posts will be orphaned.")) return;
    try {
      await autoListService.deleteAutoList(id);
      toast.success("Autolist deleted");
      navigate("/planner/autolists");
    } catch (e) {
      toast.error("Failed to delete autolist");
    }
  };

  const handleInsertPost = async () => {
    if (!newPostCaption.trim()) {
      toast.error("Post caption is required");
      return;
    }
    try {
      const mediaUrls = newPostMediaUrl.trim() ? [newPostMediaUrl.trim()] : [];
      await postService.createPost({
        brandId: activeBrand.id,
        title: newPostTitle.trim() || "Untitled Queue Post",
        caption: newPostCaption.trim(),
        type: mediaUrls.length > 0 ? "IMAGE" : "VIDEO",
        status: "DRAFT", // Will automatically be recalculated to SCHEDULED if autolist is active
        targetPlatforms: selectedPlatforms,
        mediaUrls,
        autoListId: id
      });
      toast.success("Post added to queue");
      setShowPostModal(false);
      setNewPostTitle("");
      setNewPostCaption("");
      setNewPostMediaUrl("");
      init(); // Reload details
    } catch (e) {
      toast.error("Failed to add post to queue");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Remove this post from the queue?")) return;
    try {
      await postService.deletePosts(activeBrand.id, [postId]);
      toast.success("Post removed from queue");
      init();
    } catch (e) {
      toast.error("Failed to remove post");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white min-h-screen">
         <Loader2 className="animate-spin text-gray-200" size={40} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen animate-in slide-in-from-right duration-300">
      {/* Sub-Header */}
      <div className="px-8 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{isNew ? "Create autolist" : "Edit autolist"}</h2>
          {!isNew && (
            <button 
              onClick={handleDeleteList}
              className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Delete Autolist
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/planner/autolists")}
            className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest cursor-pointer mr-2"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] hover:bg-black disabled:opacity-50 text-white rounded-xl text-[12px] font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {isNew ? "Create queue" : "Save settings"}
          </button>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Error Alert */}
        {selectedPlatforms.length === 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              <AlertTriangle size={14} />
            </div>
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-tight">You must select at least one network.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
          {/* Left Side (Settings) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Name */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Name</h3>
              <div className="relative">
                <label className="absolute -top-2 left-4 px-1 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest z-10">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl text-xs font-bold focus:border-black outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Timing Rules */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">Timing Cadence</h3>
                <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner text-[10px] font-black uppercase tracking-wider">
                  <button 
                    onClick={() => setScheduleType('INTERVAL')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${scheduleType === 'INTERVAL' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
                  >
                    Interval
                  </button>
                  <button 
                    onClick={() => setScheduleType('SPECIFIC')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${scheduleType === 'SPECIFIC' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
                  >
                    Specific Times
                  </button>
                </div>
              </div>

              <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/20 space-y-6">
                {/* Interval details */}
                {scheduleType === 'INTERVAL' ? (
                  <div className="space-y-2">
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Publish Interval</span>
                    <div className="relative w-48">
                      <select 
                        value={intervalMinutes}
                        onChange={(e) => setIntervalMinutes(parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:border-black outline-none shadow-sm appearance-none"
                      >
                        {INTERVAL_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ) : (
                  // Specific Times list & add form
                  <div className="space-y-4">
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Post at Specific Times</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="time" 
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:border-black outline-none shadow-sm"
                      />
                      <button 
                        onClick={addSpecificTime}
                        className="flex items-center gap-1 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Plus size={14} /> Add Time
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {specificTimes.length === 0 ? (
                        <span className="text-xs text-gray-400 font-bold">No specific times added yet.</span>
                      ) : (
                        specificTimes.map(time => (
                          <div key={time} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF2FF] border border-[#E0E7FF] text-[#4338CA] rounded-xl text-xs font-bold animate-in fade-in">
                            <Clock size={12} />
                            <span>{time}</span>
                            <button 
                              onClick={() => removeSpecificTime(time)}
                              className="text-[#4338CA] hover:text-red-500 transition-colors ml-1 cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Days selection */}
                <div className="space-y-2">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Posting Days</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {days.map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all border cursor-pointer ${
                          selectedDays.includes(day) 
                            ? 'bg-black text-white border-transparent shadow-sm' 
                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loop Queue setting */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <Settings size={16} className="text-gray-400" />
                    <div>
                      <span className="text-xs font-bold text-gray-700 block">Queue Loop (Repeat)</span>
                      <span className="text-[10px] text-gray-400 font-medium">Re-schedule posts from the beginning when queue runs dry</span>
                    </div>
                  </div>
                  <Switch checked={repeat} onCheckedChange={setRepeat} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side (Platform target networks) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">Target Platforms</h3>
            <div className="flex flex-col gap-3">
               {connectedPlatforms.length === 0 ? (
                 <p className="text-xs text-gray-400 font-bold">No connected platforms found. Please connect accounts first.</p>
               ) : (
                 connectedPlatforms.map((p) => (
                   <button 
                     key={p.id}
                     onClick={() => togglePlatform(p.id)}
                     className={`flex items-center gap-3 px-5 py-3 border rounded-2xl transition-all group cursor-pointer ${
                       selectedPlatforms.includes(p.id) ? 'border-black bg-gray-50/50' : 'border-gray-100 bg-white hover:border-gray-300'
                     }`}
                   >
                      {p.icon}
                      <span className={`text-xs font-bold ${selectedPlatforms.includes(p.id) ? 'text-black' : 'text-gray-700'}`}>{p.name}</span>
                   </button>
                 ))
               )}
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 my-8" />

        {/* Content (Queue List) */}
        <div className="space-y-6 text-left pb-20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Queue Content</h3>
              <p className="text-xs text-gray-400 mt-0.5">Manage the list of posts waiting to be published</p>
            </div>
            
            <button 
              onClick={() => {
                if (isNew) {
                  toast.error("Please save the autolist settings first before inserting posts.");
                } else {
                  setShowPostModal(true);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus size={14} /> Insert post
            </button>
          </div>

          {/* Posts list grid */}
          {posts.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-3xl p-12 text-center">
              <Calendar className="mx-auto text-gray-200 mb-4" size={40} />
              <h4 className="text-xs font-bold text-gray-700">The queue is currently empty</h4>
              <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">Add your first post to begin automated scheduling based on your cadence settings.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, idx) => (
                <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group">
                  <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100">
                    {idx + 1}
                  </div>
                  
                  {/* Thumbnail / Media icon */}
                  <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-gray-50">
                    {post.mediaUrls ? (
                      <img src={post.mediaUrls.split(',')[0]} alt="Media" className="w-full h-full object-cover" />
                    ) : post.type === 'VIDEO' ? (
                      <FileVideo size={16} className="text-gray-400" />
                    ) : (
                      <FileImage size={16} className="text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{post.caption || "No caption"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {post.targetPlatforms.split(',').map(plt => (
                        <span key={plt} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded font-medium text-gray-500 uppercase">
                          {plt.toLowerCase()}
                        </span>
                      ))}
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                        <Clock size={10} />
                        Scheduled: {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : "Pending"}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insert Post Dialog Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 m-4 animate-in zoom-in-95 duration-200 text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Add Post to Queue</h3>
              <button 
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Title (Internal only)</label>
                <input 
                  type="text" 
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Internal post notes"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Caption / Text Content</label>
                <textarea 
                  value={newPostCaption}
                  onChange={(e) => setNewPostCaption(e.target.value)}
                  placeholder="Write what you want to share..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Media URL (Optional)</label>
                <input 
                  type="text" 
                  value={newPostMediaUrl}
                  onChange={(e) => setNewPostMediaUrl(e.target.value)}
                  placeholder="Paste a direct image or video link"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowPostModal(false)}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleInsertPost}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Add to queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
