# Test Case: TC_AUTOLIST_07 - Bật/Tắt (Pause) hàng đợi và kiểm tra BullMQ job bị hủy

| ID number   | TC_AUTOLIST_07                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Bật/Tắt (Pause) hàng đợi và kiểm tra BullMQ job bị hủy         |
| Component   | Autolists / Operations                                         |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/autolists.spec.js`                              |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC12                                                           |

## 1. Prerequisites
- Đang ở màn hình danh sách AutoLists.
- Hàng đợi AutoList mục tiêu đang ở trạng thái hoạt động (`isActive = 1`).

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Queue Name  | Hàng đợi mục tiêu                     |

## 3. Step-by-Step Procedure
1. Tìm hàng đợi mục tiêu trên giao diện danh sách.
2. Click vào công tắc kích hoạt (Active toggle / Pause button).
3. Đợi giao diện cập nhật trạng thái hiển thị.
4. Truy vấn database để xem giá trị cột `isActive` của hàng đợi này.
5. Kiểm tra hàng đợi Redis (BullMQ) để xác định xem các job lập lịch tương ứng đã bị xóa bỏ hay chưa.

## 4. Expected Result
- Trạng thái công tắc trên UI chuyển thành màu xám (Tạm dừng).
- Trong database, bản ghi AutoList có giá trị `isActive = 0`.
- Các job lập lịch đăng bài tự động của hàng đợi này trong Redis bị hủy bỏ thành công để tránh đăng bài ngoài ý muốn.
