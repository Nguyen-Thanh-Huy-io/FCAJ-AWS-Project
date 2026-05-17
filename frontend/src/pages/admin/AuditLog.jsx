import React, { useState } from "react";
import { 
  Shield, ChevronDown, ChevronRight, Search, 
  Download, Filter, AlertCircle, ShieldAlert, 
  User, Activity, Server, Database
} from "lucide-react";
import { StatCard } from "../../components/shared/StatCard";

const logEntries = [
  { id: "L1", time: "09:41:23", actor: "Sarah K.", role: "Editor", action: "PUBLISHED", category: "Content", target: '"Q2 Campaign Post"', ip: "192.168.1.42", status: "success" },
  { id: "L2", time: "09:38:01", actor: "John D.", role: "Admin", action: "INVITED", category: "Team", target: "alex@company.com", ip: "10.0.0.15", status: "success" },
  { id: "L3", time: "09:22:47", actor: "System", role: "Root", action: "FAILED LOGIN", category: "Security", target: "—", ip: "45.33.21.108", status: "failed" },
  { id: "L4", time: "09:15:30", actor: "Maria L.", role: "Creator", action: "SUBMITTED", category: "Content", target: '"Product Launch Stream"', ip: "192.168.1.88", status: "success" },
  { id: "L5", time: "08:59:12", actor: "Nhã Võ", role: "Owner", action: "PLAN UPGRADE", category: "Billing", target: "Pro → Agency", ip: "192.168.1.1", status: "success" },
  { id: "L6", time: "08:44:05", actor: "Sarah K.", role: "Editor", action: "EDITED", category: "Content", target: '"Summer Campaign"', ip: "192.168.1.42", status: "success" },
  { id: "L7", time: "08:30:18", actor: "John D.", role: "Admin", action: "EXPORTED", category: "Data", target: "Analytics Report Q1", ip: "10.0.0.15", status: "success" },
  { id: "L8", time: "08:15:00", actor: "Maria L.", role: "Creator", action: "START STREAM", category: "Stream", target: "Tech Review Q2", ip: "192.168.1.88", status: "success" },
];

const categoryColors = {
  Content: "bg-green-100 text-green-700",
  Team: "bg-blue-100 text-blue-700",
  Security: "bg-red-100 text-red-700",
  Billing: "bg-purple-100 text-purple-700",
  Data: "bg-amber-100 text-amber-700",
  Stream: "bg-rose-100 text-rose-700",
};

