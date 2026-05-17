import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Minus, ChevronDown } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    subtitle: "Perfect to get started",
    cta: "Current Plan",
    ctaDisabled: true,
    highlight: false,
    features: {
      social: ["1 Brand", "2 Social profiles", "10 Posts per month", "Content calendar", "Post scheduling"],
      live: ["—", "—", "—", "—"],
    }
  },
  {
    name: "Starter",
    price: { monthly: 19, annual: 15 },
    subtitle: "For solo creators",
    cta: "Upgrade to Starter",
    ctaDisabled: false,
    highlight: false,
    features: {
      social: ["3 Brands", "7 Social profiles", "100 Posts per month", "Content calendar", "Post scheduling"],
      live: ["2 Platforms", "720p Streaming", "Multi-stream", "Media library"],
    }
  },
  {
    name: "Pro",
    price: { monthly: 49, annual: 39 },
    subtitle: "For growing teams",
    cta: "Upgrade to Pro",
    ctaDisabled: false,
    highlight: true,
    features: {
      social: ["10 Brands", "Unlimited profiles", "500 Posts per month", "Content calendar", "Post scheduling"],
      live: ["7 Platforms", "1080p Streaming", "Stream analytics", "Multi-stream"],
    }
  },
  {
    name: "Agency",
    price: { monthly: null, annual: null },
    subtitle: "For agencies & enterprises",
    cta: "Contact Sales",
    ctaDisabled: false,
    highlight: false,
    features: {
      social: ["Unlimited Brands", "Unlimited profiles", "Unlimited Posts", "Content calendar", "Post scheduling"],
      live: ["All Platforms", "4K Streaming", "Stream analytics", "Multi-stream"],
    }
  },
];

const COMPARISON_ROWS = [
  { section: "Social Media", rows: [
    { label: "Brands", vals: ["1", "3", "10", "Unlimited"] },
    { label: "Social profiles", vals: ["2", "7", "Unlimited", "Unlimited"] },
    { label: "Posts per month", vals: ["10", "100", "500", "Unlimited"] },
    { label: "Content calendar", vals: [true, true, true, true] },
    { label: "Post scheduling", vals: [true, true, true, true] },
    { label: "Media library", vals: [false, true, true, true] },
  ]},
  { section: "Livestream", rows: [
    { label: "Platforms", vals: ["—", "2", "7", "All"] },
    { label: "Streaming quality", vals: ["—", "720p", "1080p", "4K"] },
    { label: "Stream analytics", vals: [false, false, true, true] },
    { label: "Multi-stream", vals: [false, true, true, true] },
  ]},
  { section: "Team & Approval", rows: [
    { label: "Users", vals: ["1", "3", "10", "Unlimited"] },
    { label: "Custom roles", vals: [false, false, true, true] },
    { label: "Approval workflow", vals: [false, false, true, true] },
  ]},
];

