# BÁO CÁO TỔNG HỢP KIỂM THỬ HỘP ĐEN - MODULE THÔNG BÁO (NOTIFICATION MODULE BLACK-BOX AUDIT REPORT)

Báo cáo này tổng hợp kết quả chạy các kịch bản kiểm thử (Test Cases) thuộc module **Thông báo (Notifications)** trên cả Backend và Frontend, phân loại các trường hợp Đạt (Pass) và Lỗi (Fail).

---

## 1. Tóm tắt kết quả (Audit Summary)

* **Tổng số kịch bản kiểm thử:** 22
* **Số kịch bản ĐẠT (Pass):** 14
* **Số kịch bản LỖI (Fail - Phát hiện Bug):** 8 (Chiếm ~1/3 tổng số test cases)

---

## 2. Nhật ký Kiểm thử Hệ thống (Test Cases Audit Trail)

| Mã Test Case | Tên Kịch Bản Kiểm Thử | Trạng Thái | Ảnh Minh Họa / Mô Tả Lỗi |
| :--- | :--- | :---: | :--- |
| **UC22_NOTIF_PHUC_01** | Truy cập trang `/notifications` khi chưa đăng nhập | **Pass** | Hệ thống tự động redirect về trang `/login`. |
| **UC22_NOTIF_PHUC_02** | Kết nối stream SSE `/api/notifications/stream` không có token | **Pass** | Backend chặn và trả về HTTP 401 Unauthorized. |
| **UC22_NOTIF_PHUC_03** | Tài khoản non-admin (Owner) tạo thông báo hệ thống Global | **Pass** | Backend từ chối với HTTP 403 (Only admin can create global notifications). |
| **UC22_NOTIF_PHUC_04** | Tài khoản non-admin tạo thông báo cho Brand khác | **Pass** | Backend chặn thành công với HTTP 403 (Access denied for this brand). |
| **UC22_NOTIF_PHUC_05** | IDOR: Đánh dấu đã đọc thông báo của User/Brand khác | **Pass** | Trả về lỗi 404 (Notification not found or access denied). |
| **UC22_NOTIF_PHUC_06** | Tải danh sách thông báo thành công | **Pass** | Hiển thị đầy đủ danh sách thông báo và phân trang. |
| **UC22_NOTIF_PHUC_07** | Lọc thông báo theo danh mục (Sidebar category filter) | **Pass** | Chọn từng danh mục (stream, system...) hiển thị đúng loại. |
| **UC22_NOTIF_PHUC_08** | Giao diện chấp nhận khoảng ngày bắt đầu lớn hơn ngày kết thúc (Start Date > End Date) | **Fail** | Không có thông báo lỗi/chặn khoảng ngày không hợp lệ trên giao diện. (Xem [BUG_UC22_NOTIF_PHUC_01](BUG_NOTIF_REPORTS.md#bug_notif_001)) |
| **UC22_NOTIF_PHUC_09** | Số badge đếm chưa đọc ở sidebar không khớp số lượng thực tế trong danh sách | **Fail** | Hiển thị "Showing 21 of 21" nhưng sidebar badge "All Notifications" chỉ hiện "10". (Xem [BUG_UC22_NOTIF_PHUC_02](BUG_NOTIF_REPORTS.md#bug_notif_002)) |
| **UC22_NOTIF_PHUC_10** | Nút "Next" phân trang vẫn hiển thị khi ở trang cuối cùng | **Fail** | Nút Next không bị disable khi tổng số bản ghi chia hết cho limit. (Xem [BUG_UC22_NOTIF_PHUC_03](BUG_NOTIF_REPORTS.md#bug_notif_003)) |
| **UC22_NOTIF_PHUC_11** | Nhận thông báo thời gian thực thông qua kết nối SSE | **Pass** | Thông báo tự động hiển thị trên UI mà không cần tải lại trang. |
| **UC22_NOTIF_PHUC_12** | Cập nhật số unread count trên Badge chuông Topbar qua SSE | **Pass** | Số unread tăng/giảm realtime khi nhận/đọc thông báo. |
| **UC22_NOTIF_PHUC_13** | Rò rỉ kết nối SSE trong bộ nhớ backend khi client ngắt kết nối đột ngột | **Fail** | Map client không giải phóng kết nối chết, gây rò rỉ bộ nhớ. (Xem [BUG_UC22_NOTIF_PHUC_04](BUG_NOTIF_REPORTS.md#bug_notif_004)) |
| **UC22_NOTIF_PHUC_14** | Đồng bộ hóa thời gian thực trạng thái đã đọc trên nhiều Tab trình duyệt | **Fail** | Đọc ở Tab 1 không cập nhật UI ngay lập tức sang Tab 2 qua SSE. (Xem [BUG_UC22_NOTIF_PHUC_05](BUG_NOTIF_REPORTS.md#bug_notif_005)) |
| **UC22_NOTIF_PHUC_15** | Đánh dấu đã đọc thông báo qua nút CheckCircle trên UI | **Fail** | Nhấn CheckCircle nhưng giao diện không cập nhật sang mờ (opacity giữ nguyên 1). (Xem [BUG_UC22_NOTIF_PHUC_06](BUG_NOTIF_REPORTS.md#bug_notif_006)) |
| **UC22_NOTIF_PHUC_16** | Đọc thông báo Global/Brand không ảnh hưởng đến user khác | **Pass** | User A đã đọc thông báo thì User B vẫn thấy chưa đọc (Read Receipt hoạt động đúng). |
| **UC22_NOTIF_PHUC_17** | Nhấn "Mark all read" không cập nhật unread count của các danh mục khác ở sidebar | **Fail** | Số unread ở sidebar sidebar giữ nguyên cho tới khi F5 lại trang. (Xem [BUG_UC22_NOTIF_PHUC_07](BUG_NOTIF_REPORTS.md#bug_notif_007)) |
| **UC22_NOTIF_PHUC_18** | Nhận thông báo khi đăng bài thành công/thất bại | **Pass** | Bài đăng hoàn thành sinh ra thông báo loại content. |
| **UC22_NOTIF_PHUC_19** | Nhận thông báo khi kết nối/ngắt kết nối tài khoản mạng xã hội | **Pass** | Tạo thông báo platform tương ứng và gửi đi realtime. |
| **UC22_NOTIF_PHUC_20** | Nhận thông báo khi đồng bộ chỉ số phân tích (Metrics) thất bại | **Pass** | Phát hiện token hết hạn sinh thông báo yêu cầu reconnect. |
| **UC22_NOTIF_PHUC_21** | Nhận thông báo Global khi Admin thay đổi chính sách giá (Pricing plans) | **Pass** | Pricing plan thay đổi tạo thông báo Global hệ thống gửi tới toàn bộ user. |
| **UC22_NOTIF_PHUC_22** | Giao diện chấp nhận bộ lọc chỉ có End Date mà không có Start Date | **Fail** | Bộ lọc chấp nhận lọc End Date không giới hạn Start Date gây nguy cơ tải nhiều dữ liệu. (Xem [BUG_UC22_NOTIF_PHUC_08](BUG_NOTIF_REPORTS.md#bug_notif_008)) |

---

## 3. Xem chi tiết các báo cáo lỗi
* Báo cáo lỗi chi tiết của 8 test case Fail được ghi nhận tại file: [BUG_NOTIF_REPORTS.md](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/BUG_NOTIF_REPORTS.md)
