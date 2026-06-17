| Test Case ID    | | TEAM_022 | Test Case Description | | Chặn chỉnh sửa hoặc xóa tài khoản của OWNER | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Người dùng đang đăng nhập bằng một tài khoản có vai trò Admin (không phải Owner) | | | | 1 | "Nha Vo" (Admin) | | | | |
| 2               | Thành viên có vai trò OWNER đang hiển thị trong danh sách thành viên | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh rằng vai trò Owner của thương hiệu không thể bị sửa đổi hoặc xóa bỏ bởi bất kỳ thành viên nào khác, kể cả Admin. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Truy cập trang `/manage/team`. | | Giao diện danh sách thành viên hiển thị đầy đủ. | | Đúng như mong đợi | | | Pass | |
| 2               | Tìm đến dòng hiển thị thành viên "Nhã Võ" (vai trò Owner). | | Tìm thấy thành viên đúng như mô tả. | | Đúng như mong đợi | | | Pass | |
| 3               | Quan sát cột thao tác cuối dòng của thành viên Owner. | | Nút thao tác (3 chấm) không hiển thị hoặc bị vô hiệu hóa đối với dòng của Owner, ngăn chặn việc bấm vào để chỉnh sửa vai trò hay xóa tài khoản này. | | Đúng như mong đợi (nút 3 chấm bị ẩn hoàn toàn ở dòng của Owner Nhã Võ). | | | Pass | |
