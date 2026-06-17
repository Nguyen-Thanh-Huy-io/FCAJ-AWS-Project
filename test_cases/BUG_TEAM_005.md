# BUG REPORT - TEAM_005

| ID number        | BUG_TEAM_005                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | ROLE - Không giới hạn độ dài tên vai trò tùy chỉnh khi tạo mới hoặc cập nhật                                   |
| Reporter         | Antigravity                                                                                                   |
| Submit Date      | 16/06/2026                                                                                                    |
| Summary          | Hệ thống cho phép tạo vai trò tùy chỉnh có tên cực kỳ dài (lên tới 100 ký tự hoặc hơn), gây lỗi hiển thị tràn UI và không đảm bảo tính toàn vẹn dữ liệu. |
| URL              | http://localhost:5173/manage/team?tab=roles                                                                   |
| Screenshot       | ![Screenshot](./screenshots/custom_roles_interface.png)                                                                                                             |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome / Firefox                                                                                              |
| Severity         | Minor                                                                                                         |
| Assigned to      | Antigravity                                                                                                   |
| Priority         | Medium                                                                                                        |

**Description**

Khi tạo mới hoặc cập nhật vai trò tùy chỉnh (Custom Role), hệ thống chấp nhận các tên vai trò có độ dài vượt quá giới hạn hợp lý (ví dụ: 100 ký tự) mà không có bất kỳ thông báo lỗi hoặc giới hạn nào trên giao diện nhập liệu lẫn phía API backend.

**Steps to reproduce**

1. Truy cập tab "Vai trò tùy chỉnh" trong trang quản lý đội ngũ.
2. Nhấp nút "Tạo Custom Role".
3. Nhập một chuỗi ký tự dài 100 ký tự làm tên vai trò.
4. Nhấp nút "Lưu".

**Expected result**

Hệ thống nên giới hạn số ký tự tối đa của tên vai trò trên giao diện (ví dụ: tối đa 50 ký tự) và backend cần ném ra lỗi validation nếu độ dài vượt quá giới hạn này: "Tên vai trò không được vượt quá 50 ký tự."

**Actual result**

Hệ thống cho phép lưu thành công vai trò có tên dài 100 ký tự, dẫn đến giao diện thẻ vai trò bị vỡ, tràn chữ.

**Notes**

Cần bổ sung kiểm tra chiều dài chuỗi `name` ở cả frontend (ô nhập input với `maxLength={50}`) và backend (nếu `name.trim().length > 50` thì ném lỗi 400).

---

## ✅ RESOLVED

| Resolved Date | 16/06/2026 |
|---|---|
| Fixed By | Antigravity |
| Fix Version | hotfix/role-validation |

**Root Cause:** `RoleService.createRole` và `updateRole` không có bước kiểm tra `name.length > 50`. Frontend `<input>` cũng không có thuộc tính `maxLength`.

**Fix Applied:**
- Thêm `if (name.trim().length > 50) throw AppError(400, 'Tên vai trò không được vượt quá 50 ký tự.')` vào cả `createRole` và `updateRole` trong `backend/src/services/workspace/role.service.js`.
- Thêm `maxLength={50}` vào ô nhập tên vai trò trong `frontend/src/pages/manage/TeamManagement.jsx`.

**Verified By:** `scratch/test_bugs.js` Test [3] → ✅ PASS
