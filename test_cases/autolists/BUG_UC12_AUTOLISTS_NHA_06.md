ID number
BUG_UC12_AUTOLISTS_NHA_06
Name
AUTOLIST - Lỗi trôi lịch đăng bài (Schedule Drift) khi thay đổi hàng đợi (PC-52)
Reporter
Nhã
Submit Date
28/06/2026
Summary
Thời gian đăng bài của các bài viết nháp tiếp theo trong hàng đợi Autolist bị trôi lệch so với thời gian đăng dự kiến mỗi khi người dùng sắp xếp lại hoặc thêm mới bài viết.
URL
http://localhost:5173/autolists
Screenshot

Platform
Windows
Operating System
Windows 11
Browser
Chrome / Firefox
Severity
Major
Assigned to
Nhã
Priority
High

Description
Khi người dùng kéo thả, thay đổi thứ tự hoặc thêm bài viết mới vào hàng đợi Autolist, thời gian đăng bài được tính toán lại nhưng luôn lấy mốc thời gian hiện tại lúc thực hiện thao tác làm mốc tính. Điều này khiến khoảng cách đăng bài bị kéo dài ra, gây trôi lịch đăng bài so với dự kiến.

Steps to reproduce
1. Tạo một hàng đợi Autolist với khoảng cách đăng bài là 60 phút.
2. Thêm bài đăng và xuất bản bài đăng đầu tiên thành công.
3. Thêm một bài đăng nháp tiếp theo.
4. Đợi 15 phút, thực hiện kéo thả thay đổi vị trí hoặc chỉnh sửa bài viết trong hàng đợi để hệ thống tính toán lại thời gian.
5. Quan sát thời gian lên lịch đăng bài của bài viết nháp tiếp theo.

Expected result
Thời gian lên lịch đăng bài của bài viết nháp tiếp theo phải giữ đúng khoảng cách 60 phút tính từ thời điểm bài đăng trước đó được xuất bản.

Actual result
Lịch đăng bị đẩy lùi thêm 15 phút, tính từ thời điểm người dùng thực hiện kéo thả trên giao diện.

Notes
Hệ thống cần lấy mốc thời gian xuất bản của bài viết gần nhất làm mốc để tính lịch đăng cho bài viết nháp tiếp theo, thay vì lấy thời điểm hiện tại lúc thao tác.
