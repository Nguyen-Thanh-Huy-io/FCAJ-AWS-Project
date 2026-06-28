# BUG REPORT - PC-55

| ID number        | PC-55                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | TEAM - Nhóm lỗi UI/Validation: Mời thành viên, Tìm kiếm và Quản lý vai trò tùy chỉnh                        |
| Reporter         | NHA                                                                                                           |
| Submit Date      | 28/06/2026                                                                                                    |
| Use Case ID      | UC06, UC07                                                                                                    |
| Summary          | Nhóm 7 lỗi liên quan đến chức năng mời thành viên, tìm kiếm/lọc danh sách, và quản lý vai trò tùy chỉnh trong module Team Management. |
| URL              | http://localhost:5173/manage/team                                                                             |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome / Firefox                                                                                              |
| Severity         | Medium → High (tùy lỗi)                                                                                       |
| Assigned to      | Full-stack Team                                                                                               |
| Priority         | High                                                                                                          |
| Status           | ✅ RESOLVED (tất cả 7 lỗi đã được khắc phục)                                                                 |

---

## Danh sách lỗi (Bug Cluster)

### 🐛 BUG_TEAM_002 – Validate định dạng Email khi mời thành viên
- **Test Case liên kết:** `UC06_TEAM_NHA_02.md`
- **Trạng thái:** ✅ RESOLVED
- **Mô tả:** Hệ thống chấp nhận email sai định dạng (ví dụ: `abc@`) khi gửi lời mời thành viên.
- **Nguyên nhân:** Thiếu regex validation định dạng email trong `TeamService.inviteMember`.
- **Cách khắc phục:** Thêm kiểm tra regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, ném lỗi 400 nếu sai định dạng.

---

### 🐛 BUG_TEAM_003 – Mời trùng email có khoảng trắng không bị chặn
- **Test Case liên kết:** `UC06_TEAM_NHA_03.md`
- **Trạng thái:** ✅ RESOLVED
- **Mô tả:** Email `" test@gmail.com "` (có khoảng trắng) vượt qua kiểm tra trùng lặp, tự động đổi vai trò thành viên hiện tại thay vì báo lỗi.
- **Nguyên nhân:** Email chưa được `.trim().toLowerCase()` trước khi truy vấn kiểm tra trùng lặp.
- **Cách khắc phục:** Chuẩn hóa `email = email.trim().toLowerCase()` ở đầu API handler.

---

### 🐛 BUG_TEAM_005 – Tên vai trò tùy chỉnh không bị giới hạn độ dài
- **Test Case liên kết:** `UC07_TEAM_NHA_07.md`
- **Trạng thái:** ✅ RESOLVED
- **Mô tả:** Backend và Frontend cho phép lưu tên vai trò có độ dài không giới hạn.
- **Nguyên nhân:** Thiếu ràng buộc `maxLength` ở Frontend và thiếu validation `length <= 50` ở Backend.
- **Cách khắc phục:**
  - Frontend: Thêm `maxLength={50}` vào input tên vai trò.
  - Backend: Thêm kiểm tra độ dài ≤ 50 ký tự trong `RoleService`.

---

### 🐛 BUG_TEAM_009 – Tính năng tìm kiếm thành viên hoàn toàn bị hỏng
- **Test Case liên kết:** `UC06_TEAM_NHA_09.md` (TEAM_024 → TC09 trong Selenium)
- **Trạng thái:** ✅ RESOLVED
- **Mô tả:** Tìm kiếm theo tên/email thành viên không trả về kết quả, luôn hiển thị toàn bộ danh sách.
- **Nguyên nhân:** `TeamSearchFilter` sử dụng sai cú pháp nested relation query của Prisma.
- **Cách khắc phục:** Sửa cú pháp query Prisma sử dụng đúng relation filter `user.name` và `user.email`.

---

### 🐛 BUG_TEAM_010 – Bộ lọc thành viên theo vai trò bị crash
- **Test Case liên kết:** `UC06_TEAM_NHA_09.md`
- **Trạng thái:** ✅ RESOLVED
- **Mô tả:** Bộ lọc vai trò `TeamRoleFilter` cố ép Custom Role thành Enum của Prisma → crash câu query.
- **Nguyên nhân:** Logic filter không phân biệt System Role (enum) và Custom Role (relation).
- **Cách khắc phục:** Cải tiến `TeamRoleFilter` để phân nhánh: nếu là System Role lọc theo `role` enum, nếu là Custom Role lọc theo `customRole.name`.

---

### 🐛 BUG_TEAM_013 – Không hiển thị màn hình "No members found"
- **Test Case liên kết:** `UC06_TEAM_NHA_09.md`
- **Trạng thái:** ✅ RESOLVED
- **Mô tả:** Khi tìm kiếm không có kết quả, giao diện không hiển thị màn hình trống hợp lệ.
- **Nguyên nhân:** Lỗi liên đới từ BUG_TEAM_009, API không trả về `[]` khi không có kết quả.
- **Cách khắc phục:** Sửa bộ lọc tìm kiếm giúp API trả về danh sách rỗng chuẩn xác.

---

### 🐛 BUG_TEAM_017 – Xóa vai trò đang gán trả về lỗi 401 thay vì 400
- **Test Case liên kết:** `UC07_TEAM_NHA_08.md`
- **Trạng thái:** ✅ RESOLVED
- **Mô tả:** Khi xóa Custom Role đang được gán cho thành viên, hệ thống trả về `401 Unauthorized` thay vì lỗi nghiệp vụ `400 Bad Request`.
- **Nguyên nhân:** Database ném lỗi vi phạm khóa ngoại (Foreign Key Constraint) → middleware backend bắt nhầm thành lỗi 401.
- **Cách khắc phục:** Bổ sung bước kiểm tra trong `RoleService.deleteRole`: đếm thành viên đang dùng vai trò, nếu > 0 thì ném lỗi 400 rõ ràng trước khi xóa.

---

## Verified By
Nhã – Kiểm thử tự động Selenium E2E (`UC06_TEAM_NHA_02` đến `UC07_TEAM_NHA_08_H`) đã PASS 100% sau khi áp dụng các fix.
