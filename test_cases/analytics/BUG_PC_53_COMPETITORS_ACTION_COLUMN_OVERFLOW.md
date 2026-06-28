# BUG REPORT - PC-53

| ID number        | PC-53                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | YouTube Dashboard – Competitors table ẩn cột Action (3-dot menu) trên viewport nhỏ do overflow-x              |
| Reporter         | Antigravity                                                                                                   |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Bảng danh sách Competitors trong tab COMPETITORS có min-width: 800px. Trên các viewport nhỏ hơn (bao gồm Selenium mặc định ~1024px), bảng kích hoạt horizontal scroll khiến cột cuối cùng chứa icon ⭐ và nút ⋮ (menu hành động) bị nằm ngoài vùng nhìn thấy của người dùng. |
| URL              | /dashboard/youtube → tab COMPETITORS                                                                          |
| Screenshot       | ![Screenshot](./screenshots/youtube_competitors_overflow.png)                                                 |
| Platform         | Web Application                                                                                               |
| Operating System | Windows / Linux / macOS                                                                                       |
| Browser          | Chrome / Firefox / Safari                                                                                      |
| Severity         | Medium                                                                                                        |
| Assigned to      | Frontend Team                                                                                                 |
| Priority         | Medium                                                                                                        |

**Description**

Bảng danh sách Competitors trong tab COMPETITORS có min-width: 800px (class Tailwind `min-w-[800px]`). Trên các viewport nhỏ hơn (bao gồm Selenium mặc định ~1024px khi cửa sổ không tối đa hóa), bảng kích hoạt horizontal scroll khiến cột cuối cùng chứa icon ⭐ (yêu thích) và nút ⋮ (MoreVertical / menu hành động) bị nằm ngoài vùng nhìn thấy của người dùng.

Đây là một dạng hidden affordance (UX anti-pattern): chức năng quan trọng (xóa đối thủ cạnh tranh) bị giấu sau một hành động không rõ ràng (người dùng phải scroll ngang bảng thì mới nhìn thấy).

**Steps to reproduce**

1. Đăng nhập hệ thống và đi tới trang `/dashboard/youtube`.
2. Click tab `COMPETITORS`.
3. Thêm ít nhất 2 đối thủ cạnh tranh vào danh sách theo dõi.
4. Thu hẹp viewport trình duyệt xuống nhỏ hơn 900px.
5. Quan sát – cột Action (chứa menu ⋮) bị ẩn ra ngoài biên bên phải của bảng.

**Expected result**

Nút ⋮ (menu hành động) luôn hiển thị trong vùng nhìn thấy (ví dụ: làm cột Action đó `sticky` ở bên phải), hoặc có chỉ báo trực quan rõ ràng gợi ý cuộn ngang bảng.

**Actual result**

Cột Action bị ẩn hoàn toàn ngoài viewport. Người dùng không thấy nút xóa đối thủ trừ khi thực hiện cuộn ngang thủ công.

**Suggested Fix**

Thêm thuộc tính CSS sticky vào th/td của cột Action cuối cùng:
```jsx
<th className="sticky right-0 bg-white shadow-l">
<td className="sticky right-0 bg-white shadow-l">
```
**Phát hiện qua**: Selenium E2E Test `TC_YT_DB_07` (bị timeout khi cố gắng click nút ⋮ do nằm ngoài màn hình).
**File liên quan**: `frontend/src/pages/workspace/dashboard/CompetitorsTab.jsx`
