| Test Case ID    | | MEDIA_010 | Test Case Description | | Validate lỗi định dạng video đối với bài đăng Facebook Reel | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 17/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đang mở modal Create Post, chọn Facebook Reel. | | | | 1 | Tệp hình ảnh .jpg | | | | |
| 2               | | | | | 2 | | | | | |
| 3               | | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Hệ thống bắt buộc phải báo lỗi và chặn đăng nếu người dùng chọn định dạng Reel nhưng tải lên tệp là hình ảnh. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Chọn Facebook làm mạng xã hội, chọn loại bài đăng là Reel. | | Thiết lập đăng Facebook Reel thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Tải lên hoặc chọn một tệp hình ảnh (.jpg hoặc .png). | | Tệp hình ảnh được tải lên. | | Đúng như mong đợi | | | Pass | |
| 3               | Quan sát thông báo lỗi của hệ thống. | | Hệ thống hiển thị lỗi validation: 'Facebook Reel must be a video file.' | | Hiển thị thông báo lỗi 'Facebook Reel must be a video file.' | | | Pass | |
