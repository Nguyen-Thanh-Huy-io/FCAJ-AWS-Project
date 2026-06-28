| Test Case ID    | TC_TEAM_05_A | Test Case Description | Tạo Custom Role thành công với tên hợp lệ và phân quyền hoạt động |
| --------------- | ---------| ---------------------| ----------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                            |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                        |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của một Brand trên gói PRO (được phép dùng Custom Role).
2. Đang ở màn hình Vai trò tùy chỉnh của quản lý đội ngũ (`/manage/team` -> Tab Vai trò tùy chỉnh).

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Tên vai trò: `Restricted Analyst` |
| 2 | Mô tả: `Chỉ có quyền tạo bài viết nháp, không có quyền quản lý Team.` |
| 3 | Quyền gán: `CREATE_POSTS` (Tạo bài viết) |

### Test Scenario
Xác minh rằng Owner có thể tạo thành công một Custom Role mới với tên hợp lệ, mô tả đầy đủ, gán quyền tạo bài đăng, lưu cấu hình thành công và vai trò mới hiển thị chính xác trên danh sách giao diện.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Nhấp chọn nút "Add Custom Role" hoặc "Tạo Custom Role". | Form/Modal tạo vai trò tùy chỉnh mở ra thành công. | Form hiển thị thành công | Pass |
| 2 | Nhập tên vai trò `Restricted Analyst` và phần mô tả tương ứng. | Dữ liệu được ghi nhận vào các trường văn bản đầu vào. | Text hiển thị đúng | Pass |
| 3 | Bật (toggle/tick) quyền `CREATE_POSTS` (Tạo bài viết) trên giao diện. | Quyền được chuyển sang trạng thái kích hoạt (Checked/Active). | Quyền được chọn chính xác | Pass |
| 4 | Nhấp vào nút "Lưu cấu hình vai trò". | Yêu cầu gửi thành công, modal đóng lại, xuất hiện thông báo toast thành công. | Toast thành công hiển thị | Pass |
| 5 | Quan sát danh sách Custom Roles ngoài màn hình chính. | Vai trò `Restricted Analyst` xuất hiện trong danh sách vai trò hiện có. | Vai trò xuất hiện trên UI | Pass |
