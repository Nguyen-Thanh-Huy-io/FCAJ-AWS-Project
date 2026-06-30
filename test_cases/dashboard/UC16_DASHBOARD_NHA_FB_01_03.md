# Test Case: TC_FB_DB_01_03 - Seed DB, Overview Tab, Charts và Date Filter trên Facebook Dashboard

| ID number   | TC_FB_DB_01_03                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Seed DB, Overview Tab, Charts và Date Filter                   |
| Component   | Dashboard / Facebook Dashboard / Overview                      |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/facebook_dashboard.spec.js`           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC16                                                           |

## 1. Prerequisites
- Đã đăng ký tài khoản test thành công (từ `TC_FB_DB_00`).
- Đang hiển thị trang `/dashboard/facebook`.

## 2. Test Data
| Parameter     | Value                                 |
| ------------- | ------------------------------------- |
| Page Name     | Selenium FB Page                      |
| Filter Range  | Yesterday                             |

## 3. Step-by-Step Procedure
1. Gọi hàm seed dữ liệu chi tiết của Facebook (tài khoản Facebook, chỉ số analytics, danh sách đối thủ cạnh tranh) vào database.
2. Làm mới trang `/dashboard/facebook`.
3. Kiểm tra xem tên trang Facebook đã được liên kết (`Selenium FB Page`) có hiển thị chính xác hay không.
4. Kiểm tra xem các biểu đồ Recharts của tab Overview có hiển thị đầy đủ hay không.
5. Click bộ lọc thời gian ở góc trên cùng, chọn mốc "Yesterday" và nhấn "Apply Range".

## 4. Expected Result
- Tên trang Facebook hiển thị chính xác: `Selenium FB Page`.
- Có ít nhất một biểu đồ Recharts hiển thị (`recharts-surface` tồn tại trong DOM).
- Dữ liệu và biểu đồ tự động cập nhật chính xác theo mốc thời gian vừa lọc mà không gặp lỗi.
