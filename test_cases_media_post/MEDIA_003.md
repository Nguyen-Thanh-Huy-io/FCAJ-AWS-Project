| Test Case ID    | | MEDIA_003 | Test Case Description | | Kiểm tra hiển thị bộ đếm ký tự thời gian thực khi nhập nội dung bài viết | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 17/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đang mở modal Create Post. | | | | 1 | Chuỗi văn bản 'Hello PubliCast' | | | | |
| 2               | | | | | 2 | | | | | |
| 3               | | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo bộ đếm ký tự ở góc dưới bên phải cập nhật chính xác số ký tự thực tế người dùng đã nhập. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Mở modal 'Create new post'. | | Modal hiển thị thành công, bộ đếm mặc định hiển thị '0 / 5000'. | | Đúng như mong đợi | | | Pass | |
| 2               | Nhập chuỗi văn bản 'Hello PubliCast' vào khung soạn thảo. | | Chuỗi văn bản hiển thị bình thường. | | Đúng như mong đợi | | | Pass | |
| 3               | Quan sát bộ đếm ký tự. | | Bộ đếm hiển thị chính xác '15 / 5000'. | | Hiển thị đúng '15 / 5000'. | | | Pass | |
| 4               | Xóa đi 5 ký tự cuối. | | Văn bản còn lại là 'Hello Publi'. | | Đúng như mong đợi | | | Pass | |
| 5               | Quan sát lại bộ đếm ký tự. | | Bộ đếm cập nhật giảm xuống còn '10 / 5000'. | | Hiển thị đúng '10 / 5000'. | | | Pass | |
