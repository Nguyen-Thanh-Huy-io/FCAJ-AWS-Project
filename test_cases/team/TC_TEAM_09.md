| Test Case ID    | TC_TEAM_09 | Test Case Description | Chặn xóa vai trò đang hoạt động & Dọn dẹp dứt điểm |
| --------------- | ---------| ---------------------| ------------------------------------------------ |
| Created By      | Nhã | Reviewed By          | Nhã Võ                                           |
| Version         | 1.0       | Date Tested          | 28/06/2026                                       |
| Test Status     | Pass      | Tester's Name        | Nhã                                      |
| Use Case ID     | UC06, UC20 |

### Prerequisites
1. Đang đăng nhập với tư cách Owner của Brand.
2. Custom Role "Restricted Analyst" đang được gán cho ít nhất 1 thành viên hoạt động (`testmember@gmail.com`).
3. Đang ở trang Cài đặt Đội ngũ (`/manage/team`), tab "Vai trò tùy chỉnh".

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Custom Role cần xóa: `Restricted Analyst` |
| 2 | Email thành viên đang gán vai trò đó: `testmember@gmail.com` |
| 3 | Vai trò mặc định chuyển đổi sang: `Analyst` |

### Test Scenario
Xác minh rằng hệ thống ngăn chặn việc xóa các vai trò tùy chỉnh đang được gán cho ít nhất một thành viên trong Brand nhằm tránh lỗi mồ côi quyền hạn. Sau khi đổi vai trò của thành viên sang vai trò khác, vai trò tùy chỉnh này mới có thể được xóa thành công.

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Nhấn nút xóa vai trò "Restricted Analyst" trên giao diện danh sách Custom Roles. | Modal xác nhận xóa hiển thị. | Modal xác nhận hiển thị | Pass |
| 2 | Click "Xóa" để xác nhận. | Hệ thống chặn yêu cầu xóa vai trò, hiển thị thông báo toast lỗi: "Không thể xóa vai trò đang có thành viên" hoặc tương đương. | Toast báo lỗi hiển thị chính xác | Pass |
| 3 | Chuyển sang tab "Thành viên", định vị dòng thành viên `testmember@gmail.com`, bấm nút thao tác và đổi vai trò của thành viên này thành vai trò mặc định "Analyst". | Vai trò của thành viên được cập nhật thành công, xuất hiện toast "Cập nhật vai trò thành công". | Cập nhật vai trò thành công | Pass |
| 4 | Quay lại tab "Vai trò tùy chỉnh", bấm nút xóa vai trò "Restricted Analyst" và xác nhận xóa lần nữa. | Hệ thống chấp nhận yêu cầu xóa, vai trò biến mất khỏi danh sách Custom Roles và DB, hiển thị toast "Xóa vai trò thành công". | Vai trò được xóa thành công | Pass |
| 5 | Chạy logic dọn dẹp DB sau kiểm thử. | Xóa toàn bộ dữ liệu người dùng test, brand test, teams test ra khỏi cơ sở dữ liệu để bảo toàn môi trường. | Dọn dẹp dữ liệu DB thành công | Pass |
