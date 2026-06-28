| Test Case ID    | TC_TEAM_08_E | Test Case Description | Kiểm chứng Custom Role chỉ có quyền Xem báo cáo (VIEW_ANALYTICS) |
| --------------- | ---------| ---------------------| --------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                          |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                      |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Custom Role "Restricted Analyst" được cập nhật chỉ bật duy nhất quyền `VIEW_ANALYTICS`.
2. Thành viên đã đăng nhập và đang ở Dashboard.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Email thành viên mới mời (để test cấm): `hackmember-test-08-e@gmail.com` |
| 2 | Quyền được bật: `VIEW_ANALYTICS` |
| 3 | Quyền bị chặn: `INVITE_MEMBERS`, `MANAGE_TEAM` |

### Test Scenario
Xác minh rằng thành viên chỉ có quyền xem báo cáo có thể gọi API tải báo cáo thành công (mã 200) và thực hiện "Load Data" thành công trên giao diện UI báo cáo, đồng thời bị chặn khi cố gắng thực hiện các thao tác quản lý đội ngũ (như mời thành viên).

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Gửi yêu cầu API `GET /api/reports?brandId=<brandId>` bằng token của thành viên. | Backend cho phép truy cập và trả về mã trạng thái 200 OK. | API trả về 200 OK | Pass |
| 2 | Gửi yêu cầu API `POST /api/team/invite` để mời thành viên `hackmember-test-08-e@gmail.com`. | Backend chặn và trả về mã lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
| 3 | Truy cập màn hình Báo cáo (`/manage/reports`) trên giao diện UI. | Trang tải bình thường mà không hiển thị toast cảnh báo lỗi tải danh sách báo cáo. | Trang hiển thị bình thường | Pass |
| 4 | Nhấp chuột vào nút "Load Data". | Dữ liệu được nạp thành công và xuất hiện toast thông báo: "Dữ liệu đã được tải thành công!" | Toast thành công hiển thị | Pass |
