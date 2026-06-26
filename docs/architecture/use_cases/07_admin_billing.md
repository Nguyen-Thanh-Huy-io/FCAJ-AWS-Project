# Đặc Tả Use Case: Phân hệ Quản trị Hệ thống & Billing

## 1. Sơ đồ Use Case

![Sơ đồ Use Case Admin](../../diagrams/uc_admin.png)

## 2. Đặc tả chi tiết

### UC16. Quản lý Gói cước (Subscriptions & Pricing)
*   **Mô tả:** Quy trình xem bảng giá, thanh toán, nâng cấp/hạ cấp gói cước dịch vụ (SaaS).
*   **Tác nhân kích hoạt:** Brand Owner.
*   **Tiền điều kiện:** Tích hợp cổng thanh toán (VD: Stripe).
*   **Các bước thực hiện:**
    1.  Owner truy cập trang "Billing & Pricing".
    2.  Hệ thống liệt kê gói (STARTER, PRO...) và giới hạn (`PlanLimit`).
    3.  Owner chọn mua, nhập thẻ.
    4.  Stripe xử lý, gọi Webhook báo về PubliCast.
    5.  Hệ thống cập nhật `Subscription`, mở khóa tính năng (VD: thêm số lượng User, bật Custom Roles), tạo `Invoice`.

### UC17. Nhật ký Hoạt động Hệ thống (Audit Logs)
*   **Mô tả:** Tính năng bảo mật giúp giám sát ai làm gì vào thời điểm nào (VD: Ai là người xóa post, ai thay đổi cấu hình AutoList).
*   **Tác nhân kích hoạt:** Hệ thống (Ghi), Admin (Đọc).
*   **Các bước thực hiện:**
    1.  Mỗi khi User gọi API làm thay đổi CSDL (POST, PUT, DELETE), Middleware chặn lại, ghi bản ghi vào `AuditLog` (chứa IP, UserAgent, Action).
    2.  Brand Owner/Admin vào mục "Security/Audit Logs".
    3.  Filter theo ngày tháng, theo User hoặc theo Action. Xem chi tiết hành động.
