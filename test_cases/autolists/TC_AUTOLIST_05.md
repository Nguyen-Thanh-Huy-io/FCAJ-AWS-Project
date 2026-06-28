# Test Case: TC_AUTOLIST_05 - Thêm bài đăng nháp vào hàng đợi và kiểm tra tính lịch

| ID number   | TC_AUTOLIST_05                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Thêm bài đăng nháp vào hàng đợi và kiểm tra tính lịch         |
| Component   | Autolists / Post Queueing                                      |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/autolists.spec.js`                              |

## 1. Prerequisites
- Đã cấu hình AutoList hoạt động với khoảng cách 1 giờ (`intervalMinutes = 60`).
- Người dùng đang ở màn hình tạo bài đăng mới (Post Creator).

## 2. Test Data
| Parameter     | Value                                 |
| ------------- | ------------------------------------- |
| Post Title    | `Autolist Post <timestamp>`           |
| Post Status   | Draft                                 |
| Target Queue  | Hàng đợi AutoList vừa tạo             |

## 3. Step-by-Step Procedure
1. Mở modal Tạo bài đăng mới.
2. Nhập tiêu đề bài viết: `Autolist Post <timestamp>`.
3. Chọn tùy chọn đăng bài: "Add to AutoList queue".
4. Chọn đúng hàng đợi mục tiêu.
5. Click nút "Thêm vào hàng đợi" (Submit).
6. Truy vấn database bảng `posts` để lấy thông tin bài viết vừa được đẩy vào queue.

## 4. Expected Result
- Bài đăng được thêm thành công và xuất hiện trong danh sách hàng đợi trên UI.
- Trong database, bài viết có trạng thái `status = 'SCHEDULED'` và thời gian lên lịch `scheduledAt` được tự động tính toán chính xác (khớp với thời gian đăng bài viết trước đó + 1 tiếng).
