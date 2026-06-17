# BÁO CÁO TỔNG HỢP KIỂM THỬ HỘP ĐEN - PHÂN HỆ MEDIA & POST PUBLISHING

Báo cáo này tổng hợp kết quả chạy 23 kịch bản kiểm thử (Test Cases) của module **Media & Post Publishing** và trạng thái lỗi (Bugs) được phát hiện trong quá trình kiểm thử hệ thống.

---

## 1. Nhật ký Kiểm thử Hệ thống (Test Cases Audit Trail)

Dưới đây là danh sách 23 Test Cases được sử dụng để đánh giá chức năng soạn thảo, lên lịch, quản lý phương tiện và đăng bài viết đa nền tảng.

| Mã Test Case | Tên Kịch Bản Kiểm Thử | Trạng Thái Audit | Ảnh Minh Họa / Mô Tả |
| :--- | :--- | :---: | :--- |
| **MEDIA_001** | Đóng/Mở modal "Create Post" từ trang Calendar thành công | **Pass** | Modal hiển thị và đóng trơn tru từ nút Close |
| **MEDIA_002** | Validate bắt buộc chọn ít nhất một tài khoản mạng xã hội | **Pass** | Nút đăng bị vô hiệu hóa khi không chọn mạng xã hội |
| **MEDIA_003** | Hiển thị bộ đếm ký tự thời gian thực khi soạn thảo | **Pass** | Số ký tự tăng giảm chính xác khi gõ văn bản |
| **MEDIA_004** | Validate giới hạn ký tự tối đa (5000 ký tự) | **Not Executed** | Chưa thực hiện kiểm tra biên vượt 5000 ký tự |
| **MEDIA_005** | Chọn và hủy chọn nhiều tài khoản mạng xã hội đồng thời | **Pass** | Cho phép chọn đồng thời Facebook, TikTok, YouTube |
| **MEDIA_006** | Đổi loại bài đăng Facebook sang Reel và đổi giao diện | **Pass** | Hiển thị thêm ô Title Reel và Facebook presets |
| **MEDIA_007** | Đổi loại bài đăng Facebook sang Story và đổi giao diện | **Not Executed** | Chưa kiểm thử luồng Story |
| **MEDIA_008** | Tải lên hình ảnh từ thiết bị cục bộ (Computer) thành công | **Pass** | Thumbnail hiển thị ở composer và Preview bên phải |
| **MEDIA_009** | Tải lên hình ảnh từ liên kết URL thành công | **Pass** | Import ảnh thành công từ đường link trực tiếp |
| **MEDIA_010** | Validate lỗi định dạng video đối với Facebook Reel | **Pass** | Báo lỗi: "Facebook Reel must be a video file." |
| **MEDIA_011** | Validate lỗi thiếu phương tiện đối với Facebook Reel | **Pass** | Báo lỗi: "Reel -> Add at least 1 video." |
| **MEDIA_012** | Xóa hình ảnh/video đã tải lên khỏi bài viết thành công | **Pass** | Gỡ bỏ phương tiện thành công bằng nút Remove |
| **MEDIA_013** | Hiển thị xem trước (Live Preview) trên Mobile/Desktop | **Pass** | Chuyển đổi tab xem trước giả lập mượt mà |
| **MEDIA_014** | Lên lịch đăng bài với ngày giờ trong tương lai thành công | **Pass** | Lưu lịch đăng bài vào cơ sở dữ liệu thành công |
| **MEDIA_015** | Validate lỗi lên lịch ngày giờ trong quá khứ | **Pass** | Báo lỗi: "Publish date can't be a past date." và vô hiệu hóa nút SCHEDULE |
| **MEDIA_016** | Đăng bài viết ngay lập tức (Publish Now) thành công | **Pass** | Đăng bài thành công không qua lịch hẹn |
| **MEDIA_017** | Lưu bài viết dưới dạng bản nháp (Save as Draft) thành công | **Pass** | Bài đăng được lưu vào DB với trạng thái Draft |
| **MEDIA_018** | Gửi bài viết phê duyệt (Send to Review) thành công | **Not Executed** | Chưa thực thi kiểm thử phê duyệt từ Reviewer |
| **MEDIA_019** | Lưu bài viết thành template vào thư viện bài viết | **Pass** | Checkbox Add to library hoạt động đúng |
| **MEDIA_020** | Tải lên nhiều tệp hình ảnh cùng lúc (Multiple upload) | **Not Executed** | Chưa kiểm thử tải hàng loạt ảnh |
| **MEDIA_021** | Kiểm tra tích hợp xem và chọn media từ Google Drive | **Not Executed** | Đòi hỏi API key và kết nối tài khoản Drive |
| **MEDIA_022** | Kiểm tra lỗi hiển thị tràn dropdown chèn Media khi cuộn modal | **Fail** | Dropdown bị che khuất và tràn khỏi viewport |
| **MEDIA_023** | Kiểm tra hiển thị bài đăng lên lịch trong Calendar | **Pass** | Bài đăng hiển thị đúng ô ngày trên Lịch biểu |

---

## 2. Báo cáo Chi tiết Lỗi Phát hiện (Detected Bugs)

Trong quá trình kiểm thử, một lỗi giao diện nghiêm trọng đã được phát hiện và ghi nhận dưới trạng thái **Open / Pending** (Chưa sửa lỗi theo yêu cầu của dự án để duy trì lịch sử kiểm thử).

### 🐛 BUG_MEDIA_022: Menu dropdown chọn nguồn phương tiện bị che khuất và tràn khỏi viewport khi modal được cuộn xuống
* **Trạng thái:** ⏳ **OPEN / PENDING**
* **Mức độ nghiêm trọng:** Major (Lỗi giao diện ảnh hưởng đến trải nghiệm người dùng, chặn chức năng tải media khi cuộn modal)
* **Nguyên nhân:** Lớp CSS định vị tĩnh `absolute bottom-full left-0 mb-2` của dropdown Media nằm trong container có cuộn (`overflow-y-auto`). Khi modal soạn thảo bị cuộn xuống cuối, nút ImageIcon dịch chuyển lên đầu viewport. Dropdown mở hướng lên trên dẫn đến việc bị đẩy ra ngoài biên màn hình (tọa độ Y âm).
* **Ảnh minh chứng lỗi:** ![Screenshot](./screenshots/create_post_modal_1781682373780.png)
* **Đề xuất khắc phục:** Sử dụng logic định vị động qua JavaScript (ví dụ: Floating UI / Popper.js) hoặc phát hiện bounds của viewport để tự động thay đổi lớp CSS (flip từ `bottom-full mb-2` thành `top-full mt-2` khi chạm biên trên).

---

## 3. Danh mục Tệp Hình ảnh Minh chứng (Screenshots)

Các hình ảnh chứng thực được lưu trữ tại thư mục dự án `d:\Fullit\projects\PubliCast\test_cases_media_post\screenshots\`:

1. `planner_calendar_main_1781682392394.png`: Giao diện lịch biểu Calendar chính của StreamHub.
2. `create_post_modal_1781682373780.png`: Giao diện modal soạn thảo bài viết "Create new post" và bố cục các trường nhập liệu.
3. `reel_validation_error_1781683129119.png`: Thông báo validation chặn định dạng hình ảnh cho Facebook Reel ("Facebook Reel must be a video file").
4. `posts_library_templates_1781682440460.png`: Giao diện thư viện bài viết mẫu (Posts library templates) lưu trữ các mẫu bài viết.
