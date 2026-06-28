# Kế hoạch kiểm thử tự động (Selenium E2E Test Plan) - Phân hệ Đăng bài & Đa phương tiện (Post & Media)

Tài liệu này tổng hợp toàn bộ các kịch bản kiểm thử E2E bằng Selenium WebDriver cho phân hệ Đăng bài (Publishing) và Thư viện đa phương tiện (Media Library) tương ứng với **UC08 (Tải lên và Tổ chức Media)**, **UC09 (Quản lý và Tìm kiếm Media)**, **UC10 (Soạn thảo & Tạo bài đăng)**, **UC11 (Quy trình Phê duyệt nội dung)**, và **UC13 (Quản lý Lịch biên tập)**.

## Danh sách Test Cases (Total: 11 Test Cases)

| Mã Test Case | Tên Test Case | Mô tả kịch bản | Kết quả mong đợi (Assertion) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **TC_POST_01** | Mở và đóng Post Creator Modal | Mở modal soạn thảo bài viết từ nút tạo bài và đóng lại. | Modal đóng/mở mượt mà, không xảy ra lỗi giao diện. | Đã triển khai |
| **TC_POST_02** | Chọn nhiều nền tảng và đổi tab | Chọn đồng thời nhiều kênh (Facebook, YouTube) và click chuyển đổi tab xem trước. | Giao diện hiển thị đúng tab cấu hình riêng biệt của từng nền tảng. | Đã triển khai |
| **TC_POST_03** | Menu tùy chọn xuất bản | Chọn các phương thức xuất bản khác nhau (Đăng ngay, Lên lịch, Lưu nháp). | Nhãn nút submit ở góc dưới modal thay đổi tương ứng. | Đã triển khai |
| **TC_POST_04** | Tạo bài viết nháp Facebook | Soạn nội dung caption Facebook, chọn Lưu nháp và gửi. | Bài đăng được lưu vào DB ở trạng thái DRAFT và hiển thị ở danh sách bài viết. | Đã triển khai |
| **TC_POST_05** | Tạo bài viết đa nền tảng | Tạo bài nháp đồng thời cho nhiều nền tảng và kiểm tra lưu DB. | Cột targetPlatforms trong DB lưu đúng mảng các nền tảng được chọn. | Đã triển khai |
| **TC_POST_06** | Giới hạn ký tự Threads | Nhập nội dung bài đăng vượt quá 500 ký tự trên kênh Threads. | Giao diện hiển thị cảnh báo đỏ và ngăn chặn submit. | Đã triển khai |
| **TC_POST_07** | Validate video trên YouTube | Thử xuất bản bài viết lên YouTube mà không chọn tệp video nào. | Hệ thống từ chối submit và thông báo yêu cầu đính kèm video. | Đã triển khai |
| **TC_POST_08** | Validate media trên TikTok | Thử xuất bản bài viết lên TikTok mà không chọn hình ảnh/video. | Hệ thống từ chối submit và thông báo yêu cầu đính kèm media. | Đã triển khai |
| **TC_POST_09** | Lên lịch đăng bài | Chọn thời gian đăng bài vào ngày mai và thực hiện Schedule. | Trạng thái chuyển sang SCHEDULED trong DB và hiển thị trên Lịch đăng. | Đã triển khai |
| **TC_POST_10** | Tải lên hình ảnh từ máy tính | Chọn file ảnh từ local máy tính và tải lên bài đăng Facebook. | Hiển thị ảnh preview thu nhỏ trên giao diện và lưu đúng URL Cloudinary. | Đã triển khai |
| **TC_POST_11** | Tải lên video từ máy tính | Chọn file video từ local máy tính và tải lên bài đăng YouTube. | Hiển thị video preview thu nhỏ trên giao diện và lưu đúng URL Cloudinary. | Đã triển khai |

---

## Môi trường & File kiểm thử
- **Môi trường**: Chrome (chạy headless trên CI)
- **Tập tin kiểm thử tương ứng**: `test_selenium/post_creator.spec.js`
