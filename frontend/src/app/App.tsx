import { useState, useEffect } from "react";
import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { SocialProof } from "./components/landing/SocialProof";
import { Features } from "./components/landing/Features";
import { FeatureDeepDive } from "./components/landing/FeatureDeepDive";
import { Platforms } from "./components/landing/Platforms";
import { Testimonials } from "./components/landing/Testimonials";
import { Pricing } from "./components/landing/Pricing";
import { CTABanner } from "./components/landing/CTABanner";
import { Footer } from "./components/landing/Footer";
import { CommandPalette } from "./components/CommandPalette";
import { AdminShell } from "./components/admin/AdminShell";
import { AdminPricing } from "./components/admin/AdminPricing";
import { AuditLog } from "./components/admin/AuditLog";
import { RevenueDashboard } from "./components/admin/RevenueDashboard";
import { AppShell } from "./components/app/AppShell";
import { AIAssistant } from "./components/app/AIAssistant";
import { HashtagManager } from "./components/app/HashtagManager";
import { AutoLists } from "./components/app/AutoLists";
import { GettingStarted } from "./components/app/GettingStarted";
import { ErrorPages } from "./components/app/ErrorPages";
import { InviteFlow } from "./components/app/InviteFlow";

type Page =
  | "landing"
  | "admin-pricing"
  | "admin-audit"
  | "admin-revenue"
  | "admin-brands"
  | "admin-users"
  | "admin-settings"
  | "ai-assistant"
  | "hashtag-manager"
  | "autolists"
  | "getting-started"
  | "error-pages"
  | "invite-flow"
  | "dashboard"
  | "analytics"
  | "inbox"
  | "planner"
  | "live"
  | "team"
  | "reports";

const adminPages: Page[] = ["admin-pricing", "admin-audit", "admin-revenue", "admin-brands", "admin-users", "admin-settings"];
const appPages: Page[] = ["ai-assistant", "hashtag-manager", "autolists", "getting-started", "error-pages", "invite-flow", "dashboard", "analytics", "inbox", "planner", "live", "team", "reports"];

function SimpleDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <GettingStarted />
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { label: "Total Reach", value: "2.4M", delta: "↑ 8.2%" },
          { label: "Followers", value: "142K", delta: "↑ 3.1%" },
          { label: "Posts This Month", value: "47", delta: "↑ 12%" },
          { label: "Live Hours", value: "36h", delta: "↑ 5.4%" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-4" style={{ border: "0.5px solid #E5E7EB" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{kpi.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#0A0A0A" }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: "#16A34A" }}>{kpi.delta}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5" style={{ border: "0.5px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "AI Assistant", page: "ai-assistant", icon: "🤖" },
              { label: "Hashtags", page: "hashtag-manager", icon: "🔍" },
              { label: "AutoLists", page: "autolists", icon: "🔄" },
              { label: "Error Pages", page: "error-pages", icon: "⚠️" },
              { label: "Invite Flow", page: "invite-flow", icon: "📧" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => onNavigate(a.page)}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-[#F8F8F7] transition-colors text-left"
                style={{ border: "0.5px solid #E5E7EB", fontSize: 12, color: "#0A0A0A" }}
              >
                <span>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5" style={{ border: "0.5px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A", marginBottom: 12 }}>Admin Pages</div>
          <div className="space-y-2">
            {[
              { label: "Plans & Pricing", page: "admin-pricing", icon: "💳" },
              { label: "Revenue Dashboard", page: "admin-revenue", icon: "📈" },
              { label: "Audit Log", page: "admin-audit", icon: "📋" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => onNavigate(a.page)}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-[#F8F8F7] transition-colors w-full text-left"
                style={{ border: "0.5px solid #E5E7EB", fontSize: 12, color: "#0A0A0A" }}
              >
                <span>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericAppPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 400, textAlign: "center" }}>
        <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
          <span style={{ fontSize: 24, color: "#D1D5DB" }}>📄</span>
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>{title}</h2>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}

const adminNavMap: Record<string, Page> = {
  "admin-pricing": "admin-pricing",
  "admin-audit": "admin-audit",
  "admin-revenue": "admin-revenue",
  "admin-brands": "admin-brands",
  "admin-users": "admin-users",
  "admin-settings": "admin-settings",
};

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const navigate = (target: string) => {
    setPage(target as Page);
    window.scrollTo(0, 0);
  };

  // Landing page
  if (page === "landing") {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar onNavigate={navigate} />
        <main>
          <Hero onNavigate={navigate} />
          <SocialProof />
          <Features />
          <FeatureDeepDive />
          <Platforms />
          <Testimonials />
          <Pricing onNavigate={navigate} />
          <CTABanner onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />

        {/* Floating app nav demo button */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
          <button
            onClick={() => navigate("dashboard")}
            className="bg-[#0A0A0A] text-white px-4 py-2 rounded-full shadow-sm hover:bg-[#1E1E1E] transition-colors"
            style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
          >
            → Open App Demo
          </button>
        </div>

        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={navigate} />
      </div>
    );
  }

  // Admin pages
  if (adminPages.includes(page)) {
    return (
      <AdminShell activePage={page} onNavigate={navigate}>
        {page === "admin-pricing" && <AdminPricing />}
        {page === "admin-revenue" && <RevenueDashboard />}
        {page === "admin-audit" && <AuditLog />}
        {(page === "admin-brands" || page === "admin-users" || page === "admin-settings") && (
          <GenericAppPage title={`${page.replace("admin-", "").charAt(0).toUpperCase() + page.replace("admin-", "").slice(1)}`} description="This admin section is available in the full implementation." />
        )}
      </AdminShell>
    );
  }

  // Invite flow (standalone)
  if (page === "invite-flow") {
    return (
      <div>
        <div className="bg-white px-4 py-2 flex items-center gap-3" style={{ borderBottom: "0.5px solid #E5E7EB", fontFamily: "'DM Sans', sans-serif" }}>
          <button onClick={() => navigate("dashboard")} style={{ fontSize: 12, color: "#6B7280" }}>← Back to App</button>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>|</span>
          <span style={{ fontSize: 12, color: "#0A0A0A" }}>Invite Accept Flow — Prompt 33</span>
        </div>
        <InviteFlow />
      </div>
    );
  }

  // App pages with shell
  return (
    <AppShell activePage={page} onNavigate={navigate}>
      {page === "dashboard" && <SimpleDashboard onNavigate={navigate} />}
      {page === "ai-assistant" && <AIAssistant />}
      {page === "hashtag-manager" && <HashtagManager />}
      {page === "autolists" && <AutoLists />}
      {page === "getting-started" && <GettingStarted />}
      {page === "error-pages" && <ErrorPages onNavigate={navigate} />}
      {(page === "planner" || page === "live" || page === "analytics" || page === "inbox" || page === "team" || page === "reports") && (
        <GenericAppPage
          title={page.charAt(0).toUpperCase() + page.slice(1)}
          description="This page is part of the full StreamHub app. Navigate to other pages using the sidebar."
        />
      )}
    </AppShell>
  );
}
