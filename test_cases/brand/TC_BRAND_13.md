# Test Case: TC_BRAND_13 - Delete button visible for admin

| ID number   | TC_BRAND_13                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Delete button visible for admin                                |
| Component   | Brand Settings / Deletion / Permissions                        |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.delete.spec.js`                     |

## 1. Prerequisites
- Người dùng đăng nhập bằng tài khoản quản trị (`admin`).
- Đang ở trang cài đặt thương hiệu.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| User Role   | admin                                 |

## 3. Step-by-Step Procedure
1. Truy cập vào trang cài đặt `/manage/connections`.
2. Kiểm tra xem trên trang có xuất hiện nút xóa thương hiệu (`data-testid="delete-brand-btn"`) hay không.

## 4. Expected Result
- Nút xóa thương hiệu hiển thị ít nhất một nút đối với tài khoản `admin`.
