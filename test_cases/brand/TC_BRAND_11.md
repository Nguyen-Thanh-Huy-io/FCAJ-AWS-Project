# Test Case: TC_BRAND_11 - Delete button disabled when only 1 brand

| ID number   | TC_BRAND_11                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Delete button disabled when only 1 brand                       |
| Component   | Brand Settings / Deletion                                      |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.delete.spec.js`                     |

## 1. Prerequisites
- Người dùng đã đăng nhập với vai trò `admin`.
- Tài khoản người dùng chỉ sở hữu duy nhất 1 thương hiệu (Brand).
- Đang ở trang cài đặt thương hiệu.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Brand Count | 1                                     |

## 3. Step-by-Step Procedure
1. Truy cập vào trang cài đặt `/manage/connections`.
2. Kiểm tra xem phần tử nút xóa thương hiệu (`data-testid="delete-brand-btn"`) có tồn tại hay không.
3. Kiểm tra thuộc tính `disabled` của nút xóa thương hiệu này.

## 4. Expected Result
- Nút xóa thương hiệu tồn tại.
- Nút xóa thương hiệu ở trạng thái bị vô hiệu hóa (`disabled`) vì hệ thống ràng buộc không được phép xóa thương hiệu duy nhất (cuối cùng) của tài khoản.
