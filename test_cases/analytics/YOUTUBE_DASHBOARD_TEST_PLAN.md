# Kế hoạch Kiểm thử Tự động E2E - YouTube Dashboard Analytics

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Phân tích số liệu YouTube Dashboard (`youtube_dashboard.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Khởi tạo & Onboarding
*   **[TC_YT_DB_00](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/TC_YT_DB_00.md) – Đăng ký tài khoản mới, onboarding và seed dữ liệu YouTube**
    *   **Mô tả**: Tạo tài khoản test, vượt qua bước Onboarding và thiết lập dữ liệu mock ban đầu cho biểu đồ.

### 2. Tab Tổng quan (Overview Tab)
*   **[TC_YT_DB_01_02](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/TC_YT_DB_01_02.md) – Community Metrics và bộ lọc Date Filter trên YouTube Dashboard**
    *   **Mô tả**: Xác minh các thông số Subscribers, Views, Videos hiển thị đúng dữ liệu đã seed và thay đổi mốc thời gian lọc hoạt động chính xác.
*   **[TC_YT_DB_03](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/TC_YT_DB_03.md) – Kiểm tra biểu đồ Demographics trên YouTube Dashboard**
    *   **Mô tả**: Kiểm tra biểu đồ nhân khẩu học (Age & Gender) hiển thị chính xác tỉ lệ.

### 3. Tab Video (Videos Tab)
*   **[TC_YT_DB_04](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/TC_YT_DB_04.md) – Danh sách Published Videos và phân trang trên YouTube Dashboard**
    *   **Mô tả**: Kiểm tra danh sách video đã xuất bản và chức năng phân trang.
*   **[TC_YT_DB_06](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/TC_YT_DB_06.md) – Theo dõi Viewed Videos trên YouTube Dashboard**
    *   **Mô tả**: Kiểm tra tính năng sắp xếp danh sách video theo lượt xem giảm dần và mở link gốc sang YouTube.

### 4. Tab Đối thủ cạnh tranh (Competitors Tab)
*   **[TC_YT_DB_07_08](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/TC_YT_DB_07_08.md) – Tìm kiếm, thêm và xóa đối thủ trên YouTube Dashboard**
    *   **Mô tả**: Tìm kiếm theo handle kênh đối thủ, thêm vào danh sách theo dõi và thực hiện xóa đối thủ.
    *   **Bug liên kết**: [BUG_PC_53_COMPETITORS_ACTION_COLUMN_OVERFLOW.md](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/BUG_PC_53_COMPETITORS_ACTION_COLUMN_OVERFLOW.md) (Jira Key: `PC-53`)
*   **[TC_YT_DB_09_10](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/TC_YT_DB_09_10.md) – Xuất báo cáo CSV đối thủ trên YouTube Dashboard**
    *   **Mô tả**: Xuất dữ liệu đối thủ cạnh tranh ra file CSV và kiểm tra tính toàn vẹn của dữ liệu tải về.

### 5. Trạng thái Chưa kết nối (Empty State)
*   **[TC_YT_DB_11](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/TC_YT_DB_11.md) – Trạng thái Empty State chưa kết nối YouTube**
    *   **Mô tả**: Đảm bảo hiển thị màn hình hướng dẫn và nút Connect YouTube khi thương hiệu chưa kết nối kênh.
