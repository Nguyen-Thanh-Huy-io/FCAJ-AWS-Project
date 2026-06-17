| Test Case ID    | | TEAM_015 | Test Case Description | | Kiểm tra nút đóng (X) và Click-out của popup tạo vai trò | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang /manage/team tab "Vai trò tùy chỉnh" | | | | 1 | "Test Cancel" | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh popup đóng thành công và không lưu dữ liệu dở dang khi người dùng bấm nút X hoặc click ra ngoài vùng popup. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Click nút "Add Custom Role" để mở popup. | | Popup "Tạo vai trò tùy chỉnh" mở ra thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Nhập "Test Cancel" vào ô "Tên vai trò". | | Dữ liệu được ghi vào ô nhập thành công. | | Đúng như mong đợi | | | Pass | |
| 3               | Click nút đóng "X" ở góc trên bên phải của modal (hoặc click ra ngoài vùng modal). | | Popup đóng thành công, giao diện quay lại trang danh sách vai trò tùy chỉnh. | | Đúng như mong đợi | | | Pass | |
| 4               | Kiểm tra xem vai trò "Test Cancel" có xuất hiện trong danh sách vai trò tùy chỉnh hay không. | | Vai trò mới không được tạo và không xuất hiện trong danh sách. | | Đúng như mong đợi (danh sách không thay đổi). | | | Pass | |
