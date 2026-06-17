| Test Case ID    | | MEDIA_011 | Test Case Description | | Validate lỗi thiếu phương tiện đối với Facebook Reel | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 17/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đang mở modal Create Post, chọn Facebook Reel. | | | | 1 | Không có | | | | |
| 2               | | | | | 2 | | | | | |
| 3               | | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo người dùng bắt buộc phải chọn ít nhất 1 video khi đăng Facebook Reel. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Chọn Facebook làm mạng xã hội, chọn loại bài đăng là Reel. | | Thiết lập đăng Facebook Reel thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Để trống không tải lên tệp phương tiện nào. | | Trạng thái media trống. | | Đúng như mong đợi | | | Pass | |
| 3               | Quan sát thông báo lỗi của hệ thống và vùng xem trước. | | Hệ thống hiển thị lỗi validation: 'Reel -> Add at least 1 video.' Khung preview hiển thị màn hình đen kèm thông báo yêu cầu tải video. | | Hiển thị lỗi và màn hình đen preview đúng như mong đợi. | | | Pass | |
