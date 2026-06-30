# Test Case: TC_DASHBOARD_10 - Tràn chữ tên thương hiệu (Active Brand Text Overflow)

| ID number   | TC_DASHBOARD_10                                                |
| ----------- | -------------------------------------------------------------- |
| Name        | Tràn chữ tên thương hiệu (Active Brand Text Overflow)         |
| Component   | Dashboard / UI Constraints                                     |
| Status      | Fail                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/general_dashboard.spec.js`            |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC05, UC16                                                           |

## 1. Prerequisites
- Đang hiển thị trang Dashboard `/dashboard`.

## 2. Test Data
| Parameter      | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| Long Brand Name| `SeleniumBrandWithNameThatIsExtremelyLongAndShouldBeTruncated...`  |

## 3. Step-by-Step Procedure
1. Đăng nhập vào hệ thống, truy cập trang Dashboard tại URL `/dashboard`.
2. Tạo mới hoặc cập nhật tên thương hiệu hiện tại thành một chuỗi cực kỳ dài: `SeleniumBrandWithNameThatIsExtremelyLongAndShouldBeTruncatedWithEllipsisOrWordBreak_123456789`.
3. Thực hiện làm mới (refresh) trang trình duyệt và quan sát widget hiển thị tên thương hiệu đang hoạt động ở góc trên bên phải.
4. Định vị phần tử hiển thị tên thương hiệu đang hoạt động (`Active Brand`).
5. Sử dụng script Selenium để đo lường `scrollWidth` và `clientWidth` của phần tử chứa chữ tên thương hiệu này.
6. So sánh hai giá trị: `scrollWidth` phải nhỏ hơn hoặc bằng `clientWidth`.

## 4. Expected Result
- Chữ không được tràn ra khỏi khung bao ngoài (scrollWidth <= clientWidth).
- Giao diện áp dụng cơ chế tự động rút gọn bằng dấu ba chấm (ellipsis) hoặc tự xuống dòng (word-break) gọn gàng.

## 5. Linked Bug
- Có liên kết với bug report [BUG_UC05_UC16_DASHBOARD_NHA_10.md](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/BUG_UC05_UC16_DASHBOARD_NHA_10.md) (`PC-56`).
