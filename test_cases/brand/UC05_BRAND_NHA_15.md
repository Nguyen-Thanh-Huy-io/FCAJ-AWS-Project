# Test Case: TC_BRAND_15 - Cancel brand creation modal works

| ID number   | TC_BRAND_15                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Cancel brand creation modal works                              |
| Component   | Brand Settings / Brand Creation / Modal                        |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.error.spec.js`                      |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC05                                                           |

## 1. Prerequisites
- Người dùng đã đăng nhập với vai trò `admin`.
- Đang ở trang cài đặt thương hiệu.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Brand Name  | `ShouldNotBeCreated`                  |

## 3. Step-by-Step Procedure
1. Tại trang `/manage/connections`, click vào nút "Add brand" (`data-testid="add-brand-btn"`).
2. Chờ modal xuất hiện và điền tên thương hiệu: `ShouldNotBeCreated` vào trường nhập tên (`data-testid="create-brand-name"`).
3. Click nút Cancel (`data-testid="cancel-brand-btn"`).
4. Xác minh rằng modal đã biến mất khỏi giao diện (staleness) và không có thương hiệu nào mới được tạo ra.

## 4. Expected Result
- Modal biến mất hoàn toàn khỏi giao diện người dùng.
- Không có phần tử input tạo thương hiệu nào còn tồn tại trong DOM.
