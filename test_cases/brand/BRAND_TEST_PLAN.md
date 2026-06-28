# Kế hoạch kiểm thử tự động (Selenium E2E Test Plan) - Phân hệ Thương hiệu (Brand)

Tài liệu này tổng hợp toàn bộ các kịch bản kiểm thử E2E bằng Selenium WebDriver cho phân hệ Quản lý Thương hiệu (Brand) tương ứng với **UC05 (Quản lý Thương hiệu)**.

## Danh sách Test Cases (Total: 11 Test Cases)

| Mã Test Case | Tên Test Case | Mô tả kịch bản | Kết quả mong đợi (Assertion) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **TC_BRAND_01** | Hiển thị trang Brand Settings | Truy cập vào cài đặt thương hiệu. | Trang cài đặt hiển thị đầy đủ thông tin thương hiệu. | Đã triển khai |
| **TC_BRAND_02** | Brands selector hiển thị | Kiểm tra sự hiển thị của bộ chọn thương hiệu (Brand Selector). | Hiển thị danh sách các thương hiệu hiện có của tài khoản. | Đã triển khai |
| **TC_BRAND_03** | Tạo mới thương hiệu thành công | Nhập tên thương hiệu hợp lệ và nhấn tạo mới. | Thương hiệu mới được tạo thành công và lưu xuống database. | Đã triển khai |
| **TC_BRAND_04** | Kiểm tra validate tên rỗng khi tạo | Bỏ trống trường tên thương hiệu khi tạo. | Nút tạo bị disable hoặc hiển thị thông báo lỗi yêu cầu nhập tên. | Đã triển khai |
| **TC_BRAND_07** | Hiển thị nút thêm Brand cho Admin | Kiểm tra quyền truy cập của Admin đối với nút thêm brand. | Admin nhìn thấy và nhấn được nút "Add Brand". | Đã triển khai |
| **TC_BRAND_08** | Cập nhật tên thương hiệu | Nhập tên mới cho thương hiệu hiện tại và nhấn lưu. | Tên thương hiệu được cập nhật thành công trên UI và DB. | Đã triển khai |
| **TC_BRAND_09** | Vô hiệu hóa nút Save khi tên không đổi | Giữ nguyên tên cũ và quan sát nút lưu. | Nút Save bị disabled (vô hiệu hóa) để tránh submit rác. | Đã triển khai |
| **TC_BRAND_11** | Chặn xóa khi chỉ có 1 thương hiệu | Thử xóa thương hiệu khi tài khoản chỉ có duy nhất 1 brand. | Nút Delete bị vô hiệu hóa, không cho phép xóa brand cuối cùng. | Đã triển khai |
| **TC_BRAND_13** | Hiển thị nút xóa cho Admin | Kiểm tra quyền hạn của Admin đối với nút xóa brand. | Admin nhìn thấy nút xóa thương hiệu khả dụng. | Đã triển khai |
| **TC_BRAND_14** | Vô hiệu hóa submit khi tên rỗng | Để trống tên thương hiệu trong modal tạo thương hiệu. | Nút submit tạo mới bị disabled. | Đã triển khai |
| **TC_BRAND_15** | Đóng modal tạo thương hiệu | Nhấn nút hủy (Cancel) trên modal tạo thương hiệu. | Modal tạo thương hiệu được đóng lại thành công. | Đã triển khai |

---

## Môi trường & File kiểm thử
- **Môi trường**: Chrome (chạy headless trên CI)
- **Tập tin kiểm thử tương ứng**: `test_selenium/brand/*.spec.js`
