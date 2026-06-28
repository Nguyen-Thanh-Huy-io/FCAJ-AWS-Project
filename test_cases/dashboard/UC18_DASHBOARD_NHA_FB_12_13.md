# Test Case: TC_FB_DB_12_13 - Xuất báo cáo CSV đối thủ Facebook

| ID number   | TC_FB_DB_12_13                                                 |
| ----------- | -------------------------------------------------------------- |
| Name        | Xuất báo cáo CSV đối thủ Facebook                              |
| Component   | Dashboard / Facebook Dashboard / Competitors / Export           |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/dashboard/facebook_dashboard.spec.js`           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC18                                                           |

## 1. Prerequisites
- Đang hiển thị trang `/dashboard/facebook` tab `COMPETITORS`.
- Đã seed dữ liệu đối thủ cạnh tranh ban đầu.

## 2. Test Data
| Parameter   | Value                                 |
| ----------- | ------------------------------------- |
| File Name   | `publicast_facebook_report_competitors.csv` |

## 3. Step-by-Step Procedure
1. Click vào nút Download (icon tải xuống) ở góc trên bên phải header.
2. Một dialog xuất hiện, click vào nút "Tải file CSV".
3. Chờ quá trình tải xuống hoàn thành.
4. Kiểm tra sự tồn tại của file `publicast_facebook_report_competitors.csv` trong thư mục Downloads của hệ thống test.
5. Đọc file CSV và kiểm tra sự xuất hiện của tiêu đề `"Competitor Name"` và tên đối thủ `"Competitor A page"`.

## 4. Expected Result
- File CSV được tải về thành công và lưu đúng đường dẫn.
- Nội dung file CSV chứa đầy đủ tiêu đề cột và thông tin đối thủ cạnh tranh đã seed trên database.
