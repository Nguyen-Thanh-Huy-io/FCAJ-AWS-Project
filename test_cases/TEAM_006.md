| Test Case ID    | | TEAM_006 | Test Case Description | | Kiểm tra hiển thị trạng thái mờ (grayed out) của trường Email | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ------------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| Prerequisites: | Trình duyệt đã mở, đang ở trang /manage/team và có danh sách thành viên hiển thị. | | | | | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Kiểm tra thuộc tính hiển thị (Usability) của trường nhập Email khi cập nhật vai trò của thành viên hiện có. | | | | | | | | | |
| | | | | | | | | | | |
| Thao tác kiểm thử | | | Kết quả kỳ vọng | | Kết quả thực tế | | | Trạng thái (Pass/Fail...) | |
| | | | | | | | | | | |
| Mở Popup Quản lý vai trò (RoleModal) bằng cách click vào nút "More" (3 chấm) ở một thành viên trong danh sách và chọn quản lý vai trò. | | | Trường Email của thành viên đó được hiển thị ở dạng chỉ đọc (disabled/readonly), có màu nền xám mờ (grayed out) để báo hiệu người dùng không thể chỉnh sửa email tại đây. | | Trường email bị khóa (disabled), nền xám nhạt, không thể nhập liệu. | | | Pass | |
