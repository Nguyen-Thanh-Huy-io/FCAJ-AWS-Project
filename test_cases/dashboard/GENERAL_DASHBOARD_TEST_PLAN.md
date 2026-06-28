# Kế hoạch kiểm thử tự động (Selenium E2E Test Plan) - Dashboard Chung & Gỡ Livestream

Tài liệu này xác định kịch bản kiểm thử tự động E2E bằng Selenium WebDriver cho trang Dashboard chung mới (`/dashboard`) sau khi tái cấu trúc và loại bỏ các tính năng Livestream.

## Các Test Case chi tiết (Total: 11 Test Cases)

| Mã Test Case | Tên Test Case | Mô tả kịch bản | Trạng thái |
| :--- | :--- | :--- | :--- |
| **[TC_DASHBOARD_00](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC01_UC02_UC05_DASHBOARD_NHA_00.md)** | Đăng ký & Onboarding | Đăng ký người dùng test mới, hoàn tất onboarding và seed dữ liệu. | Pass |
| **[TC_DASHBOARD_01_02](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC16_DASHBOARD_NHA_01_02.md)** | Điều hướng & Stat Cards | Xác minh URL chứa `/dashboard` và các Stat Cards hiển thị chính xác số liệu đã seed. | Pass |
| **[TC_DASHBOARD_03](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC16_DASHBOARD_NHA_03.md)** | Hàng chờ bài đăng | Kiểm tra hàng chờ bài đăng gần đây chứa các bài viết đã seed (Draft, Scheduled, Published). | Pass |
| **[TC_DASHBOARD_04](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC16_DASHBOARD_NHA_04.md)** | Kết nối mạng xã hội | Xác minh các platform kết nối (YouTube, Facebook...) hiển thị trạng thái "Đã kết nối". | Pass |
| **[TC_DASHBOARD_05_06](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC16_DASHBOARD_NHA_05_06.md)** | Gỡ bỏ Livestream | Đảm bảo không còn menu livestream ở Header, tự động chuyển hướng từ `/live` về `/dashboard`. | Pass |
| **[TC_DASHBOARD_07](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC10_DASHBOARD_NHA_07.md)** | Mở/Đóng Post Creator | Kiểm tra tính năng mở và đóng Post Creator modal trực tiếp từ Dashboard. | Pass |
| **[TC_DASHBOARD_08_09](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC13_UC14_DASHBOARD_NHA_08_09.md)** | Liên kết nhanh | Kiểm tra liên kết nhanh đến phần Lịch đăng (Planner) và Quản lý kết nối (Connections). | Pass |
| **[TC_DASHBOARD_10](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/UC05_UC16_DASHBOARD_NHA_10.md)** | Tràn chữ Tên thương hiệu | Kiểm tra xem thẻ ACTIVE BRAND có xử lý tốt văn bản dài không. | Fail (Gốc) / Resolved |

### 🐛 Bug Report liên quan
*   [BUG_UC05_UC16_DASHBOARD_NHA_PC_56_ACTIVE_BRAND_OVERFLOW.md](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/BUG_UC05_UC16_DASHBOARD_NHA_PC_56_ACTIVE_BRAND_OVERFLOW.md) (Jira Key: `PC-56`)

---

## Môi trường kiểm thử (Environment Setup)
- **Frontend URL**: `http://localhost:5173`
- **Thư viện sử dụng**: Selenium WebDriver, Mocha (test runner), Chai (assertions).
