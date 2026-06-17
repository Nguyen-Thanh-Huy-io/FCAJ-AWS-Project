| Test Case ID    | | TEAM_020 | Test Case Description | | Kiểm tra hiển thị loading spinner khi tải dữ liệu | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| Prerequisites: | Mạng kết nối ổn định, đang truy cập vào trang /manage/team. | | | | | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh rằng hệ thống hiển thị biểu tượng loading xoay tròn (spinner) trong khi chờ dữ liệu danh sách thành viên tải về từ API backend, đảm bảo người dùng biết tiến trình đang chạy. | | | | | | | | | |
| | | | | | | | | | | |
| Thao tác kiểm thử | | | Kết quả kỳ vọng | | Kết quả thực tế | | | Trạng thái (Pass/Fail...) | |
| | | | | | | | | | | |
| F5 làm mới trang hoặc chuyển đổi nhanh giữa các tab trong trang quản lý. | | | Trong khoảng thời gian ngắn (chờ API trả kết quả), một spinner xoay tròn hiển thị chính giữa màn hình bảng. Khi dữ liệu được nạp xong, spinner biến mất và danh sách thành viên hiện ra đầy đủ. | | Đúng như mong đợi (biểu tượng spinner hiển thị trong thời gian tải dữ liệu). | | | Pass | |
