# BUG REPORT - TEAM_009

| ID number        | BUG_TEAM_009                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | TEAM - Chức năng tìm kiếm thành viên không phản hồi và không lọc danh sách hiển thị                           |
| Reporter         | Antigravity                                                                                                   |
| Submit Date      | 16/06/2026                                                                                                    |
| Summary          | Khi gõ từ khóa tìm kiếm vào ô tìm kiếm thành viên, danh sách thành viên hiển thị không có phản ứng lọc nào xảy ra. |
| URL              | http://localhost:5173/manage/team                                                                             |
| Screenshot       | /                                                                                                             |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome / Firefox                                                                                              |
| Severity         | Major                                                                                                         |
| Assigned to      | Antigravity                                                                                                   |
| Priority         | High                                                                                                          |

**Description**

Khi người dùng nhập từ khóa tìm kiếm (tên hoặc email của thành viên) vào ô tìm kiếm trên trang quản lý đội ngũ, URL trình duyệt thay đổi đúng tham số tìm kiếm (ví dụ: `?search=Guest`), nhưng danh sách thành viên hiển thị trên bảng không được cập nhật mà vẫn giữ nguyên toàn bộ danh sách.

**Steps to reproduce**

1. Mở trang quản lý đội ngũ: `http://localhost:5173/manage/team`
2. Nhập từ khóa "Guest" vào ô tìm kiếm "Search by name or email...".
3. Quan sát phản ứng của danh sách thành viên trên bảng sau 300ms.

**Expected result**

Danh sách thành viên phải tự động được lọc, chỉ hiển thị những thành viên có tên hoặc email chứa từ khóa "Guest" (ví dụ: "Guest Analyst").

**Actual result**

Danh sách thành viên không thay đổi, vẫn hiển thị đầy đủ cả 4 thành viên.

**Notes**

Do lỗi xử lý filter và re-render ở frontend hoặc do lỗi xử lý query params ở backend (khi kết hợp với các bộ lọc khác gây lỗi làm cho API trả về lỗi nhưng frontend nuốt lỗi và hiển thị danh sách cũ).

---

## ✅ RESOLVED

| Resolved Date | 16/06/2026 |
|---|---|
| Fixed By | Antigravity |
| Fix Version | hotfix/team-filter |

**Root Cause:** `TeamSearchFilter` không sử dụng đúng cú pháp Prisma relation filter. Query sử dụng `user.name` trực tiếp thay vì nested relation `{ user: { OR: [...] } }`.

**Fix Applied:**
- Sửa `TeamSearchFilter.apply()` để build đúng Prisma nested `where` clause với relation `user`:
  ```js
  where.user = { OR: [{ name: { contains: searchKey } }, { email: { contains: searchKey } }] }
  ```

**Verified By:** `scratch/test_bugs.js` Test [4] search "Guest" → ✅ PASS
