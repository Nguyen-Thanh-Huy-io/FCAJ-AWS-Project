| Test Case ID    | | MEDIA_022 | Test Case Description | | Kiểm tra lỗi giao diện: Nút chèn Media hiển thị dropdown bị tràn và che khuất khi cuộn modal xuống | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 17/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Fail | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Đang mở modal Create Post. | | | | 1 | Không có | | | | |
| 2               | | | | | 2 | | | | | |
| 3               | | | | | 3 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Khi modal được cuộn xuống cuối trang (để cấu hình presets hoặc date-picker), click vào nút Media (icon hình ảnh) phải hiển thị dropdown đầy đủ trong màn hình. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Mở modal 'Create new post'. | | Modal hiển thị thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Cuộn modal soạn thảo xuống phía dưới cùng (vùng presets hoặc date-picker). | | Vùng soạn thảo di chuyển lên trên, nút Media (ImageIcon) di chuyển lên sát mép trên viewport. | | Đúng như mong đợi | | | Pass | |
| 3               | Nhấp vào nút Media để mở menu dropdown các tùy chọn nguồn tải file. | | Menu dropdown được kích hoạt. | | Đúng như mong đợi | | | Pass | |
| 4               | Quan sát vị trí hiển thị của menu dropdown. | | Menu dropdown hiển thị đầy đủ, không bị che khuất và các tùy chọn click bình thường. | | Menu dropdown mở hướng lên (bottom-full) bị tràn ra ngoài viewport (tọa độ Y âm), các tùy chọn hàng đầu (Add image, Add video, From Media Library) bị biến mất khỏi màn hình và không thể click chọn. | | | Fail | |
