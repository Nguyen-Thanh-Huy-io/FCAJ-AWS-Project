# BUG REPORT - AUTOLIST_001

| ID number        | BUG_AUTOLIST_001                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | AUTOLIST - Lỗi trôi lịch biểu (Schedule Drift) sau khi cập nhật hoặc sắp xếp lại hàng đợi                     |
| Reporter         | NHA                                                                                                   |
| Submit Date      | 28/06/2026                                                                                                    |
| Use Case ID     | UC12                                                                                                       |
| Summary          | Mỗi khi người dùng thêm, xóa, hoặc kéo thả thay đổi thứ tự bài viết trong hàng đợi Autolist, thời gian đăng bài (`scheduledAt`) của các bài đăng nháp tiếp theo bị trôi (drift) lệch đi rất nhiều so với mốc đăng dự kiến của bài viết trước đó. |
| URL              | http://localhost:5173/autolists                                                                               |
| Platform         | Windows / Linux / macOS                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome / Firefox / Safari                                                                                      |
| Severity         | Major                                                                                                         |
| Assigned to      | Backend Team                                                                                                  |
| Priority         | High                                                                                                          |

---

### **Description**

Trong module lập lịch Autolist, khi tính toán lại thời gian đăng cho hàng đợi (`recalculateQueueSchedules`), hàm xử lý `_updatePostSchedules` luôn sử dụng thời gian hiện tại (`new Date()`) làm mốc bắt đầu (`fromDate`) để xếp lịch cho bài viết nháp đầu tiên trong hàng đợi.

Điều này gây ra lỗi nghiêm trọng:
*   Nếu bài viết trước đó vừa được đăng cách đây 10 phút, và khoảng cách đăng cấu hình là **60 phút**, bài viết nháp tiếp theo đáng lẽ phải được xếp lịch đăng sau bài viết cũ 50 phút nữa (tổng cộng 60 phút từ bài trước).
*   Tuy nhiên, do hệ thống lấy `new Date()` (thời điểm recalculate) để tính, bài viết nháp tiếp theo lại bị xếp lịch vào **thời điểm hiện tại + 60 phút**, làm lệch lịch đăng đi 10 phút.
*   Nếu người dùng liên tục kéo thả sắp xếp lại bài viết, lịch đăng sẽ bị đẩy lùi (trôi) xa dần về phía tương lai một cách vô lý.

---

### **Steps to reproduce**

1. Tạo một Autolist với cấu hình `intervalMinutes = 60` (đăng mỗi tiếng).
2. Thêm 1 bài đăng và xuất bản thành công (`PUBLISHED`).
3. Thêm 1 bài đăng nháp (`DRAFT`).
4. Đợi 15 phút, sau đó thực hiện thay đổi thứ tự hàng đợi hoặc chỉnh sửa bài viết để kích hoạt tính toán lại lịch (`recalculateQueueSchedules`).
5. Kiểm tra thời gian lên lịch `scheduledAt` của bài viết nháp tiếp theo.

---

### **Expected result**

*   Thời gian lên lịch của bài viết nháp tiếp theo phải là: `thời điểm đăng bài viết trước + 60 phút`.
*   Khoảng cách lịch đăng giữa các bài viết được bảo toàn đúng 60 phút, không bị ảnh hưởng bởi thời điểm người dùng thao tác kéo thả trên giao diện.

---

### **Actual result**

*   Thời gian lên lịch của bài viết nháp tiếp theo là: `thời điểm hiện tại (lúc kéo thả) + 60 phút`.
*   Lịch đăng bị trôi lùi lại 15 phút so với mốc lịch ban đầu.

---

### **Notes**

Lỗi xảy ra tại logic xác định `fromDate` trong hàm `_updatePostSchedules`.

---

## ✅ RESOLVED

| Status Date | 28/06/2026 |
|---|---|
| Status | **RESOLVED** |
| Verified By | Nhã (Kiểm thử tự động Jest Backend - `should prove schedule drift bug in _updatePostSchedules` và Selenium E2E UI - `TC_AUTOLIST_06` & `TC_AUTOLIST_07` đã PASS 100%) |
| Resolution | Cập nhật logic hàm `_updatePostSchedules` để lấy mốc thời gian đăng của bài viết đã đăng gần nhất (`lastPostedAt` hoặc `publishedAt`) làm mốc `fromDate` tính toán lịch cho bài tiếp theo. Thêm cơ chế phòng vệ nếu mốc cũ quá cũ (lớn hơn 1 interval) thì mới dùng `new Date()` làm mốc fallback. |
