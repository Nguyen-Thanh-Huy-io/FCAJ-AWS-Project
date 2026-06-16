# Kế hoạch sửa lỗi dữ liệu Facebook Overview Dashboard

## Nguyên nhân gốc rễ (Root Causes)

Dựa trên yêu cầu "không đổi API" (giữ nguyên cấu trúc gọi `facebook.gateway.js`), tôi đã rà soát logic xử lý dữ liệu trong `FacebookAnalyticsService.js` và phát hiện các nguyên nhân khiến dữ liệu hiển thị sai trên tab Overview:

1. **Tính sai "Daily page views" trong Summary Grid**: 
   - Hiện tại backend đang dùng tổng Reach (`totalViews` từ metric `page_impressions_unique`) để chia cho số ngày, thay vì dùng tổng Page Views (`totalPageVisits` từ metric `page_views_total`). Điều này khiến con số hiển thị không khớp với kỳ vọng.

2. **Lỗi hiển thị Followers cho các trang cũ (Legacy Pages)**: 
   - API `getPageDetails` lấy về cả `followersCount` và `likesCount` (`fan_count`). Tuy nhiên, service chỉ truyền `followersCount` vào hàm `getAnalyticsReport`. Với các trang kiểu cũ, `followersCount` thường bằng 0, dẫn đến biểu đồ Followers và con số tổng kết luôn là 0 dù trang có người theo dõi.

3. **Ngày cuối cùng trong biểu đồ luôn bị rớt về 0**:
   - Mảng `dailyMap` được khởi tạo đến hết ngày `endDate` (ví dụ 13/06). Tuy nhiên, do giới hạn của Facebook Insights (tham số `until`), dữ liệu thực tế trả về chỉ đến ngày 12/06. Điều này tạo ra một điểm `0` ảo ở cuối biểu đồ, khiến người dùng cảm thấy "không đúng dữ liệu".

4. **Ghi đè metric Total Clicks**:
   - Nếu Facebook trả về cả `page_total_actions` và `page_post_engagements`, logic `else if` sẽ ghi đè giá trị của `totalClicks`, gây sai lệch cho các tab khác.

## Giải pháp (Implementation Steps)

Chỉ chỉnh sửa logic xử lý trong `backend/src/services/social/facebook/facebook-analytics.service.js`:

### Bước 1: Sửa logic tính toán Summary
Thay đổi biến tính toán `dailyPageViews` để dùng đúng `totalPageVisits`:
```javascript
// Cũ:
const dailyPageViews = parseFloat((totalViews / daysCount).toFixed(2));
// Mới:
const dailyPageViews = parseFloat((totalPageVisits / daysCount).toFixed(2));
```

### Bước 2: Thêm Fallback cho Followers Count
Truyền thêm `likesCount` làm dự phòng nếu `followersCount` bằng 0:
```javascript
// Trong hàm getChannelInfo:
const analyticsData = await this.getAnalyticsReport(
  auth.pageId, 
  auth.pageAccessToken, 
  startDate, 
  endDate, 
  pageData.followersCount || pageData.likesCount // Thêm fallback
);
```

### Bước 3: Lọc bỏ các ngày trống (không có dữ liệu) ở cuối biểu đồ
Tránh hiển thị điểm `0` ảo ở cuối chu kỳ nếu Facebook chưa cung cấp dữ liệu cho ngày đó (do độ trễ 24-48h của Graph API):
```javascript
// Trước khi trả về sortedDates, kiểm tra và loại bỏ các ngày cuối nếu tất cả metric đều 0
while (sortedDates.length > 0) {
  const lastDay = sortedDates[sortedDates.length - 1];
  if (lastDay.views === 0 && lastDay.pageVisits === 0 && lastDay.acquired === 0) {
    sortedDates.pop();
  } else {
    break;
  }
}
```
*(Lưu ý: Chỉ áp dụng khi ngày đó thực sự chưa có dữ liệu nào)*

### Bước 4: Tách biệt logic Clicks và Engagements
```javascript
} else if (name === ANALYTICS.METRICS.FACEBOOK.ACTIONS) {
  dailyMap[dateStr].totalClicks = val.value || 0;
} else if (name === ANALYTICS.METRICS.FACEBOOK.ENGAGEMENTS) {
  // Có thể lưu riêng vào trường khác nếu cần, hoặc cộng dồn
  dailyMap[dateStr].engagements = val.value || 0;
}
```

## Xác nhận
Tôi sẽ áp dụng các thay đổi này mà **KHÔNG** chạm vào `facebook.gateway.js` hay thay đổi endpoint/tham số API gửi lên Facebook theo đúng yêu cầu của bạn.
