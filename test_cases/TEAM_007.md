| Test Case ID    | | TEAM_007 | Test Case Description | | Kiểm tra chuyển đổi giữa tab Thành viên và tab Vai trò tùy chỉnh | | | | | |
| --------------- | --- | ------- | --------------------- | --- | --------------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang /manage/team | | | | 1 | Không có | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo việc chuyển đổi qua lại giữa các tab diễn ra mượt mà, render đúng nội dung và cập nhật query parameter trên URL chính xác. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Quan sát trạng thái tab mặc định khi truy cập trang `/manage/team`. | | Tab "Thành viên" được kích hoạt (có gạch chân đen), URL hiển thị tham số `?tab=members`. | | Đúng như mong đợi | | | Pass | |
| 2               | Click chọn tab "Vai trò tùy chỉnh". | | Nội dung tab "Thành viên" biến mất, nội dung tab "Vai trò tùy chỉnh" (danh sách vai trò dạng thẻ card) xuất hiện; tab được kích hoạt gạch chân đen, URL đổi thành `?tab=roles`. | | Đúng như mong đợi | | | Pass | |
| 3               | Click quay lại tab "Thành viên". | | Hệ thống chuyển lại tab "Thành viên" mượt mà, hiển thị bảng danh sách thành viên, URL đổi lại thành `?tab=members`. | | Đúng như mong đợi | | | Pass | |
