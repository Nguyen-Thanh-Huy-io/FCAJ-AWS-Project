# Test Case: TC_FB_DB_07_08 - Tab STORIES (Metrics, List & Pagination) trên Facebook Dashboard

| ID number   | TC_FB_DB_07_08                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Tab STORIES (Metrics, List & Pagination)                       |
| Component   | Dashboard / Facebook Dashboard / Stories                       |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/facebook_dashboard.spec.js`           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC16                                                           |

## 1. Prerequisites
- Đang hiển thị trang `/dashboard/facebook`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Tab Name    | STORIES                               |

## 3. Step-by-Step Procedure
1. Click chọn tab `STORIES` trên thanh điều hướng phụ của Facebook Dashboard.
2. Kiểm tra sự xuất hiện của các biểu đồ thống kê về Tin (Stories).
3. Kiểm tra danh sách các tin ngắn đã đăng dạng bảng hoặc trạng thái Empty State tương ứng.

## 4. Expected Result
- Giao diện chuyển đổi sang tab Stories mượt mà.
- Hiển thị đúng bảng danh sách tin hoặc trạng thái Empty State "No stories found" hợp lệ mà không có lỗi Javascript nào trong Console.
