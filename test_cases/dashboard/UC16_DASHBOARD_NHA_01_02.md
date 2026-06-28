# Test Case: TC_DASHBOARD_01_02 - Xác minh URL điều hướng và Stat Cards hiển thị đúng dữ liệu

| ID number   | TC_DASHBOARD_01_02                                             |
| ----------- | -------------------------------------------------------------- |
| Name        | Xác minh URL điều hướng và Stat Cards hiển thị đúng dữ liệu    |
| Component   | Dashboard / Overview                                           |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/general_dashboard.spec.js`            |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC16                                                           |

## 1. Prerequisites
- Đã đăng ký và seed dữ liệu thành công từ `TC_DASHBOARD_00`.
- Người dùng đang hiển thị trang Dashboard `/dashboard`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Expected stats| Lượt theo dõi, Tổng lượt xem, Tổng video |

## 3. Step-by-Step Procedure
1. Kiểm tra URL hiện tại của trình duyệt để đảm bảo chứa `/dashboard`.
2. Kiểm tra sự xuất hiện và giá trị hiển thị trên các thẻ thống kê tổng quan (Stat Cards) bao gồm:
   - Thẻ hiển thị số lượng followers (người theo dõi).
   - Thẻ hiển thị "Tổng lượt xem".
   - Thẻ hiển thị "Tổng video".

## 4. Expected Result
- URL trình duyệt chứa `/dashboard`.
- Các Stat Cards hiển thị chính xác các giá trị đã seed từ database: Lượt theo dõi chứa chuỗi `"12.500"` hoặc `"12,500"`, nhãn `"Tổng lượt xem"` và `"Tổng video"` hiển thị đầy đủ và rõ ràng trên UI.
