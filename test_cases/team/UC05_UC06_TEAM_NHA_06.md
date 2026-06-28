| Test Case ID    | TC_TEAM_06 | Test Case Description | Mời thành viên mới với Custom Role |
| --------------- | ---------| ---------------------| ---------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                             |
| Version         | 1.0       | Date Tested          | 28/06/2026                         |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC05, UC06 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của một Brand trên gói PRO.
2. Đã tạo thành công Custom Role "Restricted Analyst".
3. Đang ở màn hình Quản lý đội ngũ, tab "Thành viên".

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Email thành viên mời: `testmember@gmail.com` |
| 2 | Vai trò gán: `Restricted Analyst` |

### Test Scenario
Xác minh rằng khi mời một thành viên mới, hệ thống cho phép chọn Custom Role vừa tạo ("Restricted Analyst") và gửi lời mời thành công. Lời mời mới xuất hiện trong danh sách thành viên với trạng thái PENDING.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Nhấn nút "Invite Member" để mở modal. | Modal mời thành viên hiển thị. | Modal hiển thị | Pass |
| 2 | Nhập email mời `testmember@gmail.com`. | Email được điền vào ô input. | Email được điền | Pass |
| 3 | Click chọn vai trò tùy chỉnh "Restricted Analyst" trong danh sách dropdown/options của modal. | Vai trò tùy chỉnh được chọn chính xác. | Đã chọn Restricted Analyst | Pass |
| 4 | Bấm nút "Gửi lời mời tham gia". | Lời mời được gửi đi thành công, hiển thị toast thông báo thành công. | Toast thành công hiển thị | Pass |
| 5 | Kiểm tra bảng danh sách thành viên trên UI. | Thành viên `testmember@gmail.com` hiển thị với trạng thái PENDING và vai trò "Restricted Analyst". | Dòng thành viên mới hiển thị đúng | Pass |
