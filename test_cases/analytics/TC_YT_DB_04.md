# Test Case: TC_YT_DB_04 - Danh sách Published Videos và phân trang trên YouTube Dashboard

| ID number   | TC_YT_DB_04                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Danh sách Published Videos và phân trang trên YouTube Dashboard|
| Component   | Analytics / YouTube Dashboard / Videos                         |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/youtube_dashboard.spec.js`             |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC16                                                           |

## 1. Prerequisites
- Người dùng đang ở trang `/dashboard/youtube`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Tab Name    | VIDEOS                                |

## 3. Step-by-Step Procedure
1. Click chọn tab `VIDEOS` trên thanh điều hướng phụ của Dashboard.
2. Kiểm tra danh sách các video đã xuất bản (Published Videos) hiển thị dưới dạng bảng hoặc lưới.
3. Kiểm tra các trường thông tin: Tiêu đề video, Lượt xem, Lượt thích, Lượt bình luận, và Ngày xuất bản.
4. Click nút chuyển trang (Next Page) ở cuối bảng để xác minh tính năng phân trang hoạt động.

## 4. Expected Result
- Danh sách video hiển thị đầy đủ và chính xác dữ liệu đã seed.
- Bảng hiển thị thông tin rõ ràng. Tính năng phân trang tải thêm dữ liệu mới thành công mà không gây crash trang.
