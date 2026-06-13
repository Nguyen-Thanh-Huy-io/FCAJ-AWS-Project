# 💻 Phân Hệ Team Management - Frontend (Giao Diện Cộng Tác Viên & Phân Quyền)

Tài liệu này mô tả chi tiết giao diện người dùng, cấu trúc component, luồng hoạt động client và cách tích hợp phân hệ **Team Management** với APIs backend của PubliCast.

---

## 1. Cấu Trúc Các Component Chính

Phân hệ Team Management trên giao diện Frontend bao gồm 2 trang chính nằm trong luồng ứng dụng chính và luồng kích hoạt tài khoản:

### 1.1. Trang Quản lý thành viên (`TeamManagement.jsx`)
- **Đường dẫn (Route):** `/manage/team`
- **Chức năng:** Cho phép các chủ thương hiệu (Owner) và Quản trị viên (Admin) quản lý cộng tác viên trong Workspace.
- **Thành phần giao diện:**
  - **Filter Bar (Bộ lọc nhanh):** Tìm kiếm thành viên theo tên/email, lọc nhanh theo vai trò (All, Owner, Admin, Member) và nút Reset bộ lọc.
  - **Members Table (Bảng thành viên):** Hiển thị danh sách thành viên với các thông tin chi tiết: Ảnh đại diện (Avatar/Ký tự đầu), Email, Vai trò (kèm icon Shield/User trực quan), Trạng thái kích hoạt (`active`/`pending`), Ngày tham gia và Người mời.
  - **InviteModal (Modal Mời thành viên):** Nhập email và chọn vai trò của cộng tác viên mới (Admin hoặc Member), thực hiện gửi lời mời qua API.
  - **RoleModal (Modal Phân quyền & Trục xuất):** Chỉnh sửa nhanh vai trò của thành viên hiện tại (Admin, Member, Analyst) hoặc xóa thành viên khỏi Workspace (có cảnh báo xác nhận trước khi thực hiện).

### 1.2. Trang Nhận lời mời (`InviteFlow.jsx`)
- **Đường dẫn (Route):** `/invite` (Không bị chặn bởi `ProtectedRoute` và không hiển thị Sidebar/Topbar mặc định của Dashboard).
- **Chức năng:** Điểm đón người dùng khi nhấp vào link mời từ email, xác thực mã token và cho phép tham gia nhóm.
- **Thành phần giao diện:**
  - **Trạng thái Loading:** Hiển thị biểu tượng quay vòng trong lúc kiểm tra tính hợp lệ của token qua API.
  - **Màn hình chào mừng (Landing):** Hiển thị thông tin thương hiệu, tên người mời, và nhận diện loại tài khoản:
    * **Nếu là tài khoản mới (Shell User):** Yêu cầu điền thêm Họ tên và Mật khẩu mới để đăng ký.
    * **Nếu tài khoản đã tồn tại:** Chỉ hiển thị thông tin email hiện tại và nút "Chấp nhận lời mời".
  - **Màn hình thành công (Accepted):** Hiển thị thông báo chào mừng cùng nút dẫn hướng vào thẳng hệ thống Dashboard.
  - **Màn hình hết hạn/Lỗi (Expired):** Cảnh báo nếu link mời đã hết hạn 7 ngày hoặc bị lỗi token, đi kèm nút điều hướng quay lại trang đăng nhập.

---

## 2. Luồng Xử Lý & Tương Tác State

### 2.1. Đồng bộ hóa với Workspace hiện hoạt (`activeBrand`)
Trang quản lý thành viên luôn lắng nghe sự thay đổi của Brand được chọn trên hệ thống thông qua Context API `useBrand`:

```javascript
const { activeBrand } = useBrand();

useEffect(() => {
  fetchTeam();
}, [searchParamsString, activeBrand?.id]);
```

Khi người dùng chuyển đổi giữa các thương hiệu (ví dụ từ Thương hiệu A sang Thương hiệu B), trang quản lý thành viên sẽ tự động tải lại danh sách thành viên tương ứng với `brandId` mới để hiển thị chính xác.

### 2.2. Trình tự đăng nhập tự động sau khi chấp nhận lời mời
Khi kích hoạt tài khoản thành công ở trang `/invite`, backend trả về cặp token xác thực. Hệ thống frontend xử lý như sau:

```javascript
const response = await apiService.post("/team/invitations/accept", { token, name, password });
const tokenVal = response.data.accessToken || response.data.token;

if (tokenVal) {
  // Lưu token vào local storage để chuẩn bị xác thực tự động
  localStorage.setItem("token", tokenVal);
}
setScreen("accepted");
```

Khi người dùng bấm nút **"Đi tới Dashboard"**, hệ thống gọi lệnh `window.location.href = "/"` để tải lại trang chủ. Khi tải lại, ứng dụng phát hiện thấy token trong `localStorage` và tự động thực hiện luồng đăng nhập vào Dashboard thương hiệu mới mà không bắt người dùng phải nhập lại email/mật khẩu.
