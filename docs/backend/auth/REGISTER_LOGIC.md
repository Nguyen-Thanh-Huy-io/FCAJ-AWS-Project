# 🖥️ Backend: Logic Đăng Ký & Xác Thực OTP

Tài liệu chi tiết về kiến trúc và triển khai logic đăng ký tài khoản tại Backend.

---

## 🛠️ Công Nghệ & Thành Phần
- **Framework**: Express.js
- **Database**: MySQL (via Prisma ORM)
- **Caching/Storage**: Redis (Lưu OTP & Throttle)
- **Email**: Nodemailer (Strategy Pattern)
- **Security**: BcryptJS, JWT, Express-validator

---

## ⚙️ Triển Khai Chi Tiết

### 1. Chuẩn Hóa Dữ Liệu (Normalization)
Để tránh lỗi không khớp dữ liệu do chữ hoa/thường, tất cả Email được đưa về chữ thường trước khi xử lý:
```javascript
const normalizedEmail = email.toLowerCase();
```
Áp dụng tại: `register`, `verifyOTP`, `resendOTP`.

### 2. Quản Lý OTP với Redis
- **Key**: `otp:email`
- **Giá trị**: Mã 6 số ngẫu nhiên.
- **TTL (Hết hạn)**: 10 phút.
- **Xóa mã**: Ngay sau khi xác thực thành công.

### 3. Cơ Chế Chống Spam & Kiểm Tra Trạng Thái (Throttle & Account Guard)
Sử dụng Redis để giới hạn mỗi người dùng chỉ được gửi lại OTP sau 60 giây.
- **Key**: `resend-otp-throttle:email`
- **TTL**: 60 giây.
- **Ràng buộc kiểm tra trạng thái tài khoản (Account Guard)**:
  - Nếu tài khoản đã xác thực email thành công (`isEmailVerified === true`) -> Từ chối gửi OTP mới (400).
  - Nếu tài khoản đang ở trạng thái bị khóa (`isActive === false`) -> Từ chối gửi OTP mới (400).
- **Cơ chế gửi tin (Email Dispatch)**: Gọi trực tiếp `emailService.sendOTP` đồng bộ trong API resend.
- **Logic Spam**: Nếu key throttle tồn tại -> Trả về lỗi 429.

### 4. Tự Động Đăng Nhập (Auto-login)
Sau khi `verifyOTP` thành công:
1.  Cập nhật status User sang `ACTIVE`.
2.  Sinh bộ đôi `accessToken` và `refreshToken` (Tầng Service).
3.  Lưu Refresh Token dạng mã hóa SHA-256 hash vào Redis (Tầng Service).
4.  Thiết lập **HttpOnly Cookies** để bảo mật phía trình duyệt (Tầng Controller).

---

## 🔗 Danh Sách API (Endpoints)
- `POST /api/auth/register`: Đăng ký và gửi OTP lần đầu.
- `POST /api/auth/verify-otp`: Kiểm tra mã và tự động đăng nhập.
- `POST /api/auth/resend-otp`: Gửi lại mã kèm cơ chế chặn spam 60s và Account Guard.

---
*Cập nhật: 03/06/2026*

