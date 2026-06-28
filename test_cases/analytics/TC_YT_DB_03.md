# Test Case: TC_YT_DB_03 - Kiểm tra biểu đồ Demographics trên YouTube Dashboard

| ID number   | TC_YT_DB_03                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Kiểm tra biểu đồ Demographics trên YouTube Dashboard           |
| Component   | Analytics / YouTube Dashboard / Demographics                   |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/youtube_dashboard.spec.js`             |

## 1. Prerequisites
- Người dùng đang ở trang `/dashboard/youtube` tab `OVERVIEW`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Demographics| Age & Gender distributions            |

## 3. Step-by-Step Procedure
1. Cuộn màn hình xuống khu vực biểu đồ phân tích nhân khẩu học (Demographics Chart).
2. Kiểm tra sự tồn tại của các khối biểu đồ giới tính (Gender breakdown) và độ tuổi (Age groups).
3. Di chuột hoặc click vào các cột dữ liệu biểu đồ để kiểm tra tính tương tác.

## 4. Expected Result
- Các khối biểu đồ hiển thị đúng tỉ lệ phân chia nhân khẩu học đã seed từ DB (ví dụ: tỉ lệ nam/nữ, cơ cấu độ tuổi 18-24, 25-34).
- Biểu đồ hiển thị sắc nét, không bị chồng chéo chữ hoặc nhãn.
