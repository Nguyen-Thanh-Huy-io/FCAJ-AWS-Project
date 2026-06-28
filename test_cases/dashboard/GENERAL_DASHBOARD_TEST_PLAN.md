# Kế hoạch kiểm thử tự động (Selenium E2E Test Plan) - Dashboard Chung & Gỡ Livestream

Tài liệu này xác định kịch bản kiểm thử tự động E2E bằng Selenium WebDriver cho trang Dashboard chung mới (`/dashboard`) sau khi tái cấu trúc và loại bỏ các tính năng Livestream.

## Các Test Case chi tiết (Total: 10 Test Cases)

| Mã Test Case | Tên Test Case | Mô tả kịch bản | Kết quả mong đợi (Assertion) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **TC_DASHBOARD_01** | Đăng nhập & Điều hướng | Đăng nhập bằng tài khoản test local, chờ chuyển hướng đến trang chủ. | Trình duyệt chuyển hướng thành công đến `/dashboard`. | Sẵn sàng |
| **TC_DASHBOARD_02** | Xác minh Stat Cards | Kiểm tra sự hiển thị của các thẻ thông số thống kê tổng quan. | Hiển thị các nhãn tiếng Việt: `Tổng người theo dõi`, `Tổng lượt xem`, `Tổng video`, `Thương hiệu hiện tại`. | Sẵn sàng |
| **TC_DASHBOARD_03** | Xác minh Hàng chờ bài đăng | Kiểm tra sự xuất hiện của cấu phần hàng chờ bài đăng gần đây. | Hiển thị tiêu đề `Hàng chờ bài đăng gần đây` và nút `Tạo bài đăng`. | Sẵn sàng |
| **TC_DASHBOARD_04** | Xác minh Kết nối mạng xã hội | Kiểm tra sự xuất hiện của thẻ trạng thái kết nối platform. | Hiển thị tiêu đề `Kết Nối Mạng Xã Hội` và danh sách các platform (YouTube, Facebook...). | Sẵn sàng |
| **TC_DASHBOARD_05** | Xác minh Gỡ bỏ Livestream ở Header | Kiểm tra các phần tử trên Topbar để tìm liên kết livestream. | Không tìm thấy bất kỳ nút hay liên kết nào chứa `/live` hoặc chữ `Livestream`. | Sẵn sàng |
| **TC_DASHBOARD_06** | Kiểm tra Chuyển hướng Redirect | Truy cập trực tiếp các đường dẫn livestream cũ (`/live`, `/scheduler`). | Trình duyệt tự động chuyển hướng ngược về `/dashboard`. | Sẵn sàng |
| **TC_DASHBOARD_07** | Bấm nút Tạo bài đăng | Click nút `Tạo bài đăng` ở phần hàng chờ bài đăng gần đây. | Xuất hiện Popup/Drawer Form tạo bài đăng (`Post Creator UI`). | Sẵn sàng |
| **TC_DASHBOARD_08** | Điều hướng Lịch đăng | Click nút `Lịch đăng →` ở phần hàng chờ bài đăng gần đây. | Trình duyệt chuyển hướng thành công sang trang `/planner`. | Sẵn sàng |
| **TC_DASHBOARD_09** | Điều hướng Quản lý kết nối | Click nút `Quản lý` ở thẻ trạng thái kết nối mạng xã hội. | Trình duyệt chuyển hướng thành công sang trang `/manage/connections`. | Sẵn sàng |
| **TC_DASHBOARD_10** | Tràn chữ Tên thương hiệu | Kiểm tra xem thẻ ACTIVE BRAND có xử lý tốt văn bản dài không. | Tên thương hiệu hiển thị gọn gàng, không bị tràn (scrollWidth <= clientWidth). | Tái hiện lỗi |

---

## Môi trường kiểm thử (Environment Setup)
- **Frontend URL**: `http://localhost:5173`
- **Tài khoản kiểm thử**:
  - Email: `vothanhnha26@gmail.com`
  - Mật khẩu: `nhacc123@`
- **Thư viện sử dụng**: Selenium WebDriver, Mocha (test runner), Chai (assertions).
