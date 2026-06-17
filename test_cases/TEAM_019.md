| Test Case ID    | | TEAM_019 | Test Case Description | | Kiểm tra luồng gửi email mời thành viên mới | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang /manage/team | | | | 1 | "newmember@company.com" | | | | |
| 2               | Cấu hình email server (SMTP/Nodemailer) đang hoạt động chính xác | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Đảm bảo rằng khi mời một thành viên mới, email chứa token mời (JWT link) được gửi đi thành công tới địa chỉ email của người nhận. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Click nút "Invite Member" để mở popup. | | Popup "Mời thành viên mới" hiển thị thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Nhập "newmember@company.com" vào ô "Địa chỉ Email". | | Nhập dữ liệu thành công. | | Đúng như mong đợi | | | Pass | |
| 3               | Chọn vai trò là "Member" và click "Gửi lời mời tham gia". | | Toast hiển thị thông báo: "Đã gửi lời mời thành công!". Popup đóng. Thành viên mới xuất hiện ở lưới danh sách với trạng thái PENDING. | | Đúng như mong đợi | | | Pass | |
| 4               | Kiểm tra logs gửi email của hệ thống hoặc inbox của newmember@company.com. | | Email gửi đi thành công, nội dung email chứa nút kích hoạt tài khoản có đường dẫn dạng `/accept-invite?token=JWT_TOKEN_HERE`. | | Đúng như mong đợi | | | Pass | |
