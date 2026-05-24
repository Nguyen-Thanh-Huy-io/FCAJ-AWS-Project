# Kiến Trúc Tích Hợp Mạng Xã Hội (Social Integration Architecture)

Tài liệu này mô tả chi tiết thiết kế kiến trúc hệ thống dịch vụ Social trong dự án **PubliCast**, các Design Patterns được áp dụng để đảm bảo nguyên lý **SOLID**, cấu trúc thư mục phân lớp, và sơ đồ tuần tự (Sequence Diagram) mô tả các luồng hoạt động chính.

---

## 1. Các Mẫu Thiết Kế Áp Dụng (Design Patterns)

Kiến trúc Social được xây dựng dựa trên sự kết hợp của 4 Design Patterns:

* **Strategy Pattern:** Định nghĩa giao diện chung thông qua `BaseSocialService`. Mỗi mạng xã hội (YouTube, Facebook, TikTok) là một Strategy cụ thể kế thừa lớp cơ sở này, cho phép thay thế linh hoạt mà không ảnh hưởng đến lớp gọi (Client).
* **Factory Pattern:** Sử dụng `SocialPlatformFactory` để quản lý các Service platform. Factory này quyết định động Service nào sẽ được khởi tạo dựa trên tham số `platform` (`YOUTUBE`, `FACEBOOK`,...), loại bỏ hoàn toàn các câu lệnh `if-else` cứng nhắc ở Controller hay `InboxService`.
* **Repository Pattern:** Tách biệt hoàn toàn tầng lưu trữ dữ liệu (Prisma ORM) khỏi tầng logic nghiệp vụ (Service Layer). Mọi thao tác ghi/đọc DB được thông qua các repository chuyên biệt (`inbox.repository.js`, `competitor.repository.js`, `tracked-video.repository.js`).
* **Gateway Pattern & Facade Pattern:** 
  * **Gateway:** Tạo lớp `YouTubeGateway` để đóng gói toàn bộ logic gọi Google SDK thô. Giúp giấu đi các chi tiết kết nối API phức tạp của bên thứ ba.
  * **Facade:** File `index.js` trong thư mục `youtube/` đóng vai trò là "mặt tiền", gom 3 sub-services chuyên biệt (`Analytics`, `Video`, `Comment`) thành một thực thể YouTubeService duy nhất để dễ dàng tương tác từ bên ngoài.

---

## 2. Cấu Trúc Thư Mục Phân Phối

Thư mục Social được tổ chức phân lớp theo cấu trúc **Platform-based**:

```text
backend/src/
├── repositories/social/
│   ├── social-account.repository.js  # Quản lý tài khoản mạng xã hội liên kết
│   ├── inbox.repository.js           # Quản lý tin nhắn, bình luận trong hộp thư chung
│   ├── tracked-video.repository.js   # Quản lý video được theo dõi
│   └── competitor.repository.js      # Quản lý phân tích đối thủ cạnh tranh
│
└── services/social/
    ├── base-social.service.js        # Giao diện chung (Base class)
    ├── social-platform.factory.js     # Factory khởi tạo và phân giải service động
    │
    └── youtube/                      # Module chuyên biệt cho YouTube
        ├── index.js                  # Facade kết hợp các sub-services con
        ├── youtube.gateway.js        # Tầng Gateway kết nối Google API SDK
        ├── youtube-analytics.service.js # Nghiệp vụ thông tin kênh & báo cáo số liệu
        ├── youtube-video.service.js  # Nghiệp vụ uploads & theo dõi video
        └── youtube-comment.service.js # Nghiệp vụ đồng bộ bình luận & phản hồi inbox
```

---

## 3. Sơ Đồ Tuần Tự (Sequence Diagrams)

