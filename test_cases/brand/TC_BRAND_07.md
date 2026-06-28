# Test Case: TC_BRAND_07 - Admin can see Add brand button

| ID number   | TC_BRAND_07                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Admin can see Add brand button                                 |
| Component   | Brand Settings / Permissions                                   |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.create.spec.js`                     |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC05                                                           |

## 1. Prerequisites
- Người dùng có tài khoản quản trị viên thương hiệu (`admin`).
- Đang ở trang cài đặt thương hiệu.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| User Role   | admin                                 |

## 3. Step-by-Step Procedure
1. Truy cập vào trang cài đặt `/manage/connections`.
2. Chờ trang tải hoàn tất.
3. Kiểm tra xem phần tử nút "Add brand" (`data-testid="add-brand-btn"`) có tồn tại và hiển thị trên màn hình hay không.

## 4. Expected Result
- Nút "Add brand" hiển thị ít nhất một nút đối với tài khoản `admin`.
