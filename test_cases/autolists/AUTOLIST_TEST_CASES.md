# KỊCH BẢN KIỂM THỬ CHI TIẾT - AUTOLIST (DETAILED TEST CASES - AUTOLIST)

Tài liệu này mô tả chi tiết các kịch bản kiểm thử (Test Cases) từ **TC_AUTOLIST_01** đến **TC_AUTOLIST_07** được thiết kế để chạy trên giao diện người dùng (UI) bằng Selenium WebDriver và đối chiếu trực tiếp dưới cơ sở dữ liệu (Backend Database).

---

### **TC_AUTOLIST_01: Tạo mới hàng đợi Autolist và lưu Backend Database**
*   **Mô tả:** Đảm bảo hệ thống cho phép tạo mới cấu hình Autolist với dữ liệu hợp lệ từ UI và lưu trữ chính xác dưới cơ sở dữ liệu.
*   **Các bước thực hiện (Selenium):**
    1. Đăng nhập vào hệ thống và điều hướng sang trang Autolists (`/planner/autolists`).
    2. Bấm nút `"Create autolist"`.
    3. Điền tên hàng đợi có dạng: `E2E Queue - <timestamp>`.
    4. Bấm chọn nền tảng `Facebook`.
    5. Cấu hình khoảng cách đăng bài (Interval) là `1 giờ`.
    6. Bấm nút `"Create queue"`.
*   **Kết quả mong muốn:**
    *   **UI:** Pop-up tạo mới đóng, giao diện chuyển hướng về trang cấu hình chi tiết của hàng đợi vừa tạo.
    *   **Database:** Truy vấn bảng `auto_lists` tìm theo tên `name = 'E2E Queue - <timestamp>'` trả về đúng 1 bản ghi có:
        *   `scheduleType = 'INTERVAL'`
        *   `intervalMinutes = 60` (1 giờ được đổi thành 60 phút)
        *   `isActive = 1` (Mặc định hoạt động)

---

### **TC_AUTOLIST_02: Sửa tên và thời gian giãn cách của Autolist**
*   **Mô tả:** Xác minh người dùng có thể chỉnh sửa thông tin hàng đợi và khoảng thời gian giãn cách thành công trên UI, dữ liệu được cập nhật đồng bộ xuống DB.
*   **Các bước thực hiện (Selenium):**
    1. Trên trang cấu hình chi tiết Autolist, nhập tên mới vào ô Name: `E2E Queue Updated - <timestamp>`.
    2. Thay đổi giá trị khoảng cách giãn cách trong ô Input thành `2 giờ`.
    3. Bấm nút `"Save settings"`.
*   **Kết quả mong muốn:**
    *   **UI:** Toast thông báo cập nhật thành công hiển thị. Tên mới hiển thị ở header.
    *   **Database:** Bản ghi Autolist trong bảng `auto_lists` được cập nhật:
        *   `name = 'E2E Queue Updated - <timestamp>'`
        *   `intervalMinutes = 120` (2 giờ được đổi thành 120 phút)

---

### **TC_AUTOLIST_03: Cấu hình mốc giờ đăng bài cụ thể (Specific Times)**
*   **Mô tả:** Xác minh việc chuyển đổi hình thức lập lịch sang các mốc giờ cố định trong ngày hoạt động chính xác.
*   **Các bước thực hiện (Selenium):**
    1. Trên trang cấu hình Timing, bấm chọn nút `"Specific Times"`.
    2. Bấm nút `"Add new slot"` để tạo thêm một khung giờ đăng (mặc định sẽ điền slot 09:00).
    3. Bấm nút `"Save settings"`.
*   **Kết quả mong muốn:**
    *   **UI:** Hệ thống lưu cấu hình mới thành công, hiển thị các slot giờ cụ thể trên giao diện.
    *   **Database:** Cột `scheduleType` của bản ghi trong bảng `auto_lists` chuyển thành `'SPECIFIC'`.

---

