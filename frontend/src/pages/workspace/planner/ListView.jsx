import * as React from "react";
import { useState, useEffect } from "react";
import { 
  Search, Filter, MoreHorizontal, Plus, 
  Trash2, CheckCircle, Clock, AlertCircle,
  ExternalLink, Eye, ChevronDown, Youtube, PlayCircle, Loader2, Facebook
} from "lucide-react";
import { usePostCreator } from "../../../context/PostCreatorContext";
import { useFilters } from "../../../hooks/useFilters";
import { useDebounce } from "../../../hooks/useDebounce";
import postService from "../../../services/post.service";
import brandService from "../../../services/brand.service";
import { toast } from "sonner";
import { format } from "date-fns";

const STATUS_STYLE = {
  published: "bg-green-50 text-green-700 border-green-100",
  scheduled: "bg-blue-50 text-blue-700 border-blue-100",
  draft: "bg-gray-50 text-gray-500 border-gray-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
  pending_approval: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  failed: "bg-rose-100 text-rose-800 border-rose-200"
};

export function ListView() {
  const [selected, setSelected] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [activeMenuId, setActiveMenuId] = useState(null);

  const { openPostCreator } = usePostCreator();
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    search: "",
    status: "All",
    platform: "All Platforms",
    page: "1",
    limit: "10"
  });

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const brandsRes = await brandService.getBrands();
        if (brandsRes.data && brandsRes.data.length > 0) {
          setActiveBrand(brandsRes.data[0]);
        }
      } catch (e) {
        console.error("Failed to load brands", e);
      }
    };
    init();
  }, []);

  // Sync search
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilters({ search: debouncedSearch, page: "1" });
    }
  }, [debouncedSearch]);

  // Fetch posts
  const fetchPosts = async () => {
    if (!activeBrand) return;
    setLoading(true);
    try {
      const res = await postService.getPosts(activeBrand.id, filters);
      setPosts(res.data || []);
      setMeta(res.meta || { total: 0, page: 1, totalPages: 1 });
    } catch (e) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeBrand, searchParamsString]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!activeBrand || selected.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selected.length} posts?`)) return;
    
    try {
      await postService.deletePosts(activeBrand.id, selected);
      toast.success("Posts deleted successfully");
      setSelected([]);
      fetchPosts();
    } catch (e) {
      toast.error(e.message || "Failed to delete posts");
    }
  };

  const handleBulkApprove = async () => {
    if (!activeBrand || selected.length === 0) return;
    try {
      await postService.approvePosts(activeBrand.id, selected);
      toast.success("Posts approved");
      setSelected([]);
      fetchPosts();
    } catch (e) {
      toast.error(e.message || "Failed to approve posts");
    }
  };

  const handleDeletePost = async (id) => {
    if (!activeBrand) return;
    if (!confirm(`Are you sure you want to delete this post?`)) return;
    
    try {
      await postService.deletePosts(activeBrand.id, [id]);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (e) {
      toast.error(e.message || "Failed to delete post");
    } finally {
      setActiveMenuId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1 group">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gray-500 transition-all" />
               <input 
                 type="text" 
                 placeholder="Search by title, caption..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9F99D]/50 transition-all"
               />
            </div>
            <div className="relative group">
               <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                  <Filter size={18} />
               </button>
               <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">Filter by Status</div>
                  {["All", "Draft", "Pending_Approval", "Approved", "Scheduled", "Published", "Rejected", "Failed"].map(s => (
                    <button 
                      key={s} 
                      onClick={() => updateFilters({ status: s, page: "1" })}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-all cursor-pointer ${filters.status === s ? 'font-bold text-black bg-gray-50' : 'text-gray-600'}`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3">
            {selected.length > 0 && (
               <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">{selected.length} selected</span>
                  <button 
                    onClick={handleBulkApprove}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-green-600 hover:bg-green-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
               </div>
            )}
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <button 
              onClick={() => openPostCreator()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-[12px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
               <Plus size={16} /> Create post
            </button>
         </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
         {loading ? (
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100">
                     <th className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-black cursor-pointer" 
                          disabled
                        />
                     </th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Post Details</th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Platform</th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Scheduled For</th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Status</th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Author</th>
                     <th className="px-6 py-4 text-right"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {[1, 2, 3].map((n) => (
                     <tr key={n} className="animate-pulse">
                        <td className="px-6 py-5"><div className="w-4 h-4 bg-gray-100 rounded" /></td>
                        <td className="px-4 py-5">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
                              <div className="flex flex-col gap-2">
                                 <div className="w-28 h-3 bg-gray-100 rounded" />
                                 <div className="w-20 h-2 bg-gray-50 rounded" />
                              </div>
                           </div>
                        </td>
                        <td className="px-4 py-5"><div className="w-16 h-5 bg-gray-100 rounded-lg" /></td>
                        <td className="px-4 py-5">
                           <div className="flex flex-col gap-2">
                              <div className="w-16 h-3 bg-gray-100 rounded" />
                              <div className="w-12 h-2.5 bg-gray-50 rounded" />
                           </div>
                        </td>
                        <td className="px-4 py-5"><div className="w-16 h-4 bg-gray-100 rounded-full" /></td>
                        <td className="px-4 py-5">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-100" />
                              <div className="w-12 h-3 bg-gray-50 rounded" />
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right"><div className="w-8 h-8 bg-gray-100 rounded-lg inline-block" /></td>
                     </tr>
                  ))}
               </tbody>
            </table>
         ) : posts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                  <PlayCircle size={32} />
               </div>
               <h3 className="text-sm font-bold text-gray-900">No posts found</h3>
               <p className="text-xs text-gray-400 mt-1 max-w-[250px]">You haven't created any posts for this filter yet.</p>
               <button 
                 onClick={clearFilters}
                 className="mt-6 px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
               >
                 Clear all filters
               </button>
            </div>
         ) : (
            <>
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100">
                     <th className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-black focus:ring-black cursor-pointer" 
                          checked={selected.length === posts.length && posts.length > 0}
                          onChange={(e) => setSelected(e.target.checked ? posts.map(p => p.id) : [])}
                        />
                     </th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Post Details</th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Platform</th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Scheduled For</th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Status</th>
                     <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Author</th>
                     <th className="px-6 py-4 text-right"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {posts.map((post) => (
                    <tr 
                      key={post.id} 
                      className={`hover:bg-gray-50/50 transition-colors group ${selected.includes(post.id) ? "bg-[#D9F99D]/10" : ""}`}
                    >
                       <td className="px-6 py-5">
                          <input 
                            type="checkbox" 
                            checked={selected.includes(post.id)}
                            onChange={() => toggleSelect(post.id)}
                            className="rounded border-gray-300 text-black focus:ring-black cursor-pointer" 
                          />
                       </td>
                       <td className="px-4 py-5 cursor-pointer" onClick={() => openPostCreator({ post })}>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative group-hover:border-gray-300 transition-all shadow-sm">
                                {post.thumbnail ? (
                                  <img src={post.thumbnail} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-lg">📝</div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                   <Eye size={16} className="text-white" />
                                </div>
                             </div>
                             <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-bold text-[#0A0A0A] truncate max-w-[250px]">{post.title}</span>
                                <span className="text-[11px] text-gray-400 truncate max-w-[250px]">{post.caption || "No caption provided..."}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-4 py-5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                             {post.platforms.map(plt => (
                               <div key={plt} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                                  {plt === "YOUTUBE" ? (
                                    <Youtube size={12} className="text-[#FF0000]" />
                                  ) : plt === "FACEBOOK" ? (
                                    <Facebook size={12} className="text-[#1877F2] fill-[#1877F2]" />
                                  ) : (
                                    <PlayCircle size={12} className="text-[#010101]" />
                                  )}
                                  <span className="text-[9px] font-black uppercase tracking-tighter text-gray-600">{plt}</span>
                               </div>
                             ))}
                          </div>
                       </td>
                       <td className="px-4 py-5">
                          <div className="flex flex-col">
                             <span className="text-[12px] font-bold text-gray-700">
                               {post.scheduledAt ? format(new Date(post.scheduledAt), "MMM d, yyyy") : "—"}
                             </span>
                             <span className="text-[10px] text-gray-400 uppercase font-medium">
                               {post.scheduledAt ? format(new Date(post.scheduledAt), "hh:mm a") : "—"}
                             </span>
                          </div>
                       </td>
                       <td className="px-4 py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-sm ${STATUS_STYLE[post.status] || "bg-gray-50"}`}>
                             {post.status.replace('_', ' ')}
                          </span>
                       </td>
                       <td className="px-4 py-5">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden">
                                {post.creatorAvatar ? <img src={post.creatorAvatar} className="w-full h-full object-cover" /> : post.creator.charAt(0)}
                             </div>
                             <span className="text-[11px] font-medium text-gray-600">{post.creator}</span>
                          </div>
                       </td>
                       <td className="px-6 py-5 text-right relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === post.id ? null : post.id);
                            }}
                            className="p-2 text-gray-300 hover:text-black hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm border border-transparent hover:border-gray-100 cursor-pointer"
                          >
                             <MoreHorizontal size={16} />
                          </button>

                          {activeMenuId === post.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                              <div className="absolute right-6 top-12 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-left overflow-hidden">
                                 <button 
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     openPostCreator({ post });
                                     setActiveMenuId(null);
                                   }}
                                   className="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer"
                                 >
                                    <span>✏️</span> Edit Post
                                 </button>
                                 <button 
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleDeletePost(post.id);
                                   }}
                                   className="w-full px-4 py-2 text-[11px] font-bold text-red-600 hover:bg-red-50/50 transition-all flex items-center gap-2 cursor-pointer border-t border-gray-50"
                                 >
                                    <span>🗑️</span> Delete Post
                                 </button>
                              </div>
                            </>
                          )}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            
            {/* Footer Pagination */}
            <div className="px-6 py-4 bg-gray-50/20 border-t border-gray-100 flex items-center justify-between">
               <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                 Showing {posts.length} of {meta.total} results
               </span>
               <div className="flex gap-2">
                  <button 
                    disabled={parseInt(filters.page) <= 1}
                    onClick={() => updateFilters({ page: (parseInt(filters.page) - 1).toString() })}
                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={parseInt(filters.page) >= meta.totalPages}
                    onClick={() => updateFilters({ page: (parseInt(filters.page) + 1).toString() })}
                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                  >
                    Next
                  </button>
               </div>
            </div>
            </>
         )}
      </div>
    </div>
  );
}
