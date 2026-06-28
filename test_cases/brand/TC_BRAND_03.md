# Test Case: TC_BRAND_03 - Create brand successfully

| ID number   | TC_BRAND_03                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Create brand successfully                                      |
| Component   | Brand Settings / Brand Creation                                |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.create.spec.js`                     |

## 1. Prerequisites
- Người dùng đã đăng nhập với vai trò `admin`.
- Đang ở trang cài đặt thương hiệu.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Brand Name  | `TestBrand_<timestamp>`               |
| Target URL  | http://localhost:5173/manage/connections |

## 3. Step-by-Step Procedure
1. Tại trang `/manage/connections`, click vào nút "Add brand" (`data-testid="add-brand-btn"`).
2. Chờ modal tạo thương hiệu xuất hiện.
3. Điền tên thương hiệu ngẫu nhiên: `TestBrand_<timestamp>` vào trường nhập tên (`data-testid="create-brand-name"`).
4. Click nút submit tạo thương hiệu (`data-testid="submit-brand-btn"`).
5. Xác minh modal đóng thành công (đợi phần tử tên đầu vào không còn trong DOM).

## 4. Expected Result
- Modal biến mất hoàn toàn sau khi gửi dữ liệu.
- Bản ghi thương hiệu mới được chèn thành công vào database và hiển thị trên giao diện danh sách thương hiệu.
