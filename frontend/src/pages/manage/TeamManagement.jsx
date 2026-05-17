import React, { useState } from "react";
import { Search, UserPlus, MoreHorizontal, Check, X, Mail, Shield, User, ChevronUp, ChevronDown } from "lucide-react";

const ROLES = [
  { name: "Owner", color: "#0A0A0A", textColor: "#FFF", bg: "#0A0A0A", desc: "Full control including billing and account deletion. Only 1 per account.", users: 1 },
  { name: "Admin", color: "#374151", textColor: "#FFF", bg: "#374151", desc: "All permissions except billing and account deletion.", users: 2 },
  { name: "Stream Manager", color: "#DC2626", textColor: "#FFF", bg: "#DC2626", desc: "Manages all livestreams: start/stop, stream keys, analytics.", users: 1 },
  { name: "Content Manager", color: "#4B5563", textColor: "#FFF", bg: "#4B5563", desc: "Manages content: schedule posts, approve/reject, media library.", users: 2 },
  { name: "Editor", color: "#6B7280", textColor: "#FFF", bg: "#6B7280", desc: "Creates and edits posts, schedules (needs approval), replies inbox.", users: 3 },
  { name: "Content Creator", color: "#9CA3AF", textColor: "#0A0A0A", bg: "#E5E7EB", desc: "Creates content, must submit for review before publishing.", users: 4 },
  { name: "Stream Operator", color: "#EF4444", textColor: "#7F1D1D", bg: "#FEE2E2", desc: "Operates approved streams only. Monitors chat.", users: 1 },
  { name: "Analyst", color: "#D1D5DB", textColor: "#374151", bg: "#F3F4F6", desc: "View-only access to all analytics and reports. Can export data.", users: 2 },
  { name: "Client", color: "#E5E7EB", textColor: "#6B7280", bg: "#F9FAFB", desc: "Approves/rejects content before publish. View-only analytics.", users: 1 },
];

const TEAM_MEMBERS = [
  { name: "Nguyen Minh", email: "minh@techvn.io", role: "Owner", brands: 3, lastActive: "Just now", avatar: "NM" },
  { name: "Sarah Johnson", email: "sarah@techvn.io", role: "Admin", brands: 3, lastActive: "2h ago", avatar: "SJ" },
  { name: "David Chen", email: "david@techvn.io", role: "Content Manager", brands: 2, lastActive: "1d ago", avatar: "DC" },
  { name: "Maria Garcia", email: "maria@techvn.io", role: "Editor", brands: 1, lastActive: "3h ago", avatar: "MG" },
  { name: "Alex Kim", email: "alex@techvn.io", role: "Editor", brands: 2, lastActive: "5h ago", avatar: "AK" },
  { name: "Tran Lan", email: "lan@techvn.io", role: "Content Creator", brands: 1, lastActive: "1d ago", avatar: "TL" },
  { name: "James Wu", email: "james@techvn.io", role: "Stream Manager", brands: 3, lastActive: "30m ago", avatar: "JW" },
  { name: "Le Hoang", email: "hoang@techvn.io", role: "Analyst", brands: 2, lastActive: "2d ago", avatar: "LH" },
  { name: "Client ABC", email: "client@abc.com", role: "Client", brands: 1, lastActive: "5d ago", avatar: "CA" },
];

