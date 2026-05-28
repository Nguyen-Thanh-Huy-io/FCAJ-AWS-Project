# 📂 Media Library Implementation Details

Tài liệu này chi tiết về module quản lý tài nguyên nội dung (Media Library), bao gồm kiến trúc lưu trữ hiện đại, cơ chế tải lên trực tiếp và tích hợp trình phát đa phương tiện.

---

## 🏗️ Kiến Trúc Hệ Thống (Mới)

Hệ thống đã chuyển đổi từ cơ chế upload qua Server truyền thống sang **Direct Upload** kết hợp **Resumable Chunking** để tối ưu hiệu năng.

### 1. Cơ chế Tải lên Trực tiếp (Direct Upload)
- **Luồng hoạt động**:
    1. Frontend gọi API `/api/media/signature` để lấy chữ ký bảo mật từ Backend.
    2. Frontend gửi file trực tiếp từ trình duyệt lên **Cloudinary API** (Bỏ qua băng thông của Server).
    3. Sau khi thành công, Frontend gửi metadata về `/api/media/save-direct` để lưu vào cơ sở dữ liệu.
- **Lợi ích**: Giảm tải CPU/RAM cho Server, không bị lỗi Timeout khi up file GB, tiết kiệm chi phí băng thông.

### 2. Tải lên bù (Resumable Upload - Cấp độ 2)
- **Chunking**: File được chia nhỏ thành các mẩu **6MB** (sử dụng `file.slice`).
- **Persistence**: Lưu trạng thái upload (`Unique-ID`, `Current-Byte`) vào `localStorage`.
- **Phục hồi**: Nếu mất mạng hoặc F5 trang, hệ thống sẽ tự động bắt đầu lại từ mẩu dữ liệu cuối cùng đã thành công.
- **Bảo vệ**: Sử dụng sự kiện `beforeunload` để cảnh báo người dùng khi đang upload.

### 3. Xử lý Tệp tin & Định dạng
- **Hỗ trợ MKV**: Hệ thống xử lý thông minh các MIME type không chuẩn của MKV (`application/x-matroska`, `video/webm`) và fallback kiểm tra phần mở rộng file.
- **Cloudinary Integration**: Tự động phân loại `resource_type` (image/video/raw) và lưu vào đúng thư mục (`publicast/videos`, `publicast/images`).

---

## 🔍 Tìm kiếm & Lọc Dữ liệu (Server-side)

Hệ thống sử dụng **Query Pipeline** để thực hiện truy vấn động trên MySQL:
- **Tìm kiếm Toàn cục**: Khi có từ khóa tìm kiếm, hệ thống tự động bỏ qua lọc theo Folder để tìm trên toàn bộ Brand.
- **Đa trường**: Tìm kiếm đồng thời trên `filename` và `tags`.
- **Case-insensitive**: Tận dụng cơ chế Collation của MySQL để tìm kiếm không phân biệt hoa thường.
- **Debounced Search**: Frontend trì hoãn gọi API 300ms để tối ưu số lượng request.

---

## 🔗 Danh Sách API (Endpoints)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/media/signature` | Sinh chữ ký bảo mật cho Direct Upload. |
| `POST` | `/api/media/save-direct` | Lưu thông tin file vào DB sau khi upload trực tiếp thành công. |
| `GET` | `/api/media` | Lấy danh sách media (phân trang, lọc, tìm kiếm). |
| `DELETE` | `/api/media/:id` | Xóa file khỏi Database và Cloudinary Cloud. |

---

## 🎨 Giao diện & Trải nghiệm (UI/UX)
- **Video Preview**: Tích hợp trình phát video HTML5 (Auto-play, Muted, Loop) trong bảng chi tiết file.
- **Progress Tracking**: Hiển thị % tải lên thực tế theo từng mẩu dữ liệu (Chunk).
- **Multi-view**: Hỗ trợ Grid (Lưới) và Table (Danh sách).

---
*Tài liệu được cập nhật ngày 28/05/2026 bởi Gemini CLI Assistant.*
