# DANH SÁCH BÁO CÁO LỖI MODULE THÔNG BÁO (NOTIFICATION SYSTEM BUG REPORTS)

Tài liệu này chứa 7 báo cáo lỗi chi tiết dựa trên kết quả chạy thực tế và ảnh chụp màn hình kiểm thử tự động từ file `test_notifications.js`.

---

<div id="bug_uc22_notif_phuc_08"></div>

## 1. BUG_UC22_NOTIF_PHUC_08: Hệ thống cho phép nhập khoảng ngày không hợp lệ (Start Date > End Date)

| ID number        | #BUG_UC22_NOTIF_PHUC_08                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | NOTIF - Giao diện chấp nhận khoảng ngày không hợp lệ (Start Date > End Date) mà không cảnh báo                |
| Reporter         | Nguyễn Trọng Phúc                                                                                             |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Khi lọc khoảng ngày có ngày bắt đầu lớn hơn ngày kết thúc (ví dụ: Start date = 28/06/2026, End date = 20/06/2026), giao diện vẫn chấp nhận gửi lên API mà không cảnh báo lỗi |
| URL              | `http://localhost:5173/notifications`                                                                         |
| Screenshot       | [bug_uc22_notif_phuc_08_invalid_range_allowed.png](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/screenshots/bug_uc22_notif_phuc_08_invalid_range_allowed.png) |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome 149                                                                                                    |
| Severity         | Minor                                                                                                         |
| Assigned to      | Frontend Team                                                                                                 |
| Priority         | Low                                                                                                           |

**Description**
Giao diện bộ lọc khoảng ngày thiếu validator logic phía Client. Khi nhập ngày bắt đầu sau ngày kết thúc, giao diện vẫn cho phép thực hiện truy vấn và gửi API, dẫn tới trả về danh sách rỗng 0 kết quả mà không có bất kỳ thông báo lỗi/hướng dẫn trực quan nào cho người dùng.

**Steps to reproduce**
1. Đăng nhập và vào trang `/notifications`.
2. Chọn "Start date" là ngày 28/06/2026.
3. Chọn "End date" là ngày 20/06/2026.

**Expected result**
Giao diện hiển thị tooltip hoặc nhãn cảnh báo đỏ: "Start date cannot be after End date", hoặc vô hiệu hóa việc nhấn chọn ngày không hợp lệ.

**Actual result**
Hệ thống chấp nhận bộ lọc vô lý này, gửi truy vấn và hiển thị "NO NOTIFICATIONS FOUND".

---

<div id="bug_uc22_notif_phuc_09"></div>

## 2. BUG_UC22_NOTIF_PHUC_09: Số Badge đếm ở Sidebar không đồng bộ với số lượng thông báo thực tế hiển thị

| ID number        | #BUG_UC22_NOTIF_PHUC_09                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | NOTIF - Số đếm badge chưa đọc ở Sidebar không khớp với tổng lượng thông báo hiển thị ở danh sách chính        |
| Reporter         | Nguyễn Trọng Phúc                                                                                             |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Bộ lọc hiển thị "Showing 21 of 21" thông báo nhưng số badge hiển thị tại mục "All Notifications" chỉ là "10"  |
| URL              | `http://localhost:5173/notifications`                                                                         |
| Screenshot       | [bug_uc22_notif_phuc_09_single_date_query_error.png](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/screenshots/bug_uc22_notif_phuc_09_single_date_query_error.png) |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome 149                                                                                                    |
| Severity         | Major                                                                                                         |
| Assigned to      | Backend / Frontend Team                                                                                       |
| Priority         | High                                                                                                          |

**Description**
Khi lọc thông báo, giao diện ở giữa hiển thị danh sách thực tế của 21 thông báo ("Showing 21 of 21"), tuy nhiên các số badge chỉ thị bên cạnh danh mục ở thanh sidebar bên trái (như "All Notifications") chỉ hiển thị số "10", gây mâu thuẫn trực quan và hiểu lầm dữ liệu cho người dùng.

**Steps to reproduce**
1. Đăng nhập và vào trang `/notifications`.
2. Quan sát số lượng tổng thông báo hiển thị ở đầu danh sách chính ("Showing 21 of 21").
3. Nhìn sang số badge hiển thị tại mục "All Notifications" ở thanh sidebar bên trái.

