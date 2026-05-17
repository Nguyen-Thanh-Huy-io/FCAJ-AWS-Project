import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mrrData = [
  { month: "Jun", mrr: 28000, newMrr: 4200, churnMrr: -800 },
  { month: "Jul", mrr: 30500, newMrr: 3800, churnMrr: -600 },
  { month: "Aug", mrr: 33000, newMrr: 5200, churnMrr: -900 },
  { month: "Sep", mrr: 35800, newMrr: 4100, churnMrr: -700 },
  { month: "Oct", mrr: 37500, newMrr: 3600, churnMrr: -1100 },
  { month: "Nov", mrr: 39200, newMrr: 5500, churnMrr: -800 },
  { month: "Dec", mrr: 41000, newMrr: 4800, churnMrr: -600 },
  { month: "Jan", mrr: 43500, newMrr: 6200, churnMrr: -1200 },
  { month: "Feb", mrr: 44800, newMrr: 3900, churnMrr: -900 },
  { month: "Mar", mrr: 46200, newMrr: 5100, churnMrr: -700 },
  { month: "Apr", mrr: 47600, newMrr: 4800, churnMrr: -1000 },
  { month: "May", mrr: 48291, newMrr: 5300, churnMrr: -900 },
];

const cohortData = [
  { month: "Jan 2025 (142)", m0: 100, m1: 86, m2: 78, m3: 71, m4: 68, m5: 64, m6: 62 },
  { month: "Feb 2025 (167)", m0: 100, m1: 88, m2: 81, m3: 75, m4: 70, m5: 67, m6: null },
  { month: "Mar 2025 (203)", m0: 100, m1: 85, m2: 79, m3: 72, m4: 69, m5: null, m6: null },
  { month: "Apr 2025 (184)", m0: 100, m1: 87, m2: 82, m3: 76, m4: null, m5: null, m6: null },
  { month: "May 2025 (219)", m0: 100, m1: 90, m2: 84, m3: null, m4: null, m5: null, m6: null },
  { month: "Jun 2025 (198)", m0: 100, m1: 88, m2: null, m3: null, m4: null, m5: null, m6: null },
];

function getHeatmapColor(val: number | null) {
  if (val === null) return "#F9FAFB";
  if (val >= 90) return "#0A0A0A";
  if (val >= 80) return "#374151";
  if (val >= 70) return "#6B7280";
  if (val >= 60) return "#9CA3AF";
  return "#D1D5DB";
}

const transactions = [
  { user: "Emma Wilson", plan: "Pro", amount: "$49", date: "May 16", status: "success", type: "Renewal" },
  { user: "Alex Chen", plan: "Agency", amount: "$299", date: "May 16", status: "success", type: "Upgrade" },
  { user: "Sofia Martinez", plan: "Starter", amount: "$19", date: "May 15", status: "success", type: "New" },
  { user: "James Park", plan: "Pro", amount: "$49", date: "May 15", status: "failed", type: "Renewal" },
  { user: "Yuki Tanaka", plan: "Starter", amount: "$19", date: "May 14", status: "success", type: "Refund" },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  New: { bg: "#DCFCE7", color: "#16A34A" },
  Renewal: { bg: "#F3F4F6", color: "#6B7280" },
  Upgrade: { bg: "#DBEAFE", color: "#1D4ED8" },
  Refund: { bg: "#FEE2E2", color: "#DC2626" },
};

