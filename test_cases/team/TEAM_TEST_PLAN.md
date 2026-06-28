# Kế hoạch Kiểm thử Tự động E2E - Module Team (Quản lý Đội ngũ & Phân quyền)

Tài liệu này ánh xạ các kịch bản kiểm thử tự động (E2E Selenium) của phân hệ Quản lý Đội ngũ và Custom Roles (`team/team_management.spec.js`) sang các mô tả nghiệp vụ chi tiết.

## 📋 Danh sách Test Cases Ánh xạ

### 1. Onboarding & Đăng ký (Onboarding)
*   **TC_TEAM_01: Đăng ký Owner mới và hoàn tất onboarding**
    *   **Mã test Selenium**: `TC_TEAM_01` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_01.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_01.md)
    *   **Mô tả**: Tạo tài khoản Owner mới, xác minh OTP qua Redis, hoàn thành điền thông tin và tạo Brand đầu tiên.
    *   **Kết quả mong đợi**: Tài khoản được kích hoạt (ACTIVE), chuyển hướng thành công tới `/dashboard`.

### 2. Mời thành viên & Validation (Invitations)
*   **TC_TEAM_02: Kiểm tra Validation khi mời thành viên (Email rỗng & Sai format)**
    *   **Mã test Selenium**: `TC_TEAM_02` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_02.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_02.md)
    *   **Mô tả**: Gửi lời mời với email rỗng hoặc sai định dạng.
    *   **Kết quả mong đợi**: Xuất hiện thông báo lỗi toast "Vui lòng nhập địa chỉ email" hoặc lỗi định dạng email tương ứng.
*   **TC_TEAM_03: Chặn mời trùng email hiện có (kể cả có khoảng trắng / chữ hoa)**
    *   **Mã test Selenium**: `TC_TEAM_03` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_03.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_03.md)
    *   **Mô tả**: Gửi lời mời tới một email đã tồn tại trong danh sách thành viên của Brand.
    *   **Kết quả mong đợi**: Toast hiển thị cảnh báo email đã là thành viên hoặc đã tồn tại.
*   **TC_TEAM_04: Kiểm tra giới hạn thành viên (Plan Seats Limit)**
    *   **Mã test Selenium**: `TC_TEAM_04` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_04.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_04.md)
    *   **Mô tả**: Thử mời số lượng thành viên vượt quá giới hạn số lượng ghế (Seats Limit) của gói cước hiện tại.
    *   **Kết quả mong đợi**: Hệ thống hiển thị toast lỗi yêu cầu nâng cấp gói cước.

### 3. Quản lý Vai trò tùy chỉnh (Custom Roles)
*   **TC_TEAM_05: Quản lý Custom Role (Tạo mới & validate tên vai trò)**
    *   **Mã test Selenium**: `TC_TEAM_05` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_05.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_05.md)
    *   **Mô tả**: Tạo một Custom Role mới với các quyền cụ thể và xác minh validate tên không được để trống.
    *   **Kết quả mong đợi**: Ghi nhận Custom Role mới trong DB và hiển thị trên UI.
*   **TC_TEAM_06: Mời thành viên mới với Custom Role**
    *   **Mã test Selenium**: `TC_TEAM_06` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_06.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_06.md)
    *   **Mô tả**: Mời thành viên và gán Custom Role vừa tạo (ví dụ: "Restricted Analyst").
    *   **Kết quả mong đợi**: Lời mời được gửi đi thành công với trạng thái PENDING hiển thị trên danh sách.

### 4. Quy trình chấp nhận lời mời (Accept Invitation Flow)
*   **TC_TEAM_07: Quy trình chấp nhận lời mời và Kích hoạt tài khoản thành viên**
    *   **Mã test Selenium**: `TC_TEAM_07` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_07.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_07.md)
    *   **Mô tả**: Lấy link mời chứa token từ email giả lập, đăng xuất Owner, truy cập link mời dưới tư cách thành viên, điền thông tin kích hoạt tài khoản.
    *   **Kết quả mong đợi**: Thành viên đăng nhập thành công và được dẫn thẳng vào `/dashboard` của Brand được mời.

### 5. Kiểm chứng phân quyền trên UI & API (Role-Based Access Control)
*   **TC_TEAM_08: Kiểm chứng phân quyền Custom Role hạn chế trên UI & Backend API**
    *   **Mã test Selenium**: `TC_TEAM_08` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_08.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_08.md)
    *   **Mô tả**: Kiểm tra các hành động bị cấm đối với tài khoản chỉ có quyền phân tích (không có quyền tạo bài, quản lý team).
    *   **Kết quả mong đợi**: Các menu/action bị cấm phải bị ẩn trên UI, và gọi API trực tiếp phải bị Backend trả về lỗi 403 Forbidden.
