# Hướng Dẫn Quy Chuẩn Đặt Tên Git & Tích Hợp Jira (Smart Commits)

Tài liệu này hướng dẫn cách đặt tên **Nhánh (Branch)**, **Commit** và **Tiêu đề Pull Request (PR)** chứa mã công việc của Jira (ví dụ: `PB-1`) để hệ thống tự động liên kết và cập nhật trạng thái lịch sử phát triển phần mềm lên bảng quản lý Jira.

---

## 📌 1. Quy Tắc Đặt Tên Nhánh (Branch Naming)
Để Jira tự động nhận diện và hiển thị nhánh của bạn trong mục **Branches** của Task:
* **Công thức**: `loại-nhánh/mã-jira-mô-tả-ngắn`
* **Các loại nhánh phổ biến**:
  * `feature/`: Dành cho tính năng mới.
  * `bugfix/` hoặc `fix/`: Dành cho sửa lỗi.
  * `hotfix/`: Dành cho sửa lỗi khẩn cấp trên production.
  * `refactor/`: Dành cho tối ưu, cấu trúc lại code.

### 📝 Ví dụ thực tế:
* ✅ `feature/PB-1-setup-selenium` (Đúng - Jira tự động liên kết nhánh này vào task `PB-1`)
* ✅ `bugfix/PB-12-fix-login-error` (Đúng)
* ❌ `feature/setup-selenium` (Sai - Thiếu mã Jira, Jira sẽ không nhận diện được nhánh này)

---

## 💬 2. Quy Tắc Viết Thông Điệp Commit (Commit Messages)
Để Jira tự động ghi nhận lịch sử commit vào phần **Commits** của Task trên Jira:
* **Công thức**: `[MÃ-JIRA] loại-commit: mô tả ngắn bằng tiếng Việt/Anh`
* **Các loại commit phổ biến**:
  * `feat`: Tính năng mới.
  * `fix`: Sửa lỗi.
  * `docs`: Cập nhật tài liệu, file markdown.
  * `test`: Viết hoặc sửa file test.
  * `ci`: Cấu hình hệ thống CI/CD (GitHub Actions, Docker).

### 📝 Ví dụ thực tế:
* ✅ `[PB-1] feat: tích hợp script gửi báo cáo lỗi lên Jira` (Đúng)
* ✅ `[PB-1] ci: cấu hình headless chrome chạy trên github actions` (Đúng)
* ❌ `fix lỗi đăng nhập` (Sai - Thiếu mã Jira)

---

## 🔀 3. Quy Tắc Đặt Tiêu Đề Pull Request (PR Titles)
Để Jira tự động nhận diện và hiển thị trạng thái PR của bạn trong mục **Pull requests** của Task:
* **Công thức**: `[MÃ-JIRA] Tiêu đề mô tả tính năng của PR`

### 📝 Ví dụ thực tế:
* ✅ `[PB-1] Tích hợp Selenium QA automation và tự động báo lỗi Jira` (Đúng - Jira sẽ cập nhật trạng thái PR từ 0 lên 1)
* ❌ `Feature/test automation` (Sai - Thiếu mã Jira, hệ thống sẽ báo 0 PR trên Jira)

---

## 🔄 4. Quy Trình Phối Hợp Chuẩn Từ A - Z

Dưới đây là các bước thực hiện chuẩn chỉ khi bạn nhận một Task mới trên Jira (Ví dụ task có mã là **`PB-10`**):

### **Bước 1: Tạo nhánh làm việc mới**
Tạo nhánh mới từ nhánh phát triển chung (`develop`) và đặt tên chứa mã Jira của task:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/PB-10-register-validation
```

### **Bước 2: Viết code và commit**
Trong quá trình code, thực hiện commit đều đặn kèm mã Jira của task ở đầu mỗi thông điệp:
```bash
git add .
git commit -m "[PB-10] feat: thêm kiểm tra định dạng email khi đăng ký"
```

### **Bước 3: Push code lên GitHub**
Đẩy nhánh làm việc của bạn lên kho lưu trữ từ xa:
```bash
git push origin feature/PB-10-register-validation
```

### **Bước 4: Tạo Pull Request (PR)**
1. Truy cập vào GitHub của dự án.
2. Nhấn **Compare & pull request** cho nhánh vừa push.
3. Đặt tiêu đề cho PR có chứa mã task: `[PB-10] Thêm validate form đăng ký thành viên`.
4. Nhánh nhận code (base) chọn: **`develop`**.
5. Nhấn **Create pull request**.

### **Bước 5: Kiểm tra trên Jira**
Mở task **PB-10** trên Jira. Bạn sẽ thấy:
* **Development** hiển thị: **1 branch**, **1 pull request**, và số lượng commit tương ứng.

---

*Tài liệu được tạo tự động để hỗ trợ chuẩn hóa quy trình làm việc.*
