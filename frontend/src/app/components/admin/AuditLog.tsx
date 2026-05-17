import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const logEntries = [
  { time: "09:41:23", actor: "Sarah K.", role: "Editor", action: "PUBLISHED", actionType: "publish", target: '"Q2 Campaign Post"', ip: "192.168.1.42", status: "success" },
  { time: "09:38:01", actor: "John D.", role: "Admin", action: "INVITED", actionType: "create", target: "alex@company.com", ip: "10.0.0.15", status: "success" },
  { time: "09:22:47", actor: "System", role: "system", action: "FAILED LOGIN", actionType: "delete", target: "—", ip: "45.33.21.108", status: "failed" },
  { time: "09:15:30", actor: "Maria L.", role: "Creator", action: "SUBMITTED", actionType: "create", target: '"Product Launch Stream"', ip: "192.168.1.88", status: "success" },
  { time: "08:59:12", actor: "Owner", role: "Owner", action: "PLAN UPGRADE", actionType: "edit", target: "Pro → Agency", ip: "192.168.1.1", status: "success" },
  { time: "08:44:05", actor: "Sarah K.", role: "Editor", action: "EDITED", actionType: "edit", target: '"Summer Campaign"', ip: "192.168.1.42", status: "success" },
  { time: "08:30:18", actor: "John D.", role: "Admin", action: "EXPORTED", actionType: "export", target: "Analytics Report Q1", ip: "10.0.0.15", status: "success" },
  { time: "08:15:00", actor: "Maria L.", role: "Creator", action: "START STREAM", actionType: "stream", target: "Tech Review Q2", ip: "192.168.1.88", status: "success" },
];

const actionColors: Record<string, { bg: string; color: string }> = {
  create: { bg: "#CCFBF1", color: "#0F766E" },
  edit: { bg: "#DBEAFE", color: "#1D4ED8" },
  delete: { bg: "#FEE2E2", color: "#DC2626" },
  export: { bg: "#FEF3C7", color: "#D97706" },
  publish: { bg: "#DCFCE7", color: "#16A34A" },
  stream: { bg: "#FEE2E2", color: "#DC2626" },
};

const filterOptions = ["All", "Login", "Content", "Stream", "Team", "Settings", "Billing", "API"];

export function AuditLog() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  return (
    <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>Audit Log</h1>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>All account activity with timestamps. Read-only.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Export CSV</button>
          <button className="px-3 py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>May 1 – May 16 ▾</button>
        </div>
      </div>

      {/* Security alert */}
      <div className="mb-4 px-4 py-3 rounded-lg flex items-center justify-between" style={{ border: "0.5px solid #D97706", backgroundColor: "#FFFBEB" }}>
        <p style={{ fontSize: 12, color: "#D97706" }}>
          ⚠ 3 failed login attempts from 45.33.21.108 in the last hour.
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-md" style={{ fontSize: 11, backgroundColor: "#D97706", color: "#fff" }}>Block IP</button>
          <button style={{ fontSize: 11, color: "#9CA3AF" }}>Dismiss</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select style={{ fontSize: 12, border: "0.5px solid #E5E7EB", borderRadius: 8, padding: "6px 12px", color: "#6B7280" }}>
          <option>All Users ▾</option>
          <option>Sarah K.</option>
          <option>John D.</option>
          <option>Maria L.</option>
        </select>
        <div className="flex gap-1.5 flex-wrap">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-md transition-colors"
              style={{
                fontSize: 11,
                backgroundColor: activeFilter === f ? "#0A0A0A" : "#F3F4F6",
                color: activeFilter === f ? "#fff" : "#6B7280",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          placeholder="Search actions or IPs..."
          style={{ fontSize: 12, border: "0.5px solid #E5E7EB", borderRadius: 8, padding: "6px 12px", width: 200, color: "#0A0A0A" }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Events (30d)", value: "2,847" },
          { label: "Failed Actions", value: "23" },
          { label: "Unique Actors", value: "14" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4" style={{ border: "0.5px solid #E5E7EB" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#0A0A0A" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Log table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "0.5px solid #E5E7EB" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "0.5px solid #E5E7EB", backgroundColor: "#F8F8F7" }}>
              {["Timestamp", "Actor", "Action", "Target", "IP Address", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3" style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logEntries.map((entry, idx) => (
              <>
                <tr
                  key={idx}
                  className="cursor-pointer hover:bg-[#F8F8F7] transition-colors"
                  style={{
                    borderBottom: "0.5px solid #F3F4F6",
                    backgroundColor: entry.status === "failed" ? "rgba(220,38,38,0.04)" : "transparent",
                  }}
                  onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                >
                  <td className="px-4 py-3" style={{ fontSize: 12, fontFamily: "monospace", color: "#9CA3AF" }}>May 14, 2025 · {entry.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                        <span style={{ fontSize: 9, fontWeight: 500, color: "#6B7280" }}>{entry.actor[0]}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>{entry.actor}</span>
                      <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 9, backgroundColor: "#F3F4F6", color: "#9CA3AF" }}>{entry.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        fontSize: 10,
                        backgroundColor: actionColors[entry.actionType]?.bg || "#F3F4F6",
                        color: actionColors[entry.actionType]?.color || "#6B7280",
                      }}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: 13, color: "#0A0A0A" }}>{entry.target}</td>
                  <td className="px-4 py-3" style={{ fontSize: 11, fontFamily: "monospace", color: "#9CA3AF" }}>{entry.ip}</td>
                  <td className="px-4 py-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.status === "success" ? "#16A34A" : "#DC2626" }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {expandedRow === idx ? <ChevronDown size={14} color="#9CA3AF" /> : <ChevronRight size={14} color="#9CA3AF" />}
                  </td>
                </tr>
                {expandedRow === idx && (
                  <tr key={`expanded-${idx}`} style={{ borderBottom: "0.5px solid #F3F4F6" }}>
                    <td colSpan={7}>
                      <div className="p-4 bg-[#0A0A0A] mx-4 mb-3 rounded-lg">
                        <pre style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
                          {JSON.stringify({
                            action: entry.action,
                            actor: entry.actor,
                            target: entry.target,
                            timestamp: `2025-05-14T0${entry.time}Z`,
                            requestId: `req_${Math.random().toString(36).slice(2, 9)}`,
                            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                            sessionId: `sess_${Math.random().toString(36).slice(2, 9)}`,
                            ip: entry.ip,
                          }, null, 2)}
                        </pre>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "0.5px solid #E5E7EB" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Showing 1–50 of 2,847 events</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>← Prev</button>
            <button className="px-3 py-1.5 rounded-md" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Next →</button>
            <select style={{ fontSize: 11, border: "0.5px solid #E5E7EB", borderRadius: 6, padding: "4px 8px", color: "#6B7280" }}>
              <option>50 per page</option>
              <option>100 per page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
