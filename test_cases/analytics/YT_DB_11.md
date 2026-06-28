# Kế hoạch Kiểm thử Tự động E2E - YouTube Dashboard & Analytics

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ YouTube Dashboard (`dashboard/youtube_dashboard.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Onboarding & Đăng nhập
*   **TC_YT_DB_00: Đăng ký người dùng test mới và hoàn tất onboarding**
    *   **Mã test Selenium**: `TC_YT_DB_00` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Đăng ký tài khoản kiểm thử mới, lấy mã xác thực OTP qua Redis, điền thông tin thiết lập kênh YouTube và tạo Brand để vào Dashboard.
    *   **Kết quả mong đợi**: Người dùng đăng ký thành công, hoàn tất Onboarding và điều hướng về `/dashboard`.

### 2. Trạng thái Chưa kết nối (Empty State)
*   **TC_YT_DB_11: Kiểm tra trạng thái YouTube chưa liên kết (Empty State)**
    *   **Mã test Selenium**: `TC_YT_DB_11` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Kiểm tra UI hiển thị trạng thái tài khoản YouTube chưa được kết nối đối với Brand mới tạo.
    *   **Kết quả mong đợi**: Hiển thị thông báo "YouTube account not connected" kèm nút "Connect YouTube" hiển thị rõ ràng.

### 3. Số liệu thống kê & Bộ lọc thời gian (Metrics & Date Filter)
*   **TC_YT_DB_01: Seed DB và kiểm tra Community Metrics, Charts**
    *   **Mã test Selenium**: `TC_YT_DB_01` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Seed dữ liệu thống kê YouTube (Subscribers, Views, Videos) vào DB, tải lại trang và xác minh UI hiển thị đúng số liệu đã seed cùng biểu đồ Growth Recharts.
    *   **Kết quả mong đợi**: Số liệu Subscribers hiển thị đúng 1250, Views 3650, Videos 15, và Recharts component hiển thị bình thường.
*   **TC_YT_DB_02: Date Range Filter**
    *   **Mã test Selenium**: `TC_YT_DB_02` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Lọc dữ liệu thống kê theo khoảng thời gian tùy chọn (ví dụ: Yesterday).
    *   **Kết quả mong đợi**: Bảng điều khiển cập nhật lại dữ liệu dựa trên mốc thời gian đã chọn sau khi nhấn Apply Range.

### 4. Phân tích nhân khẩu học (Demographics Tab)
*   **TC_YT_DB_03: Kiểm tra hiển thị biểu đồ tab Demographics**
    *   **Mã test Selenium**: `TC_YT_DB_03` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Chuyển sang tab Demographics và kiểm chứng các biểu đồ Gender, Age, Viewers by Country, Traffic Source.
    *   **Kết quả mong đợi**: Hiển thị chính xác các tỷ lệ Male (56%), Female (44%), biểu đồ Age, quốc gia Vietnam, và nguồn lưu lượng truy cập.

### 5. Quản lý Video (Published & Viewed Videos)
*   **TC_YT_DB_04: Kiểm tra danh sách Published Videos và tính năng phân trang**
    *   **Mã test Selenium**: `TC_YT_DB_04` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Xác minh danh sách các video đã xuất bản của kênh được hiển thị.
    *   **Kết quả mong đợi**: Trả về danh sách video hoặc hiển thị Empty State "No videos found" khi dùng token mock.
*   **TC_YT_DB_06: Kiểm tra tab Viewed Videos và thêm video YouTube để theo dõi**
    *   **Mã test Selenium**: `TC_YT_DB_06` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Kiểm chứng danh sách video đang theo dõi (ví dụ: video của Rick Astley), nhập thêm một video URL mới để bắt đầu theo dõi.
    *   **Kết quả mong đợi**: Video đã seed hiển thị tiêu đề chính xác, form nhập URL hoạt động bình thường.

### 6. Phân tích Đối thủ cạnh tranh (Competitors)
*   **TC_YT_DB_07: Kiểm tra tìm kiếm đối thủ cạnh tranh**
    *   **Mã test Selenium**: `TC_YT_DB_07` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Nhấn thêm đối thủ cạnh tranh, nhập từ khóa tìm kiếm (ví dụ: "TechVN") và thực thi tìm kiếm.
    *   **Kết quả mong đợi**: Giao diện hiển thị danh sách kết quả tìm kiếm kênh tương ứng.
*   **TC_YT_DB_08: Kiểm tra xóa đối thủ cạnh tranh**
    *   **Mã test Selenium**: `TC_YT_DB_08` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Thực hiện xóa Competitor A khỏi danh sách theo dõi của Brand.
    *   **Kết quả mong đợi**: Competitor A biến mất khỏi danh sách trên UI sau khi xác nhận xóa.

### 7. Xuất Báo cáo (Reports)
*   **TC_YT_DB_09 & TC_YT_DB_10: Tải CSV xuất báo cáo (Video & Competitors)**
    *   **Mã test Selenium**: `TC_YT_DB_09 & TC_YT_DB_10` trong `youtube_dashboard.spec.js`
    *   **Mô tả**: Nhấn nút Tải file CSV báo cáo trên tab Competitors.
    *   **Kết quả mong đợi**: Hệ thống xuất file CSV về thư mục downloads với định dạng header `Competitor Name,Handle,Subscribers,Total Views,Total Videos,Added At` và chứa đúng dữ liệu đối thủ.
