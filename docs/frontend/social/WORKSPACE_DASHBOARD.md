# 📊 Frontend: Thống Kê & Báo Cáo Kênh (Workspace Dashboard)

Tài liệu này chi tiết hóa cấu trúc thiết kế UI/UX và cơ chế xử lý số liệu phân tích mạng xã hội tập trung tại phía Frontend của PubliCast.

---

## 🛠️ Công Nghệ & Thành Phần
- **Thư viện Biểu đồ:** `Recharts` (Hỗ trợ AreaChart, BarChart, LineChart, PieChart)
- **Bộ lọc thời gian:** `DateRangeFilter.jsx` (Lịch đôi chuyên nghiệp)
- **Tải dữ liệu:** Custom Hook `usePlatformDashboard.js`

---

## ✨ Các Tính Năng Nổi Bật

### 1. Bảng Điều Khiển Trung Tâm (`PlatformDashboard.jsx`)
*   **Bộ lọc đồng bộ:** Cho phép lọc dữ liệu theo nền tảng (YouTube, Facebook, TikTok) và thời gian thực, tự động cập nhật số liệu của tất cả các tab con bên dưới.
*   **Hỗ trợ Quota & Cache:** Sử dụng cơ chế lưu bộ nhớ đệm `hasFetched` để ngăn việc gửi yêu cầu API liên tục khi người dùng chuyển đổi giữa các tab.

### 2. Thống Kê Bài Viết & Video (`PublishedVideosTab.jsx` / `TikTokPostsTab.jsx`)
*   **Thống kê chi tiết:** Hiển thị danh sách video/bài đăng thật kèm các chỉ số Lượt xem, Likes, Comments, Shares, và Tỷ lệ tương tác (Engagement Rate).
*   **Xem trước trực quan:** Tích hợp thẻ ngữ cảnh video (Video Context Card) có thể nhấp vào để chuyển tiếp xem bài đăng gốc trên nền tảng mạng xã hội.

### 3. Phân Tích Người Xem (`DemographicsTab.jsx` / `TikTokCommunityTab.jsx`)
*   **Nhân khẩu học (Demographics):** Vẽ biểu đồ phân bổ giới tính và độ tuổi của khán giả bằng biểu đồ tròn hoặc biểu đồ thanh ngang.
*   **Tăng trưởng cộng đồng:** Hiển thị biểu đồ xu hướng tăng trưởng người theo dõi (Followers Growth) qua các ngày.

---

## 📂 Các Tệp Tin Liên Quan

*   [PlatformDashboard.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/PlatformDashboard.jsx) — Component chính quản lý trạng thái Dashboard.
*   [Analytics.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/Analytics.jsx) — Báo cáo phân tích tổng quan các kênh.
*   [HashtagManager.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/HashtagManager.jsx) — Quản lý và phân tích hiệu quả các bộ Hashtag.
*   [AIAssistant.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/AIAssistant.jsx) — Trợ lý AI đồng hành tạo nội dung.
