| Test Case ID    | TC_TEAM_03 | Test Case Description | Chặn mời trùng email hiện có (kể cả có khoảng trắng / chữ hoa) |
| --------------- | ---------| ---------------------| ------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                        |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                    |
| Test Status     | Fail      | Tester's Name        | Nhã|
| Use Case ID     | UC06 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của một Brand trên gói PRO.
2. Đang ở màn hình Quản lý đội ngũ (`/manage/team`).
3. Đã có ít nhất một thành viên tồn tại trong đội ngũ với email ví dụ: `test@gmail.com`.

### Test Data
| Parameter   | Value |
| :--- | :--- |
| Email Input | ` test@gmail.com ` (chứa khoảng trắng thừa ở đầu/cuối) |

### Test Scenario
Xác minh hệ thống loại bỏ khoảng trắng và chuẩn hóa email trước khi kiểm tra trùng lặp để chặn việc gửi lời mời trùng với thành viên hiện có.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Nhấp nút "Invite Member" để mở modal mời thành viên mới. | Modal mời thành viên mở lên thành công. | Modal hiển thị đầy đủ | Pass |
| 2 | Nhập email đã tồn tại nhưng có khoảng trắng thừa ở đầu hoặc cuối (ví dụ: ` test@gmail.com `) vào ô nhập email. | Email được điền vào ô nhập. | Email hiển thị đúng | Pass |
| 3 | Chọn một vai trò tùy chỉnh khác và bấm gửi lời mời. | Hệ thống chặn gửi, loại bỏ khoảng trắng và phát hiện email trùng lặp, hiển thị toast báo lỗi rõ ràng. | Lời mời được gửi đi thành công mà không có cảnh báo trùng lặp | Fail |

### Linked Bug
- Có liên kết với bug report [BUG_UC06_TEAM_NHA_03.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/BUG_UC06_TEAM_NHA_03.md) (`PC-55`).
