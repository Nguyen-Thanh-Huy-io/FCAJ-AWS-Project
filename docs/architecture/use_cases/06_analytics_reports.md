# Đặc Tả Use Case: Phân hệ Phân tích & Báo cáo

## 1. Sơ đồ Use Case

![Sơ đồ Use Case Analytics](../../diagrams/uc_analytics.png)

## 2. Đặc tả chi tiết

### UC13. Theo dõi Thống kê Nền tảng (Social Analytics)
*   **Mô tả:** Cung cấp biểu đồ trực quan về mức độ tăng trưởng (Followers, Reach, Engagement, Video views) của các kênh kết nối.
*   **Tác nhân kích hoạt:** Analyst, Manager.
*   **Tiền điều kiện:** Kênh đã được kết nối và đã qua lượt Sync dữ liệu đầu tiên.
*   **Các bước thực hiện:**
    1.  Hệ thống chạy CronJob hằng ngày cào data từ MXH, ghi vào `SocialAnalytics`.
    2.  Người dùng chọn khoảng thời gian và kênh tại màn Dashboard.
    3.  Hệ thống trả về Data (gồm cả Audience Demographics), frontend render biểu đồ Recharts.

### UC14. Theo dõi Đối thủ & Hashtag (Competitor & Hashtag Tracking)
*   **Mô tả:** Theo dõi một tài khoản không thuộc quyền sở hữu (Đối thủ) hoặc 1 Hashtag nổi bật để đo lường trend.
*   **Tác nhân kích hoạt:** Analyst.
*   **Các bước thực hiện:**
    1.  Vào mục Competitor, nhập link/handle đối thủ.
    2.  Hệ thống fetch dữ liệu public (Follower, Avg Engagement).
    3.  Lưu vào `CompetitorAnalysis` và vẽ biểu đồ so sánh với Brand nội bộ.

### UC15. Xuất Báo cáo Tự động (Reports)
*   **Mô tả:** Lập lịch sinh file PDF/CSV báo cáo gửi cho sếp/khách hàng. Hỗ trợ White-label (tùy biến giao diện logo/màu sắc).
*   **Tác nhân kích hoạt:** Manager.
*   **Các bước thực hiện:**
    1.  Tạo Report Template (Chọn các metrics cần có, kênh MXH, dải ngày).
    2.  Cấu hình Tần suất (Hàng tuần/tháng) và Email nhận báo cáo.
    3.  (Tùy chọn) Chỉnh sửa Logo, Primary Color.
    4.  Worker chạy định kỳ sinh PDF và gửi qua Nodemailer.
