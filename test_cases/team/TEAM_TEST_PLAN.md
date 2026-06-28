# Kế hoạch kiểm thử tự động (Selenium E2E Test Plan) - Phân hệ Đội ngũ & Phân quyền (Team)

Tài liệu này tổng hợp toàn bộ các kịch bản kiểm thử E2E bằng Selenium WebDriver cho phân hệ Quản lý Đội ngũ và Phân quyền tùy chỉnh tương ứng với **UC06 (Quản lý Đội ngũ)** & **UC07 (Cấu hình Phân quyền tùy chỉnh)**.

## Danh sách Test Cases (Total: 15 Test Cases)

| Mã Test Case | Tên Test Case | Mô tả kịch bản | Kết quả mong đợi (Assertion) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **TC_TEAM_01** | Đăng ký Owner mới và Onboarding | Tạo tài khoản Owner mới, xác minh OTP, và hoàn thành quy trình Onboarding. | Đăng nhập thành công và chuyển hướng tới Dashboard của Brand mặc định. | Đã triển khai |
| **TC_TEAM_02** | Validate khi mời thành viên | Nhập email rỗng hoặc sai định dạng khi mời thành viên. | UI hiển thị lỗi validation ngăn chặn gửi lời mời không hợp lệ. | Đã triển khai |
| **TC_TEAM_03** | Chặn mời trùng email hiện có | Thử mời lại một email đã có trong team (kể cả có khoảng trắng / chữ hoa). | Hệ thống phát hiện trùng lặp và từ chối gửi lời mời. | Đã triển khai |
| **TC_TEAM_04** | Kiểm tra giới hạn ghế thành viên | Mời số thành viên vượt quá hạn mức `Plan Seats Limit` của gói cước. | Hệ thống từ chối và yêu cầu nâng cấp gói cước. | Đã triển khai |
| **TC_TEAM_05** | Quản lý Custom Role (Tạo mới) | Tạo vai trò tùy chỉnh mới và kiểm tra validation tên vai trò trùng lặp. | Hệ thống chặn tạo vai trò trùng tên và cho phép tạo vai trò hợp lệ. | Đã triển khai |
| **TC_TEAM_06** | Mời thành viên với Custom Role | Gửi lời mời tới thành viên mới và gán vai trò Custom Role vừa tạo. | Lời mời được gửi thành công kèm thông tin liên kết Custom Role. | Đã triển khai |
| **TC_TEAM_07** | Quy trình chấp nhận lời mời | Thành viên mới nhấn link kích hoạt từ email và thiết lập tài khoản. | Tài khoản thành viên chuyển sang ACTIVE và đăng nhập thành công. | Đã triển khai |
| **TC_TEAM_08** | Phân quyền Custom Role hạn chế | Đăng nhập bằng tài khoản thành viên có Custom Role hạn chế. | Thành viên bị chặn truy cập các API hoặc UI mà mình không có quyền. | Đã triển khai |
| **TC_TEAM_08_C** | Quyền xem Báo cáo & Thống kê | Kiểm chứng phân quyền xem báo cáo biểu đồ (`VIEW_ANALYTICS`). | Thành viên có quyền xem bình thường, thành viên không có quyền bị chặn. | Đã triển khai |
| **TC_TEAM_08_D** | Chỉ có quyền Quản lý thành viên | Kiểm chứng vai trò chỉ có quyền quản lý thành viên (`MANAGE_TEAM`). | Cho phép xem và sửa đội ngũ nhưng chặn các tác vụ khác. | Đã triển khai |
| **TC_TEAM_08_E** | Chỉ có quyền Xem báo cáo | Kiểm chứng vai trò chỉ có quyền xem báo cáo (`VIEW_ANALYTICS`). | Cho phép vào trang báo cáo, chặn trang cài đặt đội ngũ. | Đã triển khai |
| **TC_TEAM_08_F** | Chỉ có quyền Quản lý vai trò | Kiểm chứng vai trò chỉ có quyền quản lý vai trò (`MANAGE_ROLES`). | Cho phép tạo, sửa Custom Role nhưng chặn sửa đội ngũ. | Đã triển khai |
| **TC_TEAM_08_G** | Quyền phê duyệt & Xóa bài viết | Kiểm chứng vai trò có quyền `APPROVE_POSTS` và `DELETE_POSTS`. | Cho phép phê duyệt và xóa bài viết thành công. | Đã triển khai |
| **TC_TEAM_08_H** | Quyền tạo & Đăng bài viết | Kiểm chứng vai trò có quyền `CREATE_POSTS` và `PUBLISH_POSTS`. | Cho phép tạo bài và publish trực tiếp lên social media. | Đã triển khai |
| **TC_TEAM_09** | Chặn xóa vai trò đang hoạt động | Thử xóa một vai trò đang được gán cho một thành viên đang hoạt động. | Hệ thống từ chối xóa và hiển thị thông báo cảnh báo lỗi phù hợp. | Đã triển khai |

---

## Môi trường & File kiểm thử
- **Môi trường**: Chrome (chạy headless trên CI)
- **Tập tin kiểm thử tương ứng**: `test_selenium/team/team_management.spec.js`
