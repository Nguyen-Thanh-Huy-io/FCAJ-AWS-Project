| Test Case ID    | TC_TEAM_05_B | Test Case Description | Kiểm tra Validation khi tạo Custom Role (Thất bại do Tên vai trò rỗng hoặc Vượt quá 50 ký tự) |
| --------------- | ---------| ---------------------| -------------------------------------------------------------------------------------- |
| Created By      | Nhã| Reviewed By          | Nhã Võ                                                                                 |
| Version         | 1.0       | Date Tested          | 28/06/2026                                                                             |
| Test Status     | Pass      | Tester's Name        | Nhã|
| Use Case ID     | UC07 |

### Prerequisites
1. Đã đăng nhập với tư cách Owner của một Brand trên gói PRO.
2. Đang ở modal tạo vai trò tùy chỉnh.

### Test Data
| S # | Test Data |
| :--- | :--- |
| 1 | Trường hợp 1: Tên vai trò trống |
| 2 | Trường hợp 2: Tên vai trò dài 51 ký tự (vượt quá maxLength) |

### Test Scenario
Xác minh hệ thống ngăn chặn việc tạo vai trò nếu tên vai trò bị bỏ trống (báo lỗi toast cảnh báo) và giới hạn độ dài trường tên tối đa là 50 ký tự (chặn không cho nhập thêm trên UI).

### Step-by-Step Procedure
| Step # | Step Details | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Để trống trường Tên vai trò, chỉ điền mô tả và bấm "Lưu cấu hình vai trò". | Hệ thống chặn không gửi API, xuất hiện toast báo lỗi: "Tên vai trò không được để trống" hoặc tương đương. | Toast báo lỗi tên vai trò hiển thị | Pass |
| 2 | Kiểm tra thuộc tính `maxLength` của phần tử nhập Tên vai trò. | Thuộc tính `maxLength` phải được thiết lập là `50`. | `maxLength` bằng 50 | Pass |
| 3 | Cố gắng nhập chuỗi ký tự dài hơn 50 ký tự vào trường Tên vai trò. | Trình duyệt ngăn chặn không cho nhập vượt quá ký tự thứ 50. | Không thể nhập ký tự thứ 51 | Pass |
| 4 | Đóng modal tạo vai trò tùy chỉnh bằng cách nhấp ra ngoài backdrop. | Modal đóng lại thành công mà không có vai trò rác nào được tạo. | Modal đóng thành công | Pass |
