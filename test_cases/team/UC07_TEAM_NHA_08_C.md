| Test Case ID    | TC_TEAM_08_C | Test Case Description | Kiểm chứng phân quyền xem Báo cáo & Biểu đồ thống kê (VIEW_ANALYTICS) |
| --------------- | ---------| ---------------------| --------------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                                |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                            |
| Test Status     | Fail      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Thành viên `testmember@gmail.com` gán vai trò "Restricted Analyst" (chỉ có quyền `CREATE_POSTS`, không có quyền `VIEW_ANALYTICS`).
2. Tài khoản đã được đăng nhập trên trình duyệt.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Email thành viên: `testmember@gmail.com` |
| 2 | Endpoint báo cáo: `/api/reports?brandId=<brandId>` |
| 3 | Endpoint chỉ số mạng xã hội: `/api/social/metrics?brandId=<brandId>&platform=YOUTUBE` |

### Test Scenario
Xác minh rằng thành viên không có quyền `VIEW_ANALYTICS` sẽ bị chặn truy cập dữ liệu báo cáo ở cả cấp độ UI (hiển thị thông báo lỗi khi tải dữ liệu) và cấp độ Backend API (trả về mã trạng thái 403 Forbidden).

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Gửi yêu cầu API `GET /api/reports` bằng token người dùng bị hạn chế. | Backend chặn yêu cầu và trả về lỗi 403 Forbidden. | API trả về 403 Forbidden | Pass |
| 2 | Truy cập URL `/manage/reports` bằng tài khoản người dùng hạn chế. | Hiển thị thông báo toast cảnh báo: "Không thể tải danh sách báo cáo." | Toast cảnh báo hiển thị chính xác | Pass |
| 3 | Nhấp chuột vào nút "Load Data" trên giao diện Báo cáo. | Lời gọi API bị chặn, hiển thị thông báo toast lỗi: "Không thể tải dữ liệu". | Toast lỗi "Không thể tải dữ liệu" hiển thị | Pass |
| 4 | Kiểm tra vùng hiển thị lịch sử PDF. | Hiển thị thông báo: "Chưa có bản ghi báo cáo nào được tạo". | Thông báo trống hiển thị đúng | Pass |
| 5 | Gửi yêu cầu API `GET /api/social/metrics` kiểm tra phân quyền. | Backend phải chặn và trả về lỗi 403 Forbidden (Tuy nhiên, có thể trả về 200 do bug phân quyền). | API trả về 200 OK (Bypass phân quyền thành công) | Fail |

### Linked Bug
- Có liên kết với bug report [BUG_UC07_TEAM_NHA_08_C.md](file:///d:/Fullit/projects/PubliCast/test_cases/team/BUG_UC07_TEAM_NHA_08_C.md) (`PC-54`).
