ID number
BUG_UC05_BRAND_NHA_09
Name
BRAND - Nút Lưu thay đổi không tự động vô hiệu hóa khi thông tin thương hiệu không đổi (PC-51)
Reporter
Nhã
Submit Date
28/06/2026
Summary
Nút "Lưu thay đổi" vẫn ở trạng thái hoạt động cho phép người dùng click khi họ nhập lại chính xác tên cũ của thương hiệu (không có thay đổi nào so với ban đầu).
URL
http://localhost:5173/manage/connections
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
Low

Description
Tại trang cài đặt thương hiệu, khi người dùng thực hiện xóa tên thương hiệu hiện tại đi và nhập lại đúng tên ban đầu của thương hiệu đó, nút "Lưu thay đổi" vẫn sáng lên và cho phép click gửi yêu cầu cập nhật, thay vì phải tự động vô hiệu hóa để tránh gửi yêu cầu cập nhật vô ích lên hệ thống.

Steps to reproduce
1. Đăng nhập và truy cập trang cài đặt thương hiệu tại URL `/manage/connections`.
2. Định vị ô nhập tên thương hiệu (`data-testid="brand-name-input"`), xóa tên thương hiệu hiện tại và nhập lại chính xác tên cũ của thương hiệu đó.
3. Quan sát trạng thái hoạt động của nút "Lưu thay đổi" (`data-testid="save-brand-btn"`).

Expected result
Nút Lưu thay đổi phải tự động vô hiệu hóa (bị mờ đi và chặn click) khi tên thương hiệu nhập vào hoàn toàn trùng khớp với tên gốc hiện tại.

Actual result
Nút Lưu thay đổi vẫn ở trạng thái hoạt động và cho phép người dùng bấm lưu.

Notes
Giao diện thiếu logic so sánh dữ liệu nhập vào với dữ liệu ban đầu của thương hiệu để kiểm soát trạng thái bật/tắt hoạt động của nút lưu một cách linh hoạt.
