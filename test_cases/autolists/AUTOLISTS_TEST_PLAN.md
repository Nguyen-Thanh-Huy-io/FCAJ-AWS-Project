# Kế hoạch Kiểm thử Tự động E2E - Module Autolists (Lập lịch tự động)

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Hàng đợi lập lịch tự động AutoLists (`autolists.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Khởi tạo & Thiết lập Hàng đợi
*   **TC_AUTOLIST_01: Tạo mới Autolist và kiểm tra lưu DB**
    *   **Mã test Selenium**: `TC_AUTOLIST_01` trong `autolists.spec.js`
    *   **Mô tả**: Tạo một hàng đợi AutoList mới, chọn nền tảng Facebook, cấu hình khoảng cách thời gian (Interval) là 1 giờ.
    *   **Kết quả mong đợi**: Bản ghi AutoList được tạo mới trong DB với `intervalMinutes` bằng 60 phút và tên hàng đợi khớp chính xác.
*   **TC_AUTOLIST_02: Sửa tên và khoảng cách Autolist và kiểm tra cập nhật DB**
    *   **Mã test Selenium**: `TC_AUTOLIST_02` trong `autolists.spec.js`
    *   **Mô tả**: Chỉnh sửa tên hàng đợi vừa tạo và cập nhật khoảng cách lên 2 giờ.
    *   **Kết quả mong đợi**: DB cập nhật đúng giá trị mới (`intervalMinutes = 120` và tên hàng đợi mới).

### 2. Cấu hình Lịch nâng cao
*   **TC_AUTOLIST_03: Cấu hình specificTimes và kiểm tra lưu DB**
    *   **Mã test Selenium**: `TC_AUTOLIST_03` trong `autolists.spec.js`
    *   **Mô tả**: Chuyển đổi chiến lược lập lịch sang "Specific Times" (chọn mốc giờ cụ thể) và lưu cấu hình.
    *   **Kết quả mong đợi**: Thuộc tính `scheduleType` trong bảng `auto_lists` của DB chuyển thành `SPECIFIC`.
*   **TC_AUTOLIST_04: Cấu hình activeDays và kiểm tra lưu DB**
    *   **Mã test Selenium**: `TC_AUTOLIST_04` trong `autolists.spec.js`
    *   **Mô tả**: Thiết lập và cập nhật các ngày hoạt động trong tuần (Active Days) của hàng đợi.
    *   **Kết quả mong đợi**: Thuộc tính `activeDays` lưu trữ danh sách các ngày được tick chọn (ví dụ: `Mo,Tu,We,Th,Fr`) chính xác xuống DB.

### 3. Vận hành Bài đăng trong Hàng đợi
*   **TC_AUTOLIST_05: Thêm bài đăng nháp vào hàng đợi và kiểm tra tính lịch**
    *   **Mã test Selenium**: `TC_AUTOLIST_05` trong `autolists.spec.js`
    *   **Mô tả**: Soạn thảo bài viết mới và đẩy trực tiếp vào hàng đợi AutoList vừa tạo.
    *   **Kết quả mong đợi**: Bài đăng được lưu vào DB với trạng thái `SCHEDULED` và có giá trị `scheduledAt` tự động tính toán hợp lệ dựa trên cấu hình AutoList.
*   **TC_AUTOLIST_06: Speedrun (Tua nhanh thời gian) trigger xuất bản và kiểm tra Planner List UI**
    *   **Mã test Selenium**: `TC_AUTOLIST_06` trong `autolists.spec.js`
    *   **Mô tả**: Sử dụng script shell gọi trực tiếp logic Backend (`publishToPlatforms`) để giả lập đến hạn đăng bài (Speedrun) và kiểm tra giao diện.
    *   **Kết quả mong đợi**: Bài viết được xuất bản, trạng thái trong DB đổi thành `FAILED` hoặc `PUBLISHED` và hiển thị trên Planner List UI.

### 4. Tạm ngưng Hàng đợi (Pause Queue)
*   **TC_AUTOLIST_07: Bật/Tắt (Pause) hàng đợi và kiểm tra BullMQ job bị hủy**
    *   **Mã test Selenium**: `TC_AUTOLIST_07` trong `autolists.spec.js`
    *   **Mô tả**: Nhấn nút Tạm dừng (Pause) hàng đợi trên giao diện danh sách AutoLists.
    *   **Kết quả mong đợi**: Thuộc tính `isActive` của AutoList trong DB chuyển thành `0` (false), các tác vụ lập lịch đăng bài tự động của hàng đợi này bị tạm dừng.
