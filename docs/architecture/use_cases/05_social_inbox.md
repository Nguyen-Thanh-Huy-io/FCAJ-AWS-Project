# Đặc Tả Use Case: Phân hệ Mạng xã hội & Hộp thư

## 1. Sơ đồ Use Case

![Sơ đồ Use Case Social](../../diagrams/uc_social.png)

## 2. Đặc tả chi tiết

### UC11. Kết nối Nền tảng (Social Connections)
*   **Mô tả:** Quy trình xác thực liên kết PubliCast với các nền tảng Facebook, YouTube, TikTok, v.v. thông qua OAuth 2.0.
*   **Tác nhân kích hoạt:** Admin, Owner.
*   **Tiền điều kiện:** Token hệ thống PubliCast API (đã được đăng ký app trên FB/Google).
*   **Các bước thực hiện:**
    1.  Tại mục "Connections", click "Connect" ứng dụng (VD: TikTok).
    2.  Popup OAuth mở ra, người dùng cấp quyền truy cập.
    3.  Nền tảng trả về Code, PubliCast backend đổi lấy AccessToken & RefreshToken.
    4.  Lưu thông tin `SocialAccount` vào DB. Hệ thống khởi chạy worker sync dữ liệu ban đầu.

### UC12. Hòm thư Hợp nhất (Unified Inbox)
*   **Mô tả:** Gom toàn bộ DM, Comments, Mentions từ các kênh (FB Page, IG, TikTok, YouTube) về chung một giao diện.
*   **Tác nhân kích hoạt:** Customer Support, Editor.
*   **Tiền điều kiện:** Các Webhook của PubliCast đã được đăng ký và hoạt động.
*   **Các bước thực hiện:**
    1.  **Nhận tin:** Hệ thống nhận payload từ Webhook MXH, ghi vào `InboxItem`.
    2.  **Quản lý tin:** Nhân viên vào màn hình Unified Inbox. Có thể filter theo nền tảng, loại tin nhắn (Chưa đọc/Đã đọc).
    3.  **Tương tác:** Nhân viên có thể gán tag (VD: Hỏi giá), note nội bộ, Assign cho người khác.
    4.  **Trả lời:** Nhập text phản hồi. Hệ thống gọi lại API MXH để gửi tin tới KH.
