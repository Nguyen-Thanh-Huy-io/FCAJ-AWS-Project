# ⚙️ Frontend: Giao Diện Cài Đặt & Gói Dịch Vụ (Settings & Pricing)

Tài liệu này mô tả chi tiết giao diện cấu hình thương hiệu, nâng cấp tài khoản và quản lý thông báo.

---

## 🛠️ Công Nghệ & Thành Phần
- **Thanh toán tích hợp:** Stripe Elements / PayPal Checkout Button
- **Quản lý quyền hạn:** Access Control list (ACL) mapping dựa theo phân quyền người dùng (User Roles)
- **Thông báo đẩy:** Web Push / Socket-based notifications UI

---

## ✨ Các Tính Năng Nổi Bật

### 1. Cài Đặt Thương Hiệu & Kết Nối Kênh (`Settings.jsx`)
*   **Quản lý tài khoản mạng xã hội:** Hiển thị danh sách các kênh mạng xã hội đã kết nối (YouTube, TikTok, Facebook) với tùy chọn Disconnect/Reconnect nhanh.
*   **Mời thành viên:** Giao diện nhập email và gán vai trò (Owner, Manager, Editor, Viewer) cho thành viên mới để gửi lời mời tham gia Brand.

### 2. Gói Cước & Mua Bổ Sung (`Pricing.jsx`)
*   **Bảng giá trực quan:** So sánh các gói cước (Free, Standard, Advanced) với các tính năng giới hạn tương ứng.
*   **Gói mua bổ sung (Add-ons):** Cho phép mua thêm số lượng Brand hoặc Kênh mạng xã hội kết nối riêng lẻ mà không cần nâng cấp toàn bộ gói cước chính.

### 3. Hệ Thống Thông Báo (`Notifications.jsx`)
*   **Trung tâm thông báo:** Hiển thị thông báo về lịch xuất bản, bài đăng bị lỗi, thành viên mới chấp nhận lời mời, v.v.
*   **Trình lọc thông báo:** Cho phép lọc nhanh các thông báo theo mức độ ưu tiên hoặc trạng thái đã đọc/chưa đọc.

---

## 📂 Các Tệp Tin Liên Quan

*   [Settings.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/Settings.jsx) — Cài đặt thông tin Brand và quản lý thành viên.
*   [Pricing.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/Pricing.jsx) — Bảng giá dịch vụ và gói bổ trợ Add-ons.
*   [Notifications.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/Notifications.jsx) — Trang quản lý các thông báo từ hệ thống.
