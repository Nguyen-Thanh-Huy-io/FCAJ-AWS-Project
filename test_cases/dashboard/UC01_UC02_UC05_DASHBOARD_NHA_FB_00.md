# Test Case: TC_FB_DB_00 - Đăng ký người dùng test mới và hoàn tất onboarding Facebook Dashboard

| ID number   | TC_FB_DB_00                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Đăng ký người dùng test mới và hoàn tất onboarding             |
| Component   | Dashboard / Facebook Dashboard / Onboarding                    |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/facebook_dashboard.spec.js`           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC01, UC02, UC05                                                           |

## 1. Prerequisites
- Hệ thống Redis, MySQL và Backend/Frontend PubliCast đang chạy bình thường.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Email       | `seleniumfbadmin<timestamp>@gmail.com` |
| Password    | `Password123!`                        |

## 3. Step-by-Step Procedure
1. Truy cập vào trang đăng ký tài khoản mới `/signup`.
2. Điền họ tên, Email ngẫu nhiên, mật khẩu và tick đồng ý điều khoản.
3. Click "Submit" đăng ký.
4. Lấy mã OTP từ Redis dựa trên khóa `otp:<email>`.
5. Điền mã OTP vào ô nhập trên màn hình để xác nhận.
6. Hoàn tất các bước Onboarding chính thức (chọn loại Creator, điền tên Brand).
7. Điều hướng vào trang `/dashboard`.

## 4. Expected Result
- Người dùng vượt qua bước onboarding và truy cập thành công trang Dashboard chính của workspace mới.
