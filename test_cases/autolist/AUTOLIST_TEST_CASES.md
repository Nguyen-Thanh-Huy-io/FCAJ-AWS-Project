# KỊCH BẢN KIỂM THỬ CHI TIẾT - AUTOLIST (DETAILED TEST CASES - AUTOLIST)

Tài liệu này mô tả chi tiết các kịch bản kiểm thử (Test Cases) từ **AUTOLIST_001** đến **AUTOLIST_007** nhằm đánh giá toàn diện hoạt động của bộ lập lịch tự động Autolist.

### 📋 Test Data Sử dụng cho Autolist E2E
*   **Autolist Cấu hình Interval (TC_AUTOLIST_002)**:
    *   `name`: "Interval Queue"
    *   `scheduleType`: "INTERVAL"
    *   `intervalMinutes`: 60
*   **Autolist Cấu hình Specific Times (TC_AUTOLIST_003)**:
    *   `name`: "Specific Times Queue"
    *   `scheduleType`: "SPECIFIC"
    *   `specificTimes`: "08:00,14:00,20:00"
*   **Autolist Cấu hình Active Days (TC_AUTOLIST_004)**:
    *   `name`: "Work Days Queue"
    *   `activeDays`: "Mo,We"
*   **Autolist Cấu hình Loop (TC_AUTOLIST_005)**:
    *   `loopEnabled`: true
*   **Bài viết mẫu chèn vào hàng đợi (Mock Posts)**:
    *   Bài viết 1: `caption` = "Automated post number 1", `status` = "DRAFT"
    *   Bài viết 2: `caption` = "Automated post number 2", `status` = "DRAFT"
    *   Bài viết 3: `caption` = "Automated post number 3", `status` = "DRAFT"

---

### **AUTOLIST_001: Tạo mới và cấu hình Autolist**
*   **Mô tả:** Đảm bảo hệ thống cho phép tạo mới cấu hình Autolist với dữ liệu hợp lệ và chặn dữ liệu sai định dạng.
*   **Các bước thực hiện:**
    1. Gửi request `POST /api/brands/<brandId>/autolists` với dữ liệu hợp lệ: `name = "Queue A"`, `scheduleType = "INTERVAL"`, `intervalMinutes = 120`.
    2. Gửi request tiếp theo với dữ liệu không hợp lệ: `scheduleType = "SPECIFIC"`, `specificTimes = "invalid-time"`.
*   **Kết quả mong muốn:**
    *   Yêu cầu 1 thành công (HTTP 201), Autolist được lưu vào database.
    *   Yêu cầu 2 bị chặn (HTTP 400 Bad Request) kèm lỗi validate định dạng thời gian.

---

### **AUTOLIST_002: Lập lịch theo Khoảng thời gian (Interval)**
*   **Mô tả:** Xác minh các bài viết nháp trong hàng đợi được xếp lịch cách nhau đúng khoảng thời gian cố định.
*   **Các bước thực hiện:**
    1. Thêm 3 bài đăng ở dạng `DRAFT` vào Autolist có cấu hình `intervalMinutes = 60` (1 tiếng).
    2. Gọi API hoặc kích hoạt logic tính toán lại lịch (`recalculateQueueSchedules`).
*   **Kết quả mong muốn:** 
    *   Cả 3 bài viết chuyển trạng thái sang `SCHEDULED`.
    *   Bài viết thứ nhất có `scheduledAt = gốc`, bài thứ hai là `gốc + 1 tiếng`, bài thứ ba là `gốc + 2 tiếng`.

---

### **AUTOLIST_003: Lập lịch theo Mốc giờ cố định (Specific Times)**
*   **Mô tả:** Xác minh bài viết được xếp lịch khớp chính xác với các mốc giờ cấu hình sẵn trong ngày.
*   **Các bước thực hiện:**
    1. Cấu hình Autolist hoạt động với `specificTimes = "08:00,14:00,20:00"`.
    2. Thêm 3 bài đăng nháp và kích hoạt tính lịch.
