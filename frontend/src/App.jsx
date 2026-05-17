import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { SidebarWorkspace } from "./layout/SidebarWorkspace";
import { SidebarAdmin } from "./layout/SidebarAdmin";
import { Topbar } from "./layout/Topbar";
import { SupportChat } from "./components/app/SupportChat";
import { PostCreatorPage } from "./pages/workspace/PostCreator";
import { ConnectionsOverlay } from "./components/shared/ConnectionsOverlay";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import { LoginPage } from "./pages/auth/Login";
import { ForgotPasswordPage } from "./pages/auth/ForgotPassword";
import { InviteFlow } from "./pages/auth/InviteFlow";

// Onboarding
import { GettingStartedPage } from "./pages/workspace/Start";

// Workspace Pages
import { DashboardPage } from "./pages/workspace/Dashboard";
import { PlatformDashboardPage } from "./pages/workspace/PlatformDashboard";
import { StreamSchedulerPage } from "./pages/workspace/StreamScheduler";
import { LiveMonitorPage } from "./pages/workspace/LiveMonitor";
import { LiveSetupPage } from "./pages/workspace/LiveSetup";
import { AnalyticsPage } from "./pages/workspace/Analytics";
import { ContentPlannerPage } from "./pages/workspace/ContentPlanner";
import { MediaLibraryPage } from "./pages/workspace/MediaLibrary";
import { StreamHistoryPage } from "./pages/workspace/StreamHistory";
import { SettingsPage } from "./pages/workspace/Settings";
import { PricingPage } from "./pages/workspace/Pricing";
import { AIAssistant } from "./pages/workspace/AIAssistant";
import { HashtagManager } from "./pages/workspace/HashtagManager";
import { AutoLists } from "./pages/workspace/AutoLists";
import { ErrorPages } from "./pages/workspace/ErrorPages";
import { NotificationsPage } from "./pages/workspace/Notifications";

// Manage Pages
import { InboxPage } from "./pages/manage/Inbox";
import { TeamManagementPage } from "./pages/manage/TeamManagement";
import { MyTasksPage } from "./pages/manage/MyTasks";
import { CreateWorkplacePage } from "./pages/manage/CreateWorkplace";
import { BrandSettingsPage } from "./pages/manage/BrandSettings";
import { StaffChatPage } from "./pages/manage/StaffChat";
import {
  AdsPage, CompetitorsPage, ReportsPage, SmartLinksPage, ConnectPlatformsPage,
} from "./pages/manage/Placeholder";

// Admin Pages
import { AdminPricing } from "./pages/admin/AdminPricing";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AuditLog } from "./pages/admin/AuditLog";
import { RevenueDashboard } from "./pages/admin/RevenueDashboard";

// Landing
import { LandingPage } from "./pages/landing/LandingPage";

const NO_LAYOUT_PATHS = ["/", "/login", "/signup", "/verify-otp", "/start", "/forgot-password", "/connect", "/invite", "/manage/workplace/new"];

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F8F8F7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
      </div>
    );
  }

  const isNoLayout = NO_LAYOUT_PATHS.includes(currentPath);
  const isSuperadmin = currentPath.startsWith("/admin");
  const isStaff = currentPath.startsWith("/staff");

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Topbar ALWAYS on top across full width (except landing/login/admin/staff) */}
      {!isNoLayout && !isSuperadmin && !isStaff && <Topbar />}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar below Topbar */}
        {!isNoLayout && !isStaff && (
          <>
            {isSuperadmin ? <SidebarAdmin /> : <SidebarWorkspace />}
          </>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F8F7]">
          {/* Green accent line between Topbar and Content (Metricool style) */}
          {!isNoLayout && !isSuperadmin && <div style={{ height: 2, background: "#D9F99D", width: "100%" }} />}
          
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage initialScreen="login" />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage initialScreen="signup" />} />
              <Route path="/verify-otp" element={<LoginPage initialScreen="verify-otp" />} />
              <Route path="/start" element={<ProtectedRoute><GettingStartedPage /></ProtectedRoute>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected Workspace Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard/:platform" element={<ProtectedRoute><PlatformDashboardPage /></ProtectedRoute>} />
              <Route path="/scheduler" element={<ProtectedRoute><StreamSchedulerPage /></ProtectedRoute>} />
              <Route path="/live" element={<ProtectedRoute><LiveMonitorPage /></ProtectedRoute>} />
              <Route path="/live/setup" element={<ProtectedRoute><LiveSetupPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/planner" element={<ProtectedRoute><ContentPlannerPage /></ProtectedRoute>} />
              <Route path="/media-library" element={<ProtectedRoute><MediaLibraryPage /></ProtectedRoute>} />
              <Route path="/smartlinks" element={<ProtectedRoute><SmartLinksPage /></ProtectedRoute>} />
              <Route path="/ai" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
              <Route path="/hashtags" element={<ProtectedRoute><HashtagManager /></ProtectedRoute>} />
              <Route path="/autolists" element={<ProtectedRoute><AutoLists /></ProtectedRoute>} />
              <Route path="/errors" element={<ProtectedRoute><ErrorPages /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              
              {/* Protected Manage Routes */}
              <Route path="/manage/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
              <Route path="/manage/team" element={<ProtectedRoute><TeamManagementPage /></ProtectedRoute>} />
              <Route path="/manage/workplace/new" element={<ProtectedRoute><CreateWorkplacePage /></ProtectedRoute>} />
              <Route path="/manage/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
              <Route path="/manage/ads" element={<ProtectedRoute><AdsPage /></ProtectedRoute>} />
              <Route path="/manage/tasks" element={<ProtectedRoute><MyTasksPage /></ProtectedRoute>} />
              <Route path="/manage/competitors" element={<ProtectedRoute><CompetitorsPage /></ProtectedRoute>} />
              <Route path="/manage/connections" element={<ProtectedRoute><BrandSettingsPage /></ProtectedRoute>} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin/pricing" element={<ProtectedRoute><AdminPricing /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/audit" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
              <Route path="/admin/revenue" element={<ProtectedRoute><RevenueDashboard /></ProtectedRoute>} />

              {/* Protected Staff Routes */}
              <Route path="/staff/chats" element={<ProtectedRoute><StaffChatPage /></ProtectedRoute>} />

              {/* Protected Common App Routes */}
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><StreamHistoryPage /></ProtectedRoute>} />
              <Route path="/connect" element={<ProtectedRoute><ConnectPlatformsPage /></ProtectedRoute>} />
              <Route path="/invite" element={<ProtectedRoute><InviteFlow /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Global Overlays */}
      <PostCreatorPage />
      <ConnectionsOverlay />
      {!isNoLayout && !isSuperadmin && !isStaff && <SupportChat />}
    </div>
  );
}
