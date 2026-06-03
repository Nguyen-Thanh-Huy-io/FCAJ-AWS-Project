# ✍️ Frontend: Giao Diện Lập Lịch & Tạo Bài Viết (Content Publishing)

Tài liệu này ghi nhận chi tiết thiết kế giao diện (UI), trải nghiệm người dùng (UX), các biến trạng thái, API tích hợp và luồng hoạt động thực tế của ba thành phần cốt lõi: **PostCreatorPage**, **AutoLists** và **ContentPlannerPage** từ mã nguồn Frontend của PubliCast.

---

## 🏗️ 1. Trình Tạo Bài Viết Đa Nền Tảng (`PostCreator.jsx`)

*   **Đường dẫn mã nguồn:** [PostCreator.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/PostCreator.jsx)
*   **Trạng thái kích hoạt:** Quản lý bởi hook `usePostCreatorForm()` thông qua biến `isOpen` (L156).

### A. Các Tùy Chọn Xuất Bản (Publish Options)
Mảng `PUBLISH_OPTIONS` (L24-29) định nghĩa 4 trạng thái lưu trữ/xuất bản bài viết:
1.  `draft`: Lưu dưới dạng bản nháp (Save as Draft).
2.  `review`: Gửi duyệt bài (Send to Review) - chuyển tiếp qua quy trình phê duyệt của thương hiệu.
3.  `schedule`: Lưu và đặt lịch xuất bản (Save and Schedule).
4.  `now`: Đăng ngay lập tức lên mạng xã hội (Publish Now).

### B. Cấu Hình Riêng Biệt Cho Từng Nền Tảng (Platform Presets)
Giao diện tự động mở rộng các khu vực nhập liệu chuyên biệt tùy theo nền tảng đang chọn (`activePlatform`):

*   **Facebook Preset (L225-316):**
    *   Hỗ trợ chuyển đổi qua lại giữa các định dạng: **Post** (Bài đăng chuẩn), **Reel** (Video ngắn), **Story** (Tin ngắn) qua biến `facebookType` (L104).
    *   Hộp thoại thiết lập Alt Text (`AltTextModal`) cho hình ảnh mô tả tiếp cận.
*   **TikTok Preset (L114-127):**
    *   Cấu hình quyền riêng tư hiển thị (`tiktokPrivacy`).
    *   Tùy chọn tương tác: Cho phép bình luận (`tiktokAllowComments`), Duet (`tiktokAllowDuet`), Stitch (`tiktokAllowStitch`).
    *   Khai báo thuộc tính: Đánh dấu nội dung do AI tạo (`tiktokAiGenerated`), Nội dung thương mại/quảng cáo (`tiktokCommercialContent`).
*   **YouTube Preset (L625-742):**
    *   Phân loại định dạng: **Video** hoặc **Short** qua biến `youtubeType` (L57).
    *   Nhập Tiêu đề video (`youtubeTitle` - giới hạn tối đa 100 ký tự).
    *   Cấu hình đối tượng khán giả trẻ em (`youtubeMadeForKids`), Cài đặt quyền riêng tư (`youtubePrivacy`), Danh mục video (`youtubeCategory`), Từ khóa (`youtubeTags`).
    *   Danh sách phát (`youtubePlaylistId`) đồng bộ qua nút Refresh liên kết API YouTube.

### C. Trình Chỉnh Sửa Hình Ảnh & Tải Lên Media (L427-486)
*   **Image Editor Modal:** Hỗ trợ xoay hình (`rotation`), lật ảnh ngang/dọc (`flipH`/`flipV`) và áp dụng các bộ lọc màu chuẩn: `grayscale`, `sepia`, `invert`, `blur-[2px]`, `warm`, `cool`, `dramatic` (L174-185).
*   **Media Dropdown:** Hỗ trợ tải tệp lên từ 4 nguồn: Máy tính (local upload), Thư viện hệ thống (Library), Google Drive (`GoogleDrivePickerModal`), hoặc Kho ảnh chuyên dụng.
*   **UTM Link Generator:** Tích hợp bộ tạo mã UTM (`UTMGeneratorPopover`) giúp chèn các đường dẫn theo dõi chiến dịch quảng cáo trực tiếp vào văn bản.

---

## ⏳ 2. Hàng Đợi Lập Lịch Tự Động (`AutoLists.jsx`)

*   **Đường dẫn mã nguồn:** [AutoLists.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/AutoLists.jsx)
*   **Mô tả:** Quản lý hàng đợi bài đăng thông qua danh sách `autoLists` cấu trúc tĩnh và bảng biên tập động.

