# 🚀 Kỹ thuật Tải lên Nâng cao (Advanced Upload Technical)

Tài liệu này đi sâu vào chi tiết kỹ thuật của cơ chế **Resumable Chunked Upload** và cách xử lý các trường hợp đặc biệt về định dạng file.

---

## 1. Giải pháp Resumable Upload (Cấp độ 2)

Hệ thống sử dụng Class `CloudinaryResumableUploader` (`frontend/src/utils/cloudinaryUploader.js`) để quản lý vòng đời của một tệp tin tải lên.

### Quy trình Chia nhỏ (Chunking)
- Kích thước mỗi chunk: **6MB** (Đảm bảo > 5MB theo yêu cầu tối thiểu của Cloudinary).
- Sử dụng `X-Unique-Upload-Id`: Một chuỗi định danh duy nhất được sinh ra khi bắt đầu một phiên upload mới.
- Header `Content-Range`: Định nghĩa dải byte đang được gửi (ví dụ: `bytes 0-5999999/15000000`).

### Khả năng Phục hồi (Resume)
1. **Lưu trữ**: `localStorage` lưu trữ cặp giá trị `{fileKey}-id` và `{fileKey}-start`.
2. **Kiểm tra**: Khi một file được chọn, hệ thống tạo `fileKey` dựa trên `name` và `size`. Nếu thấy tồn tại trong Storage, nó sẽ bắt đầu từ byte đã lưu thay vì byte 0.
3. **Dọn dẹp**: Xóa sạch `localStorage` ngay sau khi nhận được phản hồi thành công mẩu cuối cùng từ Cloudinary.

---

## 2. Xử lý Định dạng File MKV & MIME Types

MKV là định dạng phức tạp do sự không nhất quán về MIME type giữa các trình duyệt và hệ điều hành.

### Các loại MIME được chấp nhận cho MKV:
- `video/x-matroska` (Tiêu chuẩn)
- `video/matroska`
- `application/x-matroska`
- `video/webm` (Một số trình duyệt nhận diện MKV là WebM)
- `application/octet-stream` (Loại chung - Hệ thống sẽ kiểm tra thêm đuôi `.mkv` để cho phép).

### Cấu hình Cloudinary Fallback:
Trong `backend/src/config/cloudinary.js`, logic phân loại được mở rộng:
```javascript
const isVideoMime = file.mimetype.startsWith('video/') || 
                   file.mimetype === 'application/x-matroska' || 
                   (file.mimetype === 'application/octet-stream' && file.originalname.toLowerCase().endsWith('.mkv'));
```
Điều này đảm bảo Cloudinary luôn xử lý đúng file là Video để sinh Thumbnail và hỗ trợ Streaming.

---

## 3. Bảo mật & Chữ ký (Signing)

Hệ thống tuyệt đối **KHÔNG sử dụng Unsigned Upload** (tải lên không ký) để tránh việc kho lưu trữ bị tấn công spam.

- **Backend-Signing**: Chỉ Backend nắm giữ `API_SECRET`. Mọi yêu cầu upload phải xin chữ ký từ API `/signature`.
- **Hạn dùng**: Chữ ký được gắn kèm `timestamp` và chỉ có hiệu lực trong một khoảng thời gian ngắn.
- **Tham số khớp**: Các tham số gửi lên Cloudinary (`folder`, `timestamp`) phải khớp tuyệt đối với tham số đã dùng để tạo chữ ký ở Backend.

---
*Tài liệu kỹ thuật chuyên sâu cho đội ngũ phát triển PubliCast.*
