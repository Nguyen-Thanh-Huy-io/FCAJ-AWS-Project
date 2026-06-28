# Kế hoạch Kiểm thử Tự động E2E - Module Brand (Quản lý Thương hiệu)

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Quản lý Thương hiệu (`brand/*.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Xem danh sách thương hiệu (Brand List)
*   **TC_BRAND_01 – Hiển thị trang Brand Settings**
    *   **Mã test Selenium**: `TC01 – Hiển thị trang Brand Settings` trong `brand.list.spec.js`
    *   **Mô tả**: Xác minh người dùng truy cập được trang cài đặt thương hiệu và tiêu đề trang hiển thị chính xác.
    *   **Kết quả mong đợi**: URL chứa `/manage/brands` và tiêu đề thiết lập hiển thị rõ ràng.
*   **TC_BRAND_02 – Brands selector hiển thị**
    *   **Mã test Selenium**: `TC02 – Brands selector hiển thị` trong `brand.list.spec.js`
    *   **Mô tả**: Đảm bảo bộ chọn thương hiệu (dropdown/selector) hiển thị đầy đủ danh sách các thương hiệu mà người dùng có quyền truy cập.
    *   **Kết quả mong đợi**: Danh sách selector xuất hiện trên UI.

### 2. Tạo mới thương hiệu (Brand Creation)
*   **TC_BRAND_03 – Create brand successfully**
    *   **Mã test Selenium**: `TC03 – Create brand successfully` trong `brand.create.spec.js`
    *   **Mô tả**: Tạo mới thương hiệu với tên hợp lệ và lưu vào database.
    *   **Kết quả mong đợi**: Thương hiệu mới xuất hiện trên giao diện và bản ghi được tạo thành công trong DB.
*   **TC_BRAND_04 – Validation: empty name**
    *   **Mã test Selenium**: `TC04 – Validation: empty name` trong `brand.create.spec.js`
    *   **Mô tả**: Xác minh lỗi khi bỏ trống tên thương hiệu.
    *   **Kết quả mong đợi**: Nút submit bị vô hiệu hóa hoặc xuất hiện thông báo lỗi yêu cầu nhập tên thương hiệu.
*   **TC_BRAND_07 – Admin can see Add brand button**
    *   **Mã test Selenium**: `TC07 – Admin can see Add brand button` trong `brand.create.spec.js`
    *   **Mô tả**: Đảm bảo người dùng có vai trò quản trị (Admin/Owner) nhìn thấy nút tạo thương hiệu.
    *   **Kết quả mong đợi**: Nút "Tạo thương hiệu" (hoặc Add Brand) hiển thị trên UI.

### 3. Cập nhật thương hiệu (Brand Modification)
*   **TC_BRAND_08 – Update brand name**
    *   **Mã test Selenium**: `TC08 – Update brand name` trong `brand.update.spec.js`
    *   **Mô tả**: Thay đổi tên thương hiệu hiện có.
    *   **Kết quả mong đợi**: Tên thương hiệu cập nhật mới hiển thị ngay trên UI và lưu chính xác xuống DB.
*   **TC_BRAND_09 – Save button disabled when name unchanged**
    *   **Mã test Selenium**: `TC09 – Save button disabled when name unchanged` trong `brand.update.spec.js`
    *   **Mô tả**: Nút Lưu thay đổi phải bị vô hiệu hóa nếu tên thương hiệu không có gì thay đổi so với tên cũ.
    *   **Kết quả mong đợi**: Nút Save có thuộc tính `disabled`.

### 4. Xử lý lỗi & Ràng buộc (Brand Errors & Modal)
*   **TC_BRAND_14 – Submit disabled when brand name is empty**
    *   **Mã test Selenium**: `TC14 – Submit disabled when brand name is empty` trong `brand.error.spec.js`
    *   **Mô tả**: Ràng buộc không cho phép bấm nút Submit khi tên thương hiệu trống.
    *   **Kết quả mong đợi**: Thuộc tính disabled được áp dụng chính xác cho nút Lưu.
*   **TC_BRAND_15 – Cancel brand creation modal works**
    *   **Mã test Selenium**: `TC15 – Cancel brand creation modal works` trong `brand.error.spec.js`
    *   **Mô tả**: Đóng modal tạo thương hiệu bằng nút Hủy bỏ.
    *   **Kết quả mong đợi**: Modal biến mất khỏi DOM, trạng thái UI quay lại bình thường.

### 5. Xóa thương hiệu (Brand Deletion)
*   **TC_BRAND_11 – Delete button disabled when only 1 brand**
    *   **Mã test Selenium**: `TC11 – Delete button disabled when only 1 brand` trong `brand.delete.spec.js`
    *   **Mô tả**: Nếu tài khoản chỉ có duy nhất 1 thương hiệu, hệ thống phải chặn không cho xóa thương hiệu cuối cùng này.
    *   **Kết quả mong đợi**: Nút Xóa bị vô hiệu hóa (disabled).
*   **TC_BRAND_13 – Delete button visible for admin**
    *   **Mã test Selenium**: `TC13 – Delete button visible for admin` trong `brand.delete.spec.js`
    *   **Mô tả**: Xác minh nút Xóa thương hiệu hiển thị cho tài khoản Admin/Owner.
    *   **Kết quả mong đợi**: Nút xóa hiển thị đúng quyền phân quyền.
