ID number
BUG_UC07_TEAM_NHA_08_C
Name
TEAM - Thành viên không có quyền vẫn truy cập được dữ liệu thống kê mạng xã hội (PC-54)
Reporter
Nhã
Submit Date
28/06/2026
Summary
Thành viên thuộc vai trò tùy chỉnh không được cấp quyền "Xem báo cáo" vẫn có thể lấy được dữ liệu chỉ số và biểu đồ thống kê mạng xã hội khi gửi yêu cầu trực tiếp đến đường dẫn API.
URL
http://localhost:5173/manage/reports
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
Khi một thành viên thuộc vai trò tùy chỉnh đã bị tắt quyền "Xem báo cáo (View Analytics)", việc truy cập giao diện Báo cáo trên ứng dụng bị chặn chính xác. Tuy nhiên, khi gửi trực tiếp yêu cầu lấy dữ liệu tới đường dẫn API thống kê của hệ thống, hệ thống vẫn trả về toàn bộ dữ liệu chỉ số mạng xã hội thay vì chặn lại. Lỗi này có nguy cơ rò rỉ dữ liệu chỉ số của thương hiệu.

Steps to reproduce
1. Đăng nhập bằng tài khoản thành viên bị hạn chế quyền `VIEW_ANALYTICS` (ví dụ: `testmember@gmail.com`).
2. Truy cập URL `/manage/reports` bằng tài khoản thành viên bị hạn chế quyền và thực hiện thao tác nhấp nút "Load Data" trên giao diện.
3. Gửi yêu cầu API lấy dữ liệu trực tiếp tới `GET /api/social/metrics?brandId=<brandId>&platform=YOUTUBE` bằng token của thành viên đó.
4. Kiểm tra phản hồi trả về từ hệ thống.

Expected result
Hệ thống chặn yêu cầu và trả về lỗi thông báo người dùng không có quyền truy cập thông tin này.

Actual result
Hệ thống vẫn phản hồi thành công và trả về toàn bộ thông tin thống kê mạng xã hội chi tiết.

Notes
Đường dẫn API lấy dữ liệu thống kê của thương hiệu trên máy chủ chưa được tích hợp bộ lọc kiểm tra quyền truy cập tương ứng với vai trò của người dùng.
