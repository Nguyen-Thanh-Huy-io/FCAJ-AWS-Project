| Test Case ID    | TC_TEAM_08_G | Test Case Description | Kiểm chứng Custom Role chỉ có quyền Phê duyệt bài viết (APPROVE_POSTS) và Xóa bài viết (DELETE_POSTS) |
| --------------- | ---------| ---------------------| ----------------------------------------------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                                                                |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                                                            |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Custom Role "Restricted Analyst" được cập nhật qua DB để chỉ sở hữu: `APPROVE_POSTS`, `DELETE_POSTS`.
2. Thành viên được gán vai trò này đã đăng nhập vào hệ thống.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Thao tác được phép 1: Phê duyệt bài viết qua API `/api/posts/bulk-approve` |
| 2 | Thao tác được phép 2: Xóa bài viết qua API `/api/posts/bulk` |
| 3 | Thao tác bị cấm: Tạo bài viết qua API `POST /api/posts` |

### Test Scenario
Xác minh rằng thành viên có quyền phê duyệt và xóa bài viết có thể thực hiện gọi các API duyệt bài viết và xóa bài viết thành công (hoặc trả về lỗi 404 Not Found nếu ID bài đăng giả lập không tồn tại trong DB, thay vì bị chặn 403). Khi gửi yêu cầu tạo bài đăng mới, Backend sẽ chặn lại và trả về lỗi 403 Forbidden.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Gửi yêu cầu API `POST /api/posts/bulk-approve` phê duyệt bài viết ngẫu nhiên. | Phản hồi từ Backend trả về trạng thái 200 (OK) hoặc 404 (Không tìm thấy bài viết), nhưng KHÔNG phải 403. | Phản hồi trả về 404 (không bị chặn 403) | Pass |
| 2 | Gửi yêu cầu API `DELETE /api/posts/bulk` xóa bài viết ngẫu nhiên. | Phản hồi từ Backend trả về trạng thái 200 (OK) hoặc 404 (Không tìm thấy), KHÔNG phải 403. | Phản hồi trả về 404 (không bị chặn 403) | Pass |
| 3 | Gửi yêu cầu API `POST /api/posts` tạo một bài viết mới bằng token của thành viên này. | Backend phát hiện thiếu quyền `CREATE_POSTS`, chặn yêu cầu và trả về lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
