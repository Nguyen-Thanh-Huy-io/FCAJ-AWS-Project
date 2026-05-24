# Kế hoạch Triển khai: Content Planner (Weekly Grid)

## 1. Mục tiêu (Objective)
Tái thiết kế trang **Content Planner** từ dạng lịch tháng hiện tại sang dạng **Weekly Grid (Lịch theo tuần)** chuyên nghiệp chuẩn Metricool, với trục Y là giờ trong ngày và trục X là các ngày trong tuần.

Đồng thời, áp dụng cấu trúc **Nested Routing (Định tuyến lồng nhau)** để quản lý các tab một cách tối ưu, giúp tách biệt logic và dễ dàng mở rộng.

---

## 2. Cấu trúc Routing (Đề xuất)

Để giải quyết yêu cầu "tối ưu" của bạn, thay vì dùng `useState` để chuyển tab trong 1 file khổng lồ, chúng ta sẽ chia trang Planner thành các route con (Sub-routes).

**Cấu hình trong `App.jsx`:**
```javascript
<Route path="/planner" element={<ProtectedRoute><PlannerLayout /></ProtectedRoute>}>
  <Route index element={<Navigate to="calendar" replace />} />
  <Route path="calendar" element={<WeeklyCalendarView />} />
  <Route path="list" element={<ListView />} />
  <Route path="library" element={<PostsLibraryView />} />
  <Route path="autolists" element={<AutoListsView />} />
  <Route path="history" element={<HistoryView />} /> {/* Deleted posts / History */}
</Route>
```

---

## 3. Kiến trúc Component (Frontend)

Chúng ta sẽ tạo một thư mục chuyên biệt `src/pages/workspace/planner/` và phân rã các component theo nguyên tắc SOLID:

### 3.1. `PlannerLayout.jsx` (Container Chính)
*   **Trách nhiệm**: Hiển thị Header Tabs (Calendar, List, Posts library, Autolists, Deleted posts).
*   **Thành phần**:
    *   **Upgrade Banner**: Banner màu vàng/xanh neon thông báo nâng cấp gói (hiển thị "0 out of your 20 available posts").
    *   **Outlet**: Nơi hiển thị nội dung của các route con (Calendar, List...).

### 3.2. `PlannerToolbar.jsx` (Thanh công cụ dùng chung)
*   **Trách nhiệm**: Chứa thanh tìm kiếm, bộ chuyển đổi thời gian ("This week", "<", ">", ngày tháng), bộ lọc, nút "Best times" và nút "+ Create post".
*   **Logic**: Sử dụng chung Custom Hook `useFilters` để đồng bộ URL Params.

### 3.3. `WeeklyCalendarView.jsx` (Tab Calendar - MVP)
*   **Trách nhiệm**: Vẽ lưới lịch tuần (Grid).
*   **Cấu trúc lưới (Grid CSS)**:
    *   Cột đầu tiên: Trục thời gian (12:00pm, 1:00pm... đến 6:00pm).
    *   7 cột tiếp theo: Các ngày trong tuần (Mon -> Sun).
*   **UI Elements**:
    *   Heatmap: Các ô màu xám đậm/nhạt hiển thị "Best times".
    *   Current Time Line: Đường kẻ ngang hiển thị thời gian thực.
    *   Draggable/Clickable Slots: Khung giờ có thể nhấn vào để tạo bài đăng.

### 3.4. `HistoryView.jsx` (Tab History / Deleted Posts)
*   **Trách nhiệm**: Hiển thị lịch sử các bài đã đăng hoặc các bài đã bị xóa, đáp ứng chính xác route `/planner/history` mà bạn đề xuất.

---

## 4. Tích hợp Backend (Data Flow)

Module `Post` ở Backend đã được đưa vào cấu trúc Modular mới (`src/modules/workspace/post/` hoặc tương tự tùy cấu trúc bạn đang có, hiện tại nó nằm trong `src/controllers/workspace/post.controller.js`).

1.  **Lấy bài đăng theo tuần**:
    *   Frontend sẽ tính toán `startDate` (Thứ 2 đầu tuần) và `endDate` (Chủ nhật cuối tuần) dựa trên thanh Toolbar.
    *   Gọi API `GET /api/posts?startDate=...&endDate=...`.
2.  **Best Time Slots (Khung giờ vàng)**:
    *   Tích hợp dữ liệu từ `bestTimeSlots` trong Database để render các ô màu xám đậm/nhạt trên lưới Lịch.

---

## 5. Lộ trình Thực hiện (Roadmap)

1.  **Bước 1**: Cập nhật `App.jsx` để thiết lập Nested Routing cho `/planner`.
2.  **Bước 2**: Tạo bộ khung Layout (`PlannerLayout`, Header Tabs, Upgrade Banner).
3.  **Bước 3**: Xây dựng thanh công cụ (`PlannerToolbar`) với thiết kế chuẩn Metricool.
4.  **Bước 4**: Triển khai lõi phức tạp nhất: **Weekly Grid View** với CSS Grid và trục thời gian.
5.  **Bước 5**: Kết nối API Backend để đổ dữ liệu bài đăng thực tế vào các khung giờ trên lưới.
