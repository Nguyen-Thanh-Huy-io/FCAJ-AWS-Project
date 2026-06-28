# Test Case: TC_YT_DB_01_02 - Community Metrics và bộ lọc Date Filter trên YouTube Dashboard

| ID number   | TC_YT_DB_01_02                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Community Metrics và bộ lọc Date Filter trên YouTube Dashboard |
| Component   | Analytics / YouTube Dashboard / Overview                       |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/youtube_dashboard.spec.js`             |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC16                                                           |

## 1. Prerequisites
- Đã hoàn tất đăng nhập và seed dữ liệu từ `TC_YT_DB_00`.
- Đang hiển thị trang `/dashboard/youtube`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Target metrics | Subscribers, Total Views, Total Videos|
| Date Range  | Last 7 days, Last 30 days             |

## 3. Step-by-Step Procedure
1. Tại tab `OVERVIEW` của YouTube Dashboard, kiểm tra các giá trị hiển thị trên Stat Cards (Subscribers, Views, Videos).
2. Click bộ chọn khoảng thời gian (Date Filter).
3. Chọn mốc thời gian "Last 30 days".
4. Kiểm tra sự thay đổi của dữ liệu và biểu đồ đường biểu diễn xu hướng người đăng ký/lượt xem.

## 4. Expected Result
- Các thẻ thống kê hiển thị đúng thông số: 12.500 Subscribers, 150.000 Views, và 120 Videos.
- Biểu đồ nạp lại dữ liệu tương ứng chính xác khi thay đổi mốc thời gian bộ lọc.
