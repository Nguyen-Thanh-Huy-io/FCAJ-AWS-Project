# Test Case: TC_DASHBOARD_07 - Kiểm tra tính năng mở và đóng Post Creator từ Dashboard

| ID number   | TC_DASHBOARD_07                                                |
| ----------- | -------------------------------------------------------------- |
| Name        | Kiểm tra tính năng mở và đóng Post Creator từ Dashboard        |
| Component   | Dashboard / Post Creator / Modal                               |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/general_dashboard.spec.js`            |

## 1. Prerequisites
- Đang hiển thị trang Dashboard chính `/dashboard`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Button Name | Tạo bài đăng                          |

## 3. Step-by-Step Procedure
1. Click chọn nút "Tạo bài đăng" trên giao diện Dashboard.
2. Chờ modal tạo bài viết mới (Post Creator) hiển thị hoàn chỉnh.
3. Kiểm tra xem tiêu đề của modal có hiển thị chữ `"Create new post"` hay không.
4. Click nút "Close" (Đóng) trên modal để tắt.
5. Xác minh modal đã biến mất khỏi DOM.

## 4. Expected Result
- Modal mở ra thành công với tiêu đề `"Create new post"`.
- Modal đóng lại bình thường và biến mất khỏi giao diện sau khi bấm nút Close.
