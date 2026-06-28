# Test Case: TC_DASHBOARD_08_09 - Các liên kết nhanh Planner và Connections từ Dashboard

| ID number   | TC_DASHBOARD_08_09                                             |
| ----------- | -------------------------------------------------------------- |
| Name        | Các liên kết nhanh Planner và Connections từ Dashboard        |
| Component   | Dashboard / Quick Links                                        |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/general_dashboard.spec.js`            |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC13, UC14                                                           |

## 1. Prerequisites
- Đang hiển thị trang Dashboard `/dashboard`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Button 1    | Lịch đăng                             |
| Button 2    | Quản lý                               |

## 3. Step-by-Step Procedure
1. Tại giao diện Dashboard, định vị và click nút "Lịch đăng" (Planner link).
2. Xác minh URL trình duyệt chuyển sang `/planner`.
3. Quay lại trang `/dashboard`.
4. Định vị và click nút "Quản lý" (Manage connections link).
5. Xác minh URL trình duyệt chuyển sang `/manage/connections`.
6. Quay lại trang `/dashboard`.

## 4. Expected Result
- Các nút liên kết hoạt động tốt, thực hiện chuyển hướng đúng trang đích tương ứng trên UI mà không bị đứng trang.
