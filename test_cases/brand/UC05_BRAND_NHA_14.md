# Test Case: TC_BRAND_14 - Submit disabled when brand name is empty

| ID number   | TC_BRAND_14                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Submit disabled when brand name is empty                       |
| Component   | Brand Settings / Brand Creation / Errors                       |
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
| Brand Name  | Rỗng (empty)                          |

## 3. Step-by-Step Procedure
1. Tại trang `/manage/connections`, click vào nút "Add brand" (`data-testid="add-brand-btn"`).
2. Chờ modal tạo thương hiệu xuất hiện.
3. Clear sạch ô nhập tên thương hiệu (`data-testid="create-brand-name"`).
4. Kiểm tra xem nút submit (`data-testid="submit-brand-btn"`) có bị vô hiệu hóa (`disabled`) hay không.
5. Click nút Cancel (`data-testid="cancel-brand-btn"`) để đóng modal.

## 4. Expected Result
- Nút submit có thuộc tính `disabled="true"` hoặc không thể tương tác khi tên rỗng.
- Modal đóng thành công khi nhấn Cancel.
