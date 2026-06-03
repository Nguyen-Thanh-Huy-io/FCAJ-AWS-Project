# 📚 PubliCast Documentation Index

Chào mừng bạn đến với hệ thống tài liệu kỹ thuật của dự án **PubliCast** — Nền tảng B2B SaaS quản lý và lập lịch xuất bản nội dung tự động đa mạng xã hội.

---

## 🏗️ Cấu Trúc Tài Liệu Hệ Thống

### 1. Kiến Trúc Hệ Thống & Thiết Kế (Architecture & Design)
*   **Tài liệu Kiến trúc Kỹ thuật:** [technical_architecture.md](../../../Users/ACER/.gemini/antigravity-cli/brain/5e3e9e5a-bd6e-4041-a7d6-1d89c72e0f87/technical_architecture.md) — Tổng quan cấu trúc phân lớp, các mẫu thiết kế (Strategy, Pipeline, Factory) và mô hình bảo mật.
*   **Tổng hợp Nghiệp vụ & Bản đồ Vai trò:** [system_wiki_synthesis.md](../../../Users/ACER/.gemini/antigravity-cli/brain/5e3e9e5a-bd6e-4041-a7d6-1d89c72e0f87/system_wiki_synthesis.md) — Sơ đồ nghiệp vụ tuần tự, 13 Roles hệ thống và cơ cấu Data Store (MySQL & Redis).
*   **Sơ đồ C4 Context & Use Case (.puml):** [c4_context_usecase.puml](./diagrams/c4_context_usecase.puml) — Lược đồ quan hệ thực thể mức hệ thống và bản đồ Use Case tổng quan.
*   **Các sơ đồ Use Case phân hệ chuyên biệt (.puml):**
    *   [Xác thực & Tài khoản](./diagrams/usecase_authentication.puml)
    *   [Bài viết & Xuất bản](./diagrams/usecase_post_publishing.puml)
    *   [Workspace & Kênh MXH](./diagrams/usecase_workspace_social.puml)
    *   [Quản trị & Bảng giá](./diagrams/usecase_admin_pricing.puml)

---

### 2. Tài Liệu Phân Hệ Backend (`docs/backend/`)

#### 🔐 Xác thực & Tài khoản (Authentication)
*   [Luồng Đăng ký tài khoản mới](./backend/auth/register.md)
*   [Chi tiết logic đăng ký và mã OTP](./backend/auth/REGISTER_LOGIC.md)
*   [Sơ đồ tuần tự đăng ký dạng PlantUML](./backend/auth/register-sequence.puml)
*   [Luồng Đăng ký hoàn chỉnh (Full Flow)](./backend/auth/REGISTER_FULL_FLOW.md)
*   [Tài liệu Hệ thống Đăng nhập (Local/OAuth)](./backend/LOGIN_SYSTEM.md)
*   [Quickstart Đăng nhập](./backend/auth/forgot-password.md)
*   [Luồng Quên mật khẩu & Khôi phục](./backend/auth/forgot-password.md)

#### 📝 Quản lý bài đăng & Kênh MXH
*   [Tìm kiếm & Lọc dữ liệu bài đăng Server-side](./search_and_filter_task.md)
*   [Hệ thống Hòm thư Hợp nhất (Unified Inbox)](./backend/UNIFIED_INBOX.md)
*   [Tích hợp MXH & Analytics tổng quan](./backend/SOCIAL_SERVICES.md)
*   [Chi tiết Tích hợp YouTube (Video & Shorts)](./backend/YOUTUBE_IMPLEMENTATION.md)
*   [Tài liệu kết nối YouTube](./backend/YOUTUBE_INTEGRATION.md)
*   [Tài liệu Tích hợp TikTok & Facebook (Publish & Analytics)](./tiktok_integration_and_analytics.md)
*   [Sơ đồ kết nối Facebook dạng PlantUML](./backend/facebook-connection-sequence.puml)

#### 📂 Quản lý Đa phương tiện & Khác
*   [Quản lý Thư viện Media (Media Library)](./backend/MEDIA_LIBRARY_IMPLEMENTATION.md)
*   [Kỹ thuật tải lên (Upload) bù & xử lý MKV](./backend/MEDIA_UPLOAD_TECHNICAL.md)
*   [Chỉnh sửa thông tin cá nhân (Edit Profile)](./backend/EDIT_PROFILE.md)
*   [Hướng dẫn kiểm thử chỉnh sửa thông tin](./backend/EDIT_PROFILE_TESTING.md)
*   [Tài liệu Tái cấu trúc Zen Architecture](./backend/ZEN_ARCHITECTURE_REFACTORING.md)
*   [Danh mục thiết kế Sơ đồ Kiến trúc](./backend/ARCHITECTURE_DIAGRAMS.md)
*   [Tham khảo các Endpoint API](./backend/API_REFERENCE.md)

---

### 3. Tài Liệu Phân Hệ Frontend (`docs/frontend/`)
*   [Giao diện Đăng ký & Nhập mã OTP (UI/UX)](./frontend/auth/REGISTER_UI.md)

---
*Tài liệu này được cập nhật tự động và phân loại khoa học theo Modules thực tế của ứng dụng PubliCast.*