**Expected result**
Số lượng đếm trên badge sidebar phải đồng bộ hoặc phản ánh đúng số lượng thực tế của bộ lọc hiện tại, hoặc phân biệt rõ đó là số lượng "chưa đọc" (unread) thay vì gây nhầm lẫn số tổng.

**Actual result**
Danh sách hiển thị tổng cộng 21 thông báo nhưng badge sidebar chỉ đếm 10 thông báo.

---

<div id="bug_uc22_notif_phuc_10"></div>

## 3. BUG_UC22_NOTIF_PHUC_10: Nút phân trang "Next" không bị vô hiệu hóa ở trang cuối cùng

| ID number        | #BUG_UC22_NOTIF_PHUC_10                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | NOTIF - Nút "Next" ở phần phân trang vẫn sáng (active) ngay cả khi danh sách chỉ có 1 trang duy nhất          |
| Reporter         | Nguyễn Trọng Phúc                                                                                             |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Nút "Next" phân trang không bị disable ở trang cuối cùng, cho phép người dùng click tiếp                      |
| URL              | `http://localhost:5173/notifications`                                                                         |
| Screenshot       | [bug_uc22_notif_phuc_10_next_button_not_disabled.png](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/screenshots/bug_uc22_notif_phuc_10_next_button_not_disabled.png) |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome 149                                                                                                    |
| Severity         | Minor                                                                                                         |
| Assigned to      | Frontend Team                                                                                                 |
| Priority         | Low                                                                                                           |

**Description**
Khi ở trang cuối cùng (hoặc chỉ có duy nhất 1 trang dữ liệu), nút "Next" vẫn có màu đậm và con trỏ chuột dạng pointer cho phép bấm, thay vì bị vô hiệu hóa (disabled) như nút "Previous".

**Steps to reproduce**
1. Vào trang `/notifications`.
2. Cuộn xuống cuối trang để xem thanh phân trang.

**Expected result**
Nút "Next" phải bị disable (mờ đi và không click được) vì không có trang kế tiếp.

**Actual result**
Nút "Next" vẫn sáng rõ và có thể click.

---

<div id="bug_uc22_notif_phuc_13"></div>

## 4. BUG_UC22_NOTIF_PHUC_13: Rò rỉ kết nối SSE trong bộ nhớ Backend khi người dùng tải lại trang

| ID number        | #BUG_UC22_NOTIF_PHUC_13                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | NOTIF - Backend giữ lại các kết nối SSE cũ đã chết khi người dùng reload trang, gây rò rỉ bộ nhớ             |
| Reporter         | Nguyễn Trọng Phúc                                                                                             |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Mỗi lần tải lại trang hoặc đóng tab, kết nối SSE cũ không được giải phóng hoàn toàn khỏi Map `clientsByUser`  |
| URL              | `http://localhost:3000/api/notifications/stream`                                                              |
| Screenshot       | [bug_uc22_notif_phuc_13_sse_connection_leak.png](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/screenshots/bug_uc22_notif_phuc_13_sse_connection_leak.png) |
| Platform         | Server (Node.js)                                                                                              |
| Operating System | Windows 11 / Linux                                                                                            |
| Browser          | N/A                                                                                                           |
| Severity         | Critical                                                                                                      |
| Assigned to      | Backend Team                                                                                                  |
| Priority         | High                                                                                                          |

**Description**
Mỗi khi người dùng reload trang `/notifications` hoặc chuyển trang, trình duyệt mở một kết nối SSE mới. Backend không bắt sự kiện đóng kết nối của Express `req.on('close')` để dọn dẹp kết nối cũ, dẫn đến việc lưu trữ vô số kết nối rác trong bộ nhớ RAM của server.

**Steps to reproduce**
1. Mở trang `/notifications`.
2. Thực hiện tải lại trang (F5) liên tục.
3. Kiểm tra số lượng kết nối SSE đang hoạt động trong RAM của backend Node.js.

**Expected result**
Khi kết nối đóng, backend phải tự động dọn dẹp và xóa client tương ứng ra khỏi Map `clientsByUser`.

**Actual result**
Kết nối cũ không bị xóa, số lượng kết nối trong bộ nhớ tăng lên liên tục sau mỗi lần reload trang.

---

<div id="bug_uc22_notif_phuc_14"></div>

## 5. BUG_UC22_NOTIF_PHUC_14: Không tự động đồng bộ trạng thái đã đọc sang Tab thứ hai qua SSE

