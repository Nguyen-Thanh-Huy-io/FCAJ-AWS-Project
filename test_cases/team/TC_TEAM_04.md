| Test Case ID    | TC_TEAM_04 | Test Case Description | Kiểm tra giới hạn thành viên (Plan Seats Limit) |
| --------------- | ---------| ---------------------| ----------------------------------------------- |
| Created By      | Antigravity | Reviewed By          | Nhã Võ                                          |
| Version         | 1.0       | Date Tested          | 28/06/2026                              |
| Test Status     | Pass      | Tester's Name        | Antigravity                             |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của một Brand.
2. Đang ở màn hình Quản lý đội ngũ (`/manage/team`).
3. Gói cước của Brand có số lượng ghế tối đa (`maxTeamSeats`) được thiết lập là 1 (chỉ cho phép 1 thành viên hoạt động).
4. Hiện tại Brand đã có 1 thành viên ở trạng thái ACTIVE (ví dụ: `duplicate-member@gmail.com`).

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Giới hạn ghế tối đa: `maxTeamSeats = 1` |
| 2 | Email mời thêm: `another-member@gmail.com` |
| 3 | Tên Custom Role: `Member` |

### Test Scenario
Xác minh hệ thống ngăn chặn việc gửi thêm lời mời mới khi số lượng thành viên (bao gồm ACTIVE và các lời mời PENDING) đã đạt tới giới hạn tối đa cho phép của gói cước (Seats Limit).

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Thiết lập database `plan_limits.maxTeamSeats = 1` cho Brand ID hiện tại. | Database lưu trữ giá trị giới hạn ghế là 1 thành công. | Database cập nhật thành công | Pass |
| 2 | Click "Invite Member", điền email `another-member@gmail.com` và nhấn Gửi. | Hệ thống kiểm tra giới hạn ghế, ngăn chặn gửi lời mời và hiển thị thông báo toast lỗi vượt quá giới hạn hoặc yêu cầu nâng cấp gói cước. | Toast báo lỗi giới hạn xuất hiện | Pass |
| 3 | Đóng modal và nâng giới hạn ghế lên 10 để tránh ảnh hưởng các test case tiếp theo. | Database cập nhật `plan_limits.maxTeamSeats = 10` thành công. | Database nâng lên 10 ghế thành công | Pass |
