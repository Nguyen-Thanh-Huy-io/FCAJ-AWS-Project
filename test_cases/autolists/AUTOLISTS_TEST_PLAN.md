# Kế hoạch Kiểm thử Tự động E2E - Module Autolists (Lập lịch tự động)

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Hàng đợi lập lịch tự động AutoLists (`autolists.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Khởi tạo & Thiết lập Hàng đợi
*   **[TC_AUTOLIST_01](file:///d:/Fullit/projects/PubliCast/test_cases/autolists/TC_AUTOLIST_01.md): Tạo mới Autolist và kiểm tra lưu DB**
    *   **Mã test Selenium**: `TC_AUTOLIST_01` trong `autolists.spec.js`
    *   **Mô tả**: Tạo một hàng đợi AutoList mới, chọn nền tảng Facebook, cấu hình khoảng cách thời gian (Interval) là 1 giờ.
*   **[TC_AUTOLIST_02](file:///d:/Fullit/projects/PubliCast/test_cases/autolists/TC_AUTOLIST_02.md): Sửa tên và khoảng cách Autolist và kiểm tra cập nhật DB**
    *   **Mã test Selenium**: `TC_AUTOLIST_02` trong `autolists.spec.js`
    *   **Mô tả**: Chỉnh sửa tên hàng đợi vừa tạo và cập nhật khoảng cách lên 2 giờ.

### 2. Cấu hình Lịch nâng cao
*   **[TC_AUTOLIST_03](file:///d:/Fullit/projects/PubliCast/test_cases/autolists/TC_AUTOLIST_03.md): Cấu hình specificTimes và kiểm tra lưu DB**
    *   **Mã test Selenium**: `TC_AUTOLIST_03` trong `autolists.spec.js`
    *   **Mô tả**: Chuyển đổi chiến lược lập lịch sang "Specific Times" (chọn mốc giờ cụ thể) và lưu cấu hình.
*   **[TC_AUTOLIST_04](file:///d:/Fullit/projects/PubliCast/test_cases/autolists/TC_AUTOLIST_04.md): Cấu hình activeDays và kiểm tra lưu DB**
    *   **Mã test Selenium**: `TC_AUTOLIST_04` trong `autolists.spec.js`
    *   **Mô tả**: Thiết lập và cập nhật các ngày hoạt động trong tuần (Active Days) của hàng đợi.

### 3. Vận hành Bài đăng trong Hàng đợi
*   **[TC_AUTOLIST_05](file:///d:/Fullit/projects/PubliCast/test_cases/autolists/TC_AUTOLIST_05.md): Thêm bài đăng nháp vào hàng đợi và kiểm tra tính lịch**
    *   **Mã test Selenium**: `TC_AUTOLIST_05` trong `autolists.spec.js`
    *   **Mô tả**: Soạn thảo bài viết mới và đẩy trực tiếp vào hàng đợi AutoList vừa tạo.
*   **[TC_AUTOLIST_06](file:///d:/Fullit/projects/PubliCast/test_cases/autolists/TC_AUTOLIST_06.md): Speedrun trigger xuất bản và kiểm tra Planner List UI**
    *   **Mã test Selenium**: `TC_AUTOLIST_06` trong `autolists.spec.js`
    *   **Mô tả**: Giả lập đến hạn đăng bài (Speedrun) và kiểm tra sự thay đổi trạng thái của bài viết trên giao diện lịch Planner.

### 4. Tạm ngưng Hàng đợi (Pause Queue)
*   **[TC_AUTOLIST_07](file:///d:/Fullit/projects/PubliCast/test_cases/autolists/TC_AUTOLIST_07.md): Bật/Tắt (Pause) hàng đợi và kiểm tra BullMQ job bị hủy**
    *   **Mã test Selenium**: `TC_AUTOLIST_07` trong `autolists.spec.js`
    *   **Mô tả**: Nhấn nút Tạm dừng (Pause) hàng đợi trên giao diện danh sách AutoLists.
    *   **Bug liên kết**: [BUG_AUTOLIST_001.md](file:///d:/Fullit/projects/PubliCast/test_cases/autolists/BUG_AUTOLIST_001.md) (Trôi lịch biểu - Resolved)
