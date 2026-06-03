# 💻 PubliCast Frontend Documentation

Tài liệu này tổng hợp cấu trúc mã nguồn, các thành phần giao diện (Components) và luồng dữ liệu phía Frontend của dự án **PubliCast** theo từng phân hệ (module).

---

## 🏗️ Cấu Trúc Các Phân Hệ Giao Diện (`src/pages/workspace/`)

Giao diện quản lý Workspace của PubliCast được chia thành các trang chức năng cốt lõi và các tab điều phối:

### 1. Phân Hệ Thống Kê & Báo Cáo (Social & Analytics)
*   **[PlatformDashboard.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/PlatformDashboard.jsx):** Trang điều hướng chính cho Dashboard của các nền tảng mạng xã hội (YouTube, Facebook, TikTok).
*   Thư mục **[dashboard/](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/dashboard/):** Chứa các tab hiển thị số liệu phân tích:
    *   **YouTube Dashboard:** `PublishedVideosTab.jsx`, `TrackedVideosTab.jsx`.
    *   **Facebook Dashboard:** `FacebookDashboard.jsx`, `FacebookOverviewTab.jsx`, `FacebookPostsTab.jsx`.
    *   **TikTok Dashboard:** `TikTokDashboard.jsx`, `TikTokPostsTab.jsx`, `TikTokCommunityTab.jsx`.

### 2. Không Gian Lập Lịch & Xuất Bản (Workspace & Scheduling)
*   **`PostCreator.jsx`:** Hộp thoại tạo bài viết đa nền tảng, tải lên phương tiện truyền thông trực quan.
*   **`ContentPlanner.jsx`:** Giao diện lịch biểu (Content Calendar) theo ngày/tuần/tháng để quản lý thời gian xuất bản.
*   **`AutoLists.jsx`:** Quản lý hàng đợi bài đăng tự động theo các khung giờ cố định hoặc khoảng thời gian.

### 3. Thư Viện Phương Tiện (Media & Live)
*   **`MediaLibrary.jsx`:** Thư viện lưu trữ và quản lý hình ảnh, video tải lên.
*   **`LiveSetup.jsx` & `LiveMonitor.jsx`:** Lên lịch livestream thông qua giao thức RTMP và giám sát luồng phát trực tiếp.

---

## 🔗 Hướng Dẫn Chi Tiết Theo Module

Để đi sâu vào chi tiết cách hoạt động của từng phân hệ giao diện tại Client-side:

### 🔐 Module Xác thực (Auth)
*   **[Giao diện Đăng ký & Nhập OTP](./auth/REGISTER_UI.md):** Luồng đăng ký tài khoản mới và xác minh mã OTP tại Frontend.

### 🌐 Module Mạng xã hội & Thống kê (Social & Analytics)
*   **[Báo cáo & Thống kê Workspace](./social/WORKSPACE_DASHBOARD.md):** Cách trực quan hóa số liệu phân tích đa nền tảng bằng Recharts.
*   **[Giao diện TikTok (TikTok Frontend Docs)](./social/TIKTOK_FRONTEND.md):** Cấu trúc component phục vụ riêng cho hiển thị kênh TikTok.

### ⏳ Module Lập lịch & Quản lý phương tiện (Workspace & Media)
*   **[Tạo bài đăng & Hàng đợi AutoLists](./workspace/CONTENT_PUBLISHING.md):** Quản lý lịch Content Planner, Modal PostCreator, và hàng đợi AutoLists.
*   **[Livestream & Thư viện Media](./workspace/LIVE_AND_MEDIA.md):** Cấu hình phát RTMP trực tiếp và quản lý tệp tin.

### ⚙️ Module Quản trị & Gói dịch vụ (Admin & Pricing)
*   **[Cài đặt & Gói cước](./admin/SETTINGS_AND_PRICING.md):** Quản lý thông tin Brand, thành viên, thông báo, tích hợp Stripe/PayPal nâng cấp tài khoản.
