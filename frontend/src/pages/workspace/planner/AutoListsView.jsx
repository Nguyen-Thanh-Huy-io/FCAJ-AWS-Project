import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Play, Pause, 
  RefreshCw, Layers, Calendar, ChevronRight, Loader2
} from "lucide-react";
import autoListService from "../../../services/auto-list.service";
import brandService from "../../../services/brand.service";
import { toast } from "sonner";

export function AutoListsView() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState(null);
  const navigate = useNavigate();

  const fetchLists = async () => {
    if (!activeBrand) return;
    setLoading(true);
    try {
      const res = await autoListService.getAutoLists(activeBrand.id);
      setLists(res.data || []);
    } catch (e) {
      toast.error("Failed to load autolists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const brandsRes = await brandService.getBrands();
      if (brandsRes.data?.length > 0) {
        setActiveBrand(brandsRes.data[0]);
      }
    };
    init();
  }, []);

  useEffect(() => {
    fetchLists();
  }, [activeBrand]);

  const handleToggle = async (id) => {
    try {
      await autoListService.toggleStatus(id);
      toast.success("Status updated");
      fetchLists();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-bold text-[#0A0A0A]">Autolists</h2>
         <button 
           onClick={() => navigate("/planner/autolist/new")}
           className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[12px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
         >
            <Plus size={16} /> Create autolist
         </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
           <Loader2 className="animate-spin text-gray-200" size={32} />
        </div>
      ) : lists.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
           <Layers className="mx-auto text-gray-200 mb-4" size={48} />
           <h3 className="text-sm font-bold text-gray-900">No autolists created yet</h3>
           <p className="text-xs text-gray-400 mt-1">Create your first queue to automate your content strategy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {lists.map((list) => (
            <div key={list.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-8 hover:shadow-md transition-all group text-left">
                {/* Circular Progress */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="transparent" stroke="#F3F4F6" strokeWidth="6" />
                      <circle 
                        cx="32" cy="32" r="28" fill="transparent" 
                        stroke={list.isActive ? "#D9F99D" : "#E5E7EB"} 
                        strokeWidth="6" 
                        strokeDasharray={175.9} 
                        strokeDashoffset={175.9 * (1 - (list.progress || 0) / 100)} 
                        strokeLinecap="round"
                      />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-black text-gray-700">{list.progress || 0}%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                      <h3 className="text-[15px] font-bold text-[#0A0A0A]">{list.name}</h3>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${list.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {list.isActive ? "Active" : "Paused"}
                      </span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Layers size={14} />
                        <span className="text-[11px] font-medium">{list.publishedPostsCount} / {list.totalPostsCount} posts</span>
                      </div>
                      <div className="w-px h-3 bg-gray-200" />
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span className="text-[11px] font-medium">{list.scheduleType === 'INTERVAL' ? `Every ${list.intervalMinutes}m` : 'Specific Times'}</span>
                      </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleToggle(list.id)}
                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black transition-all cursor-pointer shadow-sm"
                  >
                      {list.isActive ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black transition-all cursor-pointer shadow-sm">
                      <RefreshCw size={18} />
                  </button>
                  <button 
                    onClick={() => navigate(`/planner/autolist/${list.id}`)}
                    className="p-2 text-gray-300 hover:text-black transition-colors cursor-pointer"
                  >
                      <ChevronRight size={24} />
                  </button>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper Card */}
      <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-3xl p-6 flex items-start gap-4 text-left">
         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
            <RefreshCw size={20} />
         </div>
         <div>
            <h4 className="text-[14px] font-bold text-[#1E1B4B]">How do Autolists work?</h4>
            <p className="text-[12px] text-[#4338CA] leading-relaxed mt-1">Autolists allow you to automate your content queue. Simply upload your posts and set a frequency. Metricool will handle the publishing for you automatically.</p>
         </div>
      </div>
    </div>
  );
}
