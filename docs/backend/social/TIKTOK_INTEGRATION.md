# 📱 TikTok Integration & Analytics (Backend Core)

Tài liệu này mô tả chi tiết thiết kế backend, cấu trúc tệp tin, luồng hoạt động OAuth, cơ chế đồng bộ số liệu và đăng video lên nền tảng TikTok của dự án **PubliCast**.

---

## 🏗️ Cấu Trúc Mã Nguồn (Directory Structure)

Toàn bộ dịch vụ TikTok được xây dựng dưới dạng các mô-đun nghiệp vụ độc lập tại `backend/src/services/social/tiktok/`:

*   **`index.js` (TikTokService):** Lớp điều phối chính kế thừa từ `BaseSocialService`, chịu trách nhiệm phân phối các cuộc gọi nghiệp vụ từ bộ điều khiển (Controller).
*   **`tiktok.gateway.js` (TikTokGateway):** Cổng giao tiếp API trực tiếp với TikTok HTTP Endpoints, chịu trách nhiệm thiết lập tham số, header và gọi các endpoint OAuth, Content Posting, và Insights của TikTok.
*   **`tiktok-post.service.js` (TikTokPostService):** Xử lý luồng đăng bài lên TikTok (Khởi tạo video nhấp, upload nhị phân trực tiếp và cơ chế tự động chuyển sang riêng tư khi gặp lỗi *Unaudited Client*).
*   **`tiktok-video.service.js` (TikTokVideoService):** Lấy danh sách các video đã xuất bản trên kênh TikTok của thương hiệu.
*   **`tiktok-analytics.service.js` (TikTokAnalyticsService):** Chịu trách nhiệm chính trong việc đồng bộ dữ liệu phân tích kênh, tính toán số liệu người theo dõi và tương tác lịch sử.

---

## 🔑 Quy Trình Ủy Quyền OAuth (OAuth 2.0 Flow)

Quy trình kết nối tài khoản TikTok tuân thủ quy chuẩn bảo mật OAuth 2.0:
1.  **Frontend** yêu cầu URL ủy quyền từ hệ thống thông qua `GET /api/social/google/url?platform=tiktok` (sử dụng cổng cấu hình OAuth chung).
2.  Hệ thống chuyển hướng người dùng đến trang ủy quyền chính thức của TikTok kèm theo các scopes: `user.info.basic`, `video.list`, `video.publish`.
3.  Khi người dùng cấp quyền, TikTok callback về `/api/social/google/callback` cùng với mã xác thực `code`.
4.  `tiktok-analytics.service.js` gửi yêu cầu lên TikTok API để đổi mã `code` lấy bộ mã `accessToken` và `refreshToken`, sau đó lưu trữ thông tin kết nối vào bảng `SocialAccount` của MySQL qua Prisma.

---

## 📊 Logic Xử Lý Thống Kê & Phân Tích (Analytics Engine)

*   **Đồng bộ số liệu (`syncChannelMetrics`):**
    *   Hệ thống gọi API của TikTok lấy tổng lượng followers, likes, videos hiện tại.
    *   Sử dụng cơ chế **Phân bổ tuyến tính ngược** tại `_processVideosForAnalytics` để tính toán sự phát triển người theo dõi (followers gain) theo dòng thời gian dựa trên hiệu suất tương tác thực tế từ các video đã tải lên.
    *   Dữ liệu phân tích hoàn chỉnh được chuyển đổi sang cấu trúc định dạng JSON và lưu trữ vào trường `audienceDemographicsJson` và `hourlyEngagementJson` trong bảng `SocialAnalytics` (MySQL).

---

## 📤 Quy trình Đăng Video & Fallback (Video Publishing Flow)

1.  **Khởi tạo (`init`):** Gọi endpoint `/v2/post/publish/video/init/` với metadata của video để nhận về `publish_id` và `upload_url`.
2.  **Tải nhị phân (Upload Binary):** Pipe luồng video trực tiếp từ file local lên `upload_url` bằng phương thức `PUT`.
3.  **Cơ chế Fallback thông minh:**
    *   Nếu ứng dụng đang ở chế độ Sandbox (chưa được TikTok phê duyệt chính thức), việc đăng video công khai sẽ gặp lỗi `unaudited_client_can_only_post_to_private_accounts`.
    *   Backend sẽ tự động bắt mã lỗi này, chuyển đổi thuộc tính `privacy_level` của video sang `SELF_ONLY` (Chỉ mình tôi) và gửi lại yêu cầu khởi tạo lần hai để đảm bảo luồng hoạt động không bị ngắt quãng khi phát triển cục bộ.
