# Kế hoạch Triển khai: Viewed Videos & Competitors (YouTube)

## 1. Mục tiêu (Objective)
Triển khai hai tính năng quan trọng còn thiếu trên YouTube Dashboard:
1. **Viewed Videos (Start Tracking):** Cho phép người dùng nhập URL hoặc ID của một video YouTube bất kỳ để theo dõi hiệu suất chuyên sâu (Views, Likes, Comments) theo thời gian thực.
2. **Competitors (Real Data):** Hoàn thiện tab Đối thủ bằng cách cho phép tìm kiếm, thêm đối thủ và lấy dữ liệu thật (Subscribers, Views, Video Count) từ YouTube API.

---

## 2. Cập nhật Cơ sở dữ liệu (Database Schema)
Chúng ta sẽ cần cập nhật `backend/prisma/schema.prisma` để hỗ trợ tính năng theo dõi video.

*   **Model mới: `TrackedVideo`**
    ```prisma
    model TrackedVideo {
      id              String   @id @default(uuid())
      brandId         String
      platform        PlatformType @default(YOUTUBE)
      videoId         String   // YouTube Video ID
      title           String?
      thumbnailUrl    String?
      channelId       String?
      channelName     String?
      publishedAt     DateTime?
      lastViews       Int      @default(0)
      lastLikes       Int      @default(0)
      lastComments    Int      @default(0)
      isTracking      Boolean  @default(true)
      addedAt         DateTime @default(now())
      lastSyncedAt    DateTime?

      brand Brand @relation(fields: [brandId], references: [id], onDelete: Cascade)

      @@unique([brandId, videoId])
      @@index([brandId])
      @@map("tracked_videos")
    }
    ```
*   (Model `CompetitorAnalysis` đã có sẵn, chỉ cần tận dụng lại).

---

## 3. Sequence Diagrams (Quy trình hoạt động)

### 3.1. Tính năng Viewed Videos (Theo dõi Video)
```mermaid
sequenceDiagram
    actor Manager
    participant UI as Dashboard UI
    participant API as Backend (Social Controller)
    participant YT as YouTube Service
    participant DB as Prisma (DB)
    participant Google as YouTube Data API v3

    Manager->>UI: Click "Start Tracking" & Paste URL
    UI->>API: POST /api/social/youtube/track (brandId, videoUrl)
    API->>YT: parseVideoId(videoUrl)
    YT->>Google: GET /videos?id={videoId}&part=snippet,statistics
    Google-->>YT: Return Video Data
    YT->>DB: Upsert TrackedVideo
    DB-->>YT: Success
    YT-->>API: TrackedVideo Data
    API-->>UI: Return Success & New Data
    UI->>Manager: Update "Viewed Videos" List
```

### 3.2. Tính năng Competitors (Thêm Đối thủ)
```mermaid
sequenceDiagram
    actor Manager
    participant UI as Dashboard UI
    participant API as Backend (Social Controller)
    participant YT as YouTube Service
    participant DB as Prisma (DB)
    participant Google as YouTube Data API v3

    Manager->>UI: Click "ADD COMPETITOR" & Search Handle
    UI->>API: POST /api/social/youtube/competitors (brandId, handle)
    API->>YT: searchChannel(handle)
    YT->>Google: GET /search?q={handle}&type=channel
    Google-->>YT: Return Channel Info
    YT->>Google: GET /channels?id={channelId}&part=statistics
    Google-->>YT: Return Channel Stats
    YT->>DB: Create CompetitorAnalysis
    DB-->>YT: Success
    YT-->>API: Competitor Data
    API-->>UI: Return Success
    UI->>Manager: Update "Competitors" Table
```

---

## 4. Kế hoạch Code Backend (Node.js/Express)
1.  **Cập nhật `youtube.service.js`:**
    *   Thêm hàm `trackVideo(brandId, videoId)`: Gọi YouTube API để lấy thông tin video và lưu vào DB.
    *   Thêm hàm `addCompetitor(brandId, handle)`: Tìm kiếm kênh và lưu số liệu đối thủ.
    *   Thêm hàm `getTrackedVideos(brandId)` và `getCompetitors(brandId)`.
2.  **Cập nhật `social.controller.js` & `social.routes.js`:**
    *   Tạo các endpoint POST/GET tương ứng để Frontend có thể gọi.

---

## 5. Kế hoạch Code Frontend (React/Vite)
1.  **Cập nhật `social.service.js`:**
    *   Thêm các hàm gọi API: `addTrackedVideo`, `getTrackedVideos`, `addCompetitor`, `getCompetitors`.
2.  **Cập nhật `PlatformDashboard.jsx`:**
    *   **Viewed Videos Tab:** 
        *   Tạo nút "Start Tracking".
        *   Khi nhấn, hiện Modal (Dialog) nhập URL.
        *   Hiển thị danh sách Video đã track thay vì Placeholder.
    *   **Competitors Tab:**
        *   Thêm Modal (Dialog) "Add Competitor".
        *   Khi thêm thành công, tải lại danh sách từ Backend thay vì dùng Mock Data.