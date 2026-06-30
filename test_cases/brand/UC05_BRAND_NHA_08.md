# Test Case: TC_BRAND_08 - Update brand name

| ID number   | TC_BRAND_08                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Update brand name                                              |
| Component   | Brand Settings / Update                                        |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.update.spec.js`                     |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC05                                                           |

## 1. Prerequisites
- Người dùng đã đăng nhập với vai trò `admin`.
- Đang ở trang cài đặt thương hiệu.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| New Name    | `UpdatedBrand_<timestamp>`            |

## 3. Step-by-Step Procedure
1. Tại trang `/manage/connections`, tìm ô nhập tên thương hiệu (`data-testid="brand-name-input"`).
2. Xóa tên cũ trong ô nhập dữ liệu.
3. Nhập tên mới: `UpdatedBrand_<timestamp>`.
4. Nhấn nút "Lưu thay đổi" (`data-testid="save-brand-btn"`).
5. Xác minh rằng giá trị ô nhập tên thương hiệu hiển thị đúng tên mới vừa cập nhật.

## 4. Expected Result
- Tên thương hiệu được cập nhật hiển thị chính xác trên UI.
- API Backend lưu thành công tên mới của Brand vào database.
