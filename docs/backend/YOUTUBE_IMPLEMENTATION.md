# 📽️ YouTube Integration Implementation Details

Tài liệu này ghi lại chi tiết các tính năng, kỹ thuật và cấu trúc đã triển khai cho module YouTube Dashboard.

---

## 🚀 Các Tính Năng Đã Hoàn Thành

### 1. Kết nối & Quản lý Tài khoản (OAuth 2.0)
- **Tích hợp Google OAuth**: Xây dựng luồng ủy quyền an toàn để kết nối kênh YouTube.
- **Quản lý Quyền (Scopes)**:
    - `youtube.readonly`: Truy cập thông tin kênh và video.
    - `yt-analytics.readonly`: Lấy báo cáo phân tích chuyên sâu.
- **Cơ chế Token**: Tự động lưu trữ và làm mới `accessToken` bằng `refreshToken` khi đồng bộ dữ liệu.

### 2. Dashboard Analytics (Phong cách Metricool)
- **Community (Cộng đồng)**:
    - Hiển thị chỉ số thực: Subscribers, Total Views, Videos.
    - Tính toán Engagement Rate và Watch Time từ YouTube Analytics API.
    - Biểu đồ **Growth** (Bar Chart) và **Balance of Subscribers** (Line Chart) theo thời gian thực.
- **Demographics (Nhân khẩu học)**:
    - Phân tích giới tính (Gender) và độ tuổi (Age) của khán giả.
    - Bản đồ lượt xem theo quốc gia (Geographic).
    - Nguồn lưu lượng (Traffic Source): Tìm kiếm, đề xuất, trực tiếp, v.v.
- **Bộ lọc thời gian (Date Range Filter)**:
    - Giao diện lịch đôi chuyên nghiệp.
    - Phím tắt chọn nhanh: Yesterday, Last 7/30 days, Current month.
    - Đồng bộ toàn bộ Dashboard theo khoảng thời gian đã chọn.

### 3. Quản lý Nội dung & Đối thủ
- **Published Videos**:
    - Danh sách video thực tế lấy từ playlist "Uploads".
    - Phân trang chuẩn Google (`nextPageToken`).
    - Cho phép chọn số lượng hiển thị mỗi trang (5, 10, 15, 20).
- **Viewed Videos (Tracking)**:
    - Cho phép dán URL video bất kỳ để theo dõi hiệu suất riêng biệt.
    - Tự động bóc tách thông tin video từ YouTube API.
- **Competitors (Đối thủ)**:
    - Tìm kiếm kênh đối thủ bằng tên hoặc Handle.
    - So sánh số lượng người đăng ký thực tế giữa các kênh.

---

## 🛠️ Cấu Trúc Kỹ Thuật

### Backend (Node.js/Express)
- **Service Layer**: `youtube.service.js` xử lý logic gọi API phức tạp và bóc tách dữ liệu thô từ Google.
- **Repository Layer**: `social-account.repository.js` quản lý việc lưu trữ thông tin kết nối và dữ liệu Analytics vào MySQL (Prisma).
- **Quota Optimization**:
    - Lưu trữ `uploadsPlaylistId` vào DB để giảm 1 bước gọi API mỗi khi xem danh sách video.
    - Chuyển đổi dữ liệu báo cáo sang JSON để tối ưu tốc độ truy vấn.

### Frontend (React/Vite)
- **Component Design**: 
    - `PlatformDashboard.jsx`: Container chính quản lý trạng thái và luồng dữ liệu.
    - `DateRangeFilter.jsx`: Bộ lọc thời gian độc lập, tái sử dụng cao.
- **Data Transformation**: Logic chuyển đổi các hàng báo cáo thô của Google (rows) thành định dạng phù hợp cho Recharts.

---

## 📂 Danh Sách File Liên Quan

| Module | File |
| :--- | :--- |
| **Database** | `backend/prisma/schema.prisma` (Models: `YouTubeChannel`, `TrackedVideo`, `SocialAnalytics`) |
| **Backend Service** | `backend/src/services/youtube.service.js` |
| **Backend Controller** | `backend/src/controllers/social.controller.js` |
| **Frontend UI** | `frontend/src/pages/workspace/PlatformDashboard.jsx` |
| **Date Filter** | `frontend/src/components/app/DateRangeFilter.jsx` |

---
*Tài liệu được cập nhật ngày 23/05/2026.*
