ID number
BUG_UC17_ANALYTICS_NHA_07_08
Name
ANALYTICS - Cột thao tác trong bảng đối thủ cạnh tranh bị ẩn trên màn hình nhỏ (PC-53)
Reporter
Nhã
Submit Date
28/06/2026
Summary
Bảng danh sách đối thủ cạnh tranh có kích thước lớn khiến cột thao tác (nút xóa đối thủ) bị ẩn ra ngoài biên bên phải khi người dùng sử dụng màn hình nhỏ hoặc thu hẹp trình duyệt.
URL
http://localhost:5173/dashboard/youtube → tab COMPETITORS
Screenshot

Platform
Windows
Operating System
Windows 11
Browser
Chrome / Firefox
Severity
Medium
Assigned to
Nhã
Priority
Medium

Description
Bảng đối thủ cạnh tranh được thiết kế với chiều rộng tối thiểu cố định. Trên các kích thước màn hình nhỏ hoặc khi thu nhỏ trình duyệt, bảng xuất hiện thanh cuộn ngang và cột thao tác cuối cùng (chứa nút xóa đối thủ) bị ẩn ngoài vùng hiển thị của màn hình. Người dùng không thể thấy nút này để thao tác trừ khi thực hiện kéo thanh cuộn ngang thủ công, gây khó khăn cho trải nghiệm.

Steps to reproduce
1. Đăng nhập hệ thống, truy cập trang `/dashboard/youtube` và click chọn tab `COMPETITORS`.
2. Nhập handle đối thủ cạnh tranh (ví dụ: `@FapTV`) vào ô tìm kiếm và click nút "Thêm vào danh sách theo dõi".
3. Thay đổi chiều rộng cửa sổ trình duyệt xuống dưới 900 pixel.
4. Quan sát vị trí hiển thị của nút thao tác ở cuối dòng (icon menu hành động ⋮).

Expected result
Nút thao tác xóa đối thủ phải luôn được hiển thị trong tầm mắt của người dùng (ví dụ: ghim cố định cột thao tác ở cạnh phải bảng khi có thanh cuộn ngang).

Actual result
Cột thao tác bị ẩn hoàn toàn ngoài màn hình, đòi hỏi người dùng phải cuộn ngang bảng mới có thể tương tác.

Notes
Bố cục bảng hiển thị đối thủ cạnh tranh chưa được tối ưu hóa hiển thị linh hoạt (ghim cố định cột thao tác ở lề phải) cho các kích thước màn hình nhỏ hơn.
