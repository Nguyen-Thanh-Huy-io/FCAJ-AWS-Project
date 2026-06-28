| Test Case ID    | TEAM_028 | Test Case Description | Kiểm chứng nhóm quyền Quản trị & Cấu hình (MANAGE_ROLES, INVITE_MEMBERS) của Custom Role |
| --------------- | ---------| ---------------------| -----------------------------------------------------------------------------------------|
| Created By      | Antigravity | Reviewed By          | Nhã Võ                                                                                    |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                                                |
| Test Status     | Pass      | Tester's Name        | Antigravity                                                                               |

### Prerequisites
1. Đã đăng nhập vào hệ thống PubliCast.
2. Có Custom Role "Role Admin Only" được tạo và chỉ bật quyền "Quản lý vai trò (Manage Roles)" (`MANAGE_ROLES`) nhưng KHÔNG bật quyền "Mời thành viên (Invite Members)" (`INVITE_MEMBERS` / `MANAGE_TEAM`).
3. Một thành viên được gán vai trò này đã kích hoạt tài khoản.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Tài khoản Owner (Quản trị): `seleniumowner@gmail.com` / `Password123!` |
| 2 | Custom Role: Tên vai trò là `Role Admin Only` |
| 3 | Quyền kích hoạt: `MANAGE_ROLES` |
| 4 | Quyền bị tắt: `INVITE_MEMBERS`, `MANAGE_TEAM` |
| 5 | Tài khoản Member (Thành viên test): `seleniumroleadmin@gmail.com` / `Password123!` |
| 6 | Dữ liệu vai trò mới (để test tạo vai trò): Tên vai trò mới `Temporary Assistant`, Quyền gán `CREATE_POSTS` |
| 7 | Dữ liệu lời mời thành viên mới (để test bị chặn): Email mời `invitedcandidate@gmail.com`, Vai trò gán `Viewer` |

### Test Scenario
Xác minh rằng thành viên chỉ có thể thực hiện quản lý vai trò và bị chặn khi cố tình gửi lời mời thành viên mới.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Đăng nhập bằng tài khoản thành viên có vai trò "Role Admin Only". | Đăng nhập thành công và vào trang Dashboard chính. | Đăng nhập thành công và vào dashboard | Pass |
| 2 | Gửi yêu cầu API `POST /api/brands/<brandId>/roles` để tạo vai trò mới. | Backend trả về mã trạng thái 201 Created (hoặc 200). | Trả về mã trạng thái 201 Created | Pass |
| 3 | Gửi yêu cầu API `POST /api/team/invite` để mời thành viên mới. | Backend chặn yêu cầu và trả về mã lỗi 403 Forbidden. | Trả về mã lỗi 403 Forbidden | Pass |
