# 📚 PubliCast Documentation Index

Chào mừng bạn đến với hệ thống tài liệu kỹ thuật của dự án **PubliCast** — Nền tảng B2B SaaS quản lý và lập lịch xuất bản nội dung tự động trên nhiều mạng xã hội.

---

## 🏗️ Cấu Trúc Tài Liệu Hệ Thống

### 1. Kiến Trúc Hệ Thống & Thiết Kế (Architecture & Design)
*   **Tài liệu Kiến trúc Kỹ thuật:** [technical_architecture.md](../../../Users/ACER/.gemini/antigravity-cli/brain/5e3e9e5a-bd6e-4041-a7d6-1d89c72e0f87/technical_architecture.md) — Tổng quan cấu trúc phân lớp, các mẫu thiết kế (Strategy, Pipeline, Factory) và mô hình bảo mật.
*   **Tổng hợp Nghiệp vụ & Bản đồ Vai trò:** [system_wiki_synthesis.md](../../../Users/ACER/.gemini/antigravity-cli/brain/5e3e9e5a-bd6e-4041-a7d6-1d89c72e0f87/system_wiki_synthesis.md) — Sơ đồ nghiệp vụ tuần tự, 13 vai trò (Roles) trong hệ thống và cơ cấu kho lưu trữ dữ liệu (Data Store) sử dụng MySQL & Redis.
*   **Sơ đồ C4 Context & Use Case (.puml):** [c4_context_usecase.puml](./diagrams/c4_context_usecase.puml) — Sơ đồ ngữ cảnh C4 (C4 Context) và bản đồ ca sử dụng (Use Case) tổng quan của hệ thống.
*   **Sơ đồ Use Case của các phân hệ chuyên biệt (.puml):**
    *   [Xác thực & Tài khoản](./diagrams/usecase_authentication.puml)
    *   [Bài viết & Xuất bản](./diagrams/usecase_post_publishing.puml)
    *   [Không gian làm việc (Workspace) & Kênh MXH](./diagrams/usecase_workspace_social.puml)
    *   [Quản trị & Bảng giá](./diagrams/usecase_admin_pricing.puml)

---

### 2. Tài Liệu Phân Hệ Backend (`docs/backend/`)

#### 🔐 Xác thực & Tài khoản (Authentication)
*   [Luồng đăng ký tài khoản mới](./backend/auth/register.md)
*   [Chi tiết logic đăng ký và mã OTP](./backend/auth/REGISTER_LOGIC.md)
*   [Sơ đồ tuần tự đăng ký dạng PlantUML](./backend/auth/register-sequence.puml)
*   [Luồng đăng ký hoàn chỉnh (Full Flow)](./backend/auth/REGISTER_FULL_FLOW.md)
*   [Tài liệu hệ thống đăng nhập (Local/OAuth)](./backend/auth/LOGIN_SYSTEM.md)
*   [Hướng dẫn nhanh (Quickstart) đăng nhập](./backend/auth/LOGIN_QUICKSTART.md)
*   [Luồng quên mật khẩu & Khôi phục](./backend/auth/forgot-password.md)
*   [Chỉnh sửa thông tin cá nhân (Edit Profile)](./backend/auth/EDIT_PROFILE.md)
*   [Hướng dẫn kiểm thử tính năng chỉnh sửa thông tin](./backend/auth/EDIT_PROFILE_TESTING.md)

#### 📝 Quản lý bài đăng & Kênh MXH (Social & Workspace)
*   [Tìm kiếm & Lọc dữ liệu bài đăng phía máy chủ (Server-side)](./search_and_filter_task.md)
*   [Hệ thống Hòm thư hợp nhất (Unified Inbox)](./backend/social/UNIFIED_INBOX.md)
*   [Tích hợp MXH & Analytics tổng quan](./backend/social/SOCIAL_SERVICES.md)
*   [Kiến trúc tích hợp TikTok (TikTok Backend Core)](./backend/social/TIKTOK_INTEGRATION.md)
*   [Chi tiết tích hợp YouTube (Video & Shorts)](./backend/social/YOUTUBE_IMPLEMENTATION.md)
*   [Tài liệu kết nối YouTube](./backend/social/YOUTUBE_INTEGRATION.md)
*   [Tài liệu tích hợp TikTok & Facebook (Publish & Analytics)](./tiktok_integration_and_analytics.md)
*   [Sơ đồ kết nối Facebook dạng PlantUML](./backend/social/facebook-connection-sequence.puml)

