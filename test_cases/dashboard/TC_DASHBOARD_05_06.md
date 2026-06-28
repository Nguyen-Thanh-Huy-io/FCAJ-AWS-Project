# Test Case: TC_DASHBOARD_05_06 - Loại bỏ Livestream và cơ chế Redirect bảo mật

| ID number   | TC_DASHBOARD_05_06                                             |
| ----------- | -------------------------------------------------------------- |
| Name        | Loại bỏ Livestream và cơ chế Redirect bảo mật                  |
| Component   | Dashboard / Livestream Removal / Security                      |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/general_dashboard.spec.js`            |

## 1. Prerequisites
- Người dùng đã hoàn tất onboarding và đang truy cập hệ thống.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Target URL  | `/live` (URL tính năng livestream cũ) |

## 3. Step-by-Step Procedure
1. Tại trang Dashboard chính `/dashboard`, kiểm tra trên thanh tiêu đề (Header) và menu xem có bất kỳ link hoặc nút bấm nào chứa từ khóa `"Livestream"` hay link tới `/live` hay không.
2. Gửi request điều hướng trực tiếp bằng cách nhập URL `/live` trên thanh địa chỉ trình duyệt.
3. Chờ trình duyệt xử lý điều hướng.
4. Kiểm tra URL đích sau khi chuyển hướng.

## 4. Expected Result
- Không có bất kỳ liên kết hay nút bấm nào liên quan đến Livestream trên giao diện Header/Sidebar (mảng trả về từ findElements có length = 0).
- Khi truy cập trực tiếp vào `/live`, hệ thống thực hiện chuyển hướng thành công về `/dashboard` và URL hiển thị không còn chứa `/live`.
