| Test Case ID    | TC_TEAM_01 | Test Case Description | Đăng ký Owner mới và hoàn tất onboarding |
| --------------- | ---------| ---------------------| --------------------------------------- |
| Created By      | Antigravity | Reviewed By          | Nhã Võ                                  |
| Version         | 1.0       | Date Tested          | 28/06/2026                              |
| Test Status     | Pass      | Tester's Name        | Antigravity                             |

### Prerequisites
1. Hệ thống PubliCast đang chạy bình thường (Frontend và Backend).
2. Kết nối Redis và cơ sở dữ liệu MySQL hoạt động ổn định.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | URL đăng ký: `http://localhost:5173/signup` |
| 2 | Họ tên: `Team Owner Tester` |
| 3 | Mật khẩu: `Password123!` |
| 4 | Email ngẫu nhiên: `teamowner<timestamp>@gmail.com` |
| 5 | Tên Brand: `Selenium Team Brand` |

### Test Scenario
Xác minh rằng người dùng mới có thể đăng ký tài khoản Owner thành công, xác minh OTP thông qua mã OTP lưu trong Redis, và hoàn tất các bước onboarding (chọn loại Creator, thiết lập Brand mới) để đi tới Dashboard chính.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Truy cập trang đăng ký (`/signup`) và điền thông tin Họ tên, Email ngẫu nhiên, Mật khẩu. Bấm submit. | Biểu mẫu được gửi đi thành công và chuyển hướng đến trang nhập mã OTP (`/verify-otp`). | Đã chuyển hướng tới `/verify-otp` | Pass |
| 2 | Truy xuất mã OTP thực tế từ Redis bằng khóa `otp:<email>`. | Nhận được mã OTP dạng chuỗi 6 chữ số hợp lệ. | Lấy được mã OTP từ Redis | Pass |
| 3 | Nhập mã OTP vào ô input và nhấn Xác nhận. | Xác nhận thành công và hệ thống dẫn tới trang onboarding `/start`. | Đã chuyển hướng tới `/start` | Pass |
| 4 | Chọn tùy chọn "Solo Creator", nhấn "Continue", sau đó nhấn "Skip for now" ở phần liên kết mạng xã hội. | Các cấu hình bước đầu được ghi nhận và chuyển tới bước thiết lập Brand. | Chọn thành công các tùy chọn và tới phần nhập Brand | Pass |
| 5 | Nhập tên Brand "Selenium Team Brand", bấm "Finish Setup" và click "Go to Dashboard". | Hệ thống lưu trữ thông tin Brand vào database, chuyển hướng tới `/dashboard`. | Chuyển hướng thành công tới `/dashboard` | Pass |
| 6 | Truy xuất cơ sở dữ liệu MySQL để kiểm tra thông tin Brand và nâng gói cước thành PRO. | Bản ghi Brand và User đã được tạo. Nâng cấp gói cước cho Brand thành công bằng cách cập nhật `allowCustomRoles = 1` và `maxTeamSeats = 2` trong table `plan_limits`. | DB cập nhật thành công gói PRO | Pass |