#### ⏳ Hàng đợi & Lập lịch xuất bản (Scheduling & Workspace)
*   [Hệ thống lập lịch bài đăng tự động (AutoLists Backend)](./backend/workspace/AUTOLISTS.md)

#### 📂 Quản lý Đa phương tiện (Media)
*   [Quản lý thư viện Media (Media Library)](./backend/media/MEDIA_LIBRARY_IMPLEMENTATION.md)
*   [Kỹ thuật tải lên (Upload) bù & xử lý định dạng MKV](./backend/media/MEDIA_UPLOAD_TECHNICAL.md)

#### ⚙️ Quản lý hệ thống, Admin & DB (Admin & Architecture)
*   [Tài liệu tái cấu trúc DB (Database Refactoring)](./backend/architecture/Refactoring_DB.md)
*   [Tài liệu tái cấu trúc kiến trúc Zen (Zen Architecture)](./backend/architecture/ZEN_ARCHITECTURE_REFACTORING.md)
*   [Kiến trúc phân hệ Admin & Pricing](./backend/admin/ADMIN_PRICING_ARCHITECTURE.md)
*   [Đặc tả API phân hệ Admin & Pricing](./backend/admin/ADMIN_PRICING_API.md)
*   [Danh mục thiết kế sơ đồ kiến trúc](./backend/architecture/ARCHITECTURE_DIAGRAMS.md)
*   [Tham khảo các Endpoint API](./backend/architecture/API_REFERENCE.md)

---

### 3. Tài Liệu Phân Hệ Frontend (`docs/frontend/`)
*   **[Tổng quan Frontend (Frontend Index)](./frontend/README.md)**
*   [Giao diện đăng ký & Nhập mã OTP (UI/UX)](./frontend/auth/REGISTER_UI.md)

#### 💻 Các phân hệ giao diện thực tế (Vite / React app)
*   **Xác thực (Auth pages):**
    *   `Login.jsx` — Giao diện đăng nhập cục bộ và tích hợp Google/Facebook OAuth.
    *   `ForgotPassword.jsx` — Giao diện yêu cầu cấp lại mã OTP và đổi mật khẩu mới.
    *   `InviteFlow.jsx` — Giao diện nhận lời mời tham gia Brand dành cho thành viên mới.
*   **Workspace & Brand (Các trang tính năng cốt lõi):**
    *   `Dashboard.jsx`, `Analytics.jsx` & `PlatformDashboard.jsx` — [Báo cáo & Thống kê Workspace](./frontend/social/WORKSPACE_DASHBOARD.md) (Phân tích tương tác và hiệu quả quảng cáo).
    *   `PostCreator.jsx`, `ContentPlanner.jsx` & `AutoLists.jsx` — [Lập lịch & Tạo bài đăng](./frontend/workspace/CONTENT_PUBLISHING.md) (Modal tạo bài viết, lịch biên tập và hàng đợi AutoLists).
    *   `MediaLibrary.jsx`, `LiveSetup.jsx` & `LiveMonitor.jsx` — [Livestream & Thư viện Media](./frontend/workspace/LIVE_AND_MEDIA.md) (Quản lý media, cấu hình livestream RTMP và monitor).
    *   `AIAssistant.jsx` — Tích hợp trợ lý AI để tạo caption và gợi ý hashtag.
    *   `Pricing.jsx` & `Settings.jsx` — [Cài đặt & Gói cước](./frontend/admin/SETTINGS_AND_PRICING.md) (Cấu hình Brand, thành viên, và nâng cấp gói cước).

---
*Tài liệu này được cập nhật tự động và phân loại khoa học theo các mô-đun (modules) thực tế của ứng dụng PubliCast.*
