# 🌐 Social Integration & Analytics System (Core)

Tài liệu này mô tả kiến trúc cốt lõi để tích hợp các mạng xã hội và hệ thống xử lý dữ liệu phân tích tập trung của PubliCast.

---

## 🏗️ Kiến Trúc Hệ Thống (Core Architecture)

Hệ thống được thiết kế linh hoạt để có thể mở rộng thêm nhiều nền tảng (Facebook, Instagram, LinkedIn, TikTok...) bằng cách sử dụng các lớp trừu tượng và dịch vụ chuyên biệt.

### 1. Luồng Tích Hợp OAuth (Unified OAuth Flow)
Mọi kết nối mạng xã hội đều tuân theo quy trình tiêu chuẩn:
1.  **Frontend**: Gửi yêu cầu lấy URL ủy quyền cho một nền tảng cụ thể.
2.  **Backend**: Tạo URL với các `scopes` cần thiết.
3.  **User**: Cấp quyền trên trang của nền tảng.
4.  **Backend (Callback)**: Nhận `auth_code`, trao đổi lấy bộ Token (`access`, `refresh`, `expiry`).
5.  **Data Layer**: `SocialAccountRepository` lưu trữ thông tin kết nối và khởi tạo các bảng dữ liệu liên quan (ví dụ: `YouTubeChannel`).

### 2. Quản Lý Phiên Làm Việc (Connection Management)
- **Token Storage (Lưu trữ Token)**: Toàn bộ `accessToken` và `refreshToken` hiện đang được lưu trữ trực tiếp dưới dạng **Plaintext** trong MySQL DB phục vụ cho giai đoạn chạy ổn định ban đầu.
- **Security Backlog (Yêu cầu Bảo mật)**: Thiết lập cấu hình mã hóa đối xứng (Symmetric Encryption - ví dụ AES-256) cho các trường token này là hạng mục bắt buộc trước khi triển khai môi trường live production.
- **Auto-Refresh**: Tích hợp cơ chế tự động làm mới Token khi phát hiện hết hạn trong quá trình gọi API đồng bộ.
- **SocialAccount Model**: Lưu trữ metadata chung (Username, Display Name, Profile Picture) giúp Frontend hiển thị nhanh mà không cần gọi API ngoại vi.

---

## 📊 Hệ Thống Analytics Tập Trung

Hệ thống xử lý dữ liệu phân tích của PubliCast giúp tối ưu hiệu năng và Quota API.

### 1. Cấu Trúc Bảng Analytics
- **Analytics**: Lưu thông tin meta về kỳ báo cáo (từ ngày nào đến ngày nào, loại báo cáo).
- **SocialAnalytics**: Lưu dữ liệu hiệu suất chung (Followers, Reach, Impressions) và dữ liệu chuyên sâu dưới dạng JSON (`audienceDemographicsJson`).

### 2. Cơ Chế Đồng Bộ (Sync Mechanism)
Hệ thống hỗ trợ 2 chế độ:
- **On-demand Sync**: Đồng bộ khi người dùng mở Dashboard hoặc thay đổi bộ lọc thời gian.
- **Periodic Sync (Future)**: Tự động cập nhật dữ liệu hàng ngày qua Cron Job.

---

## 🛠️ Các Dịch Vụ Cốt Lõi (Core Services)

- **`google-oauth.service.js`**: Xử lý các tác vụ chung với Google API (dùng cho cả YouTube, Google Ads, v.v.).
- **`social.controller.js`**: Điều phối các yêu cầu từ Frontend tới các Service chuyên biệt của từng nền tảng.

---
*Tài liệu chi tiết về từng nền tảng:*
- [Chi tiết Triển khai YouTube](./YOUTUBE_IMPLEMENTATION.md)

