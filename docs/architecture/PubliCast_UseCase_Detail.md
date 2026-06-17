# Đặc Tả Use Case Hệ Thống PubliCast

Tài liệu này đóng vai trò là "Mục lục" (Index), tập hợp toàn bộ các mô hình Use Case và đặc tả chi tiết cho nền tảng B2B SaaS PubliCast. Hệ thống được bóc tách thành các phân hệ nghiệp vụ rõ ràng, phù hợp với kiến trúc cơ sở dữ liệu (`schema.prisma`) và thiết kế phần mềm.

---

## Danh mục Phân hệ Use Case

Vui lòng nhấp vào các liên kết bên dưới để xem **Sơ đồ Use Case (PlantUML)** và **Đặc tả chi tiết từng bước** cho phân hệ tương ứng:

1.  **[Phân hệ Xác thực & Cài đặt (Auth & Core)](./use_cases/01_auth_core.md)**
    *   UC01. Đăng nhập / Đăng ký (Local & Social)
    *   UC02. Quản lý Hồ sơ & Cài đặt cá nhân
    *   UC03. Quản lý Thương hiệu (Brand Management - Multi-tenant)

2.  **[Phân hệ Quản trị Workspace & Phân quyền](./use_cases/02_workspace_roles.md)**
    *   UC04. Quản lý Đội ngũ (Team Members)
    *   UC05. Cấu hình Phân quyền tùy chỉnh (Custom Roles)

3.  **[Phân hệ Quản lý Đa phương tiện (Media Library)](./use_cases/03_media_library.md)**
    *   UC06. Tải lên và Tổ chức Media (Upload & Folders)

4.  **[Phân hệ Đăng bài & Lập lịch (Publishing)](./use_cases/04_publishing.md)**
    *   UC07. Soạn thảo & Tạo bài đăng (Tích hợp AI)
    *   UC08. Quy trình Phê duyệt (Approval Workflow)
    *   UC09. Lập lịch Tự động (AutoLists)
    *   UC10. Quản lý Livestream (RTMP Setup)

5.  **[Phân hệ Mạng xã hội & Hộp thư (Social & Inbox)](./use_cases/05_social_inbox.md)**
    *   UC11. Kết nối Nền tảng (OAuth Connections)
    *   UC12. Hòm thư Hợp nhất (Unified Inbox)

6.  **[Phân hệ Phân tích & Báo cáo (Analytics & Reports)](./use_cases/06_analytics_reports.md)**
    *   UC13. Theo dõi Thống kê Nền tảng (Social Analytics Dashboard)
    *   UC14. Theo dõi Đối thủ & Hashtag (Competitor/Trend Tracking)
    *   UC15. Xuất Báo cáo Tự động (White-label Reports)

7.  **[Phân hệ Quản trị Hệ thống & Gói cước (Admin & Billing)](./use_cases/07_admin_billing.md)**
    *   UC16. Quản lý Gói cước (Subscriptions, Plans & Invoices)
    *   UC17. Xem Nhật ký Hoạt động Hệ thống (Audit Logs)

---
*Ghi chú: Toàn bộ biểu đồ Use Case trực quan được đặt tại thư mục `docs/diagrams/` và đã được liên kết nhúng trực tiếp bên trong các tài liệu con.*
