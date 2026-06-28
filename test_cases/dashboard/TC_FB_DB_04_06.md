# Test Case: TC_FB_DB_04_06 - Tab POSTS (Metrics, Charts, List & Pagination) trên Facebook Dashboard

| ID number   | TC_FB_DB_04_06                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Tab POSTS (Metrics, Charts, List & Pagination)                 |
| Component   | Dashboard / Facebook Dashboard / Posts                         |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/facebook_dashboard.spec.js`           |

## 1. Prerequisites
- Thương hiệu đã kết nối Facebook và đã được seed dữ liệu.
- Đang hiển thị trang `/dashboard/facebook`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Tab Name    | POSTS                                 |

## 3. Step-by-Step Procedure
1. Click chọn tab `POSTS` trên giao diện Facebook Dashboard.
2. Kiểm tra sự xuất hiện của các biểu đồ thống kê tương tác bài viết (Recharts).
3. Kiểm tra danh sách các bài viết đã đăng hiển thị dạng bảng (hoặc trạng thái Empty State "No posts found" hợp lệ do mock token).
4. Xác minh sự tồn tại của tính năng phân trang dưới chân bảng (nếu có).

## 4. Expected Result
- Các biểu đồ Recharts của bài viết hiển thị đầy đủ.
- Danh sách bài viết hiển thị chính xác hoặc đưa ra thông báo Empty State phù hợp mà không gây crash trang web.
