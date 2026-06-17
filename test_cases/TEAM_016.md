| Test Case ID    | | TEAM_016 | Test Case Description | | Tạo và lưu thành công vai trò tùy chỉnh | | | | | |
| --------------- | --- | ------- | --------------------- | --- | --------------------------------------- | --- | --- | --- | --- | --- |
| Created By      | | Antigravity | Reviewed By | | Nhã Võ | | Version | | 1.0 | |
| | | | | | | | | | | |
| QA Tester’s Log | | | | | | | | | | |
| | | | | | | | | | | |
| Tester's Name   | | Antigravity | Date Tested | | 16/06/2026 | | Test Case (Pass/Fail/Not Executed, Crashed) | | Pass | |
| | | | | | | | | | | |
| S #             | Prerequisites: | | | | S # | Test Data | | | | |
| 1               | Trình duyệt đã mở, đang ở trang /manage/team tab "Vai trò tùy chỉnh" | | | | 1 | Tên: "Content Writer", Mô tả: "Viết nội dung", Quyền: "Tạo bài viết" | | | | |
| | | | | | | | | | | |
| Test Scenario   | Xác minh hệ thống ghi nhận đúng thông tin vai trò tùy chỉnh mới tạo vào DB và hiển thị lại chính xác trên UI. | | | | | | | | | |
| | | | | | | | | | | |
| Step #          | Step Details | | Expected Results | | Actual Results | | | Pass / Fail / Not executed / Suspended/ Crashed | |
| | | | | | | | | | | |
| 1               | Click nút "Add Custom Role" để mở popup. | | Popup "Tạo vai trò tùy chỉnh" mở ra thành công. | | Đúng như mong đợi | | | Pass | |
| 2               | Nhập tên vai trò "Content Writer", nhập mô tả "Viết bài đăng và quản lý bài đăng", chọn màu sắc màu xanh lá. | | Thông tin được nhập thành công. | | Đúng như mong đợi | | | Pass | |
| 3               | Trong lưới phân quyền, bật quyền "Tạo bài viết". | | Quyền "Tạo bài viết" được chọn (switch chuyển sang màu đen). | | Đúng như mong đợi | | | Pass | |
| 4               | Click nút "Lưu cấu hình vai trò". | | Toast thông báo lưu thành công hiển thị, popup đóng, và vai trò mới "Content Writer" xuất hiện trong danh sách vai trò tùy chỉnh trên UI. | | Đúng như mong đợi (toast thông báo thành công và vai trò được cập nhật vào danh sách). | | | Pass | |
| 5               | Kiểm tra dữ liệu vai trò tùy chỉnh trong Database. | | Database có một dòng mới được lưu vào bảng Role với tên "Content Writer", brandId tương ứng và có bản ghi trong bảng Permission liên kết với Role này có `permissionKey="CREATE_POST"` và `isAllowed=true`. | | Bản ghi được ghi nhận đầy đủ dưới Database và ánh xạ đúng. | | | Pass | |
