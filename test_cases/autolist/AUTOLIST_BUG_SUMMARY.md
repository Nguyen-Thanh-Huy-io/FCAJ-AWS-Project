# BÁO CÁO TỔNG HỢP KIỂM THỬ & KHẮC PHỤC LỖI AUTOLIST (AUTOLIST MANAGEMENT AUDIT & RESOLUTION REPORT)

Báo cáo này tổng hợp kết quả chạy các kịch bản kiểm thử (Test Cases) của module **Autolist Queue Scheduler** và trạng thái khắc phục lỗi trôi lịch biểu (`BUG_AUTOLIST_001`) được phát hiện trong quá trình tối ưu thuật toán hàng đợi.

---

## 1. Danh sách Kịch Bản Kiểm Thử (Test Cases Audit Trail)

Dưới đây là danh sách các kịch bản kiểm thử được thiết lập để đánh giá tính đúng đắn của bộ lập lịch Autolist:

| Mã Test Case | Tên Kịch Bản Kiểm Thử | Trạng Thái | Ảnh Minh Họa / Mô Tả |
| :--- | :--- | :---: | :--- |
| **AUTOLIST_001** | Tạo mới và cấu hình Autolist | **Pass** | Validate đúng định dạng interval và specificTimes |
| **AUTOLIST_002** | Lập lịch theo Khoảng thời gian (Interval) | **Pass** | Sinh các slot cách nhau đúng số phút cấu hình |
| **AUTOLIST_003** | Lập lịch theo Mốc giờ cố định (Specific Times) | **Pass** | Xếp lịch khớp chính xác các mốc giờ cấu hình |
| **AUTOLIST_004** | Bộ lọc ngày hoạt động (Active Days Filter) | **Pass** | Tự động nhảy qua các ngày không được chọn (ví dụ: cuối tuần) |
| **AUTOLIST_005** | Tự động lặp lại hàng đợi (Auto Loop) | **Pass** | Nhân bản bài viết đã đăng thành DRAFT mới để bảo toàn lịch sử |
| **AUTOLIST_006** | Kéo thả thay đổi thứ tự bài viết (Reorder Posts) | **Pass** | Cập nhật createdAt tăng dần và tính toán lại lịch theo thứ tự mới |
| **AUTOLIST_007** | Bật/Tắt trạng thái hàng đợi (Toggle Active Status) | **Pass** | Đăng ký job lên BullMQ khi Active và hủy job khi Pause |
| **BUG_AUTOLIST_001**| Khắc phục lỗi trôi lịch biểu (Schedule Drift Bug) | **Pass** | Tính lịch từ bài đăng trước đó thay vì sử dụng mốc `new Date()` |

---

## 2. Chi Tiết Trạng Thái Khắc Phục Lỗi (Resolved Bugs)

### 🐛 BUG_AUTOLIST_001: Lỗi trôi lịch biểu (Schedule Drift)
*   **Trạng thái:** ✅ **RESOLVED**
*   **Nguyên nhân:** Khi tính toán lại lịch cho hàng đợi (`recalculateQueueSchedules`), hàm `_updateAutoListStats` và `_updatePostSchedules` luôn sử dụng mốc thời gian hiện tại (`new Date()`) làm mốc gốc (`fromDate`) để tính toán giờ đăng cho bài đăng tiếp theo. Điều này khiến cho giờ đăng bị trôi đi liên tục sau mỗi lần người dùng thay đổi thứ tự hoặc cập nhật hàng đợi, không giữ đúng khoảng cách cố định (ví dụ: đăng sau bài viết cũ 2 tiếng).
*   **Cách khắc phục:** Cập nhật logic:
    1. Kiểm tra mốc đăng của bài viết đã xuất bản gần nhất (`lastPostedAt` hoặc `publishedAt` của bài viết gần nhất).
    2. Sử dụng mốc đăng này cộng thêm khoảng cách để tính toán cho bài viết nháp tiếp theo.
    3. Thêm bộ lọc an toàn để tránh trôi lịch quá xa trong quá khứ nếu hàng đợi bị dừng quá lâu.
*   **Minh chứng:** Đã vượt qua bài kiểm thử tự động `should prove schedule drift bug in _updatePostSchedules` trong file kiểm thử backend.

---

## 3. Hướng Dẫn Kiểm Thử Lại (Test Execution Guide)

Các test case này được tự động hóa hoàn toàn ở mức độ Integration Test tại Backend. Bạn có thể chạy chúng bất cứ lúc nào bằng lệnh sau:

```bash
# Di chuyển vào thư mục backend và chạy test file autolist
cd backend
npx jest tests/autolist/auto-list.test.js
```

Để chạy tích hợp API thật với Database thông qua Postman:
1. Import file collection **[autolist_api.postman_collection.json](file:///D:/Fullit/projects/PubliCast/test_cases/autolist/autolist_api.postman_collection.json)** vào Postman.
2. Đảm bảo Backend server và MySQL đang chạy.
3. Chạy toàn bộ collection để xác minh tính toàn vẹn của các API Autolist.
