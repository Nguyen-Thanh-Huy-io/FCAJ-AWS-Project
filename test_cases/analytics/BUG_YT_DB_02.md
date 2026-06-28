# Báo cáo Lỗi: Bypass Cơ chế Mock Tìm kiếm Đối thủ cạnh tranh trên YouTube Dashboard (BUG_YT_DB_02)

## 📌 Thông tin chung
*   **Mã Lỗi**: BUG_YT_DB_02
*   **Độ Nghiêm Trọng**: Trung bình (Medium)
*   **Phân hệ**: YouTube Dashboard - Competitors Analysis
*   **Jira Ticket**: PC-53

## 🔍 Mô tả Lỗi
Khi chạy thử nghiệm tự động (E2E Selenium) trong môi trường phát triển cục bộ hoặc CI/CD, hệ thống sử dụng Mock Access Token (`mock-selenium-access-token-123`) để giả lập kết nối tài khoản YouTube.
Tuy nhiên, khi người dùng thực hiện tính năng tìm kiếm đối thủ cạnh tranh (Add Competitor), Backend Service (`youtube-competitor.service.js`) lại gọi trực tiếp API thật của Google/YouTube thay vì bypass thông qua mock data. Do Access Token giả lập không được chấp nhận bởi Google API, hệ thống lập tức trả về lỗi `401 Unauthorized`, làm treo modal tìm kiếm và lỗi E2E test.

## 🛠️ Hành vi Mong đợi
Nếu Access Token của tài khoản liên kết bắt đầu bằng tiền tố `mock-`, hoặc khi chạy ở môi trường TEST/CI, hệ thống phải tự động bypass cuộc gọi API thật của YouTube và trả về danh sách đối thủ giả lập (Mock Competitor List) để phục vụ quá trình test UI mà không bị crash.

## 📂 File bị ảnh hưởng
*   `backend/src/services/social/youtube/youtube-competitor.service.js`
*   `test_selenium/dashboard/youtube_dashboard.spec.js` (TC_YT_DB_07)

## 📝 Mã Test Tự động Liên quan
*   `TC_YT_DB_07: Kiểm tra tìm kiếm đối thủ cạnh tranh`
