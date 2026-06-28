# Kế hoạch Kiểm thử Tự động E2E - Module Profile & Settings (Hồ sơ & Thiết lập)

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Cấu hình tài khoản, Đổi mật khẩu, Kênh hỗ trợ (Support Chat), và Cổng thanh toán (Billing) (`profile/profile.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Điều hướng Tab & Deep Links
*   **TC_PROFILE_01 – Verify tab navigation updates URL query parameters**
    *   **Mã test Selenium**: `TC_PROFILE_01` trong `profile.spec.js`
    *   **Mô tả**: Bấm chuyển qua lại giữa các tab Cài đặt (Hồ sơ, Quyền truy cập, Kênh hỗ trợ, Thanh toán) trên UI.
    *   **Kết quả mong đợi**: URL query parameter thay đổi tương ứng (ví dụ: `/settings?tab=access`, `/settings?tab=support`, `/settings?tab=billing`).
*   **TC_PROFILE_02 – Verify direct navigation to tabs via URL queries**
    *   **Mã test Selenium**: `TC_PROFILE_02` trong `profile.spec.js`
    *   **Mô tả**: Truy cập trực tiếp tab cụ thể bằng cách nhập thẳng URL chứa query parameter trên trình duyệt.
    *   **Kết quả mong đợi**: Trang hiển thị đúng tab tương ứng ngay khi load xong (ví dụ: hiển thị input chat khi vào tab support, hiển thị nút nâng cấp khi vào tab billing).
*   **TC_PROFILE_03 – Verify Google linked success callback redirection**
    *   **Mã test Selenium**: `TC_PROFILE_03` trong `profile.spec.js`
    *   **Mô tả**: Giả lập callback thành công sau khi liên kết tài khoản Google bằng cách điều hướng tới `/settings?success=google_linked`.
    *   **Kết quả mong đợi**: Trình duyệt chuyển hướng tự động sang tab Access (`/settings?tab=access`) và hiển thị thông điệp liên kết thành công.

### 2. Thiết lập Thông tin tài khoản (Account Information)
*   **TC_PROFILE_04 – Verify default profile data displays correctly in inputs**
    *   **Mã test Selenium**: `TC_PROFILE_04` trong `profile.spec.js`
    *   **Mô tả**: Xác minh dữ liệu hồ sơ mặc định của người dùng hiển thị đầy đủ và chính xác trên các ô nhập liệu khi vừa load trang.
    *   **Kết quả mong đợi**: Ô nhập Họ tên (Full Name) chứa giá trị hợp lệ, không bị bỏ trống.
*   **TC_PROFILE_05 – Verify successful Profile Name update with special Vietnamese characters**
    *   **Mã test Selenium**: `TC_PROFILE_05` trong `profile.spec.js`
    *   **Mô tả**: Chỉnh sửa họ tên người dùng thành chuỗi chứa ký tự tiếng Việt đặc biệt (`Nguyễn Hữu Minh Trí`), lưu lại và refresh trang để kiểm tra độ bền vững.
    *   **Kết quả mong đợi**: Tên mới được lưu vào cơ sở dữ liệu và hiển thị chính xác sau khi reload trang.
*   **TC_PROFILE_06 – Verify Monthly Summary toggle switches state on UI**
    *   **Mã test Selenium**: `TC_PROFILE_06` trong `profile.spec.js`
    *   **Mô tả**: Nhấp chuột vào nút chuyển đổi (Toggle) nhận báo cáo tóm tắt hàng tháng qua email.
    *   **Kết quả mong đợi**: Nút toggle thay đổi trạng thái UI (kích hoạt/hủy kích hoạt) và class CSS của element cập nhật chính xác.

### 3. Phân hệ Bảo mật & Mật khẩu (Access & Security)
*   **TC_PROFILE_07 – Verify password change fails when current password is empty**
    *   **Mã test Selenium**: `TC_PROFILE_07` trong `profile.spec.js`
    *   **Mô tả**: Điền mật khẩu mới nhưng bỏ trống ô mật khẩu hiện tại và bấm Cập nhật.
    *   **Kết quả mong đợi**: Yêu cầu bị chặn và hệ thống hiển thị thông báo lỗi yêu cầu nhập mật khẩu hiện tại.
*   **TC_PROFILE_08 – Verify password change fails when current password is incorrect**
    *   **Mã test Selenium**: `TC_PROFILE_08` trong `profile.spec.js`
    *   **Mô tả**: Điền mật khẩu hiện tại sai, nhập mật khẩu mới và bấm Cập nhật.
    *   **Kết quả mong đợi**: Hệ thống chặn và hiển thị thông báo lỗi mật khẩu hiện tại không chính xác.
*   **TC_PROFILE_09 – Verify password change fails when new password is too short**
    *   **Mã test Selenium**: `TC_PROFILE_09` trong `profile.spec.js`
    *   **Mô tả**: Điền mật khẩu hiện tại đúng, nhưng nhập mật khẩu mới có độ dài dưới 6 ký tự.
    *   **Kết quả mong đợi**: Hệ thống chặn và báo lỗi mật khẩu mới phải tối thiểu 6 ký tự.
*   **TC_PROFILE_10 – Verify successful password change and restore original**
    *   **Mã test Selenium**: `TC_PROFILE_10` trong `profile.spec.js`
    *   **Mô tả**: Điền mật khẩu hiện tại đúng, đổi mật khẩu mới thành công, và ngay sau đó đổi ngược lại mật khẩu gốc để giữ môi trường ổn định.
    *   **Kết quả mong đợi**: Cả hai lần đổi mật khẩu đều diễn ra thành công không gặp lỗi.

### 4. Kênh chat Hỗ trợ (Support Chat)
*   **TC_PROFILE_11 – Verify Support Chat handles enter key to send message**
    *   **Mã test Selenium**: `TC_PROFILE_11` trong `profile.spec.js`
    *   **Mô tả**: Nhập tin nhắn hỗ trợ và nhấn phím Enter để gửi đi.
    *   **Kết quả mong đợi**: Tin nhắn hiển thị trên khung hội thoại thành công.
*   **TC_PROFILE_12 – Verify Support Chat prevents sending empty messages**
    *   **Mã test Selenium**: `TC_PROFILE_12` trong `profile.spec.js`
    *   **Mô tả**: Nhập toàn khoảng trắng vào ô chat và nhấn Enter.
    *   **Kết quả mong đợi**: Tin nhắn không được gửi đi, số lượng tin nhắn trong khung chat giữ nguyên.

### 5. Cổng thanh toán (Billing Portal)
*   **TC_PROFILE_13 – Verify Billing portal redirect to pricing page**
    *   **Mã test Selenium**: `TC_PROFILE_13` trong `profile.spec.js`
    *   **Mô tả**: Bấm nút nâng cấp (Upgrade) trong tab Billing.
    *   **Kết quả mong đợi**: Hệ thống chuyển hướng người dùng thành công tới trang bảng giá dịch vụ `/pricing`.