### Luồng 1: Kết Nối Kênh YouTube (OAuth Connect Flow)
Luồng này mô tả quá trình trao đổi mã code OAuth để liên kết tài khoản YouTube của thương hiệu vào hệ thống.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Controller as SocialController
    participant Facade as YouTubeService (Facade)
    participant Service as YouTubeAnalyticsService
    participant Gateway as YouTubeGateway
    participant OAuth as GoogleOAuthService
    participant DB as SocialAccountRepository

    User->>Controller: Redirect callback (code, state/brandId)
    activate Controller
    Controller->>Facade: connectChannel(brandId, code, redirectUri)
    activate Facade
    Facade->>Service: connectChannel(brandId, code, redirectUri)
    activate Service
    
    Service->>OAuth: getTokens(code, redirectUri)
    activate OAuth
    OAuth-->>Service: Trả về access_token & refresh_token
    deactivate OAuth

    Service->>OAuth: createClient(redirectUri)
    OAuth-->>Service: Trả về authClient (OAuth2)
    
    Service->>Gateway: getChannelList(authClient, mine=true)
    activate Gateway
    Gateway-->>Service: Trả về dữ liệu kênh thô (items[0])
    deactivate Gateway

    Service->>Service: getChannelInfo() (Tổng hợp dữ liệu kênh & Analytics)
    Service->>DB: upsertYouTubeAccount(brandId, channelData, tokens)
    activate DB
    DB-->>Service: Lưu thành công (SocialAccount record)
    deactivate DB

    Service-->>Facade: Trả về kết quả liên kết
    deactivate Service
    Facade-->>Controller: Trả về kết quả liên kết
    deactivate Facade
    Controller-->>User: Redirect về giao diện frontend (success=youtube_connected)
    deactivate Controller
```

---

### Luồng 2: Đồng Bộ Bình Luận Mạng Xã Hội (Inbox Sync Flow)
Luồng này mô tả cách `InboxService` đồng bộ bình luận từ YouTube về Database chung bằng Factory và Gateway.

```mermaid
sequenceDiagram
    autonumber
    participant Scheduler as Scheduler / Client
    participant InboxSvc as InboxService
    participant Factory as SocialPlatformFactory
    participant Facade as YouTubeService (Facade)
    participant CommentSvc as YouTubeCommentService
    participant Gateway as YouTubeGateway
    participant DB as InboxRepository

    Scheduler->>InboxSvc: syncPlatformComments(brandId, platform="YOUTUBE")
    activate InboxSvc
    
    InboxSvc->>Factory: getService(platform)
    activate Factory
    Factory-->>InboxSvc: Trả về YouTubeService Facade instance
    deactivate Factory

    InboxSvc->>Facade: fetchChannelComments(brandId)
    activate Facade
    Facade->>CommentSvc: fetchChannelComments(brandId)
    activate CommentSvc

    CommentSvc->>DB: findOrCreateInbox(brandId)
    activate DB
    DB-->>CommentSvc: Trả về UnifiedInbox record
    deactivate DB

    CommentSvc->>Gateway: getCommentThreads(auth, channelId)
    activate Gateway
    Gateway-->>CommentSvc: Trả về danh sách comments thô từ Google
    deactivate Gateway

    loop Duyệt qua từng comment & replies
        CommentSvc->>DB: upsertInboxItem(...)
    end

    CommentSvc->>DB: updateInboxLastSync(inboxId)
    
    CommentSvc-->>Facade: Trả về danh sách items đã đồng bộ
    deactivate CommentSvc
    Facade-->>InboxSvc: Trả về danh sách items đã đồng bộ
    deactivate Facade
    InboxSvc-->>Scheduler: Đồng bộ thành công
    deactivate InboxSvc
