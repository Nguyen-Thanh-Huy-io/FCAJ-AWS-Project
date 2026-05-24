# 📥 Hệ Thống Unified Inbox (Hòm thư Hợp nhất)

Tài liệu này chi tiết về kiến trúc và triển khai hệ thống quản lý tương tác đa nền tảng của PubliCast, tập trung vào module YouTube Inbox.

---

## 🏗️ Kiến Trúc Hệ Thống

Hệ thống Inbox được thiết kế để gom nhóm các tương tác (Bình luận, Tin nhắn) từ nhiều mạng xã hội về một giao diện quản lý duy nhất dành cho Manager.

### 1. Mô Hình Dữ Liệu (Database Schema)
Tuân thủ tiêu chuẩn **Metricool v5**, sử dụng kiểu dữ liệu linh hoạt:
- **`UnifiedInbox`**: Đại diện cho hòm thư của một Thương hiệu (Brand). Lưu trữ thông tin bộ lọc và thời gian đồng bộ cuối cùng.
- **`InboxItem`**: Từng đơn vị tin nhắn hoặc bình luận.
    - `platformItemId`: ID gốc từ nền tảng (dùng để `upsert` tránh trùng lặp).
    - `parentItemId`: Dùng để xây dựng luồng hội thoại (Threading).
    - `tags` & `internalNotes`: Lưu trữ dạng **JSON** để Manager phân loại khách hàng.
    - `socialAccountId`: Liên kết với tài khoản kết nối để nhận diện tin nhắn của chủ kênh.

### 2. Luồng Xử Lý (Logic Flow)
- **Đồng bộ (Syncing)**: Khi Manager nhấn Refresh, hệ thống gọi API chính thức (YouTube Data API v3) để lấy 100 bình luận mới nhất (`order: 'time'`).
- **Nhận diện Chủ kênh (Manager Identification)**: Hệ thống tự động so sánh `authorId` của bình luận với `platformAccountId` của kênh đang kết nối. Nếu trùng khớp, tin nhắn được đánh dấu là `me` và hiển thị bên phải với màu vàng nhạt đặc trưng.
- **Luồng hội thoại (Threading)**: Các câu trả lời (replies) được tự động gom nhóm dưới bình luận gốc. Cột bên trái hiển thị tóm tắt, khung chat bên phải hiển thị toàn bộ lịch sử tương tác của nhiều người tham gia.

---

## 🚀 Các Tính Năng Đã Hoàn Thành (YouTube)

### 1. Quản lý Tương tác
- **Đồng bộ Bình luận**: Lấy dữ liệu thật từ YouTube bao gồm nội dung, tên người dùng, avatar và thời gian.
- **Trả lời trực tiếp (Reply)**: Soạn thảo và gửi phản hồi ngay từ Dashboard lên YouTube API.
- **Quản lý Trạng thái**: 
    - Đánh dấu **Đã đọc (READ)** / **Chưa đọc (UNREAD)** bằng biểu tượng con mắt.
    - Đánh dấu **Đã giải quyết (RESOLVED)** bằng biểu tượng dấu tích để dọn dẹp danh sách.

### 2. Giao diện Người dùng (UX/UI)
- **Avatar Stack**: Hiển thị ảnh đại diện chồng lên nhau nếu luồng hội thoại có nhiều người tham gia.
- **Video Context Card**: Tự động hiển thị thẻ thông tin video (Tiêu đề, Lượt xem, Likes) mà khách hàng đang bình luận. Thẻ này có thể nhấp vào để mở video gốc trên YouTube.
- **Bố cục Chuẩn**: Tin nhắn Manager nằm bên phải, màu vàng nhạt (#FEF3C7), Avatar của Brand hiển thị đồng bộ.

---

## 🔗 Danh Sách API (Endpoints)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/inbox` | Lấy danh sách các luồng hội thoại (có phân trang & lọc). |
| `GET` | `/api/inbox/:id` | Lấy chi tiết luồng chat và thông tin ngữ cảnh Video. |
| `POST` | `/api/inbox/sync` | Kích hoạt đồng bộ dữ liệu mới nhất từ YouTube API. |
| `POST` | `/api/inbox/reply` | Gửi phản hồi thực tế lên nền tảng mạng xã hội. |
| `PATCH` | `/api/inbox/:id/status` | Cập nhật trạng thái tin nhắn (READ, UNREAD, RESOLVED). |

---

## 🛠️ Cấu Trúc Thư Mục (Modular)

Theo kiến trúc mới, các file liên quan được tổ chức tại:
- **Controller**: `src/controllers/social/inbox.controller.js`
- **Service**: `src/services/social/inbox.service.js`
- **Repository**: `src/repositories/social/inbox.repository.js`
- **Routes**: `src/routes/social/inbox.routes.js`

---
*Tài liệu được cập nhật ngày 24/05/2026 bởi Gemini CLI Assistant.*
