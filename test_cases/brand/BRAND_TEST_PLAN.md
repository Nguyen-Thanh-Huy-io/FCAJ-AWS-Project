# Kế hoạch Kiểm thử Tự động E2E - Module Brand (Quản lý Thương hiệu)

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Quản lý Thương hiệu (`brand/*.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Xem danh sách thương hiệu (Brand List)
*   **[TC_BRAND_01](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_01.md) – Hiển thị trang Brand Settings**
    *   **Mã test Selenium**: `TC01 – Hiển thị trang Brand Settings` trong `brand.list.spec.js`
    *   **Mô tả**: Xác minh người dùng truy cập được trang cài đặt thương hiệu và tiêu đề trang hiển thị chính xác.
*   **[TC_BRAND_02](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_02.md) – Brands selector hiển thị**
    *   **Mã test Selenium**: `TC02 – Brands selector hiển thị` trong `brand.list.spec.js`
    *   **Mô tả**: Đảm bảo bộ chọn thương hiệu (dropdown/selector) hiển thị đầy đủ danh sách các thương hiệu mà người dùng có quyền truy cập.

### 2. Tạo mới thương hiệu (Brand Creation)
*   **[TC_BRAND_03](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_03.md) – Create brand successfully**
    *   **Mã test Selenium**: `TC03 – Create brand successfully` trong `brand.create.spec.js`
    *   **Mô tả**: Tạo mới thương hiệu với tên hợp lệ và lưu vào database.
*   **[TC_BRAND_04](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_04.md) – Validation: empty name**
    *   **Mã test Selenium**: `TC04 – Validation: empty name` trong `brand.create.spec.js`
    *   **Mô tả**: Xác minh lỗi khi bỏ trống tên thương hiệu.
*   **[TC_BRAND_07](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_07.md) – Admin can see Add brand button**
    *   **Mã test Selenium**: `TC07 – Admin can see Add brand button` trong `brand.create.spec.js`
    *   **Mô tả**: Đảm bảo người dùng có vai trò quản trị (Admin/Owner) nhìn thấy nút tạo thương hiệu.

### 3. Cập nhật thương hiệu (Brand Modification)
*   **[TC_BRAND_08](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_08.md) – Update brand name**
    *   **Mã test Selenium**: `TC08 – Update brand name` trong `brand.update.spec.js`
    *   **Mô tả**: Thay đổi tên thương hiệu hiện có.
*   **[TC_BRAND_09](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_09.md) – Save button disabled when name unchanged**
    *   **Mã test Selenium**: `TC09 – Save button disabled when name unchanged` trong `brand.update.spec.js`
    *   **Mô tả**: Nút Lưu thay đổi phải bị vô hiệu hóa nếu tên thương hiệu không có gì thay đổi so với tên cũ.
    *   **Bug liên kết**: [BUG_PC_51_BRAND_UPDATE_DISABLED_COMPARE.md](file:///d:/Fullit/projects/PubliCast/test_cases/brand/BUG_PC_51_BRAND_UPDATE_DISABLED_COMPARE.md) (Jira Key: `PC-51`)

### 4. Xử lý lỗi & Ràng buộc (Brand Errors & Modal)
*   **[TC_BRAND_14](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_14.md) – Submit disabled when brand name is empty**
    *   **Mã test Selenium**: `TC14 – Submit disabled when brand name is empty` trong `brand.error.spec.js`
    *   **Mô tả**: Ràng buộc không cho phép bấm nút Submit khi tên thương hiệu trống.
*   **[TC_BRAND_15](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_15.md) – Cancel brand creation modal works**
    *   **Mã test Selenium**: `TC15 – Cancel brand creation modal works` trong `brand.error.spec.js`
    *   **Mô tả**: Đóng modal tạo thương hiệu bằng nút Hủy bỏ.

### 5. Xóa thương hiệu (Brand Deletion)
*   **[TC_BRAND_11](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_11.md) – Delete button disabled when only 1 brand**
    *   **Mã test Selenium**: `TC11 – Delete button disabled when only 1 brand` trong `brand.delete.spec.js`
    *   **Mô tả**: Nếu tài khoản chỉ có duy nhất 1 thương hiệu, hệ thống phải chặn không cho xóa thương hiệu cuối cùng này.
*   **[TC_BRAND_13](file:///d:/Fullit/projects/PubliCast/test_cases/brand/TC_BRAND_13.md) – Delete button visible for admin**
    *   **Mã test Selenium**: `TC13 – Delete button visible for admin` trong `brand.delete.spec.js`
    *   **Mô tả**: Xác minh nút Xóa thương hiệu hiển thị cho tài khoản Admin/Owner.
