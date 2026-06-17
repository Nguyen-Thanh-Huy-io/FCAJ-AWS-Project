| Test Case ID    | | TEAM_004 | Test Case Description | | Validate bắt buộc nhập tên vai trò tùy chỉnh | | | | | |
| --------------- | --- | ------- | --------------------- | --- | --------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Người dùng đăng nhập hệ thống và đang ở trang /manage/team | | | | 1 | Không có | | | | |
| 2               | Người dùng có quyền quản trị thương hiệu | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo hệ thống báo lỗi khi người dùng tạo vai trò tùy chỉnh nhưng để trống tên vai trò. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Click chuyển sang tab "Vai trò tùy chỉnh". | | Giao diện tab "Vai trò tùy chỉnh" hiển thị thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Click nút "Add Custom Role" ở góc trên bên phải. | | Popup "Tạo vai trò tùy chỉnh" mở ra thành công. | | Đúng như mong đợi | | | Pass | |
| 3               | Để trống ô "Tên vai trò". | | Trường nhập tên vai trò không có dữ liệu. | | Đúng như mong đợi | | | Pass | |
| 4               | Nhập mô tả bất kỳ, chọn một màu đại diện và thiết lập một vài quyền. | | Các trường khác được điền dữ liệu thành công. | | Đúng như mong đợi | | | Pass | |
| 5               | Click nút "Lưu cấu hình vai trò". | | Hệ thống chặn không cho lưu và hiển thị thông báo lỗi: "Vui lòng điền tên vai trò". | | Xuất hiện toast báo lỗi: "Vui lòng điền tên vai trò". | | | Pass | |
