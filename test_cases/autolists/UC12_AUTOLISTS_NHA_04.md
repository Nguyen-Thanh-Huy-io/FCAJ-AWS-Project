# Test Case: TC_AUTOLIST_04 - Cấu hình activeDays và kiểm tra lưu DB

| ID number   | TC_AUTOLIST_04                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Cấu hình activeDays và kiểm tra lưu DB                         |
| Component   | Autolists / Advanced Scheduling                                |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/autolists.spec.js`                              |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC12                                                           |

## 1. Prerequisites
- Đang mở modal thiết lập lịch nâng cao cho AutoList.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Active Days | Monday, Wednesday, Friday (`Mo,We,Fr`) |

## 3. Step-by-Step Procedure
1. Tại khu vực lựa chọn các ngày hoạt động trong tuần (Active Days), tích chọn các ngày: Thứ Hai, Thứ Tư, Thứ Sáu.
2. Bỏ chọn các ngày còn lại.
3. Click nút "Lưu thay đổi" (Save changes).
4. Kiểm tra dữ liệu được ghi nhận trong database.

## 4. Expected Result
- UI lưu thành công các ngày hoạt động đã chọn.
- Trong database, trường `activeDays` của bản ghi AutoList tương ứng lưu trữ giá trị dạng chuỗi: `"Mo,We,Fr"`.
