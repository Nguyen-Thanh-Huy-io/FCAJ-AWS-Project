# Test Case: TC_YT_DB_06 - Theo dõi Viewed Videos trên YouTube Dashboard

| ID number   | TC_YT_DB_06                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Theo dõi Viewed Videos trên YouTube Dashboard                 |
| Component   | Analytics / YouTube Dashboard / Videos                         |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/youtube_dashboard.spec.js`             |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC16                                                           |

## 1. Prerequisites
- Người dùng đang ở trang `/dashboard/youtube` tab `VIDEOS`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Sort field  | Views (Lượt xem)                      |

## 3. Step-by-Step Procedure
1. Tại tab `VIDEOS`, click vào tiêu đề cột "Views" để sắp xếp danh sách video theo lượt xem giảm dần.
2. Kiểm tra xem các video có lượt xem nhiều nhất có được đẩy lên đầu hay không.
3. Click vào tiêu đề video để mở link xem video gốc trên YouTube (trong tab mới).

## 4. Expected Result
- Danh sách video được sắp xếp chính xác theo số lượt xem.
- Link chuyển hướng sang YouTube hoạt động chính xác trong tab mới với URL đúng.
