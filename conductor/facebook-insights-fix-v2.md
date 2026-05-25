# Kế hoạch tiếp tục sửa lỗi Facebook Insights (Summary = 0)

## Objective
Khắc phục tình trạng "Average daily new followers" và "Daily page views" hiển thị bằng 0. 

## Root Cause Analysis
1.  **Lệch múi giờ khi khởi tạo `dailyMap`**: Câu lệnh `new Date(start)` khi truyền vào chuỗi ngày `YYYY-MM-DD` sẽ tự động parse theo múi giờ địa phương (local time). Nếu server chạy ở UTC+7, nó sẽ hiểu là 0h sáng giờ VN (tức là 17h chiều ngày hôm trước theo UTC), dẫn đến khóa (key) của mảng `dailyMap` bị lệch ngày so với logic parse `end_time` (đã chuẩn hóa sang UTC).
2.  **Thiếu Metrics của New Page Experience (NPE)**: Các trang Facebook thế hệ mới không còn dùng khái niệm Fan (Likes) mà chuyển sang Follower. Các metrics cũ như `page_fan_adds_unique` có thể trả về 0. Cần phải thu thập thêm `page_daily_follows_unique` và `page_daily_unfollows_unique`.

## Implementation Steps

### 1. Cập nhật `facebook.gateway.js`
Bổ sung các metrics mới vào danh sách yêu cầu API Insights:
- `page_daily_follows_unique`
- `page_daily_unfollows_unique`
- (Giữ nguyên các metrics cũ để tương thích với các trang kiểu cũ).

### 2. Cập nhật `facebook-analytics.service.js`
**a. Khởi tạo `dailyMap` an toàn với Timezone:**
```javascript
// Thay vì: const startMs = new Date(start).getTime();
// Dùng UTC một cách tường minh:
const startMs = new Date(start + 'T00:00:00Z').getTime();
const endMs = new Date(end + 'T00:00:00Z').getTime();
```

**b. Map thêm dữ liệu NPE:**
```javascript
// Bổ sung logic xử lý cho các metrics mới:
} else if (name === 'page_fan_adds_unique' || name === 'page_daily_follows_unique') {
  dailyMap[dateStr].acquired = (dailyMap[dateStr].acquired || 0) + (val.value || 0);
} else if (name === 'page_fan_removes_unique' || name === 'page_daily_unfollows_unique') {
  dailyMap[dateStr].lost = (dailyMap[dateStr].lost || 0) + (val.value || 0);
}
```
*Lưu ý: dùng phép cộng dồn (`+`) để đảm bảo không bị đè mất dữ liệu nếu API trả về cả 2.*

### 3. Cập nhật Test case
Xác minh rằng bài test `facebook.test.js` hoạt động tốt với cách khởi tạo ngày kiểu mới.

## Verification
- Chạy lại npm test.
- Đồng bộ lại dữ liệu và kiểm tra trên Dashboard. Dự kiến giá trị "Daily page views" và "Average daily new followers" sẽ hiển thị giá trị thật, hoặc trung bình hợp lý nếu tổng số views khác 0.