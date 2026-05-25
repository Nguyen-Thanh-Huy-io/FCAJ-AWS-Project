# Kế hoạch khắc phục lỗi YouTube Dashboard Analytics

## Objective
Xử lý lỗi `TypeError: object is not iterable` tại `usePlatformDashboard.js:289` khi parse dữ liệu từ YouTube Analytics.

## Root Cause Analysis
- Hàm `getAnalyticsData` trong `usePlatformDashboard.js` đang giả định rằng các mảng `raw.demographics`, `raw.trafficSource`, `raw.geographic`, và `raw.growth` đều chứa các phần tử con là Mảng (Array of Arrays) theo đúng định dạng chuẩn của Google Analytics API.
- Lỗi xảy ra tại `raw.growth?.map(([day, views, gained, lost]) => ...)` chứng tỏ có ít nhất một phần tử trong `raw.growth` không phải là iterable (ví dụ: `null`, `undefined`, hoặc `object`).
- Nguyên nhân sâu xa có thể do YouTube API trả về dữ liệu dị thường cho một ngày cụ thể (hoặc khi không có dữ liệu), hoặc dữ liệu cũ trong DB bị format sai (ví dụ format object của Facebook bị dính sang YouTube trong quá trình thử nghiệm).

## Implementation Steps

### 1. Cập nhật Frontend Hook (`usePlatformDashboard.js`)
Thêm các kiểm tra an toàn (defensive programming) để đảm bảo ứng dụng không bị crash nếu dữ liệu dị thường.

**Thay đổi dự kiến:**
- Tại phần parse `demographics`, `trafficSource`, `geographic`, và `growth`, kiểm tra xem mỗi phần tử (row) có phải là Array hay không (`Array.isArray(row)`) trước khi destructure.

Ví dụ:
```javascript
// Cũ:
const growth = raw.growth?.map(([day, views, gained, lost]) => ({...})) || [];

// Mới:
const growth = (raw.growth || [])
  .filter(row => Array.isArray(row) && row.length >= 4)
  .map(([day, views, gained, lost]) => ({
    name: day ? day.split('-').slice(1).join('/') : '',
    value: views || 0,
    new: gained || 0,
    lost: lost || 0
  }));
```
Áp dụng logic kiểm tra tương tự cho các mảng khác.

### 2. Xử lý lỗi Network Error (Backend down)
- Lỗi `net::ERR_CONNECTION_REFUSED` tại `api.js` cho thấy backend có thể đang không chạy hoặc port bị cấu hình sai. Việc này cần được xác nhận (bạn cần đảm bảo backend đang chạy bằng `npm start` hoặc `npm run dev`). Mã frontend đã có block `try...catch` để bắt lỗi này nên ứng dụng không bị crash hoàn toàn, chỉ không load được danh sách brands.

## Verification
- Áp dụng các thay đổi vào frontend.
- Mã sẽ an toàn bỏ qua các phần tử lỗi mà không crash toàn bộ component. Màn hình Dashboard YouTube sẽ load thành công (có thể hiển thị biểu đồ rỗng nếu toàn bộ dữ liệu bị lỗi, nhưng không bị màn hình trắng).