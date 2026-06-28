# Kế hoạch Kiểm thử Tự động E2E - Module Facebook Dashboard (Thống kê & Phân tích Facebook)

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Facebook Dashboard và Competitors Analysis (`dashboard/facebook_dashboard.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Onboarding & Đăng ký người dùng
*   **TC_FB_DB_00: Đăng ký người dùng test mới và hoàn tất onboarding**
    *   **Mã test Selenium**: `TC_FB_DB_00` trong `facebook_dashboard.spec.js`
    *   **Mô tả**: Tạo tài khoản người dùng thử nghiệm mới, nhập OTP lấy từ Redis, hoàn tất quy trình thiết lập onboarding cho Solo Creator và tạo Brand kiểm thử đầu tiên.
    *   **Kết quả mong đợi**: Kích hoạt tài khoản thành công và chuyển hướng đến trang `/dashboard`.

### 2. Trạng thái Chưa kết nối (Empty State)
*   **TC_FB_DB_11: Kiểm tra trạng thái Facebook chưa liên kết (Empty State)**
    *   **Mã test Selenium**: `TC_FB_DB_11` trong `facebook_dashboard.spec.js`
    *   **Mô tả**: Truy cập trang Dashboard của Facebook khi Brand chưa liên kết với bất kỳ trang Facebook nào.
    *   **Kết quả mong đợi**: Hiển thị chính xác thông điệp "Facebook account not connected" kèm theo nút bấm "Connect Facebook".

### 3. Tổng quan & Lọc ngày (Overview Tab & Date Filter)
*   **TC_FB_DB_01 & TC_FB_DB_02 & TC_FB_DB_03: Seed DB, kiểm tra Overview Tab, Charts và Date Filter**
    *   **Mã test Selenium**: `TC_FB_DB_01 & TC_FB_DB_02 & TC_FB_DB_03` trong `facebook_dashboard.spec.js`
    *   **Mô tả**: Ghi nhận dữ liệu mock (lượt xem, page visits, followers, reactions) xuống DB, sau đó kiểm tra xem Overview Tab hiển thị tên trang liên kết "Selenium FB Page", các biểu đồ Recharts hiển thị đúng thông số, và thực hiện lọc dữ liệu theo thời gian (Yesterday).
    *   **Kết quả mong đợi**: Hiển thị đúng dữ liệu mock trên biểu đồ và áp dụng bộ lọc ngày thành công không gây crash giao diện.

### 4. Phân tích bài đăng & Tin nổi bật (Posts & Stories tabs)
*   **TC_FB_DB_04 & TC_FB_DB_05 & TC_FB_DB_06: Kiểm tra tab POSTS (Metrics, Charts, List & Pagination)**
    *   **Mã test Selenium**: `TC_FB_DB_04 & TC_FB_DB_05 & TC_FB_DB_06` trong `facebook_dashboard.spec.js`
    *   **Mô tả**: Chuyển sang tab "POSTS" để xem thống kê hiệu quả của các bài viết.
    *   **Kết quả mong đợi**: Biểu đồ phân bố các bài đăng tải hiển thị, danh sách bài đăng hiển thị bảng dữ liệu (hoặc giao diện trống "No posts found" hợp lệ do token giả lập).
*   **TC_FB_DB_07 & TC_FB_DB_08: Kiểm tra tab STORIES (Metrics, List & Pagination)**
    *   **Mã test Selenium**: `TC_FB_DB_07 & TC_FB_DB_08` trong `facebook_dashboard.spec.js`
    *   **Mô tả**: Chuyển sang tab "STORIES" để xem số liệu phân tích về các tin ngắn tải lên.
    *   **Kết quả mong đợi**: Danh sách tin hiển thị đầy đủ, hoặc hiển thị giao diện trống "No stories found" hợp lệ.

### 5. Quản lý Đối thủ cạnh tranh (Competitors)
*   **TC_FB_DB_09 & TC_FB_DB_10: Kiểm tra tìm kiếm, thêm và xóa đối thủ cạnh tranh**
    *   **Mã test Selenium**: `TC_FB_DB_09 & TC_FB_DB_10` trong `facebook_dashboard.spec.js`
    *   **Mô tả**: Truy cập tab "COMPETITORS", kiểm tra đối thủ đã gieo sẵn (`Competitor A page`), nhấn nút ADD COMPETITOR để thực hiện tìm kiếm "Competitor C", bấm thêm vào danh sách, và sau đó thực hiện xóa đối thủ cạnh tranh khỏi bảng.
    *   **Kết quả mong đợi**: Thêm và xóa đối thủ thành công, bảng danh sách cập nhật trực tiếp trên UI và DB.

### 6. Xuất báo cáo (Report Download)
*   **TC_FB_DB_12 & TC_FB_DB_13: Tải CSV xuất báo cáo (Competitors)**
    *   **Mã test Selenium**: `TC_FB_DB_12 & TC_FB_DB_13` trong `facebook_dashboard.spec.js`
    *   **Mô tả**: Nhấn nút Tải báo cáo trong Dashboard, chọn định dạng CSV để xuất dữ liệu so sánh đối thủ cạnh tranh.
    *   **Kết quả mong đợi**: Tệp tin `publicast_facebook_report_competitors.csv` được tải xuống máy, nội dung tệp tin chứa dữ liệu đối thủ mẫu.
