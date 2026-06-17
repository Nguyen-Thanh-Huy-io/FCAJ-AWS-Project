| Test Case ID    | | TEAM_023 | Test Case Description | | Chặn tự nâng vai trò qua API trực tiếp | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đang đăng nhập bằng tài khoản vai trò Member | | | | 1 | "Nha Vo" (Member) | | | | |
| 2               | Biết thông tin ID thành viên hoặc ID vai trò để gửi Request | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo Backend thực hiện kiểm tra phân quyền chặt chẽ trên API cập nhật thành viên, không cho phép Member tự nâng vai trò của mình. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Sử dụng công cụ (như Postman hoặc Fetch API trong Console trình duyệt) để gửi request cập nhật vai trò (PUT/PATCH) của chính bản thân lên Admin. | | Gửi request thành công đến API. | | Đúng như mong đợi | | | Pass | |
| 2               | Quan sát phản hồi từ server. | | Backend trả về mã lỗi 403 Forbidden hoặc 401 Unauthorized kèm thông báo lỗi phân quyền. CSDL không thay đổi vai trò của tài khoản này. | | Backend trả về lỗi 403 Forbidden chặn cập nhật thành công. | | | Pass | |