export function AuditLog() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F7]" style={{ padding: "40px 60px" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex gap-5">
           <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100 text-[#DC2626]">
              <Shield size={28} />
           </div>
           <div>
             <h1 className="text-2xl font-bold text-[#0A0A0A]">System Audit Log</h1>
             <p className="text-gray-500 mt-1">Immutable record of all administrative and user actions across the platform.</p>
           </div>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Download size={14} /> Export JSON/CSV
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A0A0A] text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg">
              <Filter size={14} /> Advanced Search
           </button>
        </div>
      </div>

      {/* Security Critical Alert */}
      <div className="mb-10 p-6 rounded-[32px] bg-red-50 border border-red-100 flex items-center justify-between animate-pulse">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg">
               <ShieldAlert size={24} />
            </div>
            <div>
               <h3 className="text-sm font-black text-red-700 uppercase tracking-widest">Security Threat Detected</h3>
               <p className="text-sm text-red-600 font-medium">Multiple failed login attempts detected from IP 45.33.21.108 in the last 15 minutes.</p>
            </div>
         </div>
         <div className="flex gap-3">
            <button className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-700">Block Network</button>
            <button className="px-5 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold">Investigate</button>
         </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-6 mb-10">
         <StatCard label="Total Events (24h)" value="12,482" delta="↑ 4.2%" />
         <StatCard label="Security Alerts" value="3" delta="↑ 2" deltaColor="#DC2626" />
         <StatCard label="Active Root Users" value="5" note="Across 2 regions" />
         <StatCard label="Storage Health" value="99.9%" delta="STABLE" />
      </div>

      {/* Log Table Container */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
           <div className="flex items-center gap-6">
              {["All", "Security", "Billing", "Team", "Content"].map(f => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? "text-black border-b-2 border-black pb-1" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {f}
                </button>
              ))}
           </div>
           <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search logs, IPs, actors..." className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-black w-64 transition-all" />
           </div>
        </div>

        <table className="w-full text-left">
           <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                 <th className="px-8 py-4">Timestamp</th>
                 <th className="px-8 py-4">Actor</th>
                 <th className="px-8 py-4">Category</th>
                 <th className="px-8 py-4">Action</th>
                 <th className="px-8 py-4">Status</th>
                 <th className="px-8 py-4"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {logEntries.map((entry, idx) => {
                const isExpanded = expandedRow === idx;
                return (
                  <React.Fragment key={entry.id}>
                    <tr 
                      onClick={() => setExpandedRow(isExpanded ? null : idx)}
                      className={`hover:bg-gray-50/50 transition-colors cursor-pointer group ${entry.status === 'failed' ? 'bg-red-50/30' : ''}`}
                    >
                       <td className="px-8 py-5">
                          <div className="text-xs font-bold text-[#0A0A0A]">May 17, 2026</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 font-mono">{entry.time}</div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-500">{entry.actor[0]}</div>
                             <div>
                                <div className="text-xs font-bold text-[#0A0A0A]">{entry.actor}</div>
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{entry.role} · {entry.ip}</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${categoryColors[entry.category]}`}>
                             {entry.category}
                          </span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="text-xs font-bold text-[#0A0A0A]">{entry.action}</div>
                          <div className="text-[10px] text-gray-400 truncate max-w-[150px]">{entry.target}</div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${entry.status === 'success' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                             <span className={`text-[10px] font-bold uppercase ${entry.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>{entry.status}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <ChevronRight size={16} className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-90 text-black' : ''}`} />
                       </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                         <td colSpan={6} className="bg-gray-50/80 px-8 py-8 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-3 gap-8">
                               <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                     <Activity size={12} /> Execution Details
                                  </h4>
                                  <div className="space-y-2">
                                     <div className="flex justify-between text-[11px]"><span className="text-gray-500">Request ID</span><span className="font-mono font-bold text-gray-800">REQ-9428-AB-26</span></div>
                                     <div className="flex justify-between text-[11px]"><span className="text-gray-500">Trace Mode</span><span className="font-bold text-blue-600">STRICT-COMPLIANCE</span></div>
                                     <div className="flex justify-between text-[11px]"><span className="text-gray-500">Latency</span><span className="font-bold text-gray-800">42ms</span></div>
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                     <Server size={12} /> Infrastructure
                                  </h4>
                                  <div className="space-y-2">
                                     <div className="flex justify-between text-[11px]"><span className="text-gray-500">Node</span><span className="font-bold text-gray-800">AWS-SEA-042</span></div>
                                     <div className="flex justify-between text-[11px]"><span className="text-gray-500">Env</span><span className="font-bold text-green-600 uppercase">Production</span></div>
                                  </div>
                               </div>
                               <div className="space-y-4">
                                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                     <Database size={12} /> Raw Payload
                                  </h4>
                                  <div className="bg-[#0A0A0A] rounded-xl p-3">
                                     <code className="text-[9px] text-green-500 font-mono leading-tight block">
                                        {`{ "action": "${entry.action}", "target_id": "${entry.id}", "meta": { "source": "API", "ver": "2.0" } }`}
                                     </code>
                                  </div>
                               </div>
                            </div>
                         </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
           </tbody>
        </table>

        {/* Footer / Pagination */}
        <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing 50 of 2,847 system events</span>
           <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all">Previous</button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all">Next Page</button>
           </div>
        </div>
      </div>
    </div>
  );
}
