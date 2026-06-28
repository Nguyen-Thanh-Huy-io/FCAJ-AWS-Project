# Test Case: TC_DASHBOARD_00 - Đăng ký người dùng test mới, hoàn tất onboarding và seed dữ liệu

| ID number   | TC_DASHBOARD_00                                                |
| ----------- | -------------------------------------------------------------- |
| Name        | Đăng ký người dùng test mới, hoàn tất onboarding và seed dữ liệu|
| Component   | Dashboard / General Onboarding                                 |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/general_dashboard.spec.js`            |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC01, UC02, UC05                                                           |

## 1. Prerequisites
- Hệ thống Redis, MySQL, và Backend/Frontend PubliCast đang hoạt động.
- Email đăng ký chưa tồn tại trên hệ thống.

## 2. Test Data
| Parameter     | Value                                 |
| ------------- | ------------------------------------- |
| Email         | `seleniumdashboard<timestamp>@gmail.com` |
| Password      | `Password123!`                        |

## 3. Step-by-Step Procedure
1. Truy cập trang đăng ký `/signup`.
2. Nhập họ tên, Email ngẫu nhiên, mật khẩu và tích chọn điều khoản.
3. Submit đăng ký, lấy mã OTP từ Redis thông qua khóa `otp:<email>`.
4. Nhập mã OTP và nhấn Xác minh để điều hướng tới trang onboarding `/start`.
5. Hoàn tất các bước Onboarding (chọn loại Creator, thiết lập tên Brand).
6. Sử dụng API/DB seed trực tiếp dữ liệu thống kê General Dashboard (Social Accounts, Analytics, Social Analytics, Posts) cho brand vừa tạo.
7. Điều hướng vào trang `/dashboard`.

## 4. Expected Result
- Người dùng đăng ký thành công và được chuyển hướng vào giao diện `/dashboard`.
- Dữ liệu mock hiển thị đầy đủ trên giao diện sau khi reload trang.
