# Kế hoạch Kiểm thử Tự động E2E - Module Facebook Dashboard

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Facebook Dashboard và Competitors Analysis (`dashboard/facebook_dashboard.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Onboarding & Đăng ký người dùng
*   **[TC_FB_DB_00](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC01_UC02_UC05_DASHBOARD_NHA_FB_00.md) – Đăng ký người dùng test mới và hoàn tất onboarding**
    *   **Mô tả**: Tạo tài khoản người dùng thử nghiệm mới, nhập OTP lấy từ Redis, hoàn tất quy trình thiết lập onboarding cho Solo Creator và tạo Brand kiểm thử đầu tiên.

### 2. Trạng thái Chưa kết nối (Empty State)
*   **[TC_FB_DB_11](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC14_UC16_DASHBOARD_NHA_FB_11.md) – Kiểm tra trạng thái Facebook chưa liên kết (Empty State)**
    *   **Mô tả**: Truy cập trang Dashboard của Facebook khi Brand chưa liên kết với bất kỳ trang Facebook nào.

### 3. Tổng quan & Lọc ngày (Overview Tab & Date Filter)
*   **[TC_FB_DB_01_03](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC16_DASHBOARD_NHA_FB_01_03.md) – Seed DB, kiểm tra Overview Tab, Charts và Date Filter**
    *   **Mô tả**: Ghi nhận dữ liệu mock xuống DB, kiểm tra Overview Tab hiển thị tên trang liên kết "Selenium FB Page", các biểu đồ Recharts hiển thị đúng thông số, và thực hiện lọc dữ liệu theo thời gian (Yesterday).

### 4. Phân tích bài đăng & Tin nổi bật (Posts & Stories tabs)
*   **[TC_FB_DB_04_06](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC16_DASHBOARD_NHA_FB_04_06.md) – Kiểm tra tab POSTS (Metrics, Charts, List & Pagination)**
    *   **Mô tả**: Chuyển sang tab "POSTS" để xem thống kê hiệu quả của các bài viết và kiểm tra biểu đồ phân tích.
*   **[TC_FB_DB_07_08](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC16_DASHBOARD_NHA_FB_07_08.md) – Kiểm tra tab STORIES (Metrics, List & Pagination)**
    *   **Mô tả**: Chuyển sang tab "STORIES" để xem số liệu phân tích về các tin ngắn tải lên.

### 5. Quản lý Đối thủ cạnh tranh (Competitors)
*   **[TC_FB_DB_09_10](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC17_DASHBOARD_NHA_FB_09_10.md) – Kiểm tra tìm kiếm, thêm và xóa đối thủ cạnh tranh**
    *   **Mô tả**: Truy cập tab "COMPETITORS", kiểm tra đối thủ đã gieo sẵn (`Competitor A page`), nhấn nút ADD COMPETITOR để thực hiện tìm kiếm "Competitor C", bấm thêm vào danh sách, và sau đó thực hiện xóa đối thủ cạnh tranh khỏi bảng.

### 6. Xuất báo cáo (Report Download)
*   **[TC_FB_DB_12_13](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC18_DASHBOARD_NHA_FB_12_13.md) – Tải CSV xuất báo cáo (Competitors)**
    *   **Mô tả**: Nhấn nút Tải báo cáo trong Dashboard, chọn định dạng CSV để xuất dữ liệu so sánh đối thủ cạnh tranh.
