import { useState } from "react";
import { Check, Lock } from "lucide-react";

const checklistItems = [
  { id: 1, label: "Connect a social platform", status: "done", cta: "" },
  { id: 2, label: "Create your first Brand", status: "done", cta: "" },
  { id: 3, label: "Invite a team member", status: "done", cta: "" },
  { id: 4, label: "Schedule your first post", status: "current", cta: "Go to Planner →" },
  { id: 5, label: "Set up an AutoList", status: "current", cta: "Create AutoList →" },
  { id: 6, label: "Schedule a livestream", status: "locked", cta: "Schedule Stream →", requires: 4 },
  { id: 7, label: "Go live for the first time", status: "locked", cta: "Start Streaming →", requires: 4 },
];

export function GettingStarted() {
  const [dismissed, setDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const completedCount = checklistItems.filter((i) => i.status === "done").length;
  const totalCount = checklistItems.length;
  const progress = (completedCount / totalCount) * 100;
  const allDone = completedCount === totalCount;

  if (dismissed) {
    return (
      <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: 12, color: "#9CA3AF" }}>Widget dismissed. This is the empty dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-[600px]">
        {/* Collapsed chip */}
        {collapsed && !allDone && (
          <button
            onClick={() => setCollapsed(false)}
            className="mb-4 px-3 py-1.5 rounded-full"
            style={{ fontSize: 12, backgroundColor: "#F3F4F6", color: "#6B7280", border: "0.5px solid #E5E7EB" }}
          >
            Getting started · {completedCount}/{totalCount} →
          </button>
        )}

        {/* Main widget */}
        {!collapsed && (
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: "0.5px solid #E5E7EB" }}>
            {/* Header strip */}
            <div className="bg-[#0A0A0A] px-4 py-3 flex items-center justify-between">
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
                {allDone ? "🎉 All done! You're a pro." : "Getting started"}
              </span>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{completedCount} / {totalCount} complete</span>
                <button
                  onClick={() => setCollapsed(true)}
                  style={{ fontSize: 12, color: "#666" }}
                >
                  ×
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  style={{ fontSize: 12, color: "#555" }}
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-[#E5E7EB]">
              <div className="h-full bg-[#0A0A0A] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            {/* Items */}
            <div className="p-4">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: "0.5px solid #F0F0EF" }}
                >
                  <div className="flex items-center gap-3">
                    {item.status === "done" ? (
                      <div className="w-5 h-5 rounded-full bg-[#0A0A0A] flex items-center justify-center">
                        <Check size={11} color="#fff" />
                      </div>
                    ) : item.status === "locked" ? (
                      <div className="w-5 h-5 rounded-full bg-[#F3F4F6] flex items-center justify-center" style={{ border: "0.5px solid #E5E7EB" }}>
                        <Lock size={9} color="#9CA3AF" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full" style={{ border: "0.5px solid #E5E7EB" }} />
                    )}
                    <span
                      style={{
                        fontSize: 13,
                        color: item.status === "done" ? "#9CA3AF" : item.status === "locked" ? "#9CA3AF" : "#0A0A0A",
                        fontWeight: item.status === "current" ? 500 : 400,
                        textDecoration: item.status === "done" ? "line-through" : "none",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "done" && <span style={{ fontSize: 10, color: "#16A34A" }}>Done</span>}
                    {item.status === "current" && (
                      <button className="hover:underline" style={{ fontSize: 12, color: "#0A0A0A" }}>{item.cta}</button>
                    )}
                    {item.status === "locked" && <Lock size={12} color="#9CA3AF" />}
                  </div>
                </div>
              ))}

              {allDone && (
                <div className="text-center mt-4">
                  <p style={{ fontSize: 13, color: "#6B7280" }}>You've completed all getting started steps!</p>
                  <button className="mt-2 hover:underline" style={{ fontSize: 13, color: "#0A0A0A" }}>Explore advanced features →</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
