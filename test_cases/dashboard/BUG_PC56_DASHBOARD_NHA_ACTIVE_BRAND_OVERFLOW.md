# BÁO CÁO LỖI UI (BUG REPORT) - PC-56: Tên thương hiệu bị tràn chữ ở widget ACTIVE BRAND

## 1. Thông tin chung (General Information)

- **Jira Ticket**: [PC-56](https://vothanhnha26-1776162196066.atlassian.net/browse/PC-56)
- **Mã Kiểm Thử**: `TC_DASHBOARD_10`
- **Mức độ nghiêm trọng**: Thấp (Minor UI/UX Bug)
- **Cấu phần**: Dashboard / Header Widget
- **Người báo cáo**: Selenium E2E Automation Agent

---

## 2. Mô tả lỗi (Bug Description)

Khi người dùng chọn một thương hiệu (Active Brand) có tên dài (không có khoảng trắng, ví dụ: `UpdatedBrand_178262219423`), phần text hiển thị tên thương hiệu bị tràn (overflow) ra ngoài vùng thẻ card widget "ACTIVE BRAND" ở góc trên cùng bên phải màn hình Dashboard. Lỗi này gây mất mỹ quan và đè lên nhãn "Selected" / "Đang chọn".

---

## 3. Các bước tái hiện (Steps to Reproduce)

1. Đăng nhập vào hệ thống PubliCast.
2. Tạo mới hoặc đổi tên thương hiệu hiện tại thành một chuỗi văn bản dài liền nhau không có khoảng trắng (ví dụ: `UpdatedBrand_178262219423`).
3. Truy cập vào Dashboard chính (`/dashboard`).
4. Quan sát widget **ACTIVE BRAND** hiển thị ở góc trên cùng bên phải trang Dashboard.

---

## 4. Kết quả thực tế vs Mong đợi (Actual vs Expected Results)

- **Kết quả thực tế (Actual Result)**:
  Tên thương hiệu bị kéo dài theo chiều ngang, chui ra ngoài đường viền của Card và đè chèn lên nhãn trạng thái `"Selected"`.
- **Kết quả mong đợi (Expected Result)**:
  Tên thương hiệu dài cần được giới hạn hiển thị gọn gàng bên trong Card bằng cách áp dụng CSS Text Ellipsis (`UpdatedBrand_1782...`) và chỉ hiển thị đầy đủ khi người dùng di chuột (hover) qua.

---

## 5. Kịch bản kiểm thử tự động (Selenium E2E Assertion)

Lỗi được tự động phát hiện và khẳng định bằng cách so sánh chiều rộng cuộn (`scrollWidth`) và chiều rộng hiển thị (`clientWidth`) của phần tử tên thương hiệu:

```javascript
const scrollWidth = await driver.executeScript(
  "return arguments[0].scrollWidth;",
  brandNameEl,
);
const clientWidth = await driver.executeScript(
  "return arguments[0].clientWidth;",
  brandNameEl,
);
expect(scrollWidth).to.be.at.most(clientWidth);
```

- **Khi bị lỗi**: `scrollWidth` (> 200px) > `clientWidth` (xấp xỉ 120px) -> Test Fail.
- **Khi sửa lỗi**: `scrollWidth` == `clientWidth` (được cắt gọn bằng ellipsis) -> Test Pass.
