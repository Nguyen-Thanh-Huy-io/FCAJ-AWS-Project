ID number
BUG_UC05_UC16_DASHBOARD_NHA_10
Name
DASHBOARD - Tên thương hiệu hiển thị bị tràn ra ngoài widget ACTIVE BRAND (PC-56)
Reporter
Nhã
Submit Date
28/06/2026
Summary
Tên thương hiệu khi quá dài (liền nhau không khoảng trắng) sẽ tràn ra ngoài phần viền của widget hiển thị thương hiệu ở góc trên bên phải Dashboard, đè lên nhãn trạng thái.
URL
http://localhost:5173/dashboard
Screenshot

Platform
Windows
Operating System
Windows 11
Browser
Chrome / Firefox
Severity
Minor
Assigned to
Nhã
Priority
Medium

Description
Khi chọn một thương hiệu có tên rất dài, phần văn bản hiển thị tên thương hiệu trên widget góc trên cùng bên phải màn hình Dashboard bị kéo dài quá mức, tràn ra khỏi viền bao quanh của thẻ và đè lên nhãn hiển thị trạng thái "Selected". Lỗi này gây mất mỹ quan giao diện.

Steps to reproduce
1. Đăng nhập vào hệ thống, truy cập trang Dashboard tại URL `/dashboard`.
2. Tạo mới hoặc cập nhật tên thương hiệu hiện tại thành một chuỗi cực kỳ dài: `SeleniumBrandWithNameThatIsExtremelyLongAndShouldBeTruncatedWithEllipsisOrWordBreak_123456789`.
3. Thực hiện làm mới (refresh) trang trình duyệt và quan sát widget hiển thị tên thương hiệu đang hoạt động ở góc trên bên phải.

Expected result
Tên thương hiệu dài hiển thị gọn gàng bên trong widget, tự động xuống dòng hoặc cắt bớt để bảo đảm mỹ quan.

Actual result
Chữ hiển thị bị tràn ra ngoài viền widget và đè lên nhãn trạng thái bên cạnh.

Notes
Giao diện thiếu thuộc tính co dãn hoặc xuống dòng tự động cho phần chữ hiển thị tên thương hiệu trong thẻ widget.
