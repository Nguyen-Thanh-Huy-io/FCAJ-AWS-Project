| Test Case ID    | | MEDIA_002 | Test Case Description | | Validate bắt buộc chọn ít nhất một tài khoản mạng xã hội khi tạo bài viết | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 17/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, truy cập thành công hệ thống. | | | | 1 | Không có | | | | |
| 2               | Đang mở modal Create Post. | | | | 2 |  | | | | |
| 3               | | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Hệ thống phải chặn không cho phép đăng hoặc lên lịch bài viết nếu người dùng chưa chọn bất kỳ nền tảng mạng xã hội nào. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Mở modal 'Create new post'. | | Modal hiển thị thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Đảm bảo bỏ chọn tất cả các icon mạng xã hội ở thanh toolbar phía trên (Facebook, TikTok, YouTube đều ở trạng thái màu xám). | | Không có mạng xã hội nào được chọn. | | Đúng như mong đợi | | | Pass | |
| 3               | Nhập nội dung văn bản vào vùng soạn thảo. | | Nội dung được nhập bình thường. | | Đúng như mong đợi | | | Pass | |
| 4               | Quan sát nút 'PUBLISH' hoặc click thử vào nút. | | Nút 'PUBLISH' / 'SCHEDULE' bị vô hiệu hóa (greyed out) hoặc hiển thị toast báo lỗi yêu cầu chọn nền tảng. | | Nút không cho bấm và có trạng thái vô hiệu hóa. | | | Pass | |
