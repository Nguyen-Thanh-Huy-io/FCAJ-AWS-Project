# Test Case: TC_YT_DB_00 - Đăng ký tài khoản mới, onboarding và seed dữ liệu YouTube Dashboard

| ID number   | TC_YT_DB_00                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Đăng ký tài khoản mới, onboarding và seed dữ liệu YouTube      |
| Component   | Analytics / YouTube Dashboard / Onboarding                    |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/youtube_dashboard.spec.js`             |

## 1. Prerequisites
- Hệ thống Redis, MySQL, và Backend/Frontend PubliCast đang hoạt động.
- Email đăng ký chưa tồn tại trên hệ thống.

## 2. Test Data
| Parameter     | Value                                 |
| ------------- | ------------------------------------- |
| Email         | `seleniumyt<timestamp>@gmail.com`     |
| Password      | `Password123!`                        |

## 3. Step-by-Step Procedure
1. Truy cập trang đăng ký `/signup`.
2. Nhập họ tên, Email ngẫu nhiên, mật khẩu và tích chọn điều khoản.
3. Submit đăng ký, lấy mã OTP từ Redis thông qua khóa `otp:<email>`.
4. Nhập mã OTP và nhấn Xác minh để điều hướng tới trang onboarding `/start`.
5. Hoàn tất các bước Onboarding (chọn loại Creator, thiết lập tên Brand).
6. Sử dụng API/DB seed trực tiếp dữ liệu thống kê YouTube (Social Accounts, YouTube Channels, Analytics, Social Analytics, Competitors) cho brand vừa tạo.
7. Điều hướng vào trang `/dashboard/youtube`.

## 4. Expected Result
- Người dùng đăng ký thành công và được chuyển hướng vào giao diện dashboard YouTube.
- Dữ liệu mock (lượt xem, sub, video) hiển thị đầy đủ trên giao diện sau khi reload trang.
