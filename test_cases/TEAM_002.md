| Test Case ID    | | TEAM_002 | Test Case Description | | Validate định dạng Email khi gửi lời mời thành viên | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Fail | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, truy cập thành công hệ thống | | | | 1 | "testemail" | | | | |
| 2               | Đang ở trang quản lý đội ngũ tại địa chỉ /manage/team | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo hệ thống chặn và báo lỗi khi người dùng nhập email không đúng định dạng. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Nhấp vào nút "Invite Member" để mở hộp thoại. | | Popup "Mời thành viên mới" hiển thị thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Nhập chuỗi "testemail" (không đúng định dạng email) vào ô "Địa chỉ Email". | | Nhập dữ liệu thành công vào ô nhập. | | Đúng như mong đợi | | | Pass | |
| 3               | Nhấp chọn một vai trò cộng tác bất kỳ (mặc định là Member). | | Vai trò được chọn thành công. | | Đúng như mong đợi | | | Pass | |
| 4               | Nhấp vào nút "Gửi lời mời tham gia". | | Lời mời không được gửi, hệ thống hiển thị thông báo lỗi định dạng email không hợp lệ. | | Lời mời gửi đi thành công, tạo một thành viên mới với email "testemail" mà không có bất kỳ thông báo lỗi nào. | | | Fail | |