| ID number        | #BUG_UC22_NOTIF_PHUC_14                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | NOTIF - Trạng thái đã đọc của thông báo không được cập nhật realtime sang các tab trình duyệt khác            |
| Reporter         | Nguyễn Trọng Phúc                                                                                             |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Khi mở song song 2 tab trang `/notifications`, bấm nút đọc thông báo ở Tab 1 nhưng Tab 2 không tự động mờ đi |
| URL              | `http://localhost:5173/notifications`                                                                         |
| Screenshot       | [bug_uc22_notif_phuc_14_second_tab_not_synced.png](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/screenshots/bug_uc22_notif_phuc_14_second_tab_not_synced.png) |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome 149                                                                                                    |
| Severity         | Minor                                                                                                         |
| Assigned to      | Frontend / Backend SSE                                                                                        |
| Priority         | Medium                                                                                                        |

**Description**
Khi một thông báo được đánh dấu là đã đọc ở Tab 1, sự kiện `notification.read` được phát tới Tab 2 qua SSE nhưng frontend của Tab 2 không thực hiện cập nhật lại danh sách hoặc thay đổi màu viền đỏ/nút CheckCircle.

**Steps to reproduce**
1. Mở song song 2 tab trình duyệt cùng truy cập `/notifications`.
2. Tạo 1 thông báo mới ("Sync Alert Tab E2E").
3. Ở Tab 1, click nút CheckCircle để đánh dấu đã đọc.
4. Chuyển sang quan sát bên Tab 2.

**Expected result**
Thông báo "Sync Alert Tab E2E" ở Tab 2 phải tự động biến mất viền đỏ và đổi nút CheckCircle sang màu xám.

**Actual result**
Tab 2 vẫn giữ nguyên trạng thái chưa đọc (còn viền đỏ và nút CheckCircle xanh sáng).

---

<div id="bug_uc22_notif_phuc_15"></div>

## 6. BUG_UC22_NOTIF_PHUC_15: Card thông báo đã đọc giữ nguyên độ sáng (Opacity = 1) thay vì mờ đi

| ID number        | #BUG_UC22_NOTIF_PHUC_15                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | NOTIF - Card thông báo đã đọc giữ nguyên thuộc tính hiển thị opacity = 1 thay vì 0.7                          |
| Reporter         | Nguyễn Trọng Phúc                                                                                             |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Thuộc tính CSS opacity của card thông báo đã đọc vẫn hiển thị rõ nét là 1 thay vì mờ 0.7 như mô tả nghiệp vụ |
| URL              | `http://localhost:5173/notifications`                                                                         |
| Screenshot       | [bug_uc22_notif_phuc_15_card_opacity_remains_1.png](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/screenshots/bug_uc22_notif_phuc_15_card_opacity_remains_1.png) |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome 149                                                                                                    |
| Severity         | Major                                                                                                         |
| Assigned to      | Frontend Team                                                                                                 |
| Priority         | High                                                                                                          |

**Description**
Theo thiết kế nghiệp vụ, các thông báo đã đọc phải có độ mờ là `opacity: 0.7` để phân biệt trực quan với thông báo chưa đọc. Tuy nhiên, sau khi click đọc hoặc xem lại các thông báo đã đọc cũ (như Pricing plan deactivated/updated), độ sáng của card vẫn là 100% (opacity = 1).

**Steps to reproduce**
1. Vào trang `/notifications`.
2. Click nút CheckCircle trên một thông báo chưa đọc (ví dụ: Opacity Alert E2E).
3. Hoặc xem các card đã đọc (card có viền trái màu xám và CheckCircle màu xám).

**Expected result**
Các card thông báo đã đọc phải chuyển sang độ mờ hiển thị trực quan `opacity: 0.7`.

**Actual result**
Độ mờ của card vẫn giữ nguyên là `1`, khiến toàn bộ danh sách sáng rõ như nhau gây khó phân biệt.

---

<div id="bug_uc22_notif_phuc_17"></div>

## 7. BUG_UC22_NOTIF_PHUC_17: Nút "Mark all read" bị disable và các số unread đếm ngược trên sidebar hiển thị bằng 0

