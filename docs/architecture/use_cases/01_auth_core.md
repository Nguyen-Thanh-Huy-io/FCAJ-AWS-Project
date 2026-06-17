# Đặc Tả Use Case: Phân hệ Xác thực & Core (Auth & Core)

## 1. Sơ đồ Use Case

![Sơ đồ Use Case Auth](../../diagrams/uc_auth.png)

## 2. Đặc tả chi tiết

### UC01. Đăng nhập / Đăng ký (Local & Social)
*   **Mô tả:** Cho phép người dùng mới tạo tài khoản và người dùng cũ truy cập hệ thống bằng Email hoặc OAuth (Google, Facebook, Instagram).
*   **Tác nhân kích hoạt:** Khách vãng lai, Người dùng hệ thống.
*   **Tiền điều kiện:** Người dùng có tài khoản mạng xã hội hợp lệ hoặc email có thể nhận mã OTP.
*   **Các bước thực hiện:**
    1.  Người dùng truy cập vào trang xác thực của PubliCast.
    2.  Chọn hình thức Email/Mật khẩu hoặc Đăng nhập qua mạng xã hội.
    3.  **Local Auth:** Nếu đăng ký, hệ thống gửi OTP. Người dùng nhập OTP để kích hoạt.
    4.  **Social Auth:** Hệ thống điều hướng sang cổng đăng nhập của bên thứ 3 để lấy xác thực.
    5.  Hệ thống cấp phát JWT Token và chuyển hướng vào Dashboard.
*   **Ngoại lệ:** Sai mật khẩu, OTP hết hạn, Tài khoản bị khóa (Inactive).

### UC02. Quản lý Hồ sơ & Cài đặt (User Profile)
*   **Mô tả:** Cho phép người dùng đổi tên, avatar, mật khẩu, và cài đặt khu vực (ngôn ngữ, múi giờ).
*   **Tác nhân kích hoạt:** Người dùng đã đăng nhập.
*   **Tiền điều kiện:** User có token hợp lệ.
*   **Các bước thực hiện:**
    1.  Vào phần cài đặt cá nhân (Settings -> Profile).
    2.  Điền thông tin mới (VD: Thay avatar upload lên Cloudinary).
    3.  Nhấn lưu thay đổi.
    4.  Hệ thống cập nhật bảng `User` và `UserSettings`. Trả về thông báo thành công.

### UC03. Quản lý Thương hiệu (Brand Management)
*   **Mô tả:** Khởi tạo và quản lý cấu hình các Không gian làm việc đa nhóm (Brand).
*   **Tác nhân kích hoạt:** Người dùng (với tư cách là OWNER).
*   **Tiền điều kiện:** Giới hạn số lượng Brand theo gói `PlanLimit` cho phép tạo thêm.
*   **Các bước thực hiện:**
    1.  Người dùng bấm "Tạo Brand mới".
    2.  Cung cấp Tên Brand, chọn Timezone, Default Language.
    3.  Hệ thống tạo `Brand` mới, khởi tạo các cài đặt mặc định (`AIAssistant` limit, `UnifiedInbox`).
    4.  Gán người dùng làm `OWNER` của Brand đó.
