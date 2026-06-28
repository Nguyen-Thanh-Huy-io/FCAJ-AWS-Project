# Test Case: TC_AUTOLIST_02 - Sửa tên và khoảng cách Autolist và kiểm tra cập nhật DB

| ID number   | TC_AUTOLIST_02                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Sửa tên và khoảng cách Autolist và kiểm tra cập nhật DB        |
| Component   | Autolists / Update                                             |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/autolists.spec.js`                              |

## 1. Prerequisites
- Đã tạo thành công AutoList từ test case `TC_AUTOLIST_01`.
- Đang hiển thị danh sách AutoLists.

## 2. Test Data
| Parameter         | Value                                  |
| ----------------- | -------------------------------------- |
| Updated Queue Name| `Selenium Queue Updated <timestamp>`   |
| Updated Interval  | 2 Hours (120 minutes)                  |

## 3. Step-by-Step Procedure
1. Định vị hàng đợi `Selenium Queue <timestamp>` trên giao diện.
2. Click nút chỉnh sửa (Edit icon/button) của hàng đợi.
3. Thay đổi tên hàng đợi thành: `Selenium Queue Updated <timestamp>`.
4. Cập nhật khoảng cách đăng thành 2 giờ.
5. Click nút "Lưu thay đổi" (Save).
6. Truy vấn cơ sở dữ liệu để đối chiếu thông tin bản ghi.

## 4. Expected Result
- Giao diện hiển thị tên hàng đợi mới là `Selenium Queue Updated <timestamp>`.
- Trên cơ sở dữ liệu, bản ghi được cập nhật giá trị `name = 'Selenium Queue Updated <timestamp>'` và `intervalMinutes = 120`.
