| Test Case ID    | | MEDIA_004 | Test Case Description | | Validate giới hạn ký tự tối đa của nội dung bài viết (5000 ký tự) | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 17/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Not Executed | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đang mở modal Create Post. | | | | 1 | Văn bản mẫu dài 5005 ký tự | | | | |
| 2               | | | | | 2 | | | | | |
| 3               | | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Ngăn chặn người dùng nhập hoặc dán nội dung vượt quá giới hạn 5000 ký tự cho phép. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Mở modal 'Create new post'. | | Modal hiển thị thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Dán một đoạn văn bản mẫu dài 5005 ký tự vào ô soạn thảo. | | Đoạn văn bản được dán vào. | | Đúng như mong đợi | | | Pass | |
| 3               | Quan sát độ dài văn bản trong ô và bộ đếm ký tự. | | Hệ thống tự động cắt bỏ các ký tự từ thứ 5001 trở đi. Bộ đếm dừng lại ở mức '5000 / 5000'. | | Chưa thực hiện kiểm tra đầy đủ với dữ liệu biên 5000 ký tự thực tế. | | | Not Executed | |
