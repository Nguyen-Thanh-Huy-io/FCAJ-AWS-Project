import { useState } from "react";
import { MoreHorizontal, Plus, X, Check } from "lucide-react";

interface PlanData {
  name: string;
  status: "active" | "hidden" | "archived";
  mostPopular: boolean;
  monthly: number;
  annual: number;
  limits: Record<string, string | number>;
  ctaLabel: string;
  ctaAction: "signup" | "contact" | "disabled";
}

const initialPlans: PlanData[] = [
  {
    name: "Free",
    status: "active",
    mostPopular: false,
    monthly: 0,
    annual: 0,
    limits: { "Social Brands": 1, "Team Members": 1, "Posts/month": 50, "Storage": "500MB", "Stream Hours": 0, "Platforms": 3 },
    ctaLabel: "Get started free",
    ctaAction: "signup",
  },
  {
    name: "Starter",
    status: "active",
    mostPopular: false,
    monthly: 19,
    annual: 15,
    limits: { "Social Brands": 3, "Team Members": 5, "Posts/month": 200, "Storage": "5GB", "Stream Hours": 10, "Platforms": "∞" },
    ctaLabel: "Upgrade to Starter",
    ctaAction: "signup",
  },
  {
    name: "Pro",
    status: "active",
    mostPopular: true,
    monthly: 49,
    annual: 39,
    limits: { "Social Brands": 10, "Team Members": "∞", "Posts/month": 500, "Storage": "20GB", "Stream Hours": "∞", "Platforms": "∞" },
    ctaLabel: "Start Pro",
    ctaAction: "signup",
  },
  {
    name: "Agency",
    status: "active",
    mostPopular: false,
    monthly: 0,
    annual: 0,
    limits: { "Social Brands": "∞", "Team Members": "∞", "Posts/month": "∞", "Storage": "100GB", "Stream Hours": "∞", "Platforms": "∞" },
    ctaLabel: "Contact sales",
    ctaAction: "contact",
  },
];

const featureMatrix = [
  { section: "📅 Planner & Publishing", features: [
    { name: "Calendar view", free: true, starter: true, pro: true, agency: true },
    { name: "Bulk scheduling", free: false, starter: true, pro: true, agency: true },
    { name: "AI best time suggestions", free: false, starter: false, pro: true, agency: true },
    { name: "Approval workflow", free: false, starter: "Basic", pro: true, agency: true },
  ]},
  { section: "📡 Livestream", features: [
    { name: "Stream scheduling", free: false, starter: true, pro: true, agency: true },
    { name: "Multi-platform streaming", free: false, starter: false, pro: true, agency: true },
    { name: "Live chat moderation", free: false, starter: false, pro: true, agency: true },
  ]},
  { section: "📊 Analytics", features: [
    { name: "Social analytics", free: "Basic", starter: true, pro: true, agency: true },
    { name: "Livestream analytics", free: false, starter: false, pro: true, agency: true },
    { name: "Competitor benchmarking", free: false, starter: false, pro: true, agency: true },
    { name: "Report export", free: false, starter: "PDF", pro: "PDF/CSV", agency: "All formats" },
  ]},
  { section: "🛠 Support", features: [
    { name: "Email support", free: false, starter: true, pro: true, agency: true },
    { name: "Priority support", free: false, starter: false, pro: true, agency: "24/7" },
    { name: "Dedicated manager", free: false, starter: false, pro: false, agency: true },
  ]},
];

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <Check size={14} color="#16A34A" />;
  if (val === false) return <X size={14} color="#9CA3AF" />;
  return <span style={{ fontSize: 11, color: "#0A0A0A" }}>{val}</span>;
}

function PublishModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      <div className="bg-white rounded-2xl p-6" style={{ width: 440, border: "0.5px solid #E5E7EB" }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A", marginBottom: 16 }}>Confirm Plan Changes</div>
        <div className="space-y-1.5 mb-4">
          {["• Pro plan: monthly price $49 → $59", "• Starter: posts limit 200 → 300", "• Free: added 'Stream Hours' limit = 0"].map((c) => (
            <p key={c} style={{ fontSize: 12, color: "#6B7280" }}>{c}</p>
          ))}
        </div>
        <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: "#FFFBEB", border: "0.5px solid #D97706" }}>
          <p style={{ fontSize: 12, color: "#D97706" }}>
            ⚠ 892 existing Pro subscribers will see new price at their next renewal date.
          </p>
        </div>
        <label className="flex items-start gap-2 mb-6 cursor-pointer">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-0.5" />
          <span style={{ fontSize: 12, color: "#0A0A0A" }}>I understand — notify affected users via email</span>
        </label>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Cancel</button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ fontSize: 12, backgroundColor: checked ? "#0A0A0A" : "#E5E7EB", color: checked ? "#fff" : "#9CA3AF", cursor: checked ? "pointer" : "not-allowed" }}
            disabled={!checked}
          >
            Confirm & Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminPricing() {
  const [plans, setPlans] = useState(initialPlans);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [unsavedCount, setUnsavedCount] = useState(2);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Page header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A" }}>Plans & Pricing Configuration</h1>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            Manage subscription tiers, feature limits, and pricing. Changes take effect immediately for new subscribers.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg hover:bg-[#F8F8F7] transition-colors" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#0A0A0A" }}>
            Preview Public Page ↗
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-white hover:bg-[#1E1E1E] transition-colors" style={{ fontSize: 12 }}>
            <Plus size={12} className="inline mr-1" />Add New Plan
          </button>
        </div>
      </div>

      {/* Warning banner */}
      <div className="mb-6 px-4 py-3 rounded-lg" style={{ backgroundColor: "#FFFBEB", border: "0.5px solid #D97706" }}>
        <p style={{ fontSize: 12, color: "#D97706" }}>
          ⚠ Editing active plans will affect existing subscribers. Changes to limits apply at next billing cycle.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {plans.map((plan, planIdx) => (
          <div key={plan.name} className="bg-white rounded-xl p-5" style={{ border: "0.5px solid #E5E7EB" }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <input
                value={plan.name}
                onChange={(e) => {
                  const next = [...plans]; next[planIdx] = { ...plan, name: e.target.value }; setPlans(next);
                }}
                style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", background: "transparent", outline: "none", borderBottom: "0.5px dashed #9CA3AF", width: 80 }}
              />
              <button><MoreHorizontal size={14} color="#9CA3AF" /></button>
            </div>

            {/* Status + popular toggle */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {(["active", "hidden", "archived"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { const next = [...plans]; next[planIdx] = { ...plan, status: s }; setPlans(next); }}
                  className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: 10, backgroundColor: plan.status === s ? (s === "active" ? "#DCFCE7" : s === "archived" ? "#FEF2F2" : "#F3F4F6") : "#F3F4F6", color: plan.status === s ? (s === "active" ? "#16A34A" : s === "archived" ? "#DC2626" : "#6B7280") : "#9CA3AF" }}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => { const next = plans.map((p, i) => ({ ...p, mostPopular: i === planIdx })); setPlans(next); }}
              className="mb-4 px-2 py-0.5 rounded-full w-full"
              style={{ fontSize: 10, fontWeight: 500, backgroundColor: plan.mostPopular ? "#0A0A0A" : "transparent", color: plan.mostPopular ? "#fff" : "#9CA3AF", border: "0.5px solid #E5E7EB" }}
            >
              MOST POPULAR
            </button>

            {/* Pricing */}
            <div className="mb-4">
              <div className="flex items-baseline gap-1 mb-1">
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>$</span>
                <input
                  type="number"
                  value={plan.monthly}
                  onChange={(e) => { const next = [...plans]; next[planIdx] = { ...plan, monthly: Number(e.target.value) }; setPlans(next); setUnsavedCount((c) => c + 1); }}
                  style={{ fontSize: 24, fontWeight: 600, color: "#0A0A0A", width: 60, background: "transparent", outline: "none", borderBottom: "0.5px dashed #9CA3AF" }}
                />
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>/month</span>
              </div>
              {plan.monthly > 0 && plan.annual > 0 && (
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>
                  ${plan.annual}/mo (annually) — <span style={{ color: "#16A34A" }}>{Math.round((1 - plan.annual / plan.monthly) * 100)}% off</span>
                </div>
              )}
            </div>

            {/* Limits */}
            <div>
              <p style={{ fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>LIMITS</p>
              {Object.entries(plan.limits).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-1.5" style={{ borderBottom: "0.5px solid #F0F0F0" }}>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>{key}</span>
                  <input
                    value={val}
                    onChange={(e) => {
                      const next = [...plans];
                      next[planIdx] = { ...plan, limits: { ...plan.limits, [key]: e.target.value } };
                      setPlans(next);
                    }}
                    style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A", width: 50, textAlign: "right", background: "transparent", outline: "none", borderBottom: "0.5px dashed #9CA3AF" }}
                  />
                </div>
              ))}
            </div>

            {/* CTA config */}
            <div className="mt-4">
              <input
                value={plan.ctaLabel}
                onChange={(e) => { const next = [...plans]; next[planIdx] = { ...plan, ctaLabel: e.target.value }; setPlans(next); }}
                className="w-full px-2 py-1 rounded-md mb-2"
                style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#0A0A0A" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Feature Matrix */}
      <div className="bg-white rounded-xl mb-6" style={{ border: "0.5px solid #E5E7EB" }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Feature Matrix</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg" style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Add Feature</button>
            <button className="px-3 py-1.5 rounded-lg" style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>Add Section</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "0.5px solid #E5E7EB" }}>
                <th className="text-left p-4" style={{ width: 280, fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>Feature</th>
                {["Free", "Starter $19/mo", "Pro $49/mo", "Agency"].map((h) => (
                  <th key={h} className="p-4 text-center" style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((group) => (
                <>
                  <tr
                    key={group.section}
                    className="cursor-pointer hover:bg-[#F8F8F7]"
                    style={{ backgroundColor: "#F8F8F7" }}
                    onClick={() => toggleSection(group.section)}
                  >
                    <td colSpan={5} className="px-4 py-2" style={{ fontSize: 12, fontWeight: 500, color: "#0A0A0A" }}>
                      {collapsedSections.has(group.section) ? "▶" : "▼"} {group.section}
                    </td>
                  </tr>
                  {!collapsedSections.has(group.section) && group.features.map((feature) => (
                    <tr key={feature.name} className="hover:bg-[#F8F8F7] group" style={{ borderBottom: "0.5px solid #F3F4F6" }}>
                      <td className="px-4 py-2.5" style={{ fontSize: 12, color: "#6B7280" }}>{feature.name}</td>
                      {([feature.free, feature.starter, feature.pro, feature.agency] as (boolean | string)[]).map((val, i) => (
                        <td key={i} className="px-4 py-2.5 text-center">
                          <div className="flex items-center justify-center">
                            <CellValue val={val} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Settings */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Trial & Discount */}
        <div className="bg-white rounded-xl p-5" style={{ border: "0.5px solid #E5E7EB" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 16 }}>Trial Settings</p>
          <div className="space-y-3">
            {[
              { label: "Offer free trial", enabled: true },
              { label: "Require credit card for trial", enabled: false },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</span>
                <div className={`w-9 h-5 rounded-full ${s.enabled ? "bg-[#0A0A0A]" : "bg-[#E5E7EB]"} flex items-center ${s.enabled ? "justify-end pr-0.5" : "justify-start pl-0.5"}`}>
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: "#6B7280" }}>Trial duration</span>
              <div className="flex items-center gap-1">
                <input defaultValue="14" type="number" style={{ width: 40, fontSize: 12, border: "0.5px solid #E5E7EB", borderRadius: 6, padding: "2px 6px", textAlign: "center" }} />
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>days</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid #E5E7EB", margin: "16px 0" }} />
          <p style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>Coupon / Discount</p>
          <button className="px-3 py-1.5 rounded-lg w-full" style={{ fontSize: 11, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>
            + Create Coupon
          </button>
          <div className="mt-3 space-y-2">
            {[{ code: "LAUNCH20", discount: "20%", expiry: "Dec 31", uses: 142, active: true }].map((c) => (
              <div key={c.code} className="flex items-center justify-between py-1.5" style={{ borderBottom: "0.5px solid #F0F0F0" }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#0A0A0A" }}>{c.code}</span>
                <span style={{ fontSize: 10, color: "#6B7280" }}>{c.discount} · {c.uses} uses</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment config */}
        <div className="bg-white rounded-xl p-5" style={{ border: "0.5px solid #E5E7EB" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 16 }}>Payment Configuration</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: "#6B7280" }}>Payment gateway</span>
              <span style={{ fontSize: 11, color: "#16A34A" }}>Stripe ✅ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: "#6B7280" }}>Default currency</span>
              <select style={{ fontSize: 11, border: "0.5px solid #E5E7EB", borderRadius: 6, padding: "2px 8px", color: "#0A0A0A" }}>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: "#6B7280" }}>Collect VAT/GST</span>
              <div className="flex items-center gap-2">
                <div className="w-9 h-5 rounded-full bg-[#0A0A0A] flex items-center justify-end pr-0.5">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <input defaultValue="10" type="number" style={{ width: 40, fontSize: 11, border: "0.5px solid #E5E7EB", borderRadius: 6, padding: "2px 6px", textAlign: "center" }} />
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>%</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid #E5E7EB", margin: "16px 0" }} />
          <p style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>Billing Cycle</p>
          <div className="flex gap-4">
            {["Monthly", "Annual"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="billing" defaultChecked={opt === "Annual"} />
                <span style={{ fontSize: 12, color: "#0A0A0A" }}>{opt}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span style={{ fontSize: 12, color: "#6B7280" }}>Grace period after failed payment</span>
            <div className="flex items-center gap-1">
              <input defaultValue="3" type="number" style={{ width: 36, fontSize: 11, border: "0.5px solid #E5E7EB", borderRadius: 6, padding: "2px 6px", textAlign: "center" }} />
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Analytics */}
      <div className="bg-white rounded-xl p-5 mb-24" style={{ border: "0.5px solid #E5E7EB" }}>
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>Subscription Overview</span>
          <button style={{ fontSize: 12, color: "#6B7280" }}>View Revenue Dashboard →</button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Subscribers", value: "1,247", delta: "↑ 8.2% this month", deltaColor: "#16A34A" },
            { label: "MRR", value: "$48,291", delta: "↑ 12.4%", deltaColor: "#16A34A" },
            { label: "Churn Rate", value: "2.1%", delta: "↓ 0.3% vs last month", deltaColor: "#16A34A" },
            { label: "Avg Revenue Per User", value: "$38.70", delta: "", deltaColor: "#9CA3AF" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl" style={{ border: "0.5px solid #E5E7EB" }}>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#0A0A0A" }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: stat.deltaColor }}>{stat.delta}</div>
            </div>
          ))}
        </div>

        {/* Distribution bar */}
        <div className="mb-3">
          <div className="flex rounded-full overflow-hidden" style={{ height: 20 }}>
            <div style={{ width: "45%", backgroundColor: "#D1D5DB" }} />
            <div style={{ width: "28%", backgroundColor: "#6B7280" }} />
            <div style={{ width: "22%", backgroundColor: "#0A0A0A" }} />
            <div style={{ width: "5%", backgroundColor: "#444" }} />
          </div>
        </div>
        <div className="flex gap-6 flex-wrap">
          {[
            { name: "Free", color: "#D1D5DB", pct: "45%", subs: "561", mrr: "$0" },
            { name: "Starter", color: "#6B7280", pct: "28%", subs: "349", mrr: "$6,631" },
            { name: "Pro", color: "#0A0A0A", pct: "22%", subs: "274", mrr: "$13,426" },
            { name: "Agency", color: "#444", pct: "5%", subs: "63", mrr: "$28,234" },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} />
              <span style={{ fontSize: 11, color: "#6B7280" }}>{p.name} · {p.pct} · {p.subs} subs · {p.mrr} MRR</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky footer */}
      <div
        className="fixed bottom-0 right-0 flex items-center justify-between px-6 h-14 bg-white"
        style={{ borderTop: "0.5px solid #E5E7EB", left: 208 }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>Last saved: 5 minutes ago</span>
          {unsavedCount > 0 && (
            <span className="px-2 py-0.5 rounded" style={{ fontSize: 10, backgroundColor: "#FFFBEB", color: "#D97706", border: "0.5px solid #D97706" }}>
              ⚠ {unsavedCount} unsaved changes
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setUnsavedCount(0)} className="px-4 py-2 rounded-lg" style={{ fontSize: 12, border: "0.5px solid #E5E7EB", color: "#6B7280" }}>
            Discard Changes
          </button>
          <button onClick={() => setShowPublishModal(true)} className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-white" style={{ fontSize: 12 }}>
            Save & Publish
          </button>
        </div>
      </div>

      {showPublishModal && (
        <PublishModal onClose={() => setShowPublishModal(false)} onConfirm={() => { setShowPublishModal(false); setUnsavedCount(0); }} />
      )}
    </div>
  );
}
