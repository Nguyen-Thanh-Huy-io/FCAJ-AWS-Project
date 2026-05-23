import React, { useState, useEffect } from "react";
import { Search, UserPlus, MoreHorizontal, Check, X, Mail, Shield, User, ChevronUp, ChevronDown } from "lucide-react";
import { useFilters } from "../../hooks/useFilters";
import { useDebounce } from "../../hooks/useDebounce";
import apiService from "../../services/api";
import { toast } from "sonner";

export function TeamManagementPage() {
  const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
    search: "",
    role: "All",
    status: "All"
  });

  const [teamData, setTeamData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

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

  // Fetch real data from Backend
  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/team?${searchParamsString}`);
        setTeamData(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to load team members");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [searchParamsString]);

  const members = teamData.data || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F8F8F7" }}>
      {/* Sub-header */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-[#0A0A0A] tracking-tight">Team Management</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your workspace collaborators and permissions</p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-all shadow-sm active:scale-95"
        >
          <UserPlus size={14} /> Invite Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-100 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {["All", "Owner", "Admin", "Member"].map((r) => (
            <button
              key={r}
              onClick={() => updateFilters({ role: r })}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                (filters.role || "All") === r ? "bg-[#0A0A0A] text-white shadow-md" : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {(filters.search || filters.role !== "All") && (
          <button 
            onClick={clearFilters}
            className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading ? (
           <div className="flex items-center justify-center py-24 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A0A0A]" />
           </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-3xl shadow-sm gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
               <User size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-[#0A0A0A]">No members found</h3>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Try adjusting your search or filters</p>
            </div>
            <button 
              onClick={clearFilters}
              className="mt-2 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all uppercase tracking-widest"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {["Member", "Role", "Status", "Joined Date", "Invited By", ""].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden">
                          {member.avatar ? <img src={member.avatar} alt="" className="w-full h-full object-cover" /> : member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-[#0A0A0A]">{member.name}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${member.role === 'Owner' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600'}`}>
                          {member.role === 'Owner' || member.role === 'Admin' ? <Shield size={12} /> : <User size={12} />}
                        </div>
                        <span className="text-[11px] font-bold text-[#0A0A0A]">{member.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        member.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-gray-500 font-medium">{member.joinedDate}</td>
                    <td className="px-6 py-4 text-[11px] text-gray-500 font-medium">{member.invitedBy}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedMember(member); setIsRoleOpen(true); }}
                        className="p-2 text-gray-300 hover:text-black hover:bg-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      {selectedMember && <RoleModal isOpen={isRoleOpen} onClose={() => { setIsRoleOpen(false); setSelectedMember(null); }} member={selectedMember} />}
    </div>
  );
}

function InviteModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0A0A0A]">Invite Team Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={20} /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input type="email" placeholder="colleague@company.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs outline-none focus:bg-white focus:border-black transition-all" />
            </div>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workspace Role</label>
             <div className="grid grid-cols-2 gap-3">
                {['Admin', 'Member'].map((r) => (
                  <button key={r} className="p-4 border border-gray-100 rounded-2xl text-left hover:border-black transition-all">
                    <div className="text-[11px] font-bold text-[#0A0A0A]">{r}</div>
                    <div className="text-[9px] text-gray-400 mt-1">{r === 'Admin' ? 'Can manage team & settings' : 'Full content creation access'}</div>
                  </button>
                ))}
             </div>
          </div>
          <button className="w-full py-4 bg-[#0A0A0A] text-white rounded-2xl text-xs font-bold hover:shadow-lg transition-all active:scale-[0.98]">
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleModal({ isOpen, onClose, member }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0A0A0A]">Manage Permissions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={20} /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] flex items-center justify-center text-white font-bold">{member.name?.charAt(0)}</div>
             <div>
                <div className="text-sm font-bold text-[#0A0A0A]">{member.name}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.role}</div>
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Role</label>
             <div className="space-y-2">
                {['Admin', 'Member', 'Analyst'].map((r) => (
                   <button key={r} className={`w-full p-4 border rounded-2xl text-left flex items-center justify-between transition-all ${
                     member.role === r ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'
                   }`}>
                      <span className="text-[11px] font-bold text-[#0A0A0A]">{r}</span>
                      {member.role === r && <Check size={14} />}
                   </button>
                ))}
             </div>
          </div>
          <div className="pt-2">
            <button className="w-full py-4 border border-red-100 text-red-600 rounded-2xl text-xs font-bold hover:bg-red-50 transition-all">
              Remove from Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
