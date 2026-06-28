# Test Case: TC_DASHBOARD_03 - Xác minh hàng chờ bài đăng gần đây chứa các bài viết đã seed

| ID number   | TC_DASHBOARD_03                                                |
| ----------- | -------------------------------------------------------------- |
| Name        | Xác minh hàng chờ bài đăng gần đây chứa các bài viết đã seed   |
| Component   | Dashboard / Post Queue                                         |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/general_dashboard.spec.js`            |

## 1. Prerequisites
- Đã seed dữ liệu bài đăng (Draft, Scheduled, Published) cho Dashboard.

## 2. Test Data
| Parameter      | Value                                 |
| -------------- | ------------------------------------- |
| Draft Title    | `Selenium Draft Post Title`           |
| Scheduled Title| `Selenium Scheduled Post Title`       |
| Published Title| `Selenium Published Post Title`       |

## 3. Step-by-Step Procedure
1. Tại giao diện `/dashboard`, tìm khu vực danh sách hàng chờ bài đăng gần đây.
2. Kiểm tra sự xuất hiện của bài viết có tiêu đề `Selenium Draft Post Title`.
3. Kiểm tra sự xuất hiện của bài viết có tiêu đề `Selenium Scheduled Post Title`.
4. Kiểm tra sự xuất hiện của bài viết có tiêu đề `Selenium Published Post Title`.

## 4. Expected Result
- Cả ba bài viết đã seed đều hiển thị đúng tiêu đề, trạng thái và đầy đủ thông tin trên giao diện hàng chờ bài viết gần đây.
