| Test Case ID    | TC_TEAM_09_B | Test Case Description | Xóa vai trò tùy chỉnh thành công sau khi đã thu hồi gán vai trò |
| --------------- | ---------| ---------------------| ------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                        |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                    |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của Brand.
2. Vai trò tùy chỉnh `Restricted Analyst` đang gán cho thành viên `testmember@gmail.com`.
3. Đang ở màn hình quản lý đội ngũ (`/manage/team`).

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Vai trò tùy chỉnh cần xóa: `Restricted Analyst` |
| 2 | Vai trò chuyển tiếp để gán cho thành viên: `Analyst` (vai trò hệ thống mặc định) |

### Test Scenario
Xác minh rằng sau khi Owner chuyển đổi vai trò của thành viên sang vai trò hệ thống khác để vai trò tùy chỉnh không còn được sử dụng bởi ai, việc xóa vai trò tùy chỉnh đó sẽ diễn ra thành công và vai trò đó biến mất hoàn toàn khỏi danh sách.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Truy cập tab "Thành viên" trong màn hình Quản lý đội ngũ. | Danh sách thành viên hiển thị đầy đủ thông tin. | Danh sách thành viên hiển thị | Pass |
| 2 | Click chọn nút hành động bên cạnh thành viên `testmember@gmail.com` để mở dropdown vai trò. | Dropdown danh sách vai trò mở ra. | Dropdown vai trò hiển thị | Pass |
| 3 | Chọn vai trò hệ thống `Analyst` để gán cho thành viên này thay thế vai trò cũ. | Vai trò thành viên được cập nhật, hiển thị toast thành công: "Cập nhật vai trò thành công." | Cập nhật vai trò thành công | Pass |
| 4 | Chuyển sang tab "Vai trò tùy chỉnh". | Danh sách các vai trò tùy chỉnh hiện tại hiển thị. | Tab Vai trò tùy chỉnh hiển thị | Pass |
| 5 | Tìm vai trò `Restricted Analyst` và click vào icon Xóa vai trò (Thùng rác). | Modal xác nhận xóa vai trò mở ra thành công. | Modal xác nhận mở thành công | Pass |
| 6 | Nhấp xác nhận nút "Xóa" trên modal. | Backend xử lý thành công, modal đóng lại và hiển thị toast: "Xóa vai trò thành công." | Toast thành công hiển thị | Pass |
| 7 | Kiểm tra lại danh sách vai trò tùy chỉnh. | Vai trò `Restricted Analyst` biến mất hoàn toàn khỏi giao diện. | Vai trò biến mất trên giao diện | Pass |