const PERMISSIONS_DATA = {
  Livestream: [
    { label: "Xem lịch stream", Owner: true, Admin: true, "Stream Manager": true, "Content Manager": true, Editor: true, Creator: true, Operator: true, Analyst: true, Client: true },
    { label: "Lên lịch stream mới", Owner: true, Admin: true, "Stream Manager": true, "Content Manager": true, Editor: "review", Creator: "review", Operator: false, Analyst: false, Client: false },
    { label: "Bắt đầu / kết thúc stream", Owner: true, Admin: true, "Stream Manager": true, "Content Manager": true, Editor: false, Creator: false, Operator: true, Analyst: false, Client: false },
    { label: "Cài đặt stream key / RTMP", Owner: true, Admin: true, "Stream Manager": true, "Content Manager": false, Editor: false, Creator: false, Operator: false, Analyst: false, Client: false },
    { label: "Approve/reject lịch stream", Owner: true, Admin: true, "Stream Manager": true, "Content Manager": true, Editor: false, Creator: false, Operator: false, Analyst: false, Client: true },
  ],
  Content: [
    { label: "Tạo & lên lịch posts", Owner: true, Admin: true, "Stream Manager": false, "Content Manager": true, Editor: true, Creator: "review", Operator: false, Analyst: false, Client: false },
    { label: "Publish ngay (direct)", Owner: true, Admin: true, "Stream Manager": false, "Content Manager": true, Editor: true, Creator: false, Operator: false, Analyst: false, Client: false },
    { label: "Approve/reject posts", Owner: true, Admin: true, "Stream Manager": false, "Content Manager": true, Editor: false, Creator: false, Operator: false, Analyst: false, Client: true },
    { label: "Upload media library", Owner: true, Admin: true, "Stream Manager": false, "Content Manager": true, Editor: true, Creator: true, Operator: false, Analyst: false, Client: false },
    { label: "Reply Inbox", Owner: true, Admin: true, "Stream Manager": false, "Content Manager": true, Editor: true, Creator: false, Operator: false, Analyst: false, Client: false },
  ],
  Analytics: [
    { label: "Xem analytics tổng hợp", Owner: true, Admin: true, "Stream Manager": true, "Content Manager": true, Editor: true, Creator: false, Operator: false, Analyst: true, Client: true },
    { label: "Xem analytics chi tiết", Owner: true, Admin: true, "Stream Manager": true, "Content Manager": true, Editor: false, Creator: false, Operator: false, Analyst: true, Client: false },
    { label: "Tạo & export Reports", Owner: true, Admin: true, "Stream Manager": true, "Content Manager": true, Editor: false, Creator: false, Operator: false, Analyst: true, Client: false },
  ],
  "Brand Management": [
    { label: "Billing & Plan", Owner: true, Admin: false, "Stream Manager": false, "Content Manager": false, Editor: false, Creator: false, Operator: false, Analyst: false, Client: false },
    { label: "Tạo / xóa Brand", Owner: true, Admin: true, "Stream Manager": false, "Content Manager": false, Editor: false, Creator: false, Operator: false, Analyst: false, Client: false },
    { label: "Mời / xóa team members", Owner: true, Admin: true, "Stream Manager": false, "Content Manager": false, Editor: false, Creator: false, Operator: false, Analyst: false, Client: false },
    { label: "Xem audit logs", Owner: true, Admin: true, "Stream Manager": false, "Content Manager": false, Editor: false, Creator: false, Operator: false, Analyst: false, Client: false },
  ] };

const ROLE_COLS = ["Owner", "Admin", "Stream Manager", "Content Manager", "Editor", "Creator", "Operator", "Analyst", "Client"];

function ToggleSwitch({ enabled, onChange }) {
  return (
    <div 
      onClick={() => onChange(!enabled)}
      className={`w-9 h-5 rounded-full cursor-pointer transition-all flex items-center p-0.5 ${enabled ? "bg-[#16A34A]" : "bg-gray-200"}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${enabled ? "translate-x-4" : "translate-x-0"}`} />
    </div>
  );
}

