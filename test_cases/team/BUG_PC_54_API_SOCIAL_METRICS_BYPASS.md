# BUG REPORT - PC-54

| ID number        | PC-54                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | TEAM - API `/api/social/metrics` bỏ qua kiểm tra quyền `VIEW_ANALYTICS` của Custom Role                       |
| Reporter         | Antigravity                                                                                                   |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Thành viên thuộc Custom Role không được cấp quyền `VIEW_ANALYTICS` vẫn có thể truy cập thành công API lấy chỉ số và biểu đồ phân tích (`GET /api/social/metrics`). |
| URL              | http://localhost:5173/manage/reports                                                                          |
| Screenshot       | ![Screenshot](./screenshots/error_TC_TEAM_08_C__Ki_m_ch_ng_ph_n_quy_n_xem_B_o_c_o___Bi_u____th_ng_k___VIEW_ANALYTICS_.png) |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome / Firefox                                                                                              |
| Severity         | Critical                                                                                                      |
| Assigned to      | Backend Team                                                                                                  |
| Priority         | High                                                                                                          |

**Description**

Khi một thành viên thuộc Custom Role đã bị tắt quyền "Xem báo cáo (View Analytics)" (`VIEW_ANALYTICS`), việc truy cập giao diện Báo cáo trên UI bị chặn chính xác bởi AccessGuard. Tuy nhiên, khi gửi trực tiếp HTTP request tới API `/api/social/metrics?brandId=<brandId>`, hệ thống vẫn trả về dữ liệu thống kê với mã trạng thái `200 OK` thay vì chặn truy cập bằng mã lỗi `403 Forbidden`. Điều này vi phạm nghiêm trọng tính toàn vẹn của cơ chế phân quyền RBAC và có nguy cơ rò rỉ dữ liệu chỉ số mạng xã hội.

**Steps to reproduce**

1. Tạo một Custom Role chỉ được bật quyền `CREATE_POSTS` (hoặc tắt quyền `VIEW_ANALYTICS`).
2. Gán Custom Role này cho một thành viên mới và kích hoạt tài khoản.
3. Lấy accessToken của thành viên đó.
4. Gửi HTTP request bằng Postman hoặc curl/fetch:
   ```bash
   GET http://localhost:3000/api/social/metrics?brandId=<brandId>
   Headers:
     Authorization: Bearer <accessToken>
   ```

**Expected result**

API chặn yêu cầu và trả về mã lỗi `403 Forbidden` kèm thông điệp: "Bạn không có quyền thực hiện thao tác này."

**Actual result**

API trả về mã trạng thái `200 OK` kèm theo toàn bộ dữ liệu JSON chứa thông số phân tích chi tiết của mạng xã hội (YouTube/Facebook...).

**Notes**

Lỗ hổng xảy ra do route định nghĩa API `/api/social/metrics` (thường nằm trong `social.routes.js` hoặc tương đương) thiếu middleware kiểm tra phân quyền `checkPermission('VIEW_ANALYTICS')`.
