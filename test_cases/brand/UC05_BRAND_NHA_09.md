# Test Case: TC_BRAND_09 - Save button disabled when name unchanged

| ID number   | TC_BRAND_09                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Save button disabled when name unchanged                        |
| Component   | Brand Settings / Update                                        |
| Status      | Fail (Gốc) / Resolved                                          |
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
| Name Input  | Giữ nguyên tên của thương hiệu đang active |

## 3. Step-by-Step Procedure
1. Tại trang `/manage/connections`, tìm ô nhập tên thương hiệu (`data-testid="brand-name-input"`).
2. Lấy tên hiện tại của thương hiệu.
3. Xóa ô nhập, sau đó nhập lại chính xác tên thương hiệu đó.
4. Kiểm tra xem nút "Lưu thay đổi" (`data-testid="save-brand-btn"`) có bị vô hiệu hóa (disabled) hay không.

## 4. Expected Result
- Nút "Lưu thay đổi" phải ở trạng thái disabled khi tên không đổi để tránh gửi request dư thừa lên server.
- Việc so khớp thuộc tính disabled trả về `"true"` hoặc giá trị không null.

## 5. Linked Bug
- Có liên kết với bug report [BUG_UC05_BRAND_NHA_PC_51_BRAND_UPDATE_DISABLED_COMPARE.md](file:///d:/Fullit/projects/PubliCast/test_cases/brand/BUG_UC05_BRAND_NHA_PC_51_BRAND_UPDATE_DISABLED_COMPARE.md) trên Jira (`PC-51`).
