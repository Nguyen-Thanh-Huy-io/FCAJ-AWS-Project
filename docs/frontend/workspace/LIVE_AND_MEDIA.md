# 🎥 Frontend: Quản Lý Livestream & Thư Viện Media (Live & Media Library)

Tài liệu này ghi nhận chi tiết về kiến trúc UI/UX và logic tích hợp API cho tính năng cấu hình phát trực tiếp (Livestream) và quản lý thư viện hình ảnh/video.

---

## 🛠️ Công Nghệ & Thành Phần
- **Thư viện Video Preview:** HTML5 Video Player
- **Tải lên media:** Dropzone kéo thả tệp tin đa dạng định dạng
- **Cấu hình Stream:** RTMP URL & Stream Key Copy Button

---

## ✨ Các Tính Năng Nổi Bật

### 1. Thiết Lập Livestream (`LiveSetup.jsx` / `LiveMonitor.jsx`)
*   **Cấu hình luồng RTMP:** Hiển thị địa chỉ Server URL và Khóa luồng (Stream Key) để người dùng sao chép nhanh vào phần mềm phát (như OBS Studio).
*   **Lập lịch phát trực tiếp:** Thiết lập tiêu đề, mô tả, ảnh thu nhỏ (thumbnail) và lập lịch giờ phát.
*   **Giám sát luồng phát (`LiveMonitor.jsx`):** Hiển thị trạng thái kết nối trực tiếp, số lượng người xem đồng thời (peak viewers) và tổng thời gian đã phát.

### 2. Thư Viện Phương Tiện (`MediaLibrary.jsx`)
*   **Duyệt thư mục giả lập:** Hỗ trợ tạo và sắp xếp tệp tin hình ảnh/video vào các thư mục trực quan.
*   **Kéo thả tải lên:** Tự động bắt sự kiện kéo thả file từ máy tính vào trình duyệt để kích hoạt tải lên server.
*   **Video Converter UI:** Cảnh báo và hỗ trợ chuyển đổi định dạng đối với các tệp tin video nặng hoặc không được hỗ trợ mặc định trên trình duyệt (như MKV).

---

## 📂 Các Tệp Tin Liên Quan

*   [LiveSetup.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/LiveSetup.jsx) — Thiết lập cấu hình RTMP livestream.
*   [LiveMonitor.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/LiveMonitor.jsx) — Màn hình giám sát livestream thời gian thực.
*   [MediaLibrary.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/MediaLibrary.jsx) — Quản lý thư viện hình ảnh và video.
*   [StreamHistory.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/StreamHistory.jsx) — Xem lại lịch sử các luồng phát trực tiếp đã thực hiện.
