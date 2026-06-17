| Test Case ID    | | TEAM_009 | Test Case Description | | Tìm kiếm thành viên theo tên hoặc email | | | | | |
| --------------- | --- | ------- | --------------------- | --- | --------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Fail | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang /manage/team tab "Thành viên" | | | | 1 | "Guest" | | | | |
| 2               | Danh sách thành viên hiển thị 4 người như ban đầu | | | | 2 | "guest@gmail.com" | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh tính năng lọc kết quả tìm kiếm hoạt động khi người dùng gõ tên hoặc email thành viên. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Click vào ô tìm kiếm "Search by name or email...". | | Ô nhập nhận focus thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Nhập từ khóa "Guest" vào ô tìm kiếm và đợi 300ms (debounce). | | Danh sách thành viên được lọc tự động, chỉ hiển thị 1 dòng có tên "Guest Analyst". | | Tính năng tìm kiếm hoàn toàn không hoạt động. Danh sách thành viên vẫn hiển thị đầy đủ 4 người không đổi. | | | Fail | |
| 3               | Nhập từ khóa "guest@gmail.com" và quan sát. | | Danh sách được lọc, chỉ hiển thị dòng có email "guest@gmail.com". | | Not executed | | | Not executed | |
