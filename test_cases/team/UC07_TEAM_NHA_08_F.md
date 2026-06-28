| Test Case ID    | TC_TEAM_08_F | Test Case Description | Kiểm chứng Custom Role chỉ có quyền Quản lý vai trò (MANAGE_ROLES) |
| --------------- | ---------| ---------------------| ----------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                            |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                        |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Custom Role "Restricted Analyst" đã được cập nhật qua DB để chỉ có quyền `MANAGE_ROLES`.
2. Thành viên được gán vai trò này đã đăng nhập vào hệ thống.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Thao tác được phép: Tạo vai trò mới tên `Temporary Role` |
| 2 | Thao tác bị cấm: Mời thành viên tới email `hackmember-test-08-f@gmail.com` |

### Test Scenario
Xác minh rằng thành viên chỉ có quyền quản lý vai trò có thể tạo ra một vai trò mới (trả về 201 Created). Tuy nhiên, khi gửi yêu cầu mời thành viên khác vào đội ngũ, Backend sẽ chặn lại và trả về lỗi 403 Forbidden.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Gửi yêu cầu API `POST /api/brands/<brandId>/roles` tạo vai trò tùy chỉnh mới tên `Temporary Role`. | Backend xử lý thành công, trả về trạng thái 200 hoặc 201. | Vai trò mới được tạo thành công | Pass |
| 2 | Dọn dẹp vai trò vừa tạo thông qua DB để tránh rác cơ sở dữ liệu. | Bản ghi vai trò tạm thời bị xóa sạch. | Đã xóa dọn dẹp DB | Pass |
| 3 | Gửi yêu cầu API `POST /api/team/invite` bằng token của thành viên này. | Backend chặn yêu cầu và trả về lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
