# Đặc Tả Use Case: Phân hệ Đăng bài & Lập lịch

## 1. Sơ đồ Use Case

![Sơ đồ Use Case Publishing](../../diagrams/uc_publishing.png)

## 2. Đặc tả chi tiết

### UC07. Soạn thảo & Tạo bài đăng (Create Post)
*   **Mô tả:** Công cụ hợp nhất để thiết kế nội dung post, đính kèm media và sử dụng AI sinh caption/hashtag.
*   **Tác nhân kích hoạt:** Content Creator, Editor.
*   **Tiền điều kiện:** Đã kết nối tối thiểu 1 kênh mạng xã hội.
*   **Các bước thực hiện:**
    1.  Vào "Create Post". Chọn các nền tảng sẽ đăng (Multi-selection: FB, TikTok, IG...).
    2.  Nhập nội dung hoặc nhấn "AI Generate" (tích hợp Prompt để sinh nội dung theo Brand Voice).
    3.  Đính kèm Media từ máy hoặc Media Library.
    4.  Lựa chọn: Lưu Nháp (DRAFT), Lên lịch (SCHEDULED) hoặc Yêu cầu duyệt (PENDING_APPROVAL).

### UC08. Quy trình Phê duyệt (Approval Workflow)
*   **Mô tả:** Nhân sự cấp dưới đệ trình nội dung cho cấp quản lý duyệt trước khi bài được phép xuất bản.
*   **Tác nhân kích hoạt:** Requester (Người yêu cầu), Reviewer (Người duyệt).
*   **Tiền điều kiện:** Gói cước hỗ trợ `allowApprovalWorkflow`.
*   **Các bước thực hiện:**
    1.  **Requester:** Khi tạo bài, chọn "Request Approval" và tag tên Reviewer.
    2.  **Hệ thống:** Lưu trạng thái bài viết là `PENDING_APPROVAL`, gửi thông báo cho Reviewer.
    3.  **Reviewer:** Mở thông báo, xem trước bài. Chọn "Approve" (Đồng ý), "Reject" (Từ chối) hoặc "Request Revision" (Yêu cầu sửa).
    4.  Nếu Approve, bài viết tự động chuyển sang hàng đợi xuất bản.

### UC09. Lập lịch Tự động (AutoLists)
*   **Mô tả:** Quản lý hàng đợi (Queue) tự động xuất bản theo luật. Cho phép nạp dữ liệu bulk từ CSV hoặc RSS.
*   **Tác nhân kích hoạt:** Manager.
*   **Tiền điều kiện:** Không.
*   **Các bước thực hiện:**
    1.  Tạo AutoList (VD: "Meme Hàng Ngày"). Cấu hình đăng lúc 20:00 các ngày trong tuần.
    2.  Tạo bài viết và Gán (Assign) vào AutoList này (hoặc upload CSV chứa 100 bài).
    3.  Định kỳ, Worker (BullMQ) kiểm tra AutoList, bốc bài viết cũ nhất ra đẩy lên MXH.

### UC10. Quản lý Livestream
*   **Mô tả:** Khởi tạo lịch phát trực tiếp và lấy mã luồng (RTMP Key) để cấp cho phần mềm ngoài (OBS/vMix) đẩy luồng lên đa nền tảng.
*   **Tác nhân kích hoạt:** Stream Operator.
*   **Tiền điều kiện:** Kênh MXH có hỗ trợ/được phép Live.
*   **Các bước thực hiện:**
    1.  Nhập Tiêu đề, Thời gian, Chọn kênh đích.
    2.  Hệ thống tạo event, cấp URL RTMP và Stream Key.
    3.  Hệ thống giám sát trạng thái Live, lưu Peak Viewers khi hoàn thành.
