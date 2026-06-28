# Test Case: TC_BRAND_01 - Hiển thị trang Brand Settings

| ID number   | TC_BRAND_01                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Hiển thị trang Brand Settings                                  |
| Component   | Brand Settings                                                 |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.list.spec.js`                       |

## 1. Prerequisites
- Người dùng đã được đăng ký và thiết lập tài khoản quản trị (Admin).
- Ứng dụng PubliCast đang chạy bình thường.

## 2. Test Data
| Parameter  | Value                                |
| ---------- | ------------------------------------ |
| Role       | admin                                |
| Target URL | http://localhost:5173/manage/connections |

## 3. Step-by-Step Procedure
1. Đăng nhập vào hệ thống PubliCast với vai trò `admin`.
2. Điều hướng đến trang cài đặt kết nối và quản lý thương hiệu thông qua đường dẫn `/manage/connections`.
3. Kiểm tra sự xuất hiện của tiêu đề chính `h1`.
4. Tìm kiếm nút "Add brand" trên giao diện.

## 4. Expected Result
- Tiêu đề chính `h1` hiển thị nội dung chứa chuỗi `"Brand settings"`.
- Nút "Add brand" (`data-testid="add-brand-btn"`) có mặt trên giao diện.
- Trình duyệt tải thành công trang quản lý mà không xảy ra bất kỳ lỗi console nào.
