| Test Case ID    | | TEAM_011 | Test Case Description | | Kiểm tra chức năng làm mới bộ lọc (Clear Filters) | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Người dùng đang ở màn hình danh sách thành viên | | | | 1 | "Guest" | | | | |
| 2               | Đã thực hiện thao tác nhập từ khóa tìm kiếm hoặc bấm lọc vai trò | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh nút "Clear Filters" hiển thị khi có bộ lọc được kích hoạt và làm mới toàn bộ bộ lọc khi click. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Click chọn bộ lọc vai trò "OWNER" để URL xuất hiện tham số query và nút "Clear Filters" hiển thị. | | Nút "Clear Filters" màu xám hiển thị bên phải thanh bộ lọc. | | Đúng như mong đợi | | | Pass | |
| 2               | Click vào nút "Clear Filters". | | Các bộ lọc được gỡ bỏ, từ khóa tìm kiếm bị xóa, URL quay lại trạng thái mặc định không chứa query params, danh sách thành viên hiển thị đầy đủ. | | Đúng như mong đợi (các tham số URL biến mất, trạng thái nút được đưa về mặc định). | | | Pass | |
