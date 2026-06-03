# 📱 Tài Liệu Giao Diện TikTok (TikTok Frontend Documentation)

Tài liệu này mô tả chi tiết kiến trúc, các thành phần giao diện (UI Components), cấu trúc hooks và luồng dữ liệu của phân hệ **TikTok Dashboard** trên ứng dụng Frontend của PubliCast.

---

## 🏗️ Kiến Trúc Thành Phần (UI Component Hierarchy)

Giao diện thống kê TikTok được nhúng trực tiếp vào cấu trúc trang tổng quan thông qua `PlatformDashboard.jsx`. Sơ đồ phân cấp cấu trúc như sau:

```
PlatformDashboard.jsx (Container chính)
 └── TikTokDashboard.jsx (Điều hướng nội bộ TikTok)
      ├── TikTokPostsTab.jsx (Tab bài viết & số liệu tương tác video)
      └── TikTokCommunityTab.jsx (Tab cộng đồng & tăng trưởng người theo dõi)
```

---

## 🛠️ Chi Tiết Các Thành Phần Giao Diện (Components Detail)

### 1. `TikTokDashboard.jsx`
*   **Đường dẫn:** `src/pages/workspace/dashboard/TikTokDashboard.jsx`
*   **Chức năng:** Điều phối việc chuyển đổi qua lại giữa hai tab **POSTS** (Bài đăng) và **COMMUNITY** (Cộng đồng) bằng trạng thái `activeSubTab`. Nhận và chuyển tiếp các thuộc tính (props) như `dateRange` và `data` xuống các tab con.

### 2. `TikTokPostsTab.jsx`
*   **Đường dẫn:** `src/pages/workspace/dashboard/TikTokPostsTab.jsx`
*   **Chức năng:**
    *   **Thẻ chỉ số tổng hợp (Metrics Cards):** Hiển thị tổng Lượt xem (Views), Lượt thích (Likes), Bình luận (Comments), Chia sẻ (Shares) và Tỷ lệ tương tác (Engagement Rate) của toàn bộ video trong khoảng thời gian được lọc.
    *   **Biểu đồ Tương tác theo Thời gian:** Sử dụng thư viện `Recharts` (đường cong dạng sóng mịn - *monotone*) để trực quan hóa xu hướng tương tác.
    *   **Danh sách Video chi tiết:** Hiển thị danh mục video đã xuất bản với ảnh thu nhỏ (thumbnail), tiêu đề, ngày đăng và số liệu chi tiết của từng video.
*   **Xử lý Dữ liệu:** Sử dụng `React.useMemo` để lọc danh sách video theo thời gian thực dựa trên thuộc tính `dateRange` (`from`, `to`), giúp tăng tốc độ phản hồi giao diện và giảm số lượng cuộc gọi API thừa.

### 3. `TikTokCommunityTab.jsx`
*   **Đường dẫn:** `src/pages/workspace/dashboard/TikTokCommunityTab.jsx`
*   **Chức năng:**
    *   **Thống kê Tăng trưởng:** Trực quan hóa số lượng người theo dõi mới (Followers Gain) và sự thay đổi tổng số người theo dõi theo thời gian thông qua biểu đồ cột/đường kết hợp.
    *   **Phân tích Quốc gia & Giới tính:** Hiển thị biểu đồ phân bổ nhân khẩu học của lượng người xem TikTok kết nối thực tế.
*   **Đồng bộ dữ liệu:** Nhận dữ liệu phân tích lịch sử tích lũy được tính toán từ Backend để hiển thị biểu đồ xu hướng tăng trưởng tuyến tính chính xác.

---

## 🔄 Luồng Dữ Liệu & Trạng Thái (Data Flow & State Management)

1.  **Lập lịch Lấy Dữ liệu (Fetch API):**
    *   Khi người dùng truy cập trang, hook `usePlatformDashboard` sẽ thực hiện gửi yêu cầu `GET /api/social/metrics?platform=tiktok` kèm theo khoảng thời gian được chọn từ `DateRangePicker`.
2.  **Lọc dữ liệu tại Client (Client-side optimization):**
    *   Sau khi nhận dữ liệu thô, các tab con sẽ sử dụng `React.useMemo` để lọc dữ liệu theo khoảng ngày chính xác mà không cần tải lại toàn bộ trang, mang lại trải nghiệm mượt mà không độ trễ (Zero Latency).
3.  **Trạng thái Lỗi & Không có dữ liệu:**
    *   Nếu tài khoản TikTok chưa được liên kết hoặc hết hạn token, giao diện sẽ tự động hiển thị nút liên kết **Connect TikTok** kèm theo các cảnh báo chi tiết để hướng dẫn người dùng kết nối lại thông qua luồng OAuth.
