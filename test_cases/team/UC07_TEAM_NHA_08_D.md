| Test Case ID    | TC_TEAM_08_D | Test Case Description | Kiểm chứng Custom Role chỉ có quyền Quản lý thành viên (MANAGE_TEAM) |
| --------------- | ---------| ---------------------| -------------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                                |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                            |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Custom Role "Restricted Analyst" được cập nhật chỉ bật các quyền `MANAGE_TEAM` và `INVITE_MEMBERS`.
2. Tài khoản người dùng hạn chế đã đăng nhập.
3. Đang ở màn hình chính của PubliCast.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Email thành viên mời: `hackmember-test-08-d@gmail.com` |
| 2 | Quyền được bật: `MANAGE_TEAM`, `INVITE_MEMBERS` |
| 3 | Quyền bị chặn: `CREATE_POSTS` |

### Test Scenario
Xác minh rằng thành viên chỉ có quyền quản lý nhân sự có thể gửi lời mời thành viên mới thành công thông qua API, nhưng bị chặn tạo bài viết mới. Trên giao diện UI Planner, nút tạo bài viết phải bị vô hiệu hóa bởi `AccessGuard` và nếu cố tình lách luật bằng cách xóa thuộc tính `disabled`, hệ thống sẽ kích hoạt toast cảnh báo phân quyền.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Gửi yêu cầu API `POST /api/team/invite` để mời thành viên mới. | Backend chấp nhận yêu cầu và trả về trạng thái 201/200 thành công. | API trả về 201 Created | Pass |
| 2 | Gửi yêu cầu API `POST /api/posts` để tạo bài viết mới. | Backend chặn yêu cầu và trả về lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
| 3 | Truy cập màn hình Planner và định vị nút Create Post (`[data-testid="planner-create-post-btn"]`). | Nút Create Post bị disabled (thuộc tính `disabled="true"`). | Nút bị disabled thành công trên UI | Pass |
| 4 | Sử dụng JavaScript để xóa thuộc tính `disabled` hoặc gọi trực tiếp trình xử lý sự kiện onClick của nút. | Hệ thống phát hiện vi phạm quyền, chặn không cho mở modal và hiển thị toast cảnh báo: "Bạn cần có quyền tạo bài viết để sử dụng tính năng này." | Toast cảnh báo hiển thị chính xác | Pass |
