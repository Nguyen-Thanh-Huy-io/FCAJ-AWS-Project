# Test Case: TC_AUTOLIST_01 - Tạo mới Autolist và kiểm tra lưu DB

| ID number   | TC_AUTOLIST_01                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Tạo mới Autolist và kiểm tra lưu DB                            |
| Component   | Autolists                                                      |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/autolists.spec.js`                              |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC12                                                           |

## 1. Prerequisites
- Người dùng đã đăng ký và kết nối tài khoản mạng xã hội Facebook.
- Đang ở giao diện quản lý AutoLists.

## 2. Test Data
| Parameter     | Value                               |
| ------------- | ----------------------------------- |
| Queue Name    | `Selenium Queue <timestamp>`        |
| Platform      | Facebook                            |
| Interval      | 1 Hour (60 minutes)                 |

## 3. Step-by-Step Procedure
1. Truy cập trang quản lý `/autolists`.
2. Click nút "Tạo hàng đợi mới" (Create new queue).
3. Điền tên hàng đợi: `Selenium Queue <timestamp>`.
4. Chọn nền tảng mục tiêu: Facebook.
5. Thiết lập khoảng cách đăng (Interval): 1 giờ.
6. Nhấn nút "Tạo mới" (Submit) để lưu hàng đợi.
7. Chờ giao diện hiển thị danh sách cập nhật.
8. Truy vấn trực tiếp cơ sở dữ liệu (`auto_lists` table) để kiểm tra bản ghi tương ứng.

## 4. Expected Result
- Hàng đợi mới xuất hiện trên UI.
- Trên cơ sở dữ liệu, bản ghi có tên đúng `Selenium Queue <timestamp>`, `intervalMinutes = 60`, `platform = 'facebook'`, và `isActive = 1`.