```

---

## 4. Cách Mở Rộng Thêm Nền Tảng Mới (Ví dụ: Facebook)

Khi có yêu cầu tích hợp thêm Facebook, bạn chỉ cần thực hiện 3 bước sau mà không cần thay đổi bất kỳ code nghiệp vụ hiện tại nào ở Controller hay InboxService (Tuân thủ nguyên lý **OCP - Open/Closed Principle**):

1. **Tạo cấu trúc thư mục mới `src/services/social/facebook/`:**
   * `facebook.gateway.js`: Gọi Facebook Graph API SDK.
   * `facebook-comment.service.js`: Nghiệp vụ đồng bộ inbox từ Facebook.
   * `index.js`: Facade kế thừa `BaseSocialService`, gom và chuyển tiếp cuộc gọi.
2. **Đăng ký Service vào Factory (`src/services/social/social-platform.factory.js`):**
   ```javascript
   const facebookService = require('./facebook');
   
   // Trong constructor của SocialPlatformFactory:
   this.services.set(PLATFORMS.FACEBOOK, facebookService);
   ```
3. **Cập nhật hằng số nền tảng:** Đảm bảo `PLATFORMS.FACEBOOK` được định nghĩa trong `utils/constants.js`.

---

## 5. Kiến Trúc Lên Lịch & Tự Động Xuất Bản (Scheduling & Auto-Publishing)

Hệ thống đặt lịch xuất bản (Scheduling) sử dụng cơ chế kiến trúc phân tán với mô hình tự động quét nền (Background Worker), kết hợp khóa phân tán (Distributed Lock) qua Redis và cấu trúc lưu trữ đa hình (Polymorphic Metadata) để đảm bảo tính mở rộng và an toàn dữ liệu.

### 5.1 Cấu Trúc Dữ Liệu Đa Hình (Polymorphic Metadata)
Để tuân thủ nguyên lý **OCP (Open/Closed Principle)** và **ISP (Interface Segregation Principle)**, các cấu hình riêng biệt của từng mạng xã hội (như YouTube playlist, danh mục, chế độ làm cho trẻ em...) không được tạo thành các cột tĩnh trong bảng `Post`.
Thay vào đó, cột `metadata` kiểu `Text` lưu trữ chuỗi JSON cấu hình được map động:
* Khi lưu: Dữ liệu tùy chọn từ form Frontend được tuần tự hóa (Serialize) thành JSON string và lưu vào cột `metadata`.
* Khi xử lý/đăng bài: Dịch vụ `PostService` giải tuần tự hóa (Deserialize) trường `metadata` thành đối tượng `options` để truyền cho các Platform Service tương ứng.

### 5.2 Khóa Phân Tán Bằng Redis (Distributed Locking)
Để tránh việc cùng một bài viết hẹn giờ bị xuất bản trùng lặp (ví dụ: khi hệ thống Backend chạy song song nhiều cụm server/instance hoặc khi server bị restart đột ngột), hệ thống sử dụng cơ chế khóa phân tán với Redis:
1. Trước khi xử lý bài đăng, worker yêu cầu tạo khóa: `SET post:lock:<postId> "locked" NX EX 300` (khóa độc quyền tự hủy sau 5 phút).
2. Nếu Redis trả về `OK` (thành công), worker tiến hành đăng tải.
3. Nếu thất bại, worker bỏ qua bài viết để tránh xung đột dữ liệu.
4. Sau khi hoàn thành đăng tải (hoặc lỗi), khóa sẽ được xóa (`DEL`) để giải phóng tài nguyên.

### 5.3 Sơ Đồ Tuần Tự Tiến Trình Đăng Bài Ngầm (Scheduled Auto-Publish Flow)

```mermaid
sequenceDiagram
    autonumber
    participant Scheduler as PostSchedulerService (Background)
    participant Redis as Redis Server
    participant DB as Prisma (MySQL)
    participant PostSvc as PostService
    participant Factory as SocialPlatformFactory
    participant YT as YouTubeService (Facade)

    Note over Scheduler: --- Chạy ngầm định kỳ mỗi 60 giây ---
    Scheduler->>DB: findMany(status: SCHEDULED, scheduledAt <= Now)
    DB-->>Scheduler: Trả về danh sách bài đăng đến hạn
    
    loop Với mỗi bài đăng (post)
        Scheduler->>Redis: SET post:lock:<id> (NX: true, EX: 300)
        alt Khóa thành công (Lock Acquired)
            Redis-->>Scheduler: Trả về OK
            
            Scheduler->>PostSvc: publishToPlatforms(post.id)
            activate PostSvc
            
            PostSvc->>DB: Đọc bài đăng & parse metadata JSON
            DB-->>PostSvc: Post với options từ metadata
            
            loop Với mỗi platform trong targetPlatforms (vd: YOUTUBE)
                PostSvc->>Factory: getService(platform)
                Factory-->>PostSvc: Trả về YouTubeService
                
                PostSvc->>YT: publishPost(brandId, postData)
                activate YT
                YT-->>PostSvc: Trả về platformVideoId & videoUrl
                deactivate YT
            end
            
            PostSvc->>DB: updatePost(status: PUBLISHED, platformPostId, etc.)
            DB-->>PostSvc: Thành công
            
            PostSvc-->>Scheduler: Kết quả thành công
            deactivate PostSvc
            
            Scheduler->>Redis: DEL post:lock:<id>
            Redis-->>Scheduler: OK
            
        else Khóa thất bại (Lock Failed)
            Redis-->>Scheduler: Trả về null (Bỏ qua bài đăng này)
        end
    end
```