export function RevenueDashboard() {
  return (
    <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>Revenue Dashboard</h1>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Platform-wide subscription and financial overview</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Last 12 months ▾</button>
          <button className="px-3 py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Download Report</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "MRR", value: "$48,291", delta: "↑ 12.4%" },
          { label: "ARR", value: "$579,492", delta: "↑ 12.4%" },
          { label: "Active Subscribers", value: "1,247", delta: "↑ 8.2%" },
          { label: "New This Month", value: "89", delta: "↑ 14.1%" },
          { label: "Churned This Month", value: "23", delta: "↓ 0.3%" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-4" style={{ border: "0.5px solid #E5E7EB" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{kpi.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A" }}>{kpi.value}</div>
            <div style={{ fontSize: 10, color: "#16A34A" }}>{kpi.delta}</div>
            {/* Sparkline */}
            <svg viewBox="0 0 80 16" className="w-full mt-2" style={{ height: 16 }}>
              <polyline
                points="0,14 12,10 24,11 36,6 48,8 60,4 72,5 80,2"
                fill="none"
                stroke="#0A0A0A"
                strokeWidth="1"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* MRR Breakdown */}
      <div className="bg-white rounded-xl p-5 mb-6" style={{ border: "0.5px solid #E5E7EB" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 16 }}>MRR Breakdown</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mrrData}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "0.5px solid #E5E7EB" }} />
                <Area type="monotone" dataKey="mrr" stroke="#0A0A0A" fill="none" strokeWidth={1.5} name="MRR" />
                <Line type="monotone" dataKey="newMrr" stroke="#16A34A" strokeWidth={1} strokeDasharray="3 2" name="New MRR" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-center mb-4">
              <div style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A" }}>$48,291</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Total MRR</div>
            </div>
            {/* Donut placeholder */}
            <svg viewBox="0 0 100 100" className="w-28 h-28">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#D1D5DB" strokeWidth="18" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#6B7280" strokeWidth="18" strokeDasharray="70 185" strokeDashoffset="-116" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#0A0A0A" strokeWidth="18" strokeDasharray="55 185" strokeDashoffset="-46" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#444" strokeWidth="18" strokeDasharray="12 185" strokeDashoffset="0" />
            </svg>
            <div className="space-y-1 mt-3">
              {[{ name: "Free", color: "#D1D5DB", pct: "45%" }, { name: "Starter", color: "#6B7280", pct: "28%" }, { name: "Pro", color: "#0A0A0A", pct: "22%" }, { name: "Agency", color: "#444", pct: "5%" }].map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                  <span style={{ fontSize: 10, color: "#6B7280" }}>{p.name} · {p.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subscriber Table */}
      <div className="bg-white rounded-xl overflow-hidden mb-6" style={{ border: "0.5px solid #E5E7EB" }}>
        <div className="px-5 py-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Plan Breakdown</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#F8F8F7", borderBottom: "0.5px solid #E5E7EB" }}>
              {["Plan", "Active Subs", "MRR", "Avg ARPU", "Churn Rate", "New (30d)", "Cancelled (30d)", "Trial→Paid %"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5" style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { plan: "Free", color: "#D1D5DB", subs: "561", mrr: "$0", arpu: "$0", churn: "—", newSubs: "89", cancelled: "—", conv: "12%" },
              { plan: "Starter", color: "#6B7280", subs: "349", mrr: "$6,631", arpu: "$19", churn: "2.8%", newSubs: "42", cancelled: "11", conv: "28%" },
              { plan: "Pro", color: "#0A0A0A", subs: "274", mrr: "$13,426", arpu: "$49", churn: "1.9%", newSubs: "31", cancelled: "6", conv: "35%", highlight: true },
              { plan: "Agency", color: "#444", subs: "63", mrr: "$28,234", arpu: "$448", churn: "0.8%", newSubs: "7", cancelled: "1", conv: "44%" },
            ].map((row) => (
              <tr key={row.plan} style={{ borderBottom: "0.5px solid #F3F4F6", backgroundColor: (row as any).highlight ? "#F8F8F7" : "transparent" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: row.color }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>{row.plan}</span>
                  </div>
                </td>
                {[row.subs, row.mrr, row.arpu, row.churn, row.newSubs, row.cancelled, row.conv].map((val, i) => (
                  <td key={i} className="px-4 py-3" style={{ fontSize: 12, color: "#0A0A0A" }}>{val}</td>
                ))}
              </tr>
            ))}
            <tr style={{ borderTop: "0.5px solid #E5E7EB" }}>
              <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>Total</td>
              {["1,247", "$48,291", "$38.70", "2.1%", "169", "18", "—"].map((val, i) => (
                <td key={i} className="px-4 py-3" style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A" }}>{val}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cohort Analysis */}
      <div className="bg-white rounded-xl overflow-hidden mb-6" style={{ border: "0.5px solid #E5E7EB" }}>
        <div className="px-5 py-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Subscriber Retention Cohorts</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pr-4 pb-2" style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, whiteSpace: "nowrap" }}>Cohort</th>
                {["M0", "M1", "M2", "M3", "M4", "M5", "M6"].map((m) => (
                  <th key={m} className="px-2 pb-2 text-center" style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.map((row) => (
                <tr key={row.month}>
                  <td className="pr-4 py-1" style={{ fontSize: 11, color: "#6B7280", whiteSpace: "nowrap" }}>{row.month}</td>
                  {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5, row.m6].map((val, i) => (
                    <td key={i} className="px-1 py-1">
                      <div
                        className="w-12 h-8 rounded flex items-center justify-center"
                        style={{ backgroundColor: getHeatmapColor(val), color: val !== null && val >= 70 ? "#fff" : "#9CA3AF" }}
                      >
                        {val !== null && <span style={{ fontSize: 10, fontWeight: 500 }}>{val}%</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl overflow-hidden mb-6" style={{ border: "0.5px solid #E5E7EB" }}>
        <div className="px-5 py-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Recent Transactions</span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#F8F8F7", borderBottom: "0.5px solid #E5E7EB" }}>
              {["User", "Plan", "Amount", "Date", "Status", "Type", "Invoice"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5" style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} style={{ borderBottom: "0.5px solid #F3F4F6" }}>
                <td className="px-4 py-3" style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>{t.user}</td>
                <td className="px-4 py-3" style={{ fontSize: 12, color: "#6B7280" }}>{t.plan}</td>
                <td className="px-4 py-3" style={{ fontSize: 12, color: "#0A0A0A" }}>{t.amount}</td>
                <td className="px-4 py-3" style={{ fontSize: 12, color: "#9CA3AF" }}>{t.date}</td>
                <td className="px-4 py-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.status === "success" ? "#16A34A" : "#DC2626" }} />
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded" style={{ fontSize: 10, ...typeColors[t.type] }}>{t.type}</span>
                </td>
                <td className="px-4 py-3">
                  <button style={{ fontSize: 11, color: "#6B7280", border: "0.5px solid #E5E7EB", borderRadius: 6, padding: "2px 8px" }}>↓ PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Geography */}
      <div className="bg-white rounded-xl p-5" style={{ border: "0.5px solid #E5E7EB" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 16 }}>Revenue by Country</div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center justify-center rounded-xl bg-[#F8F8F7]" style={{ height: 140, border: "0.5px solid #E5E7EB" }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>🗺 World map — placeholder</span>
          </div>
          <div className="space-y-2">
            {[
              { flag: "🇺🇸", country: "United States", subs: "542", pct: "43.5%" },
              { flag: "🇬🇧", country: "United Kingdom", subs: "187", pct: "15.0%" },
              { flag: "🇩🇪", country: "Germany", subs: "124", pct: "9.9%" },
              { flag: "🇯🇵", country: "Japan", subs: "98", pct: "7.9%" },
              { flag: "🇻🇳", country: "Vietnam", subs: "76", pct: "6.1%" },
            ].map((c) => (
              <div key={c.country} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span style={{ fontSize: 12, color: "#0A0A0A" }}>{c.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 11, color: "#6B7280" }}>{c.subs} subs</span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{c.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
