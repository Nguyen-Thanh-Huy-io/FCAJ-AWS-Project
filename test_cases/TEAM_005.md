| Test Case ID    | | TEAM_005 | Test Case Description | | Kiểm tra giới hạn độ dài tên vai trò tùy chỉnh | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ---------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Fail | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Người dùng đang ở màn hình tạo vai trò tùy chỉnh | | | | 1 | "RoleTestLengthNameVeryLong..." (100 ký tự) | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo hệ thống chặn và báo lỗi hoặc giới hạn độ dài của ô nhập khi tên vai trò vượt quá độ dài tối đa cho phép (thường là 50 ký tự). | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Nhập một tên vai trò có độ dài 100 ký tự vào ô "Tên vai trò". | | Ô nhập giới hạn không cho gõ tiếp khi đủ số ký tự hoặc hệ thống báo lỗi không hợp lệ. | | Nhập thành công 100 ký tự mà không bị giới hạn độ dài trên ô nhập. | | | Fail | |
| 2               | Click nút "Lưu cấu hình vai trò". | | Hệ thống chặn và báo lỗi tên vai trò quá dài. | | Not executed | | | Not executed | |
