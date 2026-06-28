# Test Case: TC_AUTOLIST_06 - Speedrun trigger xuất bản và kiểm tra Planner List UI

| ID number   | TC_AUTOLIST_06                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Speedrun trigger xuất bản và kiểm tra Planner List UI          |
| Component   | Autolists / Execution                                          |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/autolists.spec.js`                              |

## 1. Prerequisites
- Đã có bài đăng nháp trong hàng đợi (từ `TC_AUTOLIST_05`).
- Hệ thống BullMQ và Redis hoạt động bình thường.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| API Path    | `/api/autolists/publish-now` (Hoặc trigger script) |

## 3. Step-by-Step Procedure
1. Chạy script giả lập/gọi API trigger để thực thi việc xuất bản các bài đăng đã đến hạn đăng trong hàng đợi.
2. Hệ thống xử lý xuất bản bài viết lên các nền tảng xã hội (sử dụng mock logic trong môi trường test).
3. Người dùng chuyển sang màn hình lịch Planner (`/planner`).
4. Kiểm tra sự thay đổi trạng thái của bài viết trên giao diện.
5. Truy vấn DB bảng `posts` để xác minh trạng thái.

## 4. Expected Result
- Trạng thái bài đăng trong database cập nhật thành `PUBLISHED` hoặc `FAILED` (kèm chi tiết lỗi nếu kết nối mock bị ngắt).
- Bài viết xuất hiện trực quan trên giao diện lịch Planner với thẻ màu tương ứng trạng thái mới.
