| Test Case ID    | TC_TEAM_10 | Test Case Description | Mời hàng loạt thành viên (Bulk Team Invitation) |
| --------------- | ---------| ---------------------| --------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                  |
| Version         | 1.0       | Date Tested          | 30/06/2026                              |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC06 |

### Prerequisites
1. Hệ thống PubliCast đang chạy bình thường (Frontend và Backend).
2. Đã đăng nhập vào tài khoản Owner và có quyền `INVITE_MEMBERS`.
3. Số lượng ghế trống (Seats) trong Brand Plan lớn hơn hoặc bằng 2.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | URL quản lý thành viên: `http://localhost:5173/manage/team` |
| 2 | Danh sách email: `bulk1@gmail.com, bulk2@gmail.com` |
| 3 | Vai trò: `Admin` |

### Test Scenario
Xác minh rằng Owner có thể nhập danh sách nhiều địa chỉ email (phân cách bằng dấu phẩy) vào textarea mời thành viên, chọn vai trò mong muốn, và gửi lời mời hàng loạt thành công. Hệ thống sẽ tạo tài khoản shell cho các email đó, gửi lời mời và hiển thị cả hai thành viên ở trạng thái PENDING trên giao diện quản lý thành viên.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Truy cập trang quản lý thành viên (`/manage/team`) và nhấn nút "Invite Member". | Modal "Mời thành viên mới" hiển thị, chứa trường textarea để nhập danh sách email. | Modal hiển thị đầy đủ và có textarea | Pass |
| 2 | Nhập chuỗi email `bulk1@gmail.com, bulk2@gmail.com` vào trường nhập email và chọn vai trò "Admin". | Dữ liệu được ghi nhận chính xác trong ô nhập liệu. | Nhập thành công các email và chọn vai trò Admin | Pass |
| 3 | Nhấn nút "Gửi lời mời tham gia". | Lời mời được gửi đi thông qua API mời hàng loạt. Toast thông báo thành công hiển thị: "Đã gửi lời mời thành công tới 2 thành viên!". | Toast hiển thị thông báo thành công cho 2 thành viên | Pass |
| 4 | Quan sát danh sách thành viên trong bảng. | Cả hai dòng tương ứng với `bulk1@gmail.com` và `bulk2@gmail.com` xuất hiện trong bảng với trạng thái "PENDING" và vai trò "ADMIN". | Hai dòng xuất hiện chính xác với trạng thái PENDING | Pass |
| 5 | Dọn dẹp cơ sở dữ liệu sau kiểm thử. | Xóa thành công các tài khoản shell và bản ghi team tương ứng khỏi database để đảm bảo tính độc lập của test case. | Đã dọn dẹp sạch sẽ dữ liệu DB | Pass |
