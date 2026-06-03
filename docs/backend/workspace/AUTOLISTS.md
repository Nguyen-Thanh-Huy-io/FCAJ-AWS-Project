# 📅 Hệ Thống Lập Lịch Bài Đăng Tự Động (AutoLists System Backend)

Tài liệu này mô tả chi tiết kiến trúc, thiết kế cơ sở dữ liệu, các mẫu thiết kế và luồng xử lý hàng đợi tự động (AutoLists Queueing System) của dự án **PubliCast**.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture Overview)

Phân hệ AutoLists cho phép người dùng cấu hình một hàng đợi bài viết (Queue) của thương hiệu, tự động lập lịch xuất bản các bài đăng theo các chu kỳ hoặc khoảng thời gian định trước mà không cần lập lịch thủ công cho từng bài viết.

```
AutoListController (Routes / HTTP Requests)
      └── AutoListService (Business Logic Coordinator)
            ├── AutoListRepository (Data Access & Query Logic)
            ├── ScheduleStrategyFactory (Strategy Pattern for Time Slot calculation)
            └── BullMQ Queue (Publish Queue for execution scheduling)
```

---

## 💾 Thiết Kế Cơ Sở Dữ Liệu (Database Schema)

Hệ thống sử dụng hai mô hình chính liên kết chặt chẽ với nhau:

### 1. `AutoList` Model
Đại diện cho một hàng đợi lập lịch:
*   `scheduleType`: Kiểu lập lịch (ví dụ: `INTERVAL` - theo chu kỳ phút, hoặc `SPECIFIC_TIMES` - theo các mốc giờ cố định).
*   `intervalMinutes`: Khoảng thời gian giãn cách giữa các bài viết (áp dụng cho kiểu `INTERVAL`).
*   `specificTimes`: Mảng các khung giờ cụ thể trong ngày (áp dụng cho kiểu `SPECIFIC_TIMES`).
*   `activeDays`: Các ngày trong tuần được phép xuất bản bài viết.
*   `loopEnabled`: Kích hoạt chế độ lặp (tự động chuyển các bài đăng đã xuất bản về hàng chờ khi hàng đợi bị cạn kiệt).
*   `isActive`: Trạng thái kích hoạt (Nếu tắt, toàn bộ hàng đợi sẽ tạm ngưng).

### 2. `Post` Model
Các bài đăng liên kết với `AutoList` thông qua trường `autoListId`. Khi nằm trong hàng đợi, trạng thái của Post sẽ chuyển đổi linh hoạt:
*   `DRAFT` $\rightarrow$ `SCHEDULED` (Khi hàng đợi hoạt động).
*   `SCHEDULED` $\rightarrow$ `PUBLISHED` / `FAILED` (Khi đến giờ xuất bản).

---

## 🎨 Mẫu Thiết Kế Áp Dụng (Design Patterns)

### 1. Strategy Pattern (Chiến lược Lập lịch)
Hệ thống sử dụng mẫu thiết kế Chiến lược thông qua lớp `ScheduleStrategyFactory` để tính toán mốc thời gian đăng bài tiếp theo:
*   **`IntervalStrategy`:** Cộng dồn khoảng thời gian `intervalMinutes` vào mốc xuất bản trước đó để xác định mốc tiếp theo.
*   **`SpecificTimesStrategy`:** Phân phối bài đăng vào các khung giờ chính xác trong mảng `specificTimes` dựa theo thứ tự và ngày hoạt động hợp lệ.

### 2. Event-Driven Architecture (Kiến trúc Hướng Sự Kiện)
Sử dụng bộ phát sự kiện (`eventEmitter`) để thông báo các thay đổi của hàng đợi:
*   Sự kiện `AUTOLIST.CREATED` / `AUTOLIST.UPDATED` kích hoạt quy trình tính toán lại lịch trình (`recalculateQueueSchedules`).
*   Giúp tách biệt logic giữa API điều phối và các tác vụ xử lý nền.

---

## ⚙️ Luồng Tính Toán & Đẩy Hàng Đợi (Schedules Recalculation Flow)

1.  **Tính toán lại (`recalculateQueueSchedules`):**
    *   Lấy toàn bộ bài đăng chưa xuất bản (`status != PUBLISHED`).
    *   Gọi chiến lược lập lịch tương ứng để tạo ra danh sách mốc thời gian trống tiếp theo.
    *   Cập nhật `scheduledAt` và chuyển trạng thái các bài viết sang `SCHEDULED`.
2.  **Đẩy vào hàng đợi nền (BullMQ integration):**
    *   Với mỗi bài viết chuyển sang trạng thái `SCHEDULED`, hệ thống gọi hàm `upsertPublishJob(postId, scheduledAt)` để đẩy tác vụ lập lịch vào BullMQ.
    *   Nếu hàng đợi bị tạm dừng (`isActive = false`), các tác vụ tương ứng sẽ được gỡ khỏi hàng đợi thông qua `removePublishJob(postId)`.
3.  **Hỗ trợ Kéo thả sắp xếp (`reorderPosts`):**
    *   Khi người dùng thay đổi thứ tự ưu tiên của bài viết trên giao diện, Backend cập nhật lại dấu thời gian tạo (`createdAt`) của các bài đăng một cách tuần tự.
    *   Sau đó tự động gọi lại hàm `recalculateQueueSchedules` để sắp xếp lại mốc thời gian đăng bài của cả hàng đợi.
