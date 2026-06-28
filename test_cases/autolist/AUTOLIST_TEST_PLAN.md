# Kế hoạch kiểm thử tự động (Selenium E2E Test Plan) - Phân hệ Lập lịch Tự động (Autolist)

Tài liệu này tổng hợp toàn bộ các kịch bản kiểm thử E2E bằng Selenium WebDriver cho phân hệ Lập lịch xuất bản tự động (Autolists) tương ứng với **UC12 (Lập lịch Tự động)**.

## Danh sách Test Cases (Total: 7 Test Cases)

| Mã Test Case | Tên Test Case | Mô tả kịch bản | Kết quả mong đợi (Assertion) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **TC_AUTOLIST_01** | Tạo mới Autolist | Tạo hàng đợi Autolist mới với khoảng cách thời gian (Interval = 1 giờ). | Hàng đợi được tạo thành công trên UI và lưu interval = 60 phút trong DB. | Đã triển khai |
| **TC_AUTOLIST_02** | Sửa thông tin Autolist | Thay đổi tên hàng đợi và sửa khoảng cách đăng bài (Interval = 2 giờ). | Dữ liệu cập nhật thành công trên UI và lưu interval = 120 phút trong DB. | Đã triển khai |
| **TC_AUTOLIST_03** | Cấu hình mốc giờ cụ thể | Chuyển chế độ đăng sang Specific Times và chọn mốc giờ ngẫu nhiên. | scheduleType trong database chuyển thành `SPECIFIC` thành công. | Đã triển khai |
| **TC_AUTOLIST_04** | Cấu hình ngày hoạt động | Cấu hình các ngày đăng bài (bỏ Thứ 7, Chủ Nhật) và lưu lại. | activeDays lưu đúng giá trị `Mo,Tu,We,Th,Fr` trong DB. | Đã triển khai |
| **TC_AUTOLIST_05** | Thêm bài đăng vào hàng đợi | Soạn và thêm bài viết nháp vào hàng đợi vừa tạo. | Bài viết tự động đổi trạng thái thành `SCHEDULED` và tính lịch đăng trong DB. | Đã triển khai |
| **TC_AUTOLIST_06** | Tua nhanh thời gian (Speedrun) | Chạy lệnh tua nhanh thời gian (trigger publish) bài viết đang đợi. | Bài viết được xuất bản tức thì (PUBLISHED/FAILED) và hiển thị trên Planner List. | Đã triển khai |
| **TC_AUTOLIST_07** | Tạm dừng (Pause) hàng đợi | Nhấn nút Pause (Tạm dừng) hàng đợi Autolist từ màn hình danh sách. | isActive cập nhật thành `0` trong database và dừng mọi BullMQ jobs của queue. | Đã triển khai |

---

## Môi trường & File kiểm thử
- **Môi trường**: Chrome (chạy headless trên CI)
- **Tập tin kiểm thử tương ứng**: `test_selenium/autolists.spec.js`
