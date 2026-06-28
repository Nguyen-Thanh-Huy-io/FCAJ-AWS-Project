# Kế hoạch Kiểm thử Tự động E2E - Module Post & Media (Đăng bài & Thư viện Media)

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Soạn thảo Đăng bài và Thư viện Media (`post_creator.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Thao tác Modal & Giao diện Soạn thảo
*   **TC_POST_01 – Verify Post Creator Modal can be opened and closed successfully**
    *   **Mã test Selenium**: `TC_POST_01` trong `post_creator.spec.js`
    *   **Mô tả**: Mở modal soạn thảo bài viết từ nút Lịch đăng (Planner) và đóng modal thành công.
    *   **Kết quả mong đợi**: Modal mở lên hiển thị input caption, khi bấm nút Close thì modal phải biến mất hoàn toàn khỏi DOM.
*   **TC_POST_02 – Verify multi-platform selection and active platform switcher**
    *   **Mã test Selenium**: `TC_POST_02` trong `post_creator.spec.js`
    *   **Mô tả**: Chọn đồng thời nhiều nền tảng mạng xã hội và bật/tắt lựa chọn các nền tảng (Facebook, Instagram, YouTube).
    *   **Kết quả mong đợi**: Trạng thái active/inactive của icon nền tảng cập nhật đúng khi click.
*   **TC_POST_03 – Verify publish options menu updates submit button label text**
    *   **Mã test Selenium**: `TC_POST_03` trong `post_creator.spec.js`
    *   **Mô tả**: Thay đổi tùy chọn xuất bản (ví dụ: chuyển từ Đăng ngay sang Lưu nháp).
    *   **Kết quả mong đợi**: Nhãn của nút Submit chính thay đổi tương ứng (ví dụ: chuyển sang chữ "Save" khi chọn Lưu nháp).

### 2. Soạn bài & Lưu cơ sở dữ liệu
*   **TC_POST_04 – Verify creating Facebook post draft saves caption to database and displays on List UI**
    *   **Mã test Selenium**: `TC_POST_04` trong `post_creator.spec.js`
    *   **Mô tả**: Tạo bài viết nháp cho Facebook, lưu xuống DB và kiểm tra xem có hiển thị trên danh sách Planner List UI không.
    *   **Kết quả mong đợi**: Bài đăng xuất hiện trên Planner List UI và bản ghi trong bảng `posts` có đúng caption và trạng thái DRAFT.
*   **TC_POST_05 – Verify multi-platform post draft saves targetPlatforms correctly in DB and displays on List UI**
    *   **Mã test Selenium**: `TC_POST_05` trong `post_creator.spec.js`
    *   **Mô tả**: Tạo một bài viết nháp đăng đồng thời lên nhiều nền tảng (Facebook, Instagram, Threads).
    *   **Kết quả mong đợi**: Cột `targetPlatforms` trong DB lưu trữ đúng chuỗi JSON/text chứa danh sách các platform được chọn, bài viết hiển thị trên List UI.

### 3. Ràng buộc & Validation Nền tảng (Platform Rules)
*   **TC_POST_06 – Verify character limits logic for Threads (500 chars limit)**
    *   **Mã test Selenium**: `TC_POST_06` trong `post_creator.spec.js`
    *   **Mô tả**: Kiểm tra ràng buộc giới hạn độ dài ký tự caption đối với nền tảng Threads (tối đa 500 ký tự).
    *   **Kết quả mong đợi**: Giao diện hiển thị cảnh báo hoặc chặn đăng bài khi viết quá 500 ký tự.
*   **TC_POST_07 – Verify platform validation blocks submission if YouTube has no video**
    *   **Mã test Selenium**: `TC_POST_07` trong `post_creator.spec.js`
    *   **Mô tả**: Xác minh hệ thống chặn không cho phép đăng bài lên YouTube nếu không đính kèm file video.
    *   **Kết quả mong đợi**: Submit bị chặn, modal soạn thảo vẫn hiển thị và thông báo lỗi đính kèm video xuất hiện.
*   **TC_POST_08 – Verify platform validation blocks submission if TikTok has no media**
    *   **Mã test Selenium**: `TC_POST_08` trong `post_creator.spec.js`
    *   **Mô tả**: Đảm bảo hệ thống chặn không cho phép đăng bài lên TikTok nếu không có tệp media (ảnh/video).
    *   **Kết quả mong đợi**: Nút submit bị chặn, yêu cầu đính kèm media trước khi tiếp tục.

### 4. Lập lịch đăng bài (Scheduling)
*   **TC_POST_09 – Verify scheduling a post for tomorrow saves scheduledAt correctly in DB and displays on List UI**
    *   **Mã test Selenium**: `TC_POST_09` trong `post_creator.spec.js`
    *   **Mô tả**: Lên lịch cho bài viết đăng vào ngày mai thông qua giao diện chọn ngày giờ.
    *   **Kết quả mong đợi**: Bài viết hiển thị trên Planner List UI và DB ghi nhận cột `scheduledAt` đúng thời gian đã chọn, trạng thái chuyển thành SCHEDULED.

### 5. Đính kèm & Tải lên tệp Media (Media Uploads)
*   **TC_POST_10 – Verify uploading an image file from local machine renders preview on Facebook post**
    *   **Mã test Selenium**: `TC_POST_10` trong `post_creator.spec.js`
    *   **Mô tả**: Tải lên một tệp hình ảnh từ máy cục bộ và kiểm tra ảnh preview hiển thị trong modal soạn thảo.
    *   **Kết quả mong đợi**: Thẻ img preview xuất hiện với URL tạm thời hoặc URL Cloudinary thành công.
*   **TC_POST_11 – Verify uploading a video file from local machine renders preview and saves to DB for YouTube post**
    *   **Mã test Selenium**: `TC_POST_11` trong `post_creator.spec.js`
    *   **Mô tả**: Tải lên một tệp video dung lượng lớn từ máy cục bộ, đợi trạng thái upload lên Cloudinary hoàn tất và lưu nháp bài viết YouTube.
    *   **Kết quả mong đợi**: Tên file video preview hiển thị, bài viết YouTube được lưu thành công vào DB kèm đường dẫn video.