### **TC_AUTOLIST_04: Cấu hình ngày hoạt động (Active Days)**
*   **Mô tả:** Xác minh cấu hình lọc các ngày hoạt động trong tuần của hàng đợi lưu đúng trạng thái.
*   **Các bước thực hiện (Selenium):**
    1. Bấm nút `"Interval"` để quay lại cấu hình giãn cách.
    2. Mặc định các ngày hoạt động được chọn là Thứ 2 đến Thứ 6 (`Mo,Tu,We,Th,Fr`).
    3. Bấm nút `"Save settings"`.
*   **Kết quả mong muốn:**
    *   **UI:** Cấu hình ngày hoạt động được ghi nhận.
    *   **Database:** Cột `activeDays` lưu đúng chuỗi `'Mo,Tu,We,Th,Fr'`.

---

### **TC_AUTOLIST_05: Thêm bài đăng nháp vào hàng đợi và xếp lịch tự động**
*   **Mô tả:** Đảm bảo khi thêm bài đăng mới vào hàng đợi, hệ thống lưu bài đăng và tự động tính toán thời gian lên lịch đăng bài (`scheduledAt`).
*   **Các bước thực hiện (Selenium):**
    1. Bấm nút `"Add your first post"` (hoặc `"Add post"`).
    2. Nhập nội dung bài viết vào ô soạn thảo: `E2E Queue Post Caption - <timestamp>`.
    3. Di chuyển chuột ra ngoài và bấm nút `"Save settings"`.
*   **Kết quả mong muốn:**
    *   **UI:** Card bài đăng xuất hiện trong danh sách hàng đợi Autolist.
    *   **Database:**
        *   Tìm thấy 1 bài đăng mới trong bảng `posts` có `caption` chứa chuỗi mẫu.
        *   Trạng thái của bài đăng là `'SCHEDULED'`.
        *   Trường `scheduledAt` không bị null, được tính toán đúng dựa trên mốc thời gian hoạt động của hàng đợi.

---

### **TC_AUTOLIST_06: Speedrun (Tua nhanh thời gian xuất bản) & Xác thực Planner List UI**
*   **Mô tả:** Xác minh khi bài viết đến hạn đăng, hệ thống xuất bản bài viết thành công, cập nhật trạng thái bài viết và hiển thị chính xác trên trang danh sách lịch Planner.
*   **Các bước thực hiện (Selenium & Backend Service CLI):**
    1. Truy cập database lấy `id` của bài viết vừa tạo ở TC_AUTOLIST_05.
    2. Chạy lệnh Node CLI ở Backend giả lập việc worker đến hạn đăng bài:
       ```bash
       node -e "require('./src/services/workspace/post.service').publishToPlatforms('<postId>').then(() => process.exit(0));"
       ```
    3. Chờ 2 giây để backend hoàn thành xử lý.
    4. Trình duyệt điều hướng sang trang lịch Planner List (`/planner/list`).
*   **Kết quả mong muốn:**
    *   **Database:** Trạng thái bài đăng chuyển sang `'PUBLISHED'` (hoặc `'FAILED'` nếu token mạng xã hội mockup hết hạn/không có kết nối thật nhưng quy trình chạy API vẫn hoàn tất).
    *   **UI:** Driver tìm thấy card bài đăng có nội dung `E2E Queue Post Caption - <timestamp>` hiển thị trực quan trên giao diện danh sách Planner List.

---

### **TC_AUTOLIST_07: Tạm dừng hàng đợi Autolist (Pause Queue)**
*   **Mô tả:** Xác minh khi tạm dừng hàng đợi, các công việc lập lịch gửi bài đăng tương ứng được gỡ bỏ và trạng thái Autolist chuyển sang không hoạt động.
*   **Các bước thực hiện (Selenium):**
    1. Điều hướng trình duyệt quay lại trang danh sách Autolists (`/planner/autolists`).
    2. Đợi danh sách hàng đợi load xong.
    3. Định vị card hàng đợi có tên `E2E Queue Updated - <timestamp>` và click vào nút Tạm dừng (nút có icon Pause và title `"Tạm dừng hàng đợi"`).
*   **Kết quả mong muốn:**
    *   **UI:** Nút Pause chuyển thành Play (icon Kích hoạt) với title mới là `"Kích hoạt hàng đợi"`.
    *   **Database:** Bản ghi Autolist trong bảng `auto_lists` có `isActive = 0` (đã tạm dừng thành công).
