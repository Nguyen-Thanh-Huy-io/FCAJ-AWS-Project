# Kế hoạch Tái cấu trúc Backend: Tổ chức Thư mục & Xóa Hardcode

## 1. Mục tiêu (Objective)
Giữ nguyên kiến trúc Layer-based (Controllers, Services, Repositories, Routes) nhưng **gom nhóm các tệp bên trong mỗi tầng** thành các thư mục con (sub-directories) theo nghiệp vụ (Domain). Đồng thời, thiết lập hệ thống **Constants** để dọn dẹp toàn bộ "Magic Strings" trong code.

## 2. Tổ chức lại Thư mục (Directory Reorganization)

Hiện tại, thư mục `src/services/` có tới 18 tệp nằm ngang hàng nhau. Chúng ta sẽ gom nhóm chúng như sau (tương tự cho `controllers` và `repositories`):

### Nhóm 1: `auth` (Xác thực & Người dùng)
- `auth.service.js`
- `otp.service.js`
- `profile.service.js`

### Nhóm 2: `social` (Mạng xã hội & Tích hợp)
- `youtube.service.js`
- `google-oauth.service.js`
- `inbox.service.js` (hoặc có thể tách riêng nhóm `communication`)

### Nhóm 3: `workspace` (Quản lý dự án)
- `brand.service.js`
- `team.service.js`
- `post.service.js` (Content Planner)
- `livestream.service.js`
- `media-library.service.js`

### Nhóm 4: `admin` (Quản trị hệ thống)
- `pricing.service.js`
- `revenue.service.js`
- `audit-log.service.js`

### Nhóm 5: `core` (Tiện ích chung)
- `email.service.js`
- `search.service.js`
- `notification.service.js`

*Lưu ý:* Việc di chuyển tệp sẽ yêu cầu cập nhật lại đường dẫn `require(...)` ở tất cả các file liên quan. Cần làm từng nhóm một và test cẩn thận.

## 3. Hệ thống Constants (Dọn dẹp Magic Strings)

Chúng ta sẽ tạo thư mục `src/constants/` để chứa các hằng số.

**`src/constants/index.js` (hoặc chia nhỏ theo file)**:
```javascript
const PLATFORMS = {
  YOUTUBE: 'YOUTUBE',
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  TIKTOK: 'TIKTOK'
};

const INBOX_STATUS = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  RESOLVED: 'RESOLVED',
  OPEN: 'OPEN'
};

const INBOX_TYPES = {
  COMMENT: 'COMMENT',
  DIRECT_MESSAGE: 'DIRECT_MESSAGE',
  MENTION: 'MENTION'
};

module.exports = {
  PLATFORMS,
  INBOX_STATUS,
  INBOX_TYPES
};
```

**Cách áp dụng trong code:**
Thay vì viết: `if (item.platform === 'YOUTUBE')`
Sẽ viết: `if (item.platform === PLATFORMS.YOUTUBE)`

## 4. Kế hoạch triển khai (Step-by-step)

1.  **Bước 1:** Bắt đầu bằng việc dọn dẹp các "Magic Strings" trong cụm tính năng mới nhất (Inbox & YouTube). Tôi sẽ tạo tệp hằng số và cập nhật `inbox.service.js`, `youtube.service.js`.
2.  **Bước 2:** Di chuyển cụm `Inbox` và `Social` vào các thư mục con trong `services`, `controllers` và `routes`.
3.  **Bước 3:** Chạy thử API để đảm bảo không bị gãy đường dẫn.
4.  **Bước 4:** Tiếp tục lặp lại quy trình cho cụm `Auth` và `Admin`.