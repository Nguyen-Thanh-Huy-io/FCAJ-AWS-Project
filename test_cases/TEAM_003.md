| Test Case ID    | | TEAM_003 | Test Case Description | | Kiểm tra khoảng trắng thừa và trùng lặp email mời | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Fail | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, truy cập thành công hệ thống | | | | 1 | "  guest@gmail.com  " | | | | |
| 2               | Email guest@gmail.com đã tồn tại trong danh sách thành viên | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Kiểm tra xem hệ thống có tự động cắt khoảng trắng thừa (trim) và chặn gửi lời mời trùng lặp với email đã tồn tại hay không. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Nhấp vào nút "Invite Member" để mở hộp thoại. | | Popup "Mời thành viên mới" hiển thị thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Nhập chuỗi email có khoảng trắng ở đầu và cuối: "  guest@gmail.com  " vào ô nhập Email. | | Nhập dữ liệu thành công. | | Đúng như mong đợi | | | Pass | |
| 3               | Nhấp chọn một vai trò cộng tác bất kỳ (mặc định là Member). | | Vai trò được chọn thành công. | | Đúng như mong đợi | | | Pass | |
| 4               | Nhấp vào nút "Gửi lời mời tham gia". | | Lời mời không được gửi, hệ thống tự trim khoảng trắng và hiển thị thông báo lỗi báo trùng lặp: email đã tồn tại. | | Hệ thống trim khoảng trắng đúng, nhưng không báo lỗi trùng email, ngược lại tự động thay đổi vai trò của thành viên guest@gmail.com hiện tại thành "User". | | | Fail | |
