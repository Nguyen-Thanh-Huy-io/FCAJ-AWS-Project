# Đặc Tả Use Case: Phân hệ Quản trị Workspace & Phân quyền

## 1. Sơ đồ Use Case

![Sơ đồ Use Case Workspace](../../diagrams/uc_workspace.png)

## 2. Đặc tả chi tiết

### UC04. Quản lý Đội ngũ (Team Members)
*   **Mô tả:** Chủ Brand hoặc người có quyền quản lý mời nhân sự vào Workspace thông qua email, kiểm soát trạng thái hoạt động và thay đổi Role của họ.
*   **Tác nhân kích hoạt:** Chủ Brand (OWNER), Manager.
*   **Tiền điều kiện:** Có quyền hạn `MANAGE_TEAM`. Số lượng thành viên không vượt quá `maxTeamSeats` của gói cước.
*   **Các bước thực hiện:**
    1.  Người dùng vào mục "Team Management".
    2.  Nhập danh sách email và chọn `UserRole` (hoặc `CustomRole`) tương ứng.
    3.  Hệ thống sinh mã mời (Invite Token) và gửi qua dịch vụ mail.
    4.  Hệ thống tạo bản ghi `Team` với trạng thái `PENDING`.
    5.  Khi người được mời click vào link, trạng thái đổi thành `ACTIVE`.

### UC05. Cấu hình Phân quyền tùy chỉnh (Custom Roles)
*   **Mô tả:** Brand có thể định nghĩa các Role chuyên biệt với các Permission cụ thể để cấp quyền chi tiết hơn.
*   **Tác nhân kích hoạt:** Chủ Brand (OWNER).
*   **Tiền điều kiện:** Gói cước (Plan) hỗ trợ `allowCustomRoles`.
*   **Các bước thực hiện:**
    1.  Tại "Roles & Permissions", chọn "Tạo Custom Role".
    2.  Nhập tên Role (Ví dụ: "Thực tập sinh TikTok").
    3.  Giao diện hiển thị ma trận Permission (VD: `CAN_VIEW_ANALYTICS`, `CAN_PUBLISH_TIKTOK`).
    4.  Tick chọn các quyền cần thiết và lưu lại.
    5.  Có thể gán Custom Role này cho các thành viên trong Team.