### A. Cấu Trúc Trạng Thái Hàng Đợi
Mỗi hàng đợi AutoList bao gồm các thuộc tính hiển thị quan trọng (L4-35):
*   `name`: Tên hàng đợi.
*   `status`: Trạng thái hoạt động (`active` - đang chạy, `paused` - tạm ngưng).
*   `platforms`: Mảng biểu tượng các mạng xã hội liên kết (`YT`, `IG`, `TK`, `LI`, `X`).
*   `activeDays`: Các ngày trong tuần cho phép đăng bài (Mảng số từ 0 - 6, đại diện Thứ Hai đến Chủ Nhật).
*   `queueSize` & `lowQueue`: Số lượng bài viết đang chờ và cảnh báo cạn kiệt hàng đợi (`lowQueue = true` khi lượng bài đăng sắp hết).

### B. Bảng Cài Đặt Chi Tiết (Editor Panel - L154-233)
Khi người dùng bấm chọn một hàng đợi (`selectedList`), bảng điều khiển bên phải (Slide-over Panel) sẽ hiển thị để tùy chỉnh:
*   **Lập lịch thông minh (AI Best Times):** Công tắc `useAITimes` (L186) cho phép hệ thống tự động tính toán khung giờ có lượng tương tác cao nhất của từng mạng xã hội để đăng bài.
*   **Xem & Quản lý Hàng đợi (Queue):** Hiển thị danh sách tóm tắt các tiêu đề bài viết đang xếp hàng chờ xuất bản, hỗ trợ xóa nhanh bài đăng khỏi hàng đợi.
*   **Vòng lặp bài đăng (Recycle Queue):** Công tắc `activeRecycle` (L213) kích hoạt tự động đưa các bài đăng đã xuất bản thành công trở lại dạng bản nháp cuối hàng đợi khi hàng đợi trống.

---

## 📅 3. Lịch Lên Kế Hoạch Nội Dung (`ContentPlanner.jsx`)

*   **Đường dẫn mã nguồn:** [ContentPlanner.jsx](file:///D:/Fullit/projects/PubliCast/frontend/src/pages/workspace/ContentPlanner.jsx)

### A. Tích Hợp API Động Phía Máy Chủ (Server-Side Integration)
Trang tự động đồng bộ trạng thái bộ lọc của người dùng vào URL thông qua hook `useFilters` (L41).
*   API gọi dữ liệu: `GET /posts?${searchParamsString}` (L64) được kích hoạt lại mỗi khi tham số URL thay đổi, đồng bộ hóa trạng thái tải dữ liệu (`loading`).

### B. Hai Chế Độ Hiển Thị Giao Diện (View Modes)

#### 1. Chế độ Xem Lịch (Calendar View - L188-271)
*   Hiển thị lưới lịch 31 ngày (lấy tháng 5 năm 2025 làm chuẩn hiển thị).
*   **Phân bổ bài đăng:** Sử dụng `useMemo` (L78-92) nhóm các bài viết theo ngày tương ứng trong tháng.
*   **Hiển thị trực quan:** 
    *   Màu viền bên trái của thẻ bài đăng thể hiện mạng xã hội (`PLATFORM_COLORS` như YouTube: Đỏ, Facebook: Xanh dương, v.v.).
    *   Chấm tròn biểu thị trạng thái xuất bản (`STATUS_DOT` như `published` - Xanh lá, `scheduled` - Cam, `draft` - Xám, `rejected` - Đỏ).
*   **Menu ngữ cảnh (Context Menu - L347-375):** Nhấp chuột phải vào bài viết mở ra trình đơn thao tác nhanh: `Edit` (Chỉnh sửa), `Duplicate` (Nhân bản), `Reschedule` (Đổi lịch), `Send for Review` (Gửi duyệt), và `Delete` (Xóa).

#### 2. Chế độ Xem Danh Sách (List View - L273-344)
*   Hiển thị dưới dạng bảng dữ liệu tabular với các cột: Chọn lựa, Bài đăng (Thumbnail & Tiêu đề), Nền tảng mạng xã hội, Thời gian lập lịch (`scheduledAt`), Trạng thái (`status`), Người tạo (`creator`).
*   **Thao tác hàng loạt (Bulk Actions):** Chọn nhiều bài đăng để thực hiện lệnh đồng loạt: `Approve`, `Reject`, `Delete`, `Reschedule` (L278-282).
