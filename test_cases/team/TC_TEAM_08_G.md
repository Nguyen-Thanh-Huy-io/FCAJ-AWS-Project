| Test Case ID    | TC_TEAM_08_G | Test Case Description | Kiểm chứng nhóm quyền Nội dung & Media (CREATE_POSTS, APPROVE_POSTS, DELETE_POSTS) của Custom Role |
| --------------- | ---------| ---------------------| --------------------------------------------------------------------------------------------------|
| Created By      | Nhã | Reviewed By          | Nhã Võ                                                                                    |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                                                |
| Test Status     | Pass      | Tester's Name        | Nhã                                                                               |
| Use Case ID     | UC07 |

### Prerequisites
1. Đã đăng nhập vào hệ thống PubliCast.
2. Có Custom Role "Publisher Only" được tạo và bật quyền "Phê duyệt bài viết (Approve Posts)" (`APPROVE_POSTS`) và "Xóa bài viết (Delete Posts)" (`DELETE_POSTS`) nhưng KHÔNG bật quyền "Tạo bài viết (Create Posts)" (`CREATE_POSTS`).
3. Một thành viên được gán vai trò này đã kích hoạt tài khoản.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Tài khoản Owner (Quản trị): `seleniumowner@gmail.com` / `Password123!` |
| 2 | Custom Role: Tên vai trò là `Publisher Only` |
| 3 | Quyền kích hoạt: `APPROVE_POSTS`, `DELETE_POSTS` |
| 4 | Quyền bị tắt: `CREATE_POSTS` |
| 5 | Tài khoản Member (Thành viên test): `seleniumpublisher@gmail.com` / `Password123!` |
| 6 | Dữ liệu bài viết kiểm thử: Post ID cần phê duyệt/xóa (mock) `mock-post-id-789` |

### Test Scenario
Xác minh rằng thành viên chỉ có thể thực hiện các hành động Phê duyệt và Xóa bài viết, đồng thời bị chặn khi cố tình Tạo hoặc Chỉnh sửa bài viết ở cả API và UI.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Đăng nhập bằng tài khoản thành viên có vai trò "Publisher Only". | Đăng nhập thành công và vào trang Dashboard chính. | Đăng nhập thành công và vào dashboard | Pass |
| 2 | Gửi yêu cầu API `POST /api/posts/bulk-approve` để duyệt bài viết. | Backend trả về mã trạng thái 200 OK hoặc 404 (do post không tồn tại), không trả về 403. | Trả về mã trạng thái 404 Not Found (được phép truy cập) | Pass |
| 3 | Gửi yêu cầu API `DELETE /api/posts/bulk` để xóa bài viết. | Backend trả về mã trạng thái 200 OK hoặc 404 (do post không tồn tại), không trả về 403. | Trả về mã trạng thái 404 Not Found (được phép truy cập) | Pass |
| 4 | Gửi yêu cầu API `POST /api/posts` để tạo bài viết mới. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | Trả về mã lỗi 403 Forbidden | Pass |
| 5 | Truy cập giao diện Planner và kiểm chứng nút "Create post". | Nút "Create post" bị vô hiệu hóa bởi AccessGuard và hiển thị toast cảnh báo khi click. | Nút bị disabled và hiển thị cảnh báo từ AccessGuard | Pass |
