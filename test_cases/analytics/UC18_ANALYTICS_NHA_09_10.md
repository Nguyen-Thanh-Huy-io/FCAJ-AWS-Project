# Test Case: TC_YT_DB_09_10 - Xuất báo cáo CSV đối thủ trên YouTube Dashboard

| ID number   | TC_YT_DB_09_10                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Xuất báo cáo CSV đối thủ trên YouTube Dashboard                |
| Component   | Analytics / YouTube Dashboard / Competitors / Export           |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/youtube_dashboard.spec.js`             |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC18                                                           |

## 1. Prerequisites
- Đang hiển thị trang `/dashboard/youtube` tab `COMPETITORS`.
- Đã có ít nhất 1 đối thủ trong danh sách theo dõi.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Button Name | Export CSV                            |

## 3. Step-by-Step Procedure
1. Tại tab `COMPETITORS`, click vào nút "Xuất báo cáo CSV" (hoặc Export CSV).
2. Chờ trình duyệt xử lý tải file.
3. Kiểm tra xem có file CSV được tải xuống thư mục Downloads hoặc thư mục tạm của hệ thống kiểm thử hay không.
4. Đọc nội dung file CSV và kiểm tra tính chính xác của các cột: Tên đối thủ, Lượt đăng ký, Tổng video, Lượt xem trung bình.

## 4. Expected Result
- File CSV được tải xuống thành công.
- Nội dung file chứa đúng dữ liệu của các đối thủ đang được hiển thị trên giao diện.
