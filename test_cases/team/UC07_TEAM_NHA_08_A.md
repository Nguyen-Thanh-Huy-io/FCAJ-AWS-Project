| Test Case ID    | TC_TEAM_08 | Test Case Description | Kiểm chứng phân quyền Custom Role hạn chế trên UI & Backend API |
| --------------- | ---------| ---------------------| ------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                        |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                    |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Thành viên `testmember@gmail.com` đã kích hoạt tài khoản và đăng nhập thành công.
2. Tài khoản được gán vai trò "Restricted Analyst" (chỉ có quyền `CREATE_POSTS`).
3. Đang ở màn hình Dashboard của hệ thống PubliCast.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Email thành viên: `testmember@gmail.com` |
| 2 | Token của người dùng (lấy từ localStorage/cookie) |
| 3 | Quyền được phép: `CREATE_POSTS` |
| 4 | Quyền bị chặn: `MANAGE_TEAM`, `APPROVE_POSTS`, `DELETE_POSTS` |

### Test Scenario
Xác minh rằng các thành phần giao diện liên quan tới quyền bị cấm (như menu Quản lý đội ngũ `/manage/team`) không hiển thị đối với tài khoản hạn chế, đồng thời các API gọi trực tiếp đến Backend yêu cầu quyền bị cấm phải bị chặn và trả về lỗi 403 Forbidden. Các API yêu cầu quyền được phép (tạo bài viết) phải hoạt động bình thường.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Kiểm tra thanh Sidebar điều hướng trên giao diện. | Không xuất hiện đường dẫn `/manage/team` hoặc menu quản lý đội ngũ. | Menu không hiển thị trên UI | Pass |
| 2 | Gửi yêu cầu API `POST /api/team/invite` để mời thành viên bằng Token của người dùng hạn chế. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
| 3 | Gửi yêu cầu API `POST /api/posts` để tạo bài viết nháp mới cho Facebook. | Backend chấp nhận yêu cầu và trả về mã trạng thái 201 Created. | Bài đăng được tạo thành công | Pass |
| 4 | Gửi yêu cầu API `POST /api/posts/bulk-approve` để duyệt bài viết. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
| 5 | Gửi yêu cầu API `DELETE /api/posts/bulk` để xóa bài viết. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
