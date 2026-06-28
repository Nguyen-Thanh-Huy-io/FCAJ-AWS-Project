# Test Case: TC_YT_DB_11 - Trạng thái Empty State chưa kết nối YouTube

| ID number   | TC_YT_DB_11                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Trạng thái Empty State chưa kết nối YouTube                    |
| Component   | Analytics / YouTube Dashboard / Empty State                    |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/youtube_dashboard.spec.js`             |

## 1. Prerequisites
- Người dùng đã đăng nhập vào hệ thống nhưng thương hiệu hiện tại chưa kết nối với bất kỳ kênh YouTube nào.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Brand       | Brand mới chưa liên kết kênh YouTube  |

## 3. Step-by-Step Procedure
1. Truy cập vào trang `/dashboard/youtube`.
2. Kiểm tra xem màn hình Empty State có hiển thị hay không.
3. Kiểm tra xem có nút "Kết nối YouTube" (Connect YouTube) hay không.
4. Click thử nút kết nối để xác minh nó dẫn đến trang `/manage/connections`.

## 4. Expected Result
- Giao diện không hiển thị các biểu đồ hay bảng số liệu trống mà hiển thị màn hình hướng dẫn "Chưa kết nối kênh YouTube".
- Có nút kêu gọi hành động "Kết nối YouTube" rõ ràng và click vào sẽ chuyển hướng thành công đến trang quản lý kết nối.
