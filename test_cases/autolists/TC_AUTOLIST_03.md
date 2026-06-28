# Test Case: TC_AUTOLIST_03 - Cấu hình specificTimes và kiểm tra lưu DB

| ID number   | TC_AUTOLIST_03                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Cấu hình specificTimes và kiểm tra lưu DB                      |
| Component   | Autolists / Advanced Scheduling                                |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/autolists.spec.js`                              |

## 1. Prerequisites
- Đã chọn một AutoList cụ thể để chỉnh sửa.
- Đang mở modal thiết lập lịch nâng cao (Advanced Scheduling).

## 2. Test Data
| Parameter     | Value                               |
| ------------- | ----------------------------------- |
| Schedule Type | Specific Times                      |
| Posting Hours | `["09:00", "15:00", "21:00"]`       |

## 3. Step-by-Step Procedure
1. Tại trang thiết lập nâng cao cho AutoList, chuyển đổi hình thức đặt lịch từ "Interval" sang "Specific Times".
2. Nhập/chọn các khung giờ đăng cụ thể: 09:00, 15:00, 21:00.
3. Click "Lưu lịch biểu" (Save schedule).
4. Kiểm tra trên cơ sở dữ liệu.

## 4. Expected Result
- Trạng thái UI cập nhật chế độ giờ đăng cụ thể.
- Trường `scheduleType` trong bảng `auto_lists` lưu trữ giá trị `'SPECIFIC'` và danh sách mốc giờ đăng được ghi nhận chính xác trong bảng liên kết `auto_list_times`.