const FAQ = [
  { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately." },
  { q: "What happens when I cancel?", a: "You keep access until the end of your billing period. After that, you're downgraded to Free." },
  { q: "Is there a free trial?", a: "Yes! The Pro plan comes with a 14-day free trial. No credit card required." },
  { q: "Can I add more team members?", a: "Yes, additional seats can be purchased for $8/user/month on Pro." },
];

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [expandComparison, setExpandComparison] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F8F7]" style={{ padding: "32px 24px" }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 style={{ fontSize: 24, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>Choose Your Plan</h2>
        <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 20 }}>Scale your social media and livestream management</p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3">
          <span style={{ fontSize: 12, color: billingCycle === "monthly" ? "#0A0A0A" : "#9CA3AF" }}>Monthly</span>
          <div
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            style={{
              width: 44,
              height: 24,
              borderRadius: 9999,
              background: billingCycle === "annual" ? "#0A0A0A" : "#E5E7EB",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s" }}
          >
            <div style={{
              position: "absolute",
              top: 3,
              left: billingCycle === "annual" ? 23 : 3,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#FFF",
              transition: "left 0.2s" }} />
          </div>
          <span style={{ fontSize: 12, color: billingCycle === "annual" ? "#0A0A0A" : "#9CA3AF" }}>
            Annual
          </span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#F0FDF4", color: "#16A34A", fontWeight: 500 }}>Save 20%</span>
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 1000, margin: "0 auto 32px" }}>
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: "#FFF",
              border: plan.highlight ? "1.5px solid #0A0A0A" : "0.5px solid #E5E7EB",
              borderRadius: 16,
              padding: 20,
              position: "relative" }}
          >
            {plan.highlight && (
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#0A0A0A",
                  color: "#FFF",
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "3px 12px",
                  borderRadius: 9999,
                  whiteSpace: "nowrap" }}
              >
                Most Popular
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", marginBottom: 2 }}>{plan.name}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 12 }}>{plan.subtitle}</div>
              <div style={{ marginBottom: 4 }}>
                {plan.price.monthly === null ? (
                  <span style={{ fontSize: 24, fontWeight: 500, color: "#0A0A0A" }}>Custom</span>
                ) : (
                  <>
                    <span style={{ fontSize: 28, fontWeight: 500, color: "#0A0A0A" }}>
                      ${billingCycle === "annual" && plan.price.annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span style={{ fontSize: 13, color: "#9CA3AF" }}>/mo</span>
                  </>
                )}
              </div>
              {billingCycle === "annual" && plan.price.annual && (
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Billed annually</div>
              )}
            </div>

            <div style={{ height: 0.5, background: "#E5E7EB", marginBottom: 14 }} />

            <div className="flex flex-col gap-1.5 mb-5">
              {Object.entries(plan.features).flatMap(([, feats]) => feats).slice(0, 5).map((feat, i) => (
                <div key={i} className="flex items-start gap-2">
                  {feat === "—" ? (
                    <Minus size={12} style={{ color: "#D1D5DB", marginTop: 1, flexShrink: 0 }} />
                  ) : (
                    <Check size={12} style={{ color: "#0A0A0A", marginTop: 1, flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: 11, color: feat === "—" ? "#9CA3AF" : "#374151" }}>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => !plan.ctaDisabled && navigate("/settings")}
              style={{
                width: "100%",
                padding: "9px 0",
                borderRadius: 8,
                background: plan.highlight ? "#0A0A0A" : plan.ctaDisabled ? "#F3F4F6" : "#FFF",
                color: plan.highlight ? "#FFF" : plan.ctaDisabled ? "#9CA3AF" : "#0A0A0A",
                fontSize: 12,
                fontWeight: 500,
                cursor: plan.ctaDisabled ? "default" : "pointer",
                border: plan.highlight ? "none" : "0.5px solid #E5E7EB" }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div style={{ maxWidth: 1000, margin: "0 auto 32px" }}>
        <button
          onClick={() => setExpandComparison(!expandComparison)}
          className="flex items-center gap-2 cursor-pointer mx-auto"
          style={{ fontSize: 13, color: "#6B7280", background: "none", border: "none", marginBottom: 12 }}
        >
          See full comparison <ChevronDown size={14} style={{ transform: expandComparison ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>

        {expandComparison && (
          <div style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "0.5px solid #E5E7EB" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.name} style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, fontWeight: 500, color: p.highlight ? "#0A0A0A" : "#6B7280" }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((sec) => (
                  <React.Fragment key={sec.section}>
                    <tr style={{ background: "#F9FAFB" }}>
                      <td colSpan={5} style={{ padding: "6px 16px", fontSize: 10, fontWeight: 500, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                        {sec.section}
                      </td>
                    </tr>
                    {sec.rows.map((row, ri) => (
                      <tr key={`${sec.section}-${ri}`} style={{ borderBottom: "0.5px solid #F0F0EF" }}>
                        <td style={{ padding: "8px 16px", fontSize: 12, color: "#374151" }}>{row.label}</td>
                        {row.vals.map((val, vi) => (
                          <td key={vi} style={{ padding: "8px 16px", textAlign: "center" }}>
                            {typeof val === "boolean" ? (
                              val ? <Check size={13} style={{ color: "#0A0A0A", margin: "0 auto" }} /> : <span style={{ color: "#D1D5DB", fontSize: 12 }}>—</span>
                            ) : (
                              <span style={{ fontSize: 11, color: val === "—" ? "#D1D5DB" : "#374151" }}>{val}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A", marginBottom: 16, textAlign: "center" }}>Frequently Asked Questions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: "#FFF", border: "0.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between cursor-pointer"
                style={{ padding: "12px 14px", background: "none", border: "none", textAlign: "left" }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>{item.q}</span>
                <ChevronDown size={13} style={{ color: "#9CA3AF", flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 14px 12px", fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
