import * as React from "react";
import { useState, useEffect } from "react";
import { 
  Search, Filter, Plus, Diamond, 
  Grid3X3, List as ListIcon, MoreHorizontal,
  Youtube, PlayCircle, Instagram, Image as ImageIcon, Loader2, Eye, Facebook
} from "lucide-react";
import { usePostCreator } from "../../../context/PostCreatorContext";
import postService from "../../../services/post.service";
import brandService from "../../../services/brand.service";
import { toast } from "sonner";

export function PostsLibraryView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { openPostCreator } = usePostCreator();

  const fetchLibrary = async () => {
    if (!activeBrand) return;
    setLoading(true);
    try {
      const res = await postService.getPosts(activeBrand.id, { 
        isLibrary: true,
        search: searchTerm
      });
      setPosts(res.data || []);
    } catch (e) {
      toast.error("Failed to load library posts");
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
    fetchLibrary();
  }, [activeBrand, searchTerm]);

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#0A0A0A]">Posts Library</h2>
            <div className="px-3 py-1 bg-[#D9F99D] rounded-full flex items-center gap-1.5 shadow-sm border border-[#BEF264]">
               <Diamond size={12} className="text-black" />
               <span className="text-[10px] font-bold text-black uppercase tracking-wider">Templates</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative group w-64">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
               <input 
                 type="text" 
                 placeholder="Search templates..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-[11px] focus:outline-none focus:ring-2 focus:ring-[#D9F99D]/50 transition-all"
               />
            </div>
            <button 
              onClick={() => openPostCreator({ isLibrary: true })}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[12px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
               <Plus size={16} /> Add template
            </button>
         </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-200" size={40} />
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-12 bg-[#2D1D35] rounded-[32px] p-12 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9F99D]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="relative z-10 space-y-4">
              <div className="w-20 h-20 bg-[#D9F99D]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D9F99D]/20">
                <Diamond size={40} className="text-[#D9F99D] drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Organize your best content</h3>
              <p className="text-gray-400 max-w-md mx-auto text-sm font-medium leading-relaxed">Save your top-performing posts as templates and reuse them with one click. Build a library of consistent, high-quality content.</p>
              <button 
                onClick={() => openPostCreator({ isLibrary: true })}
                className="mt-6 px-10 py-3 bg-[#D9F99D] text-[#0A0A0A] rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl cursor-pointer"
              >
                Create First Template
              </button>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
           {posts.map((item) => (
             <div 
               key={item.id} 
               onClick={() => openPostCreator({ post: item })}
               className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:border-black transition-all group cursor-pointer active:scale-[0.98]"
             >
                <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                   {item.thumbnail ? (
                      <img src={item.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   ) : (
                      <div className="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">📝</div>
                   )}
                   
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <Eye size={20} className="text-black" />
                      </div>
                   </div>

                   <div className="absolute top-4 right-4 flex gap-1">
                      {item.platforms.map(plt => (
                        <div key={plt} className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm border border-white/50">
                           {plt === "YOUTUBE" ? (
                              <Youtube size={14} className="text-[#FF0000]" />
                            ) : plt === "FACEBOOK" ? (
                              <Facebook size={14} className="text-[#1877F2] fill-[#1877F2]" />
                            ) : (
                              <PlayCircle size={14} />
                            )}
                        </div>
                      ))}
                   </div>
                </div>
                <div className="p-5 space-y-3 bg-white">
                   <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13px] font-bold text-[#0A0A0A] line-clamp-1 uppercase tracking-tight">{item.title}</h3>
                      <button className="text-gray-300 hover:text-black transition-colors"><MoreHorizontal size={14} /></button>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.type}</span>
                      <span className="text-[9px] font-black text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded-lg uppercase tracking-tighter">Template</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