function RoleModal({ isOpen, onClose }) {
  const [roleName, setRoleName] = useState("Content Creator");
  const [description, setDescription] = useState("");
  const [activeColor, setActiveColor] = useState("#CBD5E1");
  const [isViewOnlyOpen, setIsViewOnlyOpen] = useState(true);
  const [permissions, setPermissions] = useState({
    analytics: true,
    inbox: true,
    planner: true,
    ads: false
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/40 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
           <h2 className="text-xl font-medium text-[#0A0A0A]">Add role</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-black">
              <X size={24} />
           </button>
        </div>

        <div className="p-8">
          {/* Top Row: Name, Color, Description */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-10">
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-[#0A0A0A]">Role name</label>
                    <span className="text-[10px] text-gray-400 font-bold">{roleName.length} / 30</span>
                  </div>
                  <input 
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value.slice(0, 30))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-all text-sm"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-[#0A0A0A]">Description</label>
                    <span className="text-[10px] text-gray-400 font-bold">{description.length} / 400</span>
                  </div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 400))}
                    placeholder="Briefly describe the responsibilities of this role..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-all text-sm h-32 resize-none"
                  />
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-sm font-medium text-[#0A0A0A]">Role color</label>
                <div className="flex gap-4">
                   {["#CBD5E1", "#FEF3C7", "#D1FAE5", "#FCE7F3", "#DBEAFE"].map(c => (
                     <button 
                       key={c} 
                       onClick={() => setActiveColor(c)}
                       className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-105 ${activeColor === c ? "border-[#0A0A0A] ring-2 ring-offset-2 ring-gray-100" : "border-transparent"}`}
                       style={{ backgroundColor: c }}
                     />
                   ))}
                </div>
             </div>
          </div>

          {/* View Only Permissions Accordion */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
             <button 
               onClick={() => setIsViewOnlyOpen(!isViewOnlyOpen)}
               className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-all text-left"
             >
                <span className="font-bold text-[#0A0A0A]">View only permissions</span>
                {isViewOnlyOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
             </button>
             
             {isViewOnlyOpen && (
               <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-x-12 gap-y-8 animate-in slide-in-from-top-2 duration-200">
                  {/* Item 1 */}
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0A0A0A]">View analytics</span>
                        <ToggleSwitch enabled={permissions.analytics} onChange={(v) => setPermissions(p => ({...p, analytics: v}))} />
                     </div>
                     <p className="text-xs text-gray-400 leading-relaxed">
                        Allows you to view analytics for all connected networks, manage your competitors and view Hashtag Tracker sessions. It does not allow you to download any information.
                     </p>
                  </div>

                  {/* Item 2 */}
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0A0A0A]">View inbox</span>
                        <ToggleSwitch enabled={permissions.inbox} onChange={(v) => setPermissions(p => ({...p, inbox: v}))} />
                     </div>
                     <p className="text-xs text-gray-400 leading-relaxed">
                        Allows you to view Inbox conversations and notes, but does not allow you to reply to direct messages or comments, or to create, edit or delete notes.
                     </p>
                  </div>

                  {/* Item 3 */}
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0A0A0A]">View planner</span>
                        <ToggleSwitch enabled={permissions.planner} onChange={(v) => setPermissions(p => ({...p, planner: v}))} />
                     </div>
                     <p className="text-xs text-gray-400 leading-relaxed">
                        Allows you to view the entire publishing calendar as well as planned posts.
                     </p>
                  </div>

                  {/* Item 4 */}
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0A0A0A]">View ads</span>
                        <ToggleSwitch enabled={permissions.ads} onChange={(v) => setPermissions(p => ({...p, ads: v}))} />
                     </div>
                     <p className="text-xs text-gray-400 leading-relaxed">
                        Allows you to view all information related to ad campaigns, but not to create or manage them.
                     </p>
                  </div>
               </div>
             )}
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 flex justify-end gap-4">
           <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all">Cancel</button>
           <button className="px-8 py-2.5 rounded-xl bg-[#0A0A0A] text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-lg">Save Role</button>
        </div>
      </div>
    </div>
  );
}

function InviteModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
           <h3 className="font-bold text-[#0A0A0A]">Invite team member</h3>
           <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md transition-all"><X size={20} className="text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-5">
           <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="colleague@company.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0A0A0A] outline-none text-sm transition-all" />
              </div>
           </div>
           <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assign Role</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0A0A0A] outline-none text-sm cursor-pointer transition-all bg-white">
                 {ROLES.filter(r => r.name !== "Owner").map(r => (
                   <option key={r.name}>{r.name}</option>
                 ))}
              </select>
           </div>
           <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[11px] text-gray-500 leading-relaxed">Invited users will receive an email with a link to join your organization and set up their password.</p>
           </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex gap-3">
           <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all">Cancel</button>
           <button className="flex-1 py-2.5 rounded-xl bg-[#0A0A0A] text-white text-sm font-bold hover:bg-gray-800 transition-all">Send Invitation</button>
        </div>
      </div>
    </div>
  );
}

function getRoleStyle(roleName) {
  const r = ROLES.find((r) => r.name === roleName);
  if (!r) return { background: "#F3F4F6", color: "#6B7280" };
  return { background: r.bg, color: r.textColor };
}

export function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState("members");
  const [search, setSearch] = useState("");
  const [openRow, setOpenRow] = useState(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const filtered = TEAM_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#F8F8F7", padding: "20px 24px" }}>
      {/* Tab Bar */}
      <div className="flex items-center gap-1 mb-5" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
        {(["members", "roles"]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="cursor-pointer capitalize"
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              color: activeTab === tab ? "#0A0A0A" : "#6B7280",
              borderBottom: activeTab === tab ? "2px solid #0A0A0A" : "2px solid transparent",
              background: "none",
              marginBottom: -0.5 }}
          >
            {tab === "members" ? "Team Members" : "Roles & Permissions"}
          </button>
        ))}
      </div>

      {activeTab === "members" ? (
        <div className="flex flex-col gap-4">
          {/* Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1" style={{ maxWidth: 280 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 10px 7px 30px",
                  borderRadius: 8,
                  border: "0.5px solid #E5E7EB",
                  fontSize: 12,
                  outline: "none",
                  background: "#FFF" }}
              />
            </div>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 cursor-pointer rounded-lg ml-auto"
              style={{ padding: "7px 14px", background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500, borderRadius: 8 }}
            >
              <UserPlus size={13} /> Invite Member
            </button>
          </div>

          {/* Table */}
          <div style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid #E5E7EB" }}>
                  {["Member", "Email", "Role", "Brands", "Last Active", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        fontSize: 10,
                        fontWeight: 500,
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        textAlign: "left" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((member, i) => {
                  const roleStyle = getRoleStyle(member.role);
                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: "0.5px solid #F0F0EF" }}
                      onMouseEnter={(e) => ((e.currentTarget).style.background = "#FAFAFA")}
                      onMouseLeave={(e) => ((e.currentTarget).style.background = "transparent")}
                    >
                      <td style={{ padding: "10px 16px" }}>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center justify-center rounded-full shrink-0"
                            style={{ width: 28, height: 28, background: "#E5E7EB", fontSize: 10, fontWeight: 600, color: "#374151" }}
                          >
                            {member.avatar}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>{member.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "#6B7280" }}>{member.email}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 500,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: roleStyle.background,
                            color: roleStyle.color }}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: "#F3F4F6",
                            color: "#6B7280" }}
                        >
                          {member.brands} brands
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 11, color: "#9CA3AF" }}>{member.lastActive}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <div className="relative">
                          <button
                            onClick={() => setOpenRow(openRow === i ? null : i)}
                            className="cursor-pointer"
                            style={{ color: "#9CA3AF", padding: 4 }}
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          {openRow === i && (
                            <div
                              className="absolute right-0 rounded-lg overflow-hidden"
                              style={{
                                top: "100%",
                                background: "#0A0A0A",
                                border: "0.5px solid #222",
                                zIndex: 20,
                                minWidth: 150 }}
                            >
                              {["Edit Role", "Remove from Brand", "Resend Invite"].map((action) => (
                                <button
                                  key={action}
                                  className="block w-full text-left px-4 py-2 cursor-pointer"
                                  style={{ fontSize: 12, color: action.includes("Remove") ? "#EF4444" : "#DDD" }}
                                  onMouseEnter={(e) => ((e.currentTarget).style.background = "#161616")}
                                  onMouseLeave={(e) => ((e.currentTarget).style.background = "transparent")}
                                  onClick={() => setOpenRow(null)}
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Role Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Role Cards</span>
              <button
                onClick={() => setIsRoleOpen(true)}
                className="flex items-center gap-2 cursor-pointer rounded-lg"
                style={{ padding: "6px 14px", background: "#0A0A0A", color: "#FFF", fontSize: 12, fontWeight: 500, borderRadius: 8 }}
              >
                + Add Custom Role
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {ROLES.map((role) => (
                <div
                  key={role.name}
                  className="group relative cursor-pointer"
                  style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, padding: 12 }}
                  onMouseEnter={(e) => ((e.currentTarget).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget).style.boxShadow = "none")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="rounded-full"
                      style={{ width: 8, height: 8, background: role.color }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", flex: 1 }}>{role.name}</span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 9999,
                        background: "#F3F4F6",
                        color: "#6B7280" }}
                    >
                      {role.users} users
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>{role.desc}</p>
                </div>
              ))}
              {/* Create custom */}
              <div
                onClick={() => setIsRoleOpen(true)}
                className="cursor-pointer flex items-center justify-center"
                style={{
                  background: "transparent",
                  border: "0.5px dashed #E5E7EB",
                  borderRadius: 12,
                  padding: 24,
                  color: "#9CA3AF",
                  fontSize: 12,
                  gap: 6 }}
              >
                + Create Custom Role
              </div>
            </div>
          </div>

          {/* Permission Matrix */}
          <div style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "0.5px solid #E5E7EB" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Permission Matrix</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                <thead>
                  <tr style={{ background: "#FAFAFA", borderBottom: "0.5px solid #E5E7EB", position: "sticky", top: 0, zIndex: 10 }}>
                    <th style={{ padding: "8px 16px", fontSize: 10, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", textAlign: "left", minWidth: 200 }}>
                      Permission
                    </th>
                    {ROLE_COLS.map((col) => (
                      <th key={col} style={{ padding: "8px 8px", fontSize: 9, fontWeight: 500, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", textAlign: "center", minWidth: 80 }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(PERMISSIONS_DATA).map(([section, perms]) => (
                    <React.Fragment key={section}>
                      <tr style={{ background: "#F9FAFB" }}>
                        <td
                          colSpan={ROLE_COLS.length + 1}
                          style={{ padding: "6px 16px", fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px" }}
                        >
                          {section}
                        </td>
                      </tr>
                      {perms.map((perm, pi) => {
                        return (
                          <tr key={`${section}-${pi}`} style={{ borderBottom: "0.5px solid #F0F0EF" }}>
                            <td style={{ padding: "8px 16px", fontSize: 12, color: "#374151" }}>{perm.label}</td>
                            {ROLE_COLS.map((col) => {
                              const key = col === "Creator" ? "Creator" : col;
                              const val = perm[key];
                              return (
                                <td key={col} style={{ padding: "8px 8px", textAlign: "center" }}>
                                  {val === true ? (
                                    <Check size={13} style={{ color: "#0A0A0A", margin: "0 auto" }} />
                                  ) : val === "review" ? (
                                    <span style={{ fontSize: 10, color: "#D97706" }}>*</span>
                                  ) : (
                                    <span style={{ fontSize: 12, color: "#D1D5DB" }}>—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      <RoleModal isOpen={isRoleOpen} onClose={() => setIsRoleOpen(false)} />
    </div>
  );
}
