# 📂 Media Library Implementation Details

Tài liệu này chi tiết về module quản lý tài nguyên nội dung (Media Library), bao gồm kiến trúc lưu trữ, xử lý tệp tin và tích hợp giao diện người dùng.

---

## 🏗️ Kiến Trúc Hệ Thống

Module Media Library được thiết kế theo mô hình 3 lớp (Repository -> Service -> Controller) kết hợp với Middleware xử lý tệp tin.

### 1. Xử lý Tệp tin (Multer Middleware)
- **File**: `backend/src/middlewares/upload.middleware.js`
- **Cơ chế**:
    - Lưu trữ cục bộ tại thư mục `uploads/`.
    - Tự động tạo thư mục nếu chưa tồn tại.
    - Đổi tên file bằng `timestamp` và `unique suffix` để tránh trùng lặp.
    - Giới hạn dung lượng: **100MB** (phù hợp cho cả video ngắn).
    - Hỗ trợ định dạng: `JPG, PNG, GIF, MP4, MOV, MKV, WEBP`.

### 2. Tầng Dữ liệu (Backend)
- **Repository**: `media-library.repository.js` xử lý truy vấn Prisma, hỗ trợ `findManyAndCount` để phân trang hiệu quả.
- **Service**: `media-library.service.js` 
    - Áp dụng **Query Pipeline** để lọc theo loại file (`Images`, `Videos`, `GIFs`) và tìm kiếm tên file.
    - Xử lý định dạng dữ liệu trả về cho Frontend (Kích thước file, Emoji đại diện, Ngày tháng).
    - Quản lý việc xóa tệp: Xóa bản ghi trong Database đồng thời xóa file vật lý trên ổ đĩa bằng `fs.unlinkSync`.

---

## 🔗 Danh Sách API (Endpoints)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/media?brandId=...` | Lấy danh sách media (hỗ trợ search, filter, pagination). |
| `POST` | `/api/media/upload` | Upload file mới (yêu cầu `brandId` trong body). |
| `DELETE` | `/api/media/:id` | Xóa file (xóa cả DB và vật lý). |

---

## 🎨 Triển Khai Frontend

### 1. Hook Quản lý Trạng thái (`useMediaLibrary.js`)
- Quản lý đồng bộ giữa URL Params và State ứng dụng.
- Hỗ trợ **Debounced Search** (300ms) để tối ưu hiệu năng gọi API.
- Xử lý logic chọn nhiều file (Multi-select) và xóa hàng loạt (Bulk Actions).

### 2. Giao diện Người dùng
- **Drag-and-Drop**: Hỗ trợ kéo thả trực tiếp file từ máy tính vào trình duyệt để upload.
- **View Modes**: Chuyển đổi linh hoạt giữa dạng lưới (Grid) và danh sách (List Table).
- **Detail Panel**: Xem nhanh thông tin tệp và nút "Use in Post" để bắt đầu quy trình đăng bài.

---

## 🔄 Tích hợp với Post Creator

Module Media Library được tích hợp sâu vào quy trình tạo bài viết:
1.  **MediaUploadModal**: Bổ sung tab **Library** cho phép duyệt và chọn tệp đã có thay vì phải upload lại.
2.  **MediaDropdown**: Thêm tùy chọn **From Media Library** trong menu chọn nguồn media.
3.  **Luồng ngược**: Từ Media Library, người dùng nhấn **Use in Post** sẽ tự động mở modal tạo bài viết với tệp đó đã được đính kèm sẵn.

---
*Tài liệu được cập nhật ngày 26/05/2026 bởi Gemini CLI Assistant.*
