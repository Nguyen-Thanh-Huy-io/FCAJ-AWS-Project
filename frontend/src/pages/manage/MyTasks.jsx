import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Diamond, ClipboardCheck, ExternalLink } from "lucide-react";

const TABS = [
  { id: "open", label: "Open" },
  { id: "pending", label: "Pending approval" },
  { id: "rejected", label: "Rejected" },
  { id: "approved", label: "Approved" },
];

export function MyTasksPage() {
  const [activeTab, setActiveTab] = useState("open");
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-white p-8">
      {/* Title */}
      <h1 className="text-xl font-medium text-[#0A0A0A] mb-6">My tasks</h1>

      {/* Upgrade Banner */}
      <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100 flex items-center justify-between mb-8">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-[#D9F99D] flex items-center justify-center shrink-0">
            <Diamond size={24} className="text-[#0A0A0A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0A0A0A]">Do you need a higher plan?</h3>
            <p className="text-sm text-gray-500">
              Upgrade your plan to send posts to your team for review.{" "}
              <button className="text-gray-600 underline font-medium">More info</button>
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate("/pricing")}
          className="px-6 py-2.5 bg-[#2D1D35] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm"
        >
          Upgrade your plan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 border-b border-gray-100 mb-12">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="pb-3 text-sm font-medium transition-all relative"
            style={{ 
              color: activeTab === tab.id ? "#0A0A0A" : "#9CA3AF",
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0A0A0A]" />
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="w-32 h-32 bg-[#F8F9FF] rounded-full flex items-center justify-center mb-6">
           <ClipboardCheck size={64} className="text-[#D1D5DB]" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">No tasks yet</h3>
        <p className="text-sm text-gray-500 max-w-[300px] text-center">
          When you have posts pending review or tasks assigned, they will appear here.
        </p>
      </div>
    </div>
  );
}
