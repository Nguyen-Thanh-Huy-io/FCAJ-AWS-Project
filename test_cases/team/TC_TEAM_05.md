| Test Case ID    | TC_TEAM_05 | Test Case Description | Quản lý Custom Role (Tạo mới & validate tên vai trò) |
| --------------- | ---------| ---------------------| ---------------------------------------------------- |
| Created By      | Nhã | Reviewed By          | Nhã Võ                                               |
| Version         | 1.0       | Date Tested          | 28/06/2026                                           |
| Test Status     | Pass      | Tester's Name        | Nhã                                          |
| Use Case ID     | UC06 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của một Brand trên gói PRO (hỗ trợ Custom Roles).
2. Đang ở màn hình Quản lý đội ngũ, đã chọn tab "Vai trò tùy chỉnh".

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Tên vai trò trống |
| 2 | Tên vai trò hợp lệ: `Restricted Analyst` |
| 3 | Mô tả vai trò: `Chỉ có quyền tạo bài viết nháp, không có quyền quản lý Team.` |
| 4 | Quyền kích hoạt: `CREATE_POSTS` (Tạo bài viết) |

### Test Scenario
Xác minh rằng biểu mẫu tạo vai trò tùy chỉnh yêu cầu nhập tên vai trò, giới hạn độ dài ký tự tên vai trò tối đa là 50 ký tự, và cho phép lưu trữ vai trò tùy chỉnh cùng danh sách quyền tương ứng vào cơ sở dữ liệu.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Bấm nút "Add Custom Role" (hoặc Tạo Custom Role) để mở modal thiết lập vai trò. | Modal thiết lập vai trò mở ra thành công. | Modal hiển thị đầy đủ | Pass |
| 2 | Để trống ô tên vai trò và bấm "Lưu cấu hình vai trò". | Hệ thống chặn không cho lưu và hiển thị toast lỗi yêu cầu nhập tên vai trò. | Toast báo lỗi tên vai trò trống | Pass |
| 3 | Kiểm tra thuộc tính `maxLength` của ô nhập tên vai trò. | Thuộc tính `maxLength` có giá trị là 50 ký tự. | maxLength bằng 50 | Pass |
| 4 | Nhập tên vai trò `Restricted Analyst`, nhập mô tả vai trò và bật công tắc/click bật quyền "Tạo bài viết" (`CREATE_POSTS`). | Trạng thái quyền chuyển sang được chọn (isAllowed = 1). | Quyền CREATE_POSTS được tick chọn | Pass |
| 5 | Bấm "Lưu cấu hình vai trò". | Vai trò được tạo thành công, modal đóng lại, thẻ vai trò hiển thị trên giao diện danh sách Custom Roles. | Vai trò hiển thị trên UI và lưu vào DB | Pass |
