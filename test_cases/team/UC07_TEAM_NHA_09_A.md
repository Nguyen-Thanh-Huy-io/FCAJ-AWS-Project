| Test Case ID    | TC_TEAM_09_A | Test Case Description | Chặn xóa vai trò tùy chỉnh đang hoạt động (Thất bại khi vai trò đang gán cho thành viên) |
| --------------- | ---------| ---------------------| -------------------------------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                                                 |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                                             |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của Brand.
2. Có vai trò tùy chỉnh `Restricted Analyst` đang gán cho thành viên `testmember@gmail.com`.
3. Đang ở màn hình Vai trò tùy chỉnh của quản lý đội ngũ (`/manage/team` -> Tab Vai trò tùy chỉnh).

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Vai trò tùy chỉnh cần xóa: `Restricted Analyst` (đang active) |

### Test Scenario
Xác minh rằng hệ thống bảo vệ an toàn dữ liệu bằng cách ngăn chặn Owner xóa vai trò tùy chỉnh nếu vai trò đó đang được gán cho bất kỳ thành viên nào trong nhóm, hiển thị toast báo lỗi cảnh báo rõ ràng.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Tìm vai trò `Restricted Analyst` trong danh sách vai trò tùy chỉnh. | Vai trò hiển thị chính xác kèm theo nút Xóa vai trò (icon Thùng rác). | Hiển thị vai trò & nút xóa | Pass |
| 2 | Nhấp vào biểu tượng Xóa vai trò tùy chỉnh này. | Hộp thoại modal xác nhận xóa xuất hiện để người dùng xác nhận lại. | Modal xác nhận hiển thị | Pass |
| 3 | Xác nhận xóa vai trò bằng cách nhấp chọn nút "Xóa" trên modal. | Yêu cầu bị từ chối, xuất hiện toast lỗi: "Không thể xóa vai trò đang có thành viên sử dụng" hoặc tương đương. | Toast báo lỗi hiển thị chính xác | Pass |
| 4 | Kiểm tra danh sách các vai trò tùy chỉnh. | Vai trò `Restricted Analyst` vẫn tồn tại nguyên vẹn trong danh sách vai trò hiện có. | Vai trò không bị xóa mất | Pass |