*   **TC_TEAM_08_C: Kiểm chứng phân quyền xem Báo cáo & Biểu đồ thống kê (VIEW_ANALYTICS)**
    *   **Mã test Selenium**: `TC_TEAM_08_C` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_08_C.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_08_C.md)
    *   **Mô tả**: Tài khoản có quyền `VIEW_ANALYTICS` được phép tải dữ liệu thống kê biểu đồ.
    *   **Kết quả mong đợi**: Dữ liệu biểu đồ hiển thị bình thường.
*   **TC_TEAM_08_D: Kiểm chứng Custom Role chỉ có quyền Quản lý thành viên (MANAGE_TEAM)**
    *   **Mã test Selenium**: `TC_TEAM_08_D` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_08_D.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_08_D.md)
    *   **Mô tả**: Kiểm chứng tài khoản chỉ có quyền `MANAGE_TEAM` thì có thể xem/mời thành viên nhưng bị chặn các tính năng soạn thảo.
    *   **Kết quả mong đợi**: UI chặn truy cập soạn thảo, nút Create Post bị ẩn/vô hiệu hóa.
*   **TC_TEAM_08_E: Kiểm chứng Custom Role chỉ có quyền Xem báo cáo (VIEW_ANALYTICS)**
    *   **Mã test Selenium**: `TC_TEAM_08_E` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_08_E.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_08_E.md)
    *   **Mô tả**: Thành viên chỉ có quyền `VIEW_ANALYTICS` có thể xem số liệu thống kê nhưng không thể quản lý nhân sự.
    *   **Kết quả mong đợi**: Menu quản lý đội ngũ bị ẩn hoặc trả về lỗi khi truy cập.
*   **TC_TEAM_08_F: Kiểm chứng Custom Role chỉ có quyền Quản lý vai trò (MANAGE_ROLES)**
    *   **Mã test Selenium**: `TC_TEAM_08_F` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_08_F.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_08_F.md)
    *   **Mô tả**: Kiểm tra tính năng quản trị vai trò đối với tài khoản chỉ được cấp quyền `MANAGE_ROLES`.
    *   **Kết quả mong đợi**: Thao tác cập nhật ma trận vai trò được thực thi thành công.
*   **TC_TEAM_08_G: Kiểm chứng Custom Role chỉ có quyền Phê duyệt bài viết (APPROVE_POSTS) và Xóa bài viết (DELETE_POSTS)**
    *   **Mã test Selenium**: `TC_TEAM_08_G` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_08_G.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_08_G.md)
    *   **Mô tả**: Tài khoản có quyền duyệt và xóa nhưng không có quyền tạo bài đăng mới.
    *   **Kết quả mong đợi**: Chức năng duyệt/xóa bài hoạt động bình thường, chức năng tạo bài viết mới bị khóa.
*   **TC_TEAM_08_H: Kiểm chứng Custom Role chỉ có quyền Tạo bài viết (CREATE_POSTS) và Đăng bài viết (PUBLISH_POSTS)**
    *   **Mã test Selenium**: `TC_TEAM_08_H` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_08_H.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_08_H.md)
    *   **Mô tả**: Tài khoản có quyền tạo và xuất bản trực tiếp bài viết nhưng không có quyền phê duyệt bài của người khác.
    *   **Kết quả mong đợi**: Tạo bài thành công, không hiển thị chức năng duyệt bài của thành viên khác.

### 6. Xóa vai trò & Dọn dẹp (Role Cleanup)
*   **TC_TEAM_09: Chặn xóa vai trò đang hoạt động & Dọn dẹp dứt điểm**
    *   **Mã test Selenium**: `TC_TEAM_09` trong `team_management.spec.js`
    *   **Kịch bản chi tiết**: [TC_TEAM_09.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/TC_TEAM_09.md)
    *   **Mô tả**: Thử xóa một Custom Role đang được gán cho một thành viên. Sau đó dọn dẹp các tài khoản kiểm thử khỏi DB.
    *   **Kết quả mong đợi**: Hệ thống báo lỗi không thể xóa vai trò đang được sử dụng. Dữ liệu rác được dọn dẹp sạch sẽ sau test.
