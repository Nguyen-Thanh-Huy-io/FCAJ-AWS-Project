| Test Case ID    | | TEAM_014 | Test Case Description | | Kiểm tra khóa tương tác cửa sổ cha khi mở popup | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ------------------------------------------------ | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| Prerequisites: | Trình duyệt đã mở, đang ở trang /manage/team | | | | | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh rằng người dùng không thể tương tác (click) với trang chính phía sau khi popup Invite Modal đang mở. | | | | | | | | | |
| | | | | | | | | | | |
| Thao tác kiểm thử | | | Kết quả kỳ vọng | | Kết quả thực tế | | | Trạng thái (Pass/Fail...) | |
| | | | | | | | | | | |
| 1. Click nút "Invite Member" để mở popup.<br>2. Thử click vào các nút lọc vai trò (OWNER, MEMBER) hoặc các mục trong menu bên trái. | | | Popup "Mời thành viên mới" hiển thị đè lên trên kèm lớp phủ nền mờ (backdrop). Người dùng không thể click vào bất kỳ phần tử nào bên dưới lớp phủ này. | | Hoạt động chính xác. Lớp phủ backdrop chặn hoàn toàn mọi tương tác chuột với trang cha. | | | Pass | |
