# Test Case: TC_BRAND_02 - Brands selector hiển thị

| ID number   | TC_BRAND_02                                                    |
| ----------- | -------------------------------------------------------------- |
| Name        | Brands selector hiển thị                                      |
| Component   | Brand Settings                                                 |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/brand/brand.list.spec.js`                       |

## 1. Prerequisites
- Người dùng đã đăng nhập với vai trò `admin`.
- Đang ở trang cài đặt thương hiệu.

## 2. Test Data
| Parameter   | Value                                |
| ----------- | ------------------------------------ |
| Target URL  | http://localhost:5173/manage/connections |

## 3. Step-by-Step Procedure
1. Điều hướng đến trang quản lý `/manage/connections`.
2. Kiểm tra phần tử Selector chọn thương hiệu có tồn tại trên giao diện hay không bằng cách định vị phần tử `[data-testid="brand-name-input"]` hoặc class `bg-[#F8F9FB]`.

## 4. Expected Result
- Bộ chọn thương hiệu (Selector) được hiển thị đầy đủ trên giao diện.
- Người dùng có thể nhìn thấy thương hiệu hiện tại đang hoạt động.
