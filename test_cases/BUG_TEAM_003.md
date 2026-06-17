# BUG REPORT - TEAM_003

| ID number        | BUG_TEAM_003                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | TEAM - Hệ thống không chặn trùng lặp email và tự động đổi vai trò thành viên hiện tại khi mời lại có khoảng trắng |
| Reporter         | Antigravity                                                                                                   |
| Submit Date      | 16/06/2026                                                                                                    |
| Summary          | Khi mời một email đã là thành viên trong thương hiệu nhưng kèm theo khoảng trắng ở đầu/cuối, hệ thống tự động đổi vai trò của thành viên đó thay vì báo lỗi trùng lặp. |
| URL              | http://localhost:5173/manage/team                                                                             |
| Screenshot       | /                                                                                                             |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome / Firefox                                                                                              |
| Severity         | Critical                                                                                                      |
| Assigned to      | Antigravity                                                                                                   |
| Priority         | High                                                                                                          |

**Description**

Khi thực hiện mời một thành viên mới, nếu email đã tồn tại trong thương hiệu (ở trạng thái ACTIVE hoặc PENDING) nhưng người dùng nhập thêm khoảng trắng (ví dụ: " guest@gmail.com " hoặc "guest@gmail.com "), hệ thống không trim email trước khi truy vấn dẫn đến việc không phát hiện ra sự tồn tại của thành viên này. Kết quả là hệ thống tự động cập nhật hoặc thay đổi vai trò của thành viên hiện tại thay vì ném ra lỗi validation chặn trùng lặp.

**Steps to reproduce**

1. Mở trình duyệt, truy cập trang quản lý đội ngũ: `http://localhost:5173/manage/team`
2. Đã có một thành viên với email `guest@gmail.com` trong danh sách.
3. Nhấp "Invite Member".
4. Nhập email kèm khoảng trắng: ` guest@gmail.com ` hoặc `guest@gmail.com `
5. Nhấp nút "Gửi lời mời tham gia".

**Expected result**

Hệ thống phải tự động loại bỏ khoảng trắng ở đầu và cuối email (trim), kiểm tra sự tồn tại của email trong thương hiệu, và hiển thị thông báo lỗi: "Người dùng này đã là thành viên của thương hiệu."

**Actual result**

Hệ thống trim khoảng trắng đúng khi lưu nhưng không ném ra lỗi trùng email, mà tự động ghi đè và thay đổi vai trò của thành viên `guest@gmail.com` hiện tại thành vai trò mới được chọn.

**Notes**

Lỗi do thiếu xử lý trim và chuyển thành chữ thường (`toLowerCase()`) cho email ở đầu hàm xử lý API mời thành viên, làm cho câu lệnh kiểm tra trùng lặp trên DB bị sai lệch.

---

## ✅ RESOLVED

| Resolved Date | 16/06/2026 |
|---|---|
| Fixed By | Antigravity |
| Fix Version | hotfix/team-validation |

**Root Cause:** Email không được `.trim().toLowerCase()` trước khi query kiểm tra tồn tại, khiến `" guest@gmail.com "` không match với `"guest@gmail.com"` trong DB.

**Fix Applied:**
- Thêm `email = email.trim().toLowerCase()` ngay sau bước validate regex trong `TeamService.inviteMember`.
- Query kiểm tra tồn tại thành viên dùng email đã được chuẩn hóa, ném `AppError(400, 'Người dùng này đã là thành viên...')` nếu trùng.

**Verified By:** `scratch/test_bugs.js` Test [2] → ✅ PASS
