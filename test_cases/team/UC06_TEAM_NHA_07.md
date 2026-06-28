| Test Case ID    | TC_TEAM_07 | Test Case Description | Quy trình chấp nhận lời mời và Kích hoạt tài khoản thành viên |
| --------------- | ---------| ---------------------| ----------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                      |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                  |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Đã gửi lời mời tới `testmember@gmail.com` với Custom Role "Restricted Analyst".
2. Hệ thống API Backend đang mở.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Email thành viên: `testmember@gmail.com` |
| 2 | Mật khẩu thành viên: `Password123!` |
| 3 | Họ tên thành viên: `Selenium Member Tester` |
| 4 | Token mời lấy từ API hoặc giả lập qua DB |

### Test Scenario
Xác minh quy trình người dùng nhận được liên kết mời có chứa token hợp lệ, truy cập vào liên kết, điền đầy đủ họ tên và mật khẩu để kích hoạt tài khoản thành công, sau đó đăng nhập thẳng vào hệ thống PubliCast.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Sử dụng API Backend gọi tạo lời mời mới để trích xuất mã token hợp lệ trong phản hồi API. | Nhận được mã token mời (invitation token) dạng chuỗi băm. | Đã lấy được token | Pass |
| 2 | Đăng xuất tài khoản Owner hiện tại ra khỏi hệ thống. | Trình duyệt chuyển hướng về trang đăng nhập và xóa session/cookie. | Đăng xuất thành công | Pass |
| 3 | Truy cập URL mời dạng: `http://localhost:5173/invite?token=<token>`. | Giao diện đăng ký/kích hoạt cho thành viên được mời hiển thị. | Hiển thị màn hình Accept Invite | Pass |
| 4 | Nhập Họ tên "Selenium Member Tester", Mật khẩu "Password123!" và bấm nút kích hoạt/tạo tài khoản. | Hệ thống lưu thông tin người dùng, cập nhật trạng thái liên kết thành công. | Gửi thông tin thành công | Pass |
| 5 | Nhấn nút "Đi tới Dashboard" ở màn hình hoàn tất chấp nhận lời mời. | Người dùng được tự động đăng nhập và dẫn vào `/dashboard` của Brand đã mời mình. | Vào dashboard thành công | Pass |
