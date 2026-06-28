# Test Case: TC_FB_DB_09_10 - Quản lý đối thủ cạnh tranh trên Facebook Dashboard

| ID number   | TC_FB_DB_09_10                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Quản lý đối thủ cạnh tranh trên Facebook Dashboard             |
| Component   | Dashboard / Facebook Dashboard / Competitors                   |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/facebook_dashboard.spec.js`           |

## 1. Prerequisites
- Đang hiển thị trang `/dashboard/facebook` tab `COMPETITORS`.
- Đã seed dữ liệu đối thủ cạnh tranh ban đầu (`Competitor A page`).

## 2. Test Data
| Parameter      | Value                                 |
| -------------- | ------------------------------------- |
| Search Query   | `Competitor C`                        |

## 3. Step-by-Step Procedure
1. Tại tab `COMPETITORS`, kiểm tra xem đối thủ cạnh tranh đã seed (`Competitor A page`) có hiển thị trong danh sách hay không.
2. Click nút "ADD COMPETITOR".
3. Nhập tên `"Competitor C"` vào ô tìm kiếm và click nút "Search".
4. Khi kết quả tìm kiếm xuất hiện, click nút "Add" kế bên đối thủ mới để thêm vào danh sách theo dõi.
5. Kiểm tra danh sách đối thủ cạnh tranh để xem đối thủ vừa thêm có tồn tại hay không.
6. Click vào icon menu hành động (nút ⋮) ở cột Action cuối cùng của đối thủ vừa thêm.
7. Chọn `"Delete competitor"`.
8. Click nút `"Delete"` trên dialog xác nhận để hoàn tất xóa.

## 4. Expected Result
- Hiển thị đúng đối thủ đã seed ban đầu.
- Tính năng tìm kiếm và thêm đối thủ mới diễn ra thành công.
- Menu hành động mở ra và hỗ trợ xóa đối thủ thành công, đối thủ bị loại bỏ hoàn toàn khỏi bảng.
