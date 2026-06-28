| Test Case ID    | TEAM_029 | Test Case Description | Kiểm chứng Custom Role có quyền Tạo và Đăng bài viết (CREATE_POSTS, PUBLISH_POSTS) nhưng KHÔNG có quyền Phê duyệt và Xóa bài viết |
| --------------- | ---------| ---------------------| ----------------------------------------------------------------------------------------------------------------------------------|
| Created By      | Antigravity | Reviewed By          | Nhã Võ                                                                                    |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                                                |
| Test Status     | Pass      | Tester's Name        | Antigravity                                                                               |

### Prerequisites
1. Đã đăng nhập vào hệ thống PubliCast.
2. Có Custom Role "Editor Only" được tạo và bật quyền "Tạo bài viết (Create Posts)" (`CREATE_POSTS`) và "Đăng bài viết (Publish Posts)" (`PUBLISH_POSTS`) nhưng KHÔNG bật quyền "Phê duyệt bài viết (Approve Posts)" (`APPROVE_POSTS`) và "Xóa bài viết (Delete Posts)" (`DELETE_POSTS`).
3. Một thành viên được gán vai trò này đã kích hoạt tài khoản.

### Test Data
*   **Tài khoản Owner (Quản trị)**:
    *   Email: `seleniumowner@gmail.com`
    *   Mật khẩu: `Password123!`
*   **Custom Role**:
    *   Tên vai trò: `Editor Only`
    *   Quyền kích hoạt: `CREATE_POSTS`, `PUBLISH_POSTS`
    *   Quyền bị tắt: `APPROVE_POSTS`, `DELETE_POSTS`
*   **Tài khoản Member (Thành viên test)**:
    *   Email: `seleniummember@gmail.com`
    *   Mật khẩu: `Password123!`
*   **Dữ liệu bài viết kiểm thử**:
    *   Tiêu đề: `Test Post Draft by Editor Only`
    *   Nội dung: `This is a test post content created by member with Editor Only role.`

### Test Scenario
Xác minh rằng thành viên có quyền Tạo bài viết có thể thực hiện thành công việc tạo bài viết nháp, trong khi các quyền nâng cao như Phê duyệt bài viết và Xóa bài viết bị chặn hoàn toàn ở cả giao diện UI và API.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Đăng nhập bằng tài khoản thành viên có vai trò "Editor Only". | Đăng nhập thành công và vào trang Dashboard chính. | Đăng nhập thành công và vào dashboard | Pass |
| 2 | Gửi yêu cầu API `POST /api/posts` để tạo bài viết mới. | Backend chấp nhận yêu cầu và tạo bài viết thành công (trả về 201/200). | Trả về mã trạng thái 201 Created | Pass |
| 3 | Gửi yêu cầu API `POST /api/posts/bulk-approve` để duyệt bài viết. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | Trả về mã lỗi 403 Forbidden | Pass |
| 4 | Gửi yêu cầu API `DELETE /api/posts/bulk` để xóa bài viết. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | Trả về mã lỗi 403 Forbidden | Pass |
| 5 | Truy cập giao diện Planner và xác nhận nút "Create post". | Nút "Create post" hiển thị trạng thái hoạt động bình thường, không bị disabled hay bị cảnh báo bởi AccessGuard. | Nút hoạt động bình thường | Pass |
