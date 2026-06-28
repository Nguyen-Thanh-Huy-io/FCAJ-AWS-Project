| Test Case ID    | TC_TEAM_02 | Test Case Description | Kiểm tra Validation khi mời thành viên (Email rỗng & Sai format) |
| --------------- | ---------| ---------------------| ------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                        |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                    |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC06 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của một Brand trên gói PRO.
2. Đang ở màn hình Quản lý đội ngũ (`/manage/team`).

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Email trống |
| 2 | Email sai định dạng: `invalid-email` |

### Test Scenario
Xác minh rằng biểu mẫu mời thành viên mới thực hiện validate đúng định dạng email và báo lỗi toast cảnh báo nếu người dùng nhập email trống hoặc sai định dạng.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Nhấp nút "Invite Member" để mở modal mời thành viên mới. | Modal mời thành viên mở lên thành công. | Modal hiển thị đầy đủ | Pass |
| 2 | Để trống ô nhập email và bấm nút "Gửi lời mời tham gia". | Lời mời không được gửi đi, xuất hiện thông báo toast "Vui lòng nhập địa chỉ email" hoặc tương đương. | Toast hiển thị đúng thông điệp | Pass |
| 3 | Nhập email sai định dạng `invalid-email` và bấm "Gửi lời mời tham gia". | Hệ thống chặn và hiển thị toast báo lỗi định dạng email không hợp lệ. | Toast hiển thị lỗi định dạng | Pass |
| 4 | Click ra ngoài backdrop của modal. | Modal mời thành viên đóng lại thành công. | Modal đóng thành công | Pass |
