| Test Case ID    | | TEAM_021 | Test Case Description | | Chặn tài khoản Member truy cập trực tiếp trang quản lý | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đã có tài khoản vai trò Member (ví dụ: Nha Vo - vtn26xn@gmail.com) | | | | 1 | "Nha Vo" (Member) | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh rằng người dùng không có quyền quản trị (Member) bị chặn truy cập trực tiếp trang quản lý đội ngũ qua việc thay đổi URL trình duyệt. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Đăng nhập vào hệ thống bằng tài khoản của thành viên "Nha Vo" (vai trò Member). | | Đăng nhập thành công và hiển thị giao diện dashboard. Menu bên trái không hiển thị các mục quản lý như "Brand settings" hay "Team Management". | | Đúng như mong đợi | | | Pass | |
| 2               | Cố tình nhập trực tiếp địa chỉ `http://localhost:5173/manage/team` vào thanh địa chỉ trình duyệt và nhấn Enter. | | Hệ thống chặn quyền truy cập, hiển thị thông báo lỗi 403 Forbidden hoặc tự động chuyển hướng người dùng trở lại trang chủ/dashboard của thương hiệu. | | Hệ thống chặn và tự động chuyển hướng về trang chủ của thương hiệu. | | | Pass | |
