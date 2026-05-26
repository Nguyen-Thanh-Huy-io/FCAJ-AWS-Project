# Báo cáo Refactoring Backend: Hành trình đến "Zen Architecture"

Tài liệu này tổng hợp toàn bộ các công việc refactoring đã thực hiện để đưa hệ thống Backend của PubliCast đạt đến trạng thái **"Zen Architecture"** - một kiến trúc thuần khiết, tuân thủ tuyệt đối các nguyên lý SOLID, Clean Architecture và không còn "Magic Strings".

## 1. Mục tiêu Cốt lõi
*   **Decoupling (Giải phóng phụ thuộc):** Tách biệt hoàn toàn Business Logic khỏi Database Driver (Prisma) và các External APIs (Facebook, YouTube).
*   **Zero Magic Strings:** Tập trung hóa 100% các chuỗi ký tự kỹ thuật, cấu hình, phiên bản API vào một file cấu hình duy nhất.
*   **Plug-and-Play (Mở rộng dễ dàng):** Thiết kế hệ thống sao cho việc thêm tính năng mới (nền tảng mới, bộ lọc mới, chiến lược mới) không yêu cầu sửa đổi code cũ (Open/Closed Principle).

## 2. Các Thành tựu Chính (Milestones)

### 2.1. Chuẩn hóa Kiến trúc (100% SOLID Compliance)
*   **Single Responsibility Principle (SRP):** Mọi class và file đều có một trách nhiệm duy nhất rõ ràng.
    *   **Gateways:** Chuyên trách giao tiếp HTTP với các API bên ngoài (Facebook Graph API, YouTube Data API).
    *   **Repositories:** Đóng vai trò là cửa ngõ duy nhất (Data Access Layer) giao tiếp với Database qua Prisma.
    *   **Services:** Thuần túy chứa Business Logic.
*   **Dependency Inversion Principle (DIP):** Các `Services` không còn gọi trực tiếp `prisma`. Mọi thao tác dữ liệu đều đi qua `Repositories`. Điều này giúp hệ thống dễ dàng Unit Test và có thể thay đổi ORM/Database trong tương lai mà không ảnh hưởng logic.

### 2.2. Triệt tiêu Magic Strings (Zero Magic Strings)
Tất cả các chuỗi ký tự rải rác trong mã nguồn đã được gom về file `src/utils/constants.js`. Các nhóm cấu hình bao gồm:
*   **Hệ thống API Versions:** `API_VERSIONS` (`v25.0` cho FB, `v3` cho YouTube API, `v2` cho YT Analytics).
*   **Cấu hình hệ thống (Defaults):** `DEFAULT_CONFIG` (Locale `vi-VN`, Timezone `Asia/Ho_Chi_Minh`, `WORKSPACE_DEFAULTS`).
*   **Kỹ thuật mạng xã hội (Social Technical):** `SOCIAL_TECHNICAL` (Định dạng file đính kèm FB, nhãn Inbox), `YOUTUBE_PART`, `YOUTUBE_RESOURCE`.
*   **Metrics & Analytics:** `ANALYTICS.METRICS`, `ANALYTICS.DIMENSIONS`, `ANALYTICS.SORT`.
*   **Phân loại chung:** `POST_TYPES`, `POST_STATUS`, `SYSTEM_LABELS`.

### 2.3. Áp dụng Design Patterns nâng cao
Để loại bỏ các cấu trúc `if/else` và `switch/case` khổng lồ, hàng loạt Design Patterns đã được đưa vào hệ thống:
*   **Strategy Pattern:**
    *   `SearchService`: Tách biệt logic tìm kiếm cho Admin (`AdminSearchStrategy`) và User (`UserSearchStrategy`).
    *   `EmailService`: Cho phép dễ dàng thay đổi nhà cung cấp gửi email (`NodemailerStrategy`).
    *   `FacebookPublishStrategy`: Tách biệt logic đăng bài theo định dạng (Video, Photo, Reel, Story, Text).
    *   `AutoListScheduleStrategy`: Xử lý việc lập lịch theo Interval hoặc Specific Times.
*   **Pipeline Pattern:**
    *   `PostService`: Quy trình đăng bài được module hóa thành các bước: `FetchPostStep` -> `SocialPublishStep` -> `UpdatePostStatusStep`.
    *   `QueryPipeline`: Áp dụng cho toàn bộ các tác vụ lấy dữ liệu (Livestream, Post, Team, Inbox, Media). Mỗi filter (Search, Status, DateRange) là một class độc lập, giúp query DB linh hoạt.
*   **Factory Pattern:**
    *   `SocialPlatformFactory`: Nơi duy nhất điều phối việc gọi Service của các nền tảng (Facebook, YouTube).
    *   `FacebookPublishStrategyFactory`: Trả về chiến lược đăng bài tương ứng với loại nội dung.

### 2.4. Khắc phục Bug & Tăng cường Robustness
Trong quá trình refactor, nhiều lỗi tiềm ẩn và logic sai lệch đã được giải quyết:
*   **Sửa lỗi PrismaClientValidationError:** Ở `SocialAccountRepository`, xử lý linh hoạt tham số `where` để tránh truyền giá trị `null` vào bộ lọc `platform`, khắc phục lỗi crash khi đồng bộ metrics toàn hệ thống.
*   **Sửa lỗi YouTube Analytics "Invalid argument":** Phương thức `search.list` của YouTube không hỗ trợ kết hợp `forMine: true` với `publishedAfter`. Đã refactor sang việc sử dụng danh sách video từ Playlist `uploads` mặc định của kênh. Vừa triệt để sửa lỗi, vừa tiết kiệm Quota API.
*   **Robust Media Handling:** Sử dụng array method (`some`) kết hợp với `MEDIA_EXTENSIONS` thay vì kiểm tra đuôi file thủ công bằng string literals (`.mp4`, `.mov`).

## 3. Lợi ích mang lại
Kiến trúc hiện tại đã ở trạng thái **Plug-and-Play**:
*   **Bảo trì dễ dàng:** Lỗi nằm ở đâu, khoanh vùng ở đó. Sửa API Facebook chỉ cần vào file Gateway của Facebook. Sửa query lấy bài viết chỉ cần sửa file Filter tương ứng.
*   **Thêm tính năng an toàn (OCP):** Khi tích hợp nền tảng mới (ví dụ TikTok), chỉ cần tạo thư mục `tiktok`, implement các class kế thừa từ `BaseSocialService`, và khai báo tên vào `constants.js` + `SocialPlatformFactory`. Toàn bộ luồng đăng bài, inbox, phân tích tự động hoạt động mà không cần sửa code cốt lõi.

---
*Tài liệu được sinh tự động sau đợt Refactoring hệ thống. Kiến trúc hiện tại sẵn sàng 100% để phục vụ việc tích hợp UI Frontend và Mở rộng tính năng trong tương lai.*