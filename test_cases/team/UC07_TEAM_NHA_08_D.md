| Test Case ID    | TC_TEAM_08_D | Test Case Description | Kiểm chứng Custom Role chỉ có quyền Quản lý thành viên (MANAGE_TEAM) |
| --------------- | ---------| ---------------------| ------------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                              |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                          |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Custom Role "Restricted Analyst" đã được cập nhật quyền qua DB để chỉ sở hữu: `MANAGE_TEAM`, `INVITE_MEMBERS` (các quyền nội dung bị thu hồi).
2. Thành viên được gán vai trò này đã đăng nhập và đang sử dụng hệ thống.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Thao tác được phép: Gửi lời mời tới `hackmember-test-08-d@gmail.com` |
| 2 | Thao tác bị cấm: Click nút tạo bài viết hoặc gọi API `POST /api/posts` |

### Test Scenario
Xác minh rằng thành viên có quyền `INVITE_MEMBERS` có thể thực hiện gọi API gửi lời mời thành viên thành công (trả về 200/201). Ngược lại, khi cố gắng tạo bài viết:
- Nút "Create Post" trên giao diện Planner Calendar bị disabled bởi AccessGuard.
- Nếu cố tình lách qua UI để gọi API `POST /api/posts`, Backend sẽ chặn lại và trả về lỗi 403 Forbidden.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Gọi API `POST /api/team/invite` gửi lời mời bằng token của thành viên này. | Backend chấp nhận và trả về mã trạng thái 200 hoặc 201. | Lời mời gửi thành công | Pass |
| 2 | Truy cập giao diện Content Planner Calendar (`/planner/calendar`). | Giao diện Calendar tải thành công thông tin. | Giao diện hiển thị đúng | Pass |
| 3 | Kiểm tra thuộc tính của nút "Create Post" trên UI. | Nút bị vô hiệu hóa, thuộc tính `disabled` bằng `"true"`. | Nút bị disabled | Pass |
| 4 | Dùng script gỡ bỏ thuộc tính `disabled` và kích hoạt click nút. | Xuất hiện toast cảnh báo từ AccessGuard: "Bạn cần có quyền tạo bài viết để sử dụng tính năng này." | Toast cảnh báo hiển thị đúng | Pass |
| 5 | Gửi trực tiếp yêu cầu API `POST /api/posts` bằng authorization token. | Backend chặn yêu cầu và trả về lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
