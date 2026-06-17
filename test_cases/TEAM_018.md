| Test Case ID    | | TEAM_018 | Test Case Description | | Kiểm tra tải lên Avatar định dạng file không hợp lệ | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ----------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang Settings cá nhân | | | | 1 | "test_document.txt" hoặc "test.pdf" | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh hệ thống từ chối tải lên tệp tin ảnh đại diện nếu tệp đó không phải là các định dạng ảnh thông dụng (.png, .jpg, .jpeg). | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Click vào ảnh đại diện hoặc nút tải ảnh đại diện mới trong phần thông tin cá nhân. | | Hộp thoại chọn tệp tin của hệ điều hành mở ra. | | Đúng như mong đợi | | | Pass | |
| 2               | Quan sát phần lọc tệp tin của hộp thoại. | | Hộp thoại tự động lọc chỉ hiển thị các tệp tin hình ảnh (.png, .jpg, .jpeg, .gif). | | Đúng như mong đợi | | | Pass | |
| 3               | Cố tình kéo thả hoặc chọn một tệp tin tài liệu (ví dụ: `test_document.txt` hoặc `test.pdf`) để tải lên. | | Hệ thống chặn thao tác, từ chối tải lên và hiển thị thông báo lỗi: "Định dạng tệp không được hỗ trợ". | | Đúng như mong đợi | | | Pass | |
