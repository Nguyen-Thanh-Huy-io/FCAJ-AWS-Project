import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Wifi, Check, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/auth.service";
import { toast } from "sonner";
import { STORAGE_KEYS } from "../../constants/storageKeys";

function LeftPanel({ tagline, features }) {
  return (
    <div
      className="hidden md:flex flex-col h-full"
      style={{ background: "#0A0A0A", padding: "48px 60px", flex: "0 0 45%" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-auto">
        <div style={{ width: 32, height: 32, background: "#FFF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Wifi size={16} color="#0A0A0A" />
        </div>
        <span style={{ color: "#FFF", fontSize: 16, fontWeight: 500 }}>StreamHub</span>
      </div>

      <div className="flex flex-col justify-center flex-1 py-12">
        <h2 style={{ fontSize: 32, fontWeight: 500, color: "#FFF", marginBottom: 24, lineHeight: 1.3, maxWidth: 440 }}>
          {tagline}
        </h2>
        <div className="flex flex-col gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <Check size={11} color="#FFF" />
              </div>
              <span style={{ fontSize: 15, color: "#CCC", lineHeight: 1.6 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto">
        <div className="flex" style={{ marginLeft: -4 }}>
          {["NM", "SJ", "DC"].map((i) => (
            <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: "#333", border: "2px solid #0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#FFF", marginLeft: -4 }}>
              {i}
            </div>
          ))}
        </div>
        <span style={{ fontSize: 13, color: "#777" }}>Trusted by 150,000+ creators</span>
      </div>
    </div>
  );
}

export function LoginPage({ initialScreen = "login" }) {
  const { login, register, verifyOTP } = useAuth();
  const [screen, setScreen] = useState(initialScreen);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passStrength, setPassStrength] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  // Restore timer from localStorage on mount
  useEffect(() => {
    const timerExpiry = localStorage.getItem(STORAGE_KEYS.RESEND_TIMER_EXPIRY);
    if (timerExpiry) {
      const remaining = Math.round((parseInt(timerExpiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setResendTimer(remaining);
      } else {
        localStorage.removeItem(STORAGE_KEYS.RESEND_TIMER_EXPIRY);
      }
    }
  }, []);

  // Restore state on F5
  useEffect(() => {
    const pendingEmail = localStorage.getItem(STORAGE_KEYS.PENDING_VERIFY_EMAIL);

    // Nếu đang ở URL /verify-otp mà có email chờ xác thực
    if (initialScreen === "verify-otp" && pendingEmail) {
      setEmail(pendingEmail);
    }

    setScreen(initialScreen);
  }, [initialScreen]);

  // Persist state to localStorage for verify flow
  useEffect(() => {
    if (screen === "verify-otp" && email) {
      localStorage.setItem(STORAGE_KEYS.IS_VERIFYING_OTP, "true");
      localStorage.setItem(STORAGE_KEYS.PENDING_VERIFY_EMAIL, email);
    }
  }, [screen, email]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.message.includes("Account not activated")) {
        localStorage.setItem(STORAGE_KEYS.IS_VERIFYING_OTP, "true");
        localStorage.setItem(STORAGE_KEYS.PENDING_VERIFY_EMAIL, email);
        toast.info("Vui lòng xác thực email của bạn");
        navigate("/verify-otp");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    setIsLoading(true);
    try {
      await register({ name: fullName, email, password, confirmPassword });
      localStorage.setItem(STORAGE_KEYS.IS_VERIFYING_OTP, "true");
      localStorage.setItem(STORAGE_KEYS.PENDING_VERIFY_EMAIL, email);

      const expiry = Date.now() + 60 * 1000;
      localStorage.setItem(STORAGE_KEYS.RESEND_TIMER_EXPIRY, expiry.toString());
      setResendTimer(60);

      navigate("/verify-otp");
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    if (!otp) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }
    setIsLoading(true);
    try {
      await verifyOTP(email, otp);
      localStorage.removeItem(STORAGE_KEYS.IS_VERIFYING_OTP);
      localStorage.removeItem(STORAGE_KEYS.PENDING_VERIFY_EMAIL);
      // Sau khi verify thành công, chuyển sang trang /start để làm Onboarding
      navigate("/start");
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      await authService.resendOTP(email);
      toast.success("Mã mới đã được gửi!");
      const expiry = Date.now() + 60 * 1000;
      localStorage.setItem(STORAGE_KEYS.RESEND_TIMER_EXPIRY, expiry.toString());
      setResendTimer(60);
    } catch (err) {
      toast.error(err.message || "Gửi lại mã thất bại");
    }
  };

  const checkPasswordStrength = (p) => {
    let strength = 0;
    if (p.length > 6) strength++;
    if (/[A-Z]/.test(p)) strength++;
    if (/[0-9]/.test(p)) strength++;
    if (/[!@#$%]/.test(p)) strength++;
    setPassStrength(strength);
  };

  const STRENGTH_COLOR = ["#E5E7EB", "#DC2626", "#D97706", "#16A34A", "#16A34A"];
  const STRENGTH_LABEL = ["", "Weak", "Medium", "Strong", "Very Strong"];

  const handleGoogleLogin = async () => {
    try {
      const { url } = await authService.getGoogleLoginUrl();
      if (url) window.location.href = url;
    } catch (err) {
      toast.error("Không thể khởi động đăng nhập Google");
    }
  };

  if (screen === "login" || screen === "signup" || screen === "verify-otp") {
    return (
      <div className="flex h-screen w-full bg-white overflow-hidden">
        <LeftPanel
          tagline="Manage your social media and livestreams — all in one place"
          features={[
            "Schedule posts across 7+ platforms simultaneously",
            "Go live on YouTube, Facebook, TikTok & more at once",
            "Collaborate with your team using role-based permissions",
          ]}
        />

        {/* Right Panel */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
          <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
            {screen === "login" ? (
              <>
                <div className="md:hidden flex items-center gap-2 mb-8">
                  <div style={{ width: 28, height: 28, background: "#0A0A0A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Wifi size={14} color="#FFF" />
                  </div>
                  <span style={{ color: "#0A0A0A", fontSize: 16, fontWeight: 500 }}>StreamHub</span>
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 500, color: "#0A0A0A", marginBottom: 4 }}>Welcome back</h3>
                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 32 }}>Log in to your account</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-6">
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Email address</label>
                    <input id="email" type="email" placeholder="you@company.com" value={email || ""} onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "0.5px solid #E5E7EB", fontSize: 14, outline: "none", height: 46 }} required />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>Password</label>
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-[12px] color-[#2563EB] cursor-pointer bg-transparent border-none hover:underline"
                        style={{ color: "#2563EB" }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" value={password || ""} onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "12px 40px 12px 14px", borderRadius: 10, border: "0.5px solid #E5E7EB", fontSize: 14, outline: "none", height: 46 }} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ width: "100%", height: 46, borderRadius: 10, background: "#0A0A0A", color: "#FFF", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 12, border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Log in"}
                  </button>
                </form>

                <div className="flex items-center gap-3 mb-6">
                  <div style={{ flex: 1, height: 0.5, background: "#E5E7EB" }} />
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>or</span>
                  <div style={{ flex: 1, height: 0.5, background: "#E5E7EB" }} />
                </div>

                <div className="flex flex-col gap-3 mb-8">
                  <button
                    onClick={handleGoogleLogin}
                    style={{ width: "100%", height: 46, borderRadius: 10, background: "#FFF", color: "#0A0A0A", fontSize: 14, fontWeight: 400, cursor: "pointer", border: "0.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 16 }}>G</span> Continue with Google
                  </button>
                  <button style={{ width: "100%", height: 46, borderRadius: 10, background: "#0A0A0A", color: "#FFF", fontSize: 14, fontWeight: 400, cursor: "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>🍎</span> Continue with Apple
                  </button>
                </div>

                <div style={{ textAlign: "center", fontSize: 14, color: "#6B7280" }}>
                  Don't have an account?{" "}
                  <span style={{ color: "#0A0A0A", fontWeight: 500, cursor: "pointer" }} onClick={() => navigate("/signup")}>
                    Sign up free →
                  </span>
                </div>
              </>
            ) : screen === "signup" ? (
              <>
                <div className="md:hidden flex items-center gap-2 mb-8">
                  <div style={{ width: 28, height: 28, background: "#0A0A0A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Wifi size={14} color="#FFF" />
                  </div>
                  <span style={{ color: "#0A0A0A", fontSize: 16, fontWeight: 500 }}>StreamHub</span>
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 500, color: "#0A0A0A", marginBottom: 4 }}>Create your account</h3>
                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 32 }}>Start your 14-day free trial</p>

                <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6">
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Full Name</label>
                    <input type="text" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "0.5px solid #E5E7EB", fontSize: 14, outline: "none", height: 46 }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Email Address</label>
                    <input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "0.5px solid #E5E7EB", fontSize: 14, outline: "none", height: 46 }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Password</label>
                    <div className="relative">
                      <input id="password" type={showPass ? "text" : "password"} placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          checkPasswordStrength(e.target.value);
                        }}
                        style={{ width: "100%", padding: "12px 40px 12px 14px", borderRadius: 10, border: "0.5px solid #E5E7EB", fontSize: 14, outline: "none", height: 46 }} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passStrength > 0 && (
                      <div className="flex items-center gap-2 mt-2.5">
                        <div className="flex gap-1.5 flex-1">
                          {[1, 2, 3, 4].map((s) => (
                            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= passStrength ? STRENGTH_COLOR[passStrength] : "#E5E7EB" }} />
                          ))}
                        </div>
                        <span style={{ fontSize: 11, color: STRENGTH_COLOR[passStrength] }}>{STRENGTH_LABEL[passStrength]}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Confirm Password</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ width: "100%", padding: "12px 40px 12px 14px", borderRadius: 10, border: "0.5px solid #E5E7EB", fontSize: 14, outline: "none", height: 46 }} required />
                    </div>
                  </div>
                  <label className="flex items-start gap-2.5 cursor-pointer mt-2">
                    <input type="checkbox" style={{ accentColor: "#0A0A0A", marginTop: 2 }} required />
                    <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                      I agree to the <span style={{ color: "#0A0A0A", fontWeight: 500 }}>Terms of Service</span> and <span style={{ color: "#0A0A0A", fontWeight: 500 }}>Privacy Policy</span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ width: "100%", height: 46, borderRadius: 10, background: "#0A0A0A", color: "#FFF", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 12, border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Create free account"}
                  </button>
                </form>

                <div style={{ textAlign: "center", fontSize: 14, color: "#6B7280" }}>
                  Already have an account?{" "}
                  <span style={{ color: "#0A0A0A", fontWeight: 500, cursor: "pointer" }} onClick={() => navigate("/login")}>
                    Log in →
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="md:hidden flex items-center gap-2 mb-8">
                  <div style={{ width: 28, height: 28, background: "#0A0A0A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Wifi size={14} color="#FFF" />
                  </div>
                  <span style={{ color: "#0A0A0A", fontSize: 16, fontWeight: 500 }}>StreamHub</span>
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 500, color: "#0A0A0A", marginBottom: 4 }}>Verify your email</h3>
                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 32 }}>We've sent a 6-digit code to {email}</p>

                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6 mb-6">
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Verification Code</label>
                    <input type="text" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "0.5px solid #E5E7EB", fontSize: 24, fontWeight: 700, letterSpacing: 8, textAlign: "center", outline: "none", height: 56 }} required />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ width: "100%", height: 46, borderRadius: 10, background: "#0A0A0A", color: "#FFF", fontSize: 14, fontWeight: 500, cursor: "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Verify Code"}
                  </button>
                </form>

                <div style={{ textAlign: "center", fontSize: 14, color: "#6B7280" }}>
                  Didn't receive code?{" "}
                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    style={{ color: resendTimer > 0 ? "#9CA3AF" : "#0A0A0A", fontWeight: 500, cursor: resendTimer > 0 ? "not-allowed" : "pointer", background: "none", border: "none", padding: 0, fontSize: 14 }}
                    onClick={handleResendOTP}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