| ID number        | #BUG_UC22_NOTIF_PHUC_17                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | NOTIF - Sidebar unread counts hiển thị bằng 0 và nút Mark all read bị vô hiệu hóa dù có thông báo chưa đọc     |
| Reporter         | Nguyễn Trọng Phúc                                                                                             |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Số lượng chưa đọc (unread counts) trên các danh mục sidebar hiển thị rỗng, khiến nút "Mark all read" bị vô hiệu hóa mặc dù danh sách ở giữa vẫn hiển thị thông báo chưa đọc (viền đỏ) |
| URL              | `http://localhost:5173/notifications`                                                                         |
| Screenshot       | [bug_uc22_notif_phuc_17_2_after_mark_all_read_sidebar_still_has_count.png](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/screenshots/bug_uc22_notif_phuc_17_2_after_mark_all_read_sidebar_still_has_count.png) |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome 149                                                                                                    |
| Severity         | Major                                                                                                         |
| Assigned to      | Backend / Frontend Team                                                                                       |
| Priority         | High                                                                                                          |

**Description**
Khi người dùng truy cập trực tiếp vào trang thông báo mặc định (xem toàn bộ thông báo, không qua việc chọn lọc một thương hiệu cụ thể), bộ đếm chưa đọc trên thanh sidebar hiển thị trống (bằng 0) và nút "Mark all read" bị khóa (disabled) hiển thị màu xám. Tuy nhiên, trong danh sách ở giữa màn hình vẫn đang hiển thị các thông báo chưa đọc (có viền đỏ).

**Steps to reproduce**
1. Đăng nhập và truy cập trực tiếp vào trang thông báo mặc định `/notifications` (chế độ xem tất cả thông báo).
2. Nhìn vào số lượng số lượng chưa đọc (unread counts) hiển thị bên cạnh các danh mục ở sidebar bên trái.
3. Quan sát trạng thái của nút "Mark all read" ở góc trên bên phải màn hình.

**Expected result**
Sidebar phải hiển thị chính xác số lượng thông báo chưa đọc của người dùng hiện tại (ví dụ: All Notifications (10)), và nút "Mark all read" phải sáng rõ, khả dụng để có thể click được.

**Actual result**
Sidebar không hiển thị số lượng chưa đọc, nút "Mark all read" bị disable màu xám không thể click, mặc dù vẫn tồn tại các thông báo chưa đọc trên màn hình.

---

<div id="bug_uc22_notif_phuc_22"></div>

## 8. BUG_UC22_NOTIF_PHUC_22: Giao diện chấp nhận bộ lọc chỉ có ngày kết thúc (End Date) mà không có ngày bắt đầu (Start Date)

| ID number        | #BUG_UC22_NOTIF_PHUC_22                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | NOTIF - Chỉ điền ô End Date (bỏ trống Start Date) được chấp nhận mà không tự động điền hay cảnh báo           |
| Reporter         | Nguyễn Trọng Phúc                                                                                             |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Hệ thống chấp nhận lọc chỉ điền End Date, dẫn tới rủi ro truy vấn tải quá nhiều dữ liệu lịch sử không giới hạn |
| URL              | `http://localhost:5173/notifications`                                                                         |
| Screenshot       | [bug_uc22_notif_phuc_22_single_end_date_no_start.png](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/test_cases/notification/screenshots/bug_uc22_notif_phuc_22_single_end_date_no_start.png) |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome 149                                                                                                    |
| Severity         | Minor                                                                                                         |
| Assigned to      | Frontend Team                                                                                                 |
| Priority         | Low                                                                                                           |

**Description**
Giao diện bộ lọc không thực hiện validation để bắt buộc điền Start Date khi End Date có dữ liệu, đồng thời không tự động thiết lập một mốc ngày bắt đầu mặc định (ví dụ: 7 ngày trước đó). Điều này dẫn tới hệ thống thực hiện quét và tải toàn bộ dữ liệu lịch sử từ trước đến nay kết thúc tại mốc End Date đã chọn, gây ảnh hưởng đến hiệu năng tải trang.

**Steps to reproduce**
1. Đăng nhập và vào trang `/notifications`.
2. Điền mốc ngày ở ô "End date" (ví dụ: 25/06/2026) và bỏ trống ô "Start date".

**Expected result**
Giao diện hiển thị cảnh báo yêu cầu điền Start Date.

**Actual result**
Hệ thống chấp nhận bộ lọc chỉ có End Date và tải tất cả thông báo từ quá khứ cho tới ngày 25/06/2026.
