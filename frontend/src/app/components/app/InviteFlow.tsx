import { useState } from "react";
import { Check, AlertTriangle } from "lucide-react";

type Screen = "landing" | "accepted" | "expired" | "already-member";

export function InviteFlow() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Preview tabs */}
      <div className="flex gap-2 p-4 bg-white" style={{ borderBottom: "0.5px solid #E5E7EB" }}>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>Screen:</span>
        {(["landing", "accepted", "expired", "already-member"] as Screen[]).map((s) => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            className="px-3 py-1 rounded-md"
            style={{ fontSize: 11, backgroundColor: screen === s ? "#0A0A0A" : "#F3F4F6", color: screen === s ? "#fff" : "#6B7280" }}
          >
            {s}
          </button>
        ))}
      </div>

      {screen === "landing" && (
        <div className="flex h-[calc(100vh-48px)]">
          {/* Left - black */}
          <div className="w-2/5 bg-[#0A0A0A] flex flex-col p-8">
            <div className="flex items-center gap-2 mb-auto">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span style={{ fontSize: 10, color: "#0A0A0A", fontWeight: 700 }}>S</span>
              </div>
              <span style={{ fontSize: 13, color: "#fff" }}>StreamHub</span>
            </div>
            <div className="flex flex-col items-center text-center py-12">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-3">
                <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>JD</span>
              </div>
              <p style={{ fontSize: 15, color: "#fff", marginBottom: 4 }}>John Doe has invited you</p>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>to join TechVision on StreamHub</p>
              <div className="px-4 py-2 rounded-full mb-4" style={{ backgroundColor: "#1E1E1E", border: "0.5px solid #333" }}>
                <span style={{ fontSize: 14, color: "#DDD" }}>as Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center">
                  <span style={{ fontSize: 9, color: "#fff", fontWeight: 500 }}>TV</span>
                </div>
                <span style={{ fontSize: 14, color: "#fff" }}>TechVision</span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#555", marginTop: "auto" }}>streamhub.com</p>
          </div>

          {/* Right - white */}
          <div className="flex-1 flex items-center justify-center p-12">
            <div style={{ maxWidth: 400, width: "100%" }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A", marginBottom: 6 }}>Accept your invitation</h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>Create your account to get started</p>
              <div className="space-y-4">
                <div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2.5 rounded-lg outline-none"
                    style={{ fontSize: 14, border: "0.5px solid #E5E7EB", color: "#0A0A0A", height: 42 }}
                    autoFocus
                  />
                </div>
                <div>
                  <input
                    defaultValue="alex@company.com"
                    disabled
                    className="w-full px-3 py-2.5 rounded-lg"
                    style={{ fontSize: 14, height: 42, backgroundColor: "#F3F4F6", color: "#9CA3AF", border: "0.5px solid #E5E7EB" }}
                  />
                  <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>Invitation was sent to this email</p>
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2.5 rounded-lg outline-none"
                    style={{ fontSize: 14, border: "0.5px solid #E5E7EB", color: "#0A0A0A", height: 42 }}
                  />
                  {password && (
                    <div className="h-1 mt-1 rounded-full bg-[#E5E7EB]">
                      <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${Math.min(password.length * 10, 100)}%` }} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setScreen("accepted")}
                  className="w-full py-3 rounded-lg bg-[#0A0A0A] text-white hover:bg-[#1E1E1E] transition-colors"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  Create Account & Accept Invite
                </button>
                <div className="flex items-center gap-3">
                  <div style={{ flex: 1, height: "0.5px", backgroundColor: "#E5E7EB" }} />
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>or</span>
                  <div style={{ flex: 1, height: "0.5px", backgroundColor: "#E5E7EB" }} />
                </div>
                <button className="w-full py-2.5 rounded-lg" style={{ fontSize: 14, border: "0.5px solid #E5E7EB", color: "#0A0A0A" }}>
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "accepted" && (
        <div className="flex items-center justify-center h-[calc(100vh-48px)]">
          <div className="bg-white rounded-2xl p-10 text-center" style={{ maxWidth: 480, border: "0.5px solid #E5E7EB" }}>
            <div className="w-14 h-14 rounded-full bg-[#0A0A0A] flex items-center justify-center mx-auto mb-5">
              <Check size={24} color="#fff" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 6 }}>Welcome to TechVision!</h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>You've joined as Editor</p>
            <ul className="space-y-1.5 mb-6 text-left">
              {["You can create and schedule posts", "Your posts require approval before publishing", "You can view content analytics"].map((p) => (
                <li key={p} style={{ fontSize: 12, color: "#6B7280" }}>• {p}</li>
              ))}
            </ul>
            <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-lg" style={{ border: "0.5px solid #E5E7EB" }}>
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                <span style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}>TV</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#0A0A0A" }}>TechVision</span>
            </div>
            <button className="w-full py-3 rounded-lg bg-[#0A0A0A] text-white mb-3" style={{ fontSize: 14, fontWeight: 500 }}>
              Go to Dashboard →
            </button>
            <button style={{ fontSize: 13, color: "#6B7280" }}>Complete your profile first</button>
          </div>
        </div>
      )}

      {screen === "expired" && (
        <div className="flex items-center justify-center h-[calc(100vh-48px)]">
          <div className="bg-white rounded-2xl p-10 text-center" style={{ maxWidth: 480, border: "0.5px solid #E5E7EB" }}>
            <AlertTriangle size={48} color="#D1D5DB" className="mx-auto mb-5" />
            <h2 style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>This invitation has expired</h2>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 24 }}>
              Invitation links expire after 7 days. Ask John Doe to send a new invite.
            </p>
            <button className="px-5 py-2.5 rounded-lg mb-4 w-full" style={{ fontSize: 14, border: "0.5px solid #E5E7EB", color: "#0A0A0A" }}>
              Request new invite
            </button>
            <button style={{ fontSize: 13, color: "#6B7280" }}>Go to login</button>
          </div>
        </div>
      )}

      {screen === "already-member" && (
        <div className="flex items-center justify-center h-[calc(100vh-48px)]">
          <div className="bg-white rounded-2xl p-10 text-center" style={{ maxWidth: 480, border: "0.5px solid #E5E7EB" }}>
            <div className="w-14 h-14 rounded-full bg-[#E5E7EB] flex items-center justify-center mx-auto mb-5">
              <span style={{ fontSize: 20 }}>👋</span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A", marginBottom: 8 }}>You're already a member</h2>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 24 }}>
              You already have access to TechVision as Editor.
            </p>
            <button className="w-full py-3 rounded-lg bg-[#0A0A0A] text-white" style={{ fontSize: 14, fontWeight: 500 }}>
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
