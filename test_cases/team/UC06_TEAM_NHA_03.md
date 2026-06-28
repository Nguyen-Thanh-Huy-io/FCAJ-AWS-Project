| Test Case ID    | TC_TEAM_03 | Test Case Description | Chặn mời trùng email hiện có (kể cả có khoảng trắng / chữ hoa) |
| --------------- | ---------| ---------------------| ------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                        |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                    |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC06 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của một Brand trên gói PRO.
2. Đang ở màn hình Quản lý đội ngũ (`/manage/team`).
3. Đã mời thành viên `duplicate-member@gmail.com` và chuyển trạng thái thành ACTIVE trong DB.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Email thành viên đã hoạt động: `duplicate-member@gmail.com` |
| 2 | Email trùng lặp có khoảng trắng và viết hoa: `   DUPLICATE-MEMBER@gmail.com   ` |

### Test Scenario
Xác minh hệ thống chuẩn hóa địa chỉ email bằng cách cắt bỏ khoảng trắng đầu/cuối và chuyển về chữ thường, sau đó chặn gửi lời mời nếu email trùng lặp với một thành viên đã hoạt động (ACTIVE) trong cùng Brand.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Mời lần đầu email `duplicate-member@gmail.com`. | Lời mời gửi đi thành công. | Gửi thành công | Pass |
| 2 | Chạy script cập nhật trạng thái của thành viên này thành ACTIVE trực tiếp trong database. | Bản ghi trong bảng `teams` được cập nhật trạng thái thành ACTIVE. | Trạng thái cập nhật thành ACTIVE | Pass |
| 3 | Mở lại modal Invite Member, nhập email trùng lặp: `   DUPLICATE-MEMBER@gmail.com   ` và bấm gửi. | Hệ thống chặn yêu cầu gửi lời mời, hiển thị toast thông báo email này đã là thành viên của brand. | Hiển thị toast lỗi trùng lặp | Pass |
| 4 | Đóng modal và đóng backdrop. | Modal đóng thành công. | Modal đóng thành công | Pass |
