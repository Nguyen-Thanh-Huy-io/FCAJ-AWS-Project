| Test Case ID    | | POST_UI_029 | Test Case Description | | Xác minh luồng xử lý lỗi và độ ổn định khi tải lên (upload) tệp video không hợp lệ cho YouTube | | | | | |
| --------------- | --- | ------- | --------------------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | Nhã| Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | Nhã|
| Use Case ID     | UC08, UC10 | Antigravity | Date Tested | | 28/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Crashed | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Người dùng đã đăng nhập hệ thống và có Brand đã kết nối tài khoản YouTube (Mock). | | | | 1 | Tệp tin video mẫu không hợp lệ/bị lỗi (sample_video.mp4 có kích thước 24 bytes). |
| 2               | Đang mở modal soạn thảo bài viết "Create new post". | | | | 2 | | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh rằng hệ thống xử lý lỗi một cách an toàn và hiển thị thông báo lỗi phù hợp khi người dùng tải lên tệp tin video không hợp lệ hoặc bị lỗi (corrupted) cho kênh YouTube, và đảm bảo lỗi này không gây ảnh hưởng đến tính ổn định của server backend. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Chọn nền tảng đăng bài là YouTube. | | Giao diện hiển thị các trường soạn thảo dành cho YouTube. | | Đúng như mong đợi. | | | Pass |
| 2               | Thực hiện tải lên (upload) tệp tin video không hợp lệ `sample_video.mp4` (stub file 24 bytes) từ máy tính. | | Vùng preview của Post Creator nhận diện tệp tin và hiển thị tên tệp tin tải lên. | | Tên tệp tin hiển thị trong phần preview của Post Creator. | | | Pass |
| 3               | Nhập caption cho bài viết, chọn chế độ xuất bản là Draft (Lưu nháp), và nhấn nút đăng bài (Submit). | | Backend nhận request, kiểm tra định dạng và tính hợp lệ của tệp video, trả về mã lỗi HTTP 400 Bad Request và thông báo lỗi rõ ràng. Giao diện hiển thị thông báo lỗi tương ứng. Server backend tiếp tục chạy bình thường. | | Backend bị crash tiến trình Node.js hoàn toàn, người dùng bị mất phiên làm việc và đẩy ra trang đăng nhập. | | | Crashed |

## 5. Linked Bug
- Có liên kết với bug report [BUG_UC08_UC10_POST_MEDIA_NHA_POST_UI_029.md](file:///d:/Fullit/projects/PubliCast/test_cases/post-media/BUG_UC08_UC10_POST_MEDIA_NHA_POST_UI_029.md) (`PC-57`).
