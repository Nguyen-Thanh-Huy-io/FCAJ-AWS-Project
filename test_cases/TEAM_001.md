| Test Case ID    | | TEAM_001 | Test Case Description | | Validate bắt buộc nhập Email khi gửi lời mời thành viên | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, truy cập thành công hệ thống | | | | 1 | Không có | | | | |
| 2               | Người dùng có quyền Owner hoặc Admin trong thương hiệu | | | | 2 | | | | | |
| 3               | Đang ở trang quản lý đội ngũ tại địa chỉ /manage/team | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo hệ thống báo lỗi khi người dùng cố tình gửi lời mời mà không nhập địa chỉ email. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Nhấp vào nút "Invite Member" ở góc trên bên phải trang để mở hộp thoại. | | Popup "Mời thành viên mới" hiển thị thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Để trống trường nhập "Địa chỉ Email". | | Trường nhập Email không chứa bất kỳ ký tự nào. | | Đúng như mong đợi | | | Pass | |
| 3               | Nhấp chọn một vai trò cộng tác bất kỳ (mặc định là Member). | | Vai trò được chọn thành công. | | Đúng như mong đợi | | | Pass | |
| 4               | Nhấp vào nút "Gửi lời mời tham gia". | | Lời mời không được gửi, hệ thống hiển thị thông báo lỗi: "Vui lòng nhập địa chỉ email". | | Hiển thị toast báo lỗi: "Vui lòng nhập địa chỉ email". | | | Pass | |
