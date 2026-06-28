# BÁO CÁO TỔNG HỢP KIỂM THỬ & KHẮC PHỤC LỖI AUTOLIST (AUTOLIST MANAGEMENT AUDIT & RESOLUTION REPORT)

Báo cáo này tổng hợp kết quả chạy các kịch bản kiểm thử (Test Cases) của module **Autolist Queue Scheduler** ở cả hai cấp độ: Kiểm thử logic tích hợp backend (Integration Tests) và Kiểm thử tự động giao diện (Selenium UI E2E Tests), đồng thời xác nhận trạng thái khắc phục lỗi trôi lịch biểu (`BUG_AUTOLIST_001`).

---

## 1. Danh sách Kịch Bản Kiểm Thử & Trạng Thái (Test Cases & Execution Status)

Dưới đây là danh sách chi tiết các kịch bản kiểm thử đã được triển khai và vượt qua hoàn toàn:

| Mã Test Case | Tên Kịch Bản Kiểm Thử | Trạng Thái Integration (Jest) | Trạng Thái UI E2E (Selenium) | Chi Tiết / Cơ Chế Kiểm Thử |
| :--- | :--- | :---: | :---: | :--- |
| **AUTOLIST_001** | Tạo mới và cấu hình Autolist | **Pass** | **Pass** (TC_01) | Tạo trên UI và assert DB lưu đúng `INTERVAL` (60 phút). |
| **AUTOLIST_002** | Sửa đổi tên và khoảng giãn cách | **Pass** | **Pass** (TC_02) | Sửa trên UI và assert DB lưu đúng `intervalMinutes = 120`. |
| **AUTOLIST_003** | Lập lịch theo Mốc giờ cố định (Specific Times) | **Pass** | **Pass** (TC_03) | Đổi loại schedule, thêm slot trên UI và verify DB chuyển thành `'SPECIFIC'`. |
| **AUTOLIST_004** | Bộ lọc ngày hoạt động (Active Days Filter) | **Pass** | **Pass** (TC_04) | Cấu hình lọc ngày Mo-Fr và verify DB lưu đúng `activeDays`. |
| **AUTOLIST_005** | Thêm bài đăng nháp và tự động tính lịch | **Pass** | **Pass** (TC_05) | Thêm bài viết nháp trên UI, assert DB lưu trạng thái `'SCHEDULED'`. |
| **AUTOLIST_006** | Speedrun (Tua nhanh) & Xác thực Planner List | **Pass** | **Pass** (TC_06) | Kích hoạt CLI publish ở backend từ script test Selenium, verify bài đăng hiển thị trên Planner List UI. |
| **AUTOLIST_007** | Tạm dừng hàng đợi (Pause Queue) | **Pass** | **Pass** (TC_07) | Click Tạm dừng trên UI, verify DB cập nhật `isActive = 0`. |
| **BUG_AUTOLIST_001**| Khắc phục lỗi trôi lịch biểu (Schedule Drift) | **Pass** | **N/A** (Logic) | Bảo đảm tính mốc lịch từ bài đăng trước đó thay vì dùng mốc hiện tại. |

---

## 2. Chi Tiết Trạng Thái Khắc Phục Lỗi (Resolved Bugs)

### 🐛 BUG_AUTOLIST_001: Lỗi trôi lịch biểu (Schedule Drift)
*   **Trạng thái:** ✅ **RESOLVED**
*   **Nguyên nhân:** Khi tính toán lại lịch cho hàng đợi (`recalculateQueueSchedules`), hệ thống cũ luôn sử dụng thời gian hiện tại (`new Date()`) làm mốc gốc (`fromDate`) để xếp lịch cho bài tiếp theo. Điều này làm trôi lệch thời gian đăng mỗi khi người dùng kéo thả hoặc sửa bài viết.
*   **Cách khắc phục:**
    1. Sử dụng mốc thời gian đăng của bài viết đã xuất bản gần nhất (`lastPostedAt` hoặc `publishedAt`) cộng thêm khoảng cách để tính toán cho bài nháp tiếp theo.
    2. Thêm cơ chế bảo vệ (Drift Safety Guard) để tự động đồng bộ về thời gian hiện tại nếu mốc cũ quá xa trong quá khứ (nhỏ hơn 1 interval).
*   **Xác minh:** Đã vượt qua Jest integration test `should prove schedule drift bug in _updatePostSchedules` và kiểm tra logic lập lịch chính xác khi chạy Selenium E2E.

---

## 3. Hướng Dẫn Chạy Kiểm Thử (Test Execution Guide)

### A. Chạy Unit & Integration Test tại Backend (Jest)
Bộ test này kiểm tra sâu logic thuật toán lập lịch, bộ lọc ngày hoạt động, loop logic và khắc phục bug trôi lịch biểu:
```bash
cd backend
npx jest tests/autolist/auto-list.test.js
```

### B. Chạy Kiểm Thử Tự Động Giao Diện & Cơ Sở Dữ Liệu (Selenium E2E)
Bộ test này mở giao diện Chrome thật, thực hiện luồng click/nhập dữ liệu trực tiếp, kết nối MySQL database kiểm tra đồng bộ, thực hiện Speedrun và xác nhận hiển thị bài đăng trên Planner List:
```bash
# Di chuyển vào thư mục test_selenium
cd test_selenium

# Chạy toàn bộ 7 test cases E2E cho Autolist
npm run test:autolists
```
*Lưu ý:* Hãy chắc chắn rằng Backend Server (`npm run dev` trên cổng 3000) và Frontend Client (`npm run dev` trên cổng 5173) đang chạy trước khi kích hoạt bộ test Selenium.
