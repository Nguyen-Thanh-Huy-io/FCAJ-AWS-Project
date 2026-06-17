| Test Case ID    | | TEAM_017 | Test Case Description | | Chặn xóa vai trò tùy chỉnh đang được gán cho thành viên | | | | | |
| --------------- | --- | ------- | --------------------- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Fail | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang /manage/team tab "Vai trò tùy chỉnh" | | | | 1 | "Brand Analyst" (đang gán cho Guest Analyst) | | | | |
| 2               | Vai trò tùy chỉnh đang được gán cho ít nhất một thành viên trong thương hiệu | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh hệ thống không cho phép xóa vai trò tùy chỉnh nếu vai trò đó đang được gán cho thành viên khác, nhằm đảm bảo tính toàn vẹn của dữ liệu liên kết. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Quan sát danh sách các vai trò tùy chỉnh, xác định vai trò "Brand Analyst" đang có gán thành viên (hiển thị "1 thành viên đang gán"). | | Vai trò "Brand Analyst" hiển thị trong danh sách. | | Đúng như mong đợi | | | Pass | |
| 2               | Click nút Xóa (thùng rác) tại góc phải thẻ vai trò "Brand Analyst". | | Hộp thoại xác nhận xóa vai trò hiển thị với câu hỏi: "Bạn có chắc chắn muốn xóa vai trò tùy chỉnh này?". | | Đúng như mong đợi | | | Pass | |
| 3               | Click nút "Xóa" trên hộp thoại xác nhận. | | Hệ thống chặn thao tác xóa, hiển thị thông báo lỗi nghiệp vụ rõ ràng: "Vai trò tùy chỉnh đang được gán cho thành viên, không thể xóa." Vai trò vẫn tồn tại trong danh sách. | | Hệ thống không hiển thị lỗi chặn nghiệp vụ, thay vào đó API trả về lỗi xác thực `401 (Unauthorized)` hiển thị thông báo toast: "Access token required". | | | Fail | |
