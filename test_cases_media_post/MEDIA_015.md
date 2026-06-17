| Test Case ID    | | MEDIA_015 | Test Case Description | | Validate lỗi lên lịch ngày giờ trong quá khứ | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 17/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đang ở modal Create Post. | | | | 1 | Thời gian quá khứ | | | | |
| 2               | | | | | 2 | | | | | |
| 3               | | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Hệ thống phải chặn không cho phép lên lịch đăng bài vào một thời điểm đã qua. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Mở bảng Date-picker và chọn ngày hôm qua hoặc một giờ trước giờ hiện tại. | | Thời gian quá khứ được chọn. | | Đúng như mong đợi | | | Pass | |
| 2               | Quan sát thông báo lỗi và trạng thái nút hành động chính. | | Hệ thống hiển thị thông báo lỗi màu đỏ: '1 errors: Publish date can't be a past date.' và nút SCHEDULE bị vô hiệu hóa (greyed out). | | Hiển thị thông báo lỗi và vô hiệu hóa nút SCHEDULE đúng như mong đợi. | | | Pass | |
