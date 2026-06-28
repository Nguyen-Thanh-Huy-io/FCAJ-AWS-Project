ID number
BUG_UC06_TEAM_NHA_03
Name
TEAM - Mời thành viên trùng địa chỉ Email có khoảng trắng không bị chặn (PC-55)
Reporter
Nhã
Submit Date
28/06/2026
Summary
Hệ thống cho phép gửi lời mời thành viên với địa chỉ email đã tồn tại trong thương hiệu nếu email đó chứa các khoảng trắng ở đầu hoặc cuối.
URL
http://localhost:5173/manage/team
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
Hệ thống cho phép gửi lời mời thành viên với địa chỉ email đã tồn tại trong thương hiệu nếu địa chỉ email đó chứa các khoảng trắng thừa (ví dụ: " test@gmail.com "). Khi gửi lời mời này, thay vì thông báo lỗi email đã tồn tại, hệ thống lại chấp nhận và tự động cập nhật vai trò của thành viên hiện tại có email đó, dẫn đến sai lệch quyền hạn.

Steps to reproduce
1. Đăng nhập vào hệ thống với vai trò quản trị viên.
2. Đi tới mục Quản lý đội ngũ (Team).
3. Nhập một email đã là thành viên trong đội ngũ nhưng thêm khoảng trắng ở đầu hoặc cuối (ví dụ: " test@gmail.com ") vào ô mời thành viên.
4. Chọn một vai trò khác và bấm gửi lời mời.
5. Quan sát phản hồi của hệ thống.

Expected result
Hệ thống loại bỏ các khoảng trắng thừa trong email trước khi kiểm tra và chặn gửi lời mời trùng lặp, hiển thị thông báo lỗi rõ ràng: "Email này đã tồn tại trong đội ngũ của bạn".

Actual result
Lời mời được gửi đi thành công, vai trò của thành viên cũ tự động bị thay đổi mà không có cảnh báo trùng lặp.

Notes
Hệ thống thiếu phần chuẩn hóa dữ liệu email đầu vào (loại bỏ khoảng trắng thừa ở đầu/cuối và chuyển về chữ thường) trước khi kiểm tra trùng lặp trên cơ sở dữ liệu.
