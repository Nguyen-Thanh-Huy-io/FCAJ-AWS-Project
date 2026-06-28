# Test Case: TC_YT_DB_07_08 - Tìm kiếm, thêm và xóa đối thủ trên YouTube Dashboard

| ID number   | TC_YT_DB_07_08                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Tìm kiếm, thêm và xóa đối thủ trên YouTube Dashboard          |
| Component   | Analytics / YouTube Dashboard / Competitors                    |
| Status      | Fail (Gốc) / Resolved                                          |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/youtube_dashboard.spec.js`             |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC17                                                           |

## 1. Prerequisites
- Đang hiển thị trang `/dashboard/youtube` tab `COMPETITORS`.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| Competitor  | `@FapTV` hoặc kênh YouTube bất kỳ     |

## 3. Step-by-Step Procedure
1. Click chọn tab `COMPETITORS` trên Dashboard.
2. Tìm ô tìm kiếm đối thủ (`[placeholder="Tìm kiếm kênh đối thủ..."]`).
3. Nhập handle của đối thủ (ví dụ: `@FapTV`) và click nút "Tìm kiếm".
4. Khi kết quả tìm kiếm xuất hiện, click nút "Thêm vào danh sách theo dõi".
5. Xác minh đối thủ mới xuất hiện trong danh sách.
6. Click vào icon menu hành động (nút ⋮) ở cột Action cuối cùng của đối thủ vừa thêm.
7. Click nút "Xóa đối thủ" trong dropdown menu.
8. Xác minh đối thủ biến mất khỏi danh sách.

## 4. Expected Result
- Tính năng tìm kiếm và thêm đối thủ hoạt động tốt, hiển thị ngay trên UI.
- Thao tác xóa đối thủ diễn ra thành công.
- Không bị lỗi ẩn cột hành động trên các màn hình nhỏ.

## 5. Linked Bug
- Có liên kết với bug report [BUG_UC17_ANALYTICS_NHA_07_08.md](file:///d:/Fullit/projects/PubliCast/test_cases/analytics/BUG_UC17_ANALYTICS_NHA_07_08.md) (`PC-53`).
