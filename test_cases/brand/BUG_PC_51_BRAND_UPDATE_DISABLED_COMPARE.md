# BUG REPORT - PC-51

| ID number        | PC-51                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Name             | BRAND - Kiểm thử Selenium TC09 thất bại khi so khớp giá trị disabled                                          |
| Reporter         | Antigravity                                                                                                   |
| Submit Date      | 28/06/2026                                                                                                    |
| Summary          | Nút 'Lưu thay đổi' (save-brand-btn) đã bị vô hiệu hóa chính xác trên giao diện (UI) khi tên không đổi, nhưng phương thức `.getAttribute('disabled')` của Selenium WebDriver trả về chuỗi `'true'` thay vì `null` hoặc ngược lại tùy thuộc vào môi trường webdriver. Điều này khiến assert mong đợi `expect(isDisabled).to.not.be.null` hoặc `expect(isDisabled).to.be.null` bị fail tùy theo môi trường. |
| URL              | http://localhost:5173/manage/connections                                                                      |
| Screenshot       | ![Screenshot](./screenshots/brand_update_failed.png)                                                          |
| Platform         | Windows                                                                                                       |
| Operating System | Windows 11                                                                                                    |
| Browser          | Chrome / Firefox                                                                                              |
| Severity         | Low                                                                                                           |
| Assigned to      | QA Team / Frontend Team                                                                                        |
| Priority         | Low                                                                                                           |

**Description**

Trong kịch bản kiểm thử `brand.update.spec.js` dòng 87 (`TC09 – Save button disabled when name unchanged`), chúng ta thực hiện kiểm tra xem nút Save có bị disabled khi tên thương hiệu không thay đổi. Tuy nhiên, cách Selenium lấy thuộc tính `disabled` thông qua `.getAttribute('disabled')` có thể trả về các giá trị khác nhau tùy thuộc vào phiên bản ChromeDriver (trả về chuỗi `'true'`, `'disabled'`, hoặc `null` / `true` dạng boolean).
Điều này làm cho câu lệnh assertion:
```javascript
const isDisabled = await saveBtn.getAttribute('disabled');
expect(isDisabled).to.not.be.null;
```
bị thất bại trong một số môi trường chạy test cụ thể.

**Steps to reproduce**

1. Đăng nhập hệ thống với quyền `admin` và điều hướng tới `/manage/connections`.
2. Lấy tên hiện tại của thương hiệu, xóa đi và nhập lại đúng tên đó.
3. Chạy kiểm thử tự động Selenium `brand.update.spec.js`.
4. Quan sát kết quả assertion thất bại ở dòng 99.

**Expected result**

Assertion hoạt động ổn định trên mọi môi trường ChromeDriver bằng cách kiểm tra thuộc tính hoặc trạng thái disabled một cách linh hoạt (ví dụ: so khớp cả chuỗi `'true'` hoặc sử dụng `.getProperty('disabled')` để nhận dạng kiểu boolean đích thực).

**Actual result**

Test suite bị crash/fail do so khớp không khớp với giá trị trả về của trình điều khiển trình duyệt.

**Suggested Fix**

Thay vì dùng `getAttribute('disabled')`, hãy đổi sang dùng `getProperty('disabled')` để trả về giá trị boolean `true`/`false` chuẩn xác:
```javascript
const isDisabled = await saveBtn.getProperty('disabled');
expect(isDisabled).to.be.true;
```
hoặc kiểm tra tính tồn tại linh hoạt:
```javascript
const isDisabled = await saveBtn.getAttribute('disabled');
expect(isDisabled === 'true' || isDisabled === 'disabled' || isDisabled === '').to.be.true;
```
