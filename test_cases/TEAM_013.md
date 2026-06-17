| Test Case ID    | | TEAM_013 | Test Case Description | | Kiểm tra hiển thị màn hình trống khi không tìm thấy thành viên | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Fail | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang /manage/team tab "Thành viên" | | | | 1 | "xyz123" | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh hệ thống hiển thị đúng màn hình trống kèm thông báo và nút reset khi tìm kiếm từ khóa không khớp với bất kỳ thành viên nào. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Nhập từ khóa "xyz123" vào ô tìm kiếm "Search by name or email...". | | Lưới danh sách thành viên biến mất, hệ thống hiển thị màn hình trống với tiêu đề "No members found", mô tả "Try adjusting your search or filters" và nút "Reset All Filters". | | Danh sách thành viên vẫn hiển thị đầy đủ 4 người. Không có màn hình trống hay thông báo lỗi nào xuất hiện do tính năng tìm kiếm bị hỏng. | | | Fail | |
| 2               | Click nút "Reset All Filters" trên màn hình trống. | | Ô tìm kiếm được xóa trắng, lưới danh sách thành viên hiển thị lại đầy đủ 4 người ban đầu. | | Not executed | | | Not executed | |
