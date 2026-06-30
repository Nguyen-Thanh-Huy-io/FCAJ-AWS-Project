1.3.2. Đặc tả usecase 
Phân hệ Thông báo (Notification)
Use Case Quản lý thông báo (UC22)
Mô tả  
  Cho phép người dùng xem toàn bộ danh sách thông báo hệ thống và thông báo của thương hiệu (Brand). Người dùng có thể lọc thông báo theo danh mục hoặc khoảng thời gian, đánh dấu đã đọc đối với từng thông báo hoặc đọc tất cả thông báo cùng lúc nhằm quản lý trạng thái hiển thị.

* **Tác nhân kích hoạt:**  
  Người dùng đã đăng nhập (Owner, Member, Admin, v.v.).

* **Tiền điều kiện:**  
  Người dùng đã đăng nhập thành công vào hệ thống và đang truy cập vào không gian làm việc của thương hiệu.

* **Các bước thực hiện:**
  * **Bước 1:** Người dùng truy cập vào trang thông báo mặc định `/notifications` bằng cách click vào biểu tượng chuông hoặc liên kết điều hướng.
  * **Bước 2:** Hệ thống tải dữ liệu, hiển thị danh sách thông báo và bộ đếm số lượng chưa đọc (unread counts) tương ứng trên thanh sidebar trái.
  * **Bước 3:** Người dùng nhấp chọn lọc thông báo theo danh mục trên sidebar hoặc lựa chọn khoảng thời gian (Start Date và End Date) để lọc.
  * **Bước 4:** Hệ thống cập nhật danh sách hiển thị các thông báo khớp với tiêu chí lọc đã chọn.
  * **Bước 5:** Người dùng nhấp chọn biểu tượng CheckCircle của một thông báo cụ thể hoặc nhấn nút "Mark all read" để đánh dấu tất cả là đã đọc.
  * **Bước 6:** Hệ thống cập nhật trạng thái đã đọc vào cơ sở dữ liệu, cập nhật hiển thị của card (mờ opacity sang 0.7 và đổi viền sang màu xám) và giảm số đếm chưa đọc trên sidebar & Topbar.

* **Ngoại lệ / Luồng thay thế:**
  * Kết nối SSE bị ngắt kết nối đột ngột → Hệ thống tự động thực hiện reconnect để duy trì thông báo realtime.
  * Khoảng ngày lọc không hợp lệ (Start Date > End Date) hoặc chỉ điền End Date → Hệ thống hiển thị cảnh báo lỗi và chặn truy vấn không hợp lệ.
  * Cố gắng đánh dấu đã đọc đối với thông báo không thuộc quyền sở hữu (IDOR) → Hệ thống từ chối yêu cầu và hiển thị thông báo lỗi truy cập.
