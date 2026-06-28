| Test Case ID    | TC_TEAM_08_H | Test Case Description | Kiểm chứng Custom Role chỉ có quyền Tạo bài viết (CREATE_POSTS) và Đăng bài viết (PUBLISH_POSTS) |
| --------------- | ---------| ---------------------| ----------------------------------------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                                                          |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                                                      |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Custom Role "Restricted Analyst" được cập nhật qua DB để chỉ sở hữu: `CREATE_POSTS`, `PUBLISH_POSTS`.
2. Thành viên được gán vai trò này đã đăng nhập vào hệ thống.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Thao tác được phép: Tạo bài viết mới qua API `POST /api/posts` |
| 2 | Thao tác bị cấm 1: Phê duyệt bài viết qua API `POST /api/posts/bulk-approve` |
| 3 | Thao tác bị cấm 2: Xóa bài viết qua API `DELETE /api/posts/bulk` |

### Test Scenario
Xác minh rằng thành viên chỉ có quyền tạo và đăng bài viết có thể thực hiện tạo bài đăng thành công (trả về 201 Created). Tuy nhiên, khi gửi yêu cầu phê duyệt hoặc xóa bài viết, Backend sẽ chặn lại và trả về lỗi 403 Forbidden.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Gửi yêu cầu API `POST /api/posts` tạo một bài viết nháp. | Backend xử lý thành công và trả về mã trạng thái 201 Created. | Bài đăng được tạo thành công | Pass |
| 2 | Gửi yêu cầu API `POST /api/posts/bulk-approve` để phê duyệt bài viết. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
| 3 | Gửi yêu cầu API `DELETE /api/posts/bulk` để xóa bài viết. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
