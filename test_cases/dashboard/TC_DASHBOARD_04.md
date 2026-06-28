# Test Case: TC_DASHBOARD_04 - Xác minh các platform kết nối hiển thị trạng thái "Đã kết nối"

| ID number   | TC_DASHBOARD_04                                                |
| ----------- | -------------------------------------------------------------- |
| Name        | Xác minh các platform kết nối hiển thị trạng thái "Đã kết nối" |
| Component   | Dashboard / Connected Platforms                                |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/general_dashboard.spec.js`            |

## 1. Prerequisites
- Đã seed tài khoản liên kết Facebook và YouTube (isConnected = 1) vào database.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Platforms   | Facebook, YouTube                     |

## 3. Step-by-Step Procedure
1. Tại giao diện `/dashboard`, tìm khu vực các nền tảng/kênh mạng xã hội được liên kết.
2. Kiểm tra trạng thái liên kết hiển thị của Facebook.
3. Kiểm tra trạng thái liên kết hiển thị của YouTube.

## 4. Expected Result
- Cả hai nền tảng Facebook và YouTube đều hiển thị nhãn trạng thái chính xác là `"Đã kết nối"`.
