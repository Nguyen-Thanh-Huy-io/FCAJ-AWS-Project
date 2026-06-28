# Test Case: TC_DASHBOARD_10 - Tràn chữ tên thương hiệu (Active Brand Text Overflow)

| ID number   | TC_DASHBOARD_10                                                |
| ----------- | -------------------------------------------------------------- |
| Name        | Tràn chữ tên thương hiệu (Active Brand Text Overflow)         |
| Component   | Dashboard / UI Constraints                                     |
| Status      | Fail (Gốc) / Resolved                                          |
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
1. Cập nhật tên thương hiệu hiện tại trong database thành chuỗi cực kỳ dài: `SeleniumBrandWithNameThatIsExtremelyLongAndShouldBeTruncatedWithEllipsisOrWordBreak_123456789`.
2. Thực hiện làm mới (refresh) trang trình duyệt để nhận tên thương hiệu mới.
3. Định vị phần tử hiển thị tên thương hiệu đang hoạt động (`Active Brand`).
4. Sử dụng script Selenium để đo lường `scrollWidth` và `clientWidth` của phần tử chứa chữ tên thương hiệu này.
5. So sánh hai giá trị: `scrollWidth` phải nhỏ hơn hoặc bằng `clientWidth`.

## 4. Expected Result
- Chữ không được tràn ra khỏi khung bao ngoài (scrollWidth <= clientWidth).
- Giao diện áp dụng cơ chế tự động rút gọn bằng dấu ba chấm (ellipsis) hoặc tự xuống dòng (word-break) gọn gàng.

## 5. Linked Bug
- Có liên kết với bug report [BUG_UC05_UC16_DASHBOARD_NHA_PC_56_ACTIVE_BRAND_OVERFLOW.md](file:///d:/Fullit/projects/PubliCast/test_cases/dashboard/BUG_UC05_UC16_DASHBOARD_NHA_PC_56_ACTIVE_BRAND_OVERFLOW.md) (`PC-56`).
