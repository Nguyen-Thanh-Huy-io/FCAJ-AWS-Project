# Test Case: TC_BRAND_04 - Validation: empty name

| ID number   | TC_BRAND_04                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Validation: empty name                                         |
| Component   | Brand Settings / Brand Creation                                |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.create.spec.js`                     |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC05                                                           |

## 1. Prerequisites
- Người dùng đã đăng nhập với vai trò `admin`.
- Đang ở trang cài đặt thương hiệu.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Brand Name  | Empty (rỗng)                          |

## 3. Step-by-Step Procedure
1. Tại trang `/manage/connections`, click vào nút "Add brand" (`data-testid="add-brand-btn"`).
2. Chờ modal tạo thương hiệu xuất hiện.
3. Bỏ trống hoặc xóa sạch ô nhập tên thương hiệu (`data-testid="create-brand-name"`).
4. Kiểm tra xem nút submit (`data-testid="submit-brand-btn"`) có bị vô hiệu hóa hay không.
5. Click nút "Hủy" (`data-testid="cancel-brand-btn"`) để đóng modal.
6. Xác minh modal đóng thành công.

## 4. Expected Result
- Nút submit có thuộc tính `disabled="true"` hoặc không thể tương tác khi tên rỗng.
- Modal đóng bình thường khi nhấn Cancel.
