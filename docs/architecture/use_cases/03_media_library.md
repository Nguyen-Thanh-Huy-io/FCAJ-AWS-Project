# Đặc Tả Use Case: Phân hệ Đa phương tiện (Media)

## 1. Sơ đồ Use Case

![Sơ đồ Use Case Media](../../diagrams/uc_media.png)

## 2. Đặc tả chi tiết

### UC06. Tải lên và Tổ chức Media (Upload & Folders)
*   **Mô tả:** Quản lý kho nội dung số (ảnh, video). Tải trực tiếp hoặc liên kết từ Google Drive, sắp xếp vào các thư mục (Folder).
*   **Tác nhân kích hoạt:** Content Creator, Editor, Admin.
*   **Tiền điều kiện:** Định dạng file hợp lệ.
*   **Các bước thực hiện:**
    1.  Vào mục "Media Library".
    2.  Chọn "Tạo Folder" để phân nhóm (vd: "Chiến dịch Tết").
    3.  Người dùng bấm Upload hoặc "Import từ Google Drive".
    4.  Hệ thống xử lý upload luồng lên Cloudinary, trích xuất metadata (width, height, duration).
    5.  Hệ thống lưu bản ghi `MediaLibrary` liên kết với `MediaFolder`.
