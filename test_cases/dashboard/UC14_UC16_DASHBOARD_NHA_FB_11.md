# Test Case: TC_FB_DB_11 - Kiểm tra trạng thái Facebook chưa liên kết (Empty State)

| ID number   | TC_FB_DB_11                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Kiểm tra trạng thái Facebook chưa liên kết (Empty State)       |
| Component   | Dashboard / Facebook Dashboard / Empty State                   |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/facebook_dashboard.spec.js`           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC14, UC16                                                           |

## 1. Prerequisites
- Đăng nhập thành công và chưa liên kết tài khoản trang Facebook nào cho thương hiệu này.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Target URL  | `/dashboard/facebook`                 |

## 3. Step-by-Step Procedure
1. Click vào tab "Facebook" ở thanh điều hướng bên trái (Sidebar).
2. Chờ trang tải hoàn tất.
3. Kiểm tra xem màn hình có hiển thị dòng thông báo `"Facebook account not connected"` hay không.
4. Kiểm tra sự xuất hiện của nút bấm "Connect Facebook".

## 4. Expected Result
- Giao diện hiển thị màn hình Empty State thông báo chưa liên kết tài khoản.
- Nút bấm `"Connect Facebook"` xuất hiện đầy đủ trên màn hình.
