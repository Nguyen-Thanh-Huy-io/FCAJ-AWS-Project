| Test Case ID    | | TEAM_010 | Test Case Description | | Lọc thành viên theo vai trò cộng tác | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Fail | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang /manage/team tab "Thành viên" | | | | 1 | "OWNER" | | | | |
| 2               | Danh sách hiển thị đầy đủ các thành viên ban đầu | | | | 2 | "MEMBER" | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh hệ thống lọc đúng danh sách thành viên tương ứng với nút vai trò được chọn trên thanh lọc. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Click chọn nút lọc vai trò "OWNER" trên thanh lọc. | | Nút "OWNER" được chọn (active nền đen), URL cập nhật `?role=Owner`, danh sách thành viên chỉ hiển thị duy nhất người có vai trò Owner (Nhã Võ). | | Nút lọc đổi màu và URL cập nhật đúng tham số, nhưng danh sách thành viên không thay đổi (vẫn hiển thị toàn bộ 4 người). | | | Fail | |
| 2               | Click chọn nút lọc vai trò "MEMBER" trên thanh lọc. | | Nút "MEMBER" được chọn, URL cập nhật `?role=Member`, danh sách thành viên chỉ hiển thị những người có vai trò Member. | | Not executed | | | Not executed | |
