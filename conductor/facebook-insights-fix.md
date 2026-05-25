# Kế hoạch sửa lỗi dữ liệu Facebook Insights (Views & Page Visits)

## Objective
Khắc phục tình trạng dữ liệu Views và Page Visits (Reach) của Facebook luôn hiển thị là 0 trên Dashboard.

## Root Cause Analysis
1. **Lệch múi giờ & logic `end_time`**: Facebook Graph API trả về trường `end_time` cho mỗi metric. `end_time` này biểu thị thời điểm *kết thúc* của khoảng thời gian 24 giờ. Ví dụ: dữ liệu của ngày `2026-05-24` sẽ có `end_time` là `2026-05-25T07:00:00+0000` (hoặc `00:00:00`). Code hiện tại dùng trực tiếp chuỗi ngày của `end_time` này (`2026-05-25`), làm cho toàn bộ dữ liệu bị đẩy lùi 1 ngày và không khớp với `dailyMap` (đặc biệt là nếu bị văng ra khỏi mảng ngày đã khởi tạo).
2. **Metrics Mapping**: Hiện tại, backend đang dùng `page_views_total` cho Views và `page_impressions_unique` cho Page Visits. Đây là cách mapping chuẩn cho Reach và Views, nhưng nếu không parse đúng ngày, giá trị sẽ không được cộng dồn vào các mảng thống kê.

## Implementation Steps

### 1. Cập nhật logic parse thời gian trong `facebook-analytics.service.js`
- Tìm đoạn parse `end_time` trong phương thức `getAnalyticsReport`.
- Trừ đi 1 ngày từ giá trị `end_time` để lấy đúng ngày thống kê thực tế.

**Thay đổi dự kiến:**
```javascript
// Cũ:
const dateStr = new Date(val.end_time).toISOString().split('T')[0];

// Mới:
const d = new Date(val.end_time);
// Facebook Insights end_time đánh dấu điểm kết thúc của chu kỳ 24h,
// nên ngày thực tế của dữ liệu là ngày trước đó.
d.setUTCDate(d.getUTCDate() - 1);
const dateStr = d.toISOString().split('T')[0];
```

### 2. Bổ sung log và dự phòng lỗi trong `facebook.gateway.js` (Optional)
- Thêm log debug trong trường hợp API Insights trả về mảng rỗng để dễ dàng theo dõi sau này.
- Giữ nguyên các metric hiện tại vì chúng là chuẩn của Graph API v18.0.

## Verification & Testing
- Sau khi áp dụng, gọi lại API `GET /api/social/metrics` hoặc vào trang Dashboard của nền tảng để kiểm tra.
- Xác nhận các con số Views và Reach/Page Visits không còn là 0.
- Kiểm tra tính đồng bộ dữ liệu theo từng ngày trên biểu đồ.