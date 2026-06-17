# BUG REPORT - TEAM_013

| ID number        | BUG_TEAM_013                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | TEAM - Tìm kiếm với từ khóa không tồn tại vẫn hiển thị đầy đủ danh sách thay vì màn hình trống                |
| Reporter         | Antigravity                                                                                                   |
| Submit Date      | 16/06/2026                                                                                                    |
| Summary          | Khi gõ từ khóa tìm kiếm không khớp với bất kỳ thành viên nào (ví dụ: "xyz123"), danh sách thành viên vẫn hiển thị đầy đủ 4 người. |
| URL              | http://localhost:5173/manage/team                                                                             |
| Screenshot       | /                                                                                                             |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome / Firefox                                                                                              |
| Severity         | Major                                                                                                         |
| Assigned to      | Antigravity                                                                                                   |
| Priority         | High                                                                                                          |

**Description**

Khi người dùng nhập một từ khóa ngẫu nhiên không tồn tại trong hệ thống vào ô tìm kiếm thành viên, thay vì trả về danh sách rỗng và hiển thị giao diện "No members found", giao diện danh sách vẫn hiển thị đầy đủ cả 4 người dùng do chức năng tìm kiếm hoàn toàn bị vô hiệu hóa.

**Steps to reproduce**

1. Mở trang quản lý đội ngũ: `http://localhost:5173/manage/team`
2. Nhập từ khóa "xyz123" vào ô tìm kiếm "Search by name or email...".
3. Quan sát giao diện danh sách thành viên.

**Expected result**

Danh sách thành viên biến mất, hệ thống hiển thị màn hình trống với tiêu đề "No members found", mô tả "Try adjusting your search or filters" và nút "Reset All Filters".

**Actual result**

Danh sách thành viên vẫn hiển thị đầy đủ 4 người và không có bất kỳ thông báo hay màn hình trống nào được hiển thị.

**Notes**

Đây là lỗi dây chuyền từ việc tính năng tìm kiếm của module bị hỏng hoàn toàn. Sau khi sửa lỗi tìm kiếm ở backend, cần kiểm tra đảm bảo giao diện màn hình trống được render đúng ở frontend khi danh sách trống.

---

## ✅ RESOLVED

| Resolved Date | 16/06/2026 |
|---|---|
| Fixed By | Antigravity |
| Fix Version | hotfix/team-filter |

**Root Cause:** Lỗi cascade từ BUG_TEAM_009. Vì `TeamSearchFilter` không hoạt động nên API luôn trả về đầy đủ danh sách, khiến UI không bao giờ nhận được mảng rỗng để render màn hình "No members found".

**Fix Applied:**
- Cùng fix với BUG_TEAM_009 (`TeamSearchFilter`). Sau khi search filter hoạt động đúng, backend trả về `data: []` khi không có kết quả, và frontend render đúng component empty state.

**Verified By:** Browser test search "NonexistentUser" → hiển thị "No members found" ✅ PASS
