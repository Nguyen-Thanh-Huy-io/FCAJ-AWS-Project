| Test Case ID    | | MEDIA_014 | Test Case Description | | Lên lịch đăng bài với ngày giờ trong tương lai thành công | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 17/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đang ở modal Create Post. | | | | 1 | Thời gian ngày mai 09:00 AM | | | | |
| 2               | | | | | 2 | | | | | |
| 3               | | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Kiểm tra tính năng hẹn giờ đăng bài viết tại một thời điểm xác định trong tương lai. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Mở bảng Date-picker và chọn một ngày giờ trong tương lai (ví dụ: ngày mai lúc 09:00 AM). | | Thời gian được chọn thành công. Nút hành động chính đổi nhãn từ 'PUBLISH' sang 'SCHEDULE'. | | Đúng như mong đợi | | | Pass | |
| 2               | Nhập văn bản nội dung bài đăng. | | Nội dung bài đăng được nhập. | | Đúng như mong đợi | | | Pass | |
| 3               | Nhấn vào nút 'SCHEDULE'. | | Hệ thống xử lý lưu bài viết lên lịch thành công, hiển thị toast thông báo thành công và đóng modal. | | Đúng như mong đợi | | | Pass | |