*   **Kết quả mong muốn:** 
    *   Các bài viết được xếp lịch vào các khung giờ chính xác: bài thứ nhất đăng lúc 08:00, bài thứ hai lúc 14:00, bài thứ ba lúc 20:00 của ngày tương ứng.

---

### **AUTOLIST_004: Bộ lọc ngày hoạt động (Active Days Filter)**
*   **Mô tả:** Xác minh bộ lập lịch bỏ qua các ngày nghỉ và chỉ xếp lịch vào các ngày hoạt động được chọn.
*   **Các bước thực hiện:**
    1. Cấu hình Autolist chỉ hoạt động vào Thứ Hai và Thứ Tư (`activeDays = "Mo,We"`).
    2. Thêm bài đăng nháp vào hàng đợi. Giả lập thời gian chạy từ tối Thứ Tư.
*   **Kết quả mong muốn:** Bài đăng tiếp theo phải được xếp lịch sang ngày **Thứ Hai tuần kế tiếp** (bỏ qua Thứ Năm, Thứ Sáu và các ngày cuối tuần).

---

### **AUTOLIST_005: Tự động lặp lại hàng đợi (Auto Loop)**
*   **Mô tả:** Xác minh khi hàng đợi cạn bài viết mới và bật chế độ lặp, hệ thống tự động nhân bản bài viết đã đăng thành bản nháp mới để lặp lại mà không làm mất lịch sử bài viết cũ.
*   **Các bước thực hiện:**
    1. Cấu hình Autolist bật `loopEnabled = true`.
    2. Đăng hết tất cả các bài viết trong hàng đợi (không còn bài viết nào ở trạng thái DRAFT hay SCHEDULED).
    3. Thực hiện kích hoạt tính toán lại lịch.
*   **Kết quả mong muốn:** 
    *   Hệ thống tự động phát hiện hàng đợi cạn.
    *   Các bài viết cũ đã xuất bản (`PUBLISHED`) được gỡ liên kết autolist (`autoListId = null`) để lưu trữ lịch sử tĩnh.
    *   Một bản sao mới ở trạng thái `DRAFT` được tạo ra cho từng bài viết cũ và gán vào Autolist để bắt đầu vòng lặp mới.

---

### **AUTOLIST_006: Kéo thả thay đổi thứ tự bài viết (Reorder Posts)**
*   **Mô tả:** Xác minh khi người dùng thay đổi thứ tự bài đăng trên giao diện, hệ thống cập nhật đúng thứ tự trong database và xếp lại lịch đăng.
*   **Các bước thực hiện:**
    1. Gửi request `POST /api/autolists/<id>/reorder` với mảng ID bài viết đã thay đổi thứ tự.
*   **Kết quả mong muốn:** 
    *   Trường `createdAt` của các bài viết được cập nhật tăng dần theo thứ tự mới để làm mốc sắp xếp của câu query database.
    *   Lịch biểu (`scheduledAt`) của các bài đăng được tính toán lại và áp dụng chính xác theo thứ tự mới.

---

### **AUTOLIST_007: Bật/Tắt trạng thái hàng đợi (Toggle Active Status)**
*   **Mô tả:** Xác minh khi tạm dừng (pause) hoặc kích hoạt lại (active) hàng đợi, các job lập lịch tương ứng trong BullMQ được quản lý chính xác.
*   **Các bước thực hiện:**
    1. Gọi API tắt Autolist (`isActive = false`).
    2. Gọi API bật lại Autolist (`isActive = true`).
*   **Kết quả mong muốn:** 
    *   Khi tắt: Toàn bộ bài đăng chuyển về dạng `DRAFT` và các job gửi đăng bài trong hàng đợi BullMQ bị hủy.
    *   Khi bật: Các bài đăng chuyển sang `SCHEDULED` và đăng ký lại các job tương ứng với thời gian đăng mới vào BullMQ.
