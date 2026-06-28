ID number
BUG_UC08_UC10_POST_MEDIA_NHA_POST_UI_029
Name
POST_MEDIA - Máy chủ bị dừng hoạt động khi người dùng tải lên tệp video không hợp lệ (PC-57)
Reporter
Nhã
Submit Date
28/06/2026
Summary
Khi người dùng tải lên tệp video bị lỗi hoặc không đúng định dạng nén chuẩn cho bài đăng YouTube, hệ thống máy chủ bị dừng hoạt động đột ngột làm mất phiên kết nối của toàn bộ người dùng khác.
URL
http://localhost:5173/planner/calendar
Screenshot

Platform
Windows
Operating System
Windows 11
Browser
Chrome / Firefox
Severity
Critical
Assigned to
Nhã
Priority
High

Description
Khi người dùng tạo một bài đăng YouTube và đính kèm tải lên một tệp tin video bị lỗi (ví dụ tệp video giả lập chỉ có kích thước vài bytes và không chứa nội dung giải mã video hợp lệ), hệ thống xử lý tệp tin ở máy chủ gặp lỗi ngoại lệ nhưng không được xử lý an sau. Lỗi này làm cho ứng dụng máy chủ bị sập đột ngột, dẫn đến việc toàn bộ người dùng khác đang làm việc trên hệ thống bị mất phiên đăng nhập và bị đẩy ra màn hình đăng nhập.

Steps to reproduce
1. Mở tính năng tạo bài viết mới và chọn nền tảng YouTube.
2. Chọn đính kèm và tải lên một tệp tin video giả lập hoặc tệp bị hỏng (kích thước vài bytes không có định dạng nén video hợp lệ).
3. Bấm xác nhận gửi để lưu bài viết.
4. Quan sát trạng thái hoạt động của máy chủ hệ thống.

Expected result
Hệ thống xử lý lỗi tệp tin an toàn, chặn tệp tin lỗi và hiển thị thông báo lỗi rõ ràng trên giao diện cho người dùng, bảo đảm máy chủ tiếp tục hoạt động ổn định.

Actual result
Máy chủ bị sập đột ngột và tự khởi động lại, làm gián đoạn kết nối và tự động đăng xuất toàn bộ người dùng khác.

Notes
Hệ thống máy chủ xử lý tác vụ tải lên và xử lý tệp tin đa phương tiện thiếu bộ lọc bắt lỗi ngoại lệ để phản hồi an toàn thay vì làm dừng tiến trình của chương trình.
