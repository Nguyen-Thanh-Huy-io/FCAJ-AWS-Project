# Test Case: UC10_POST_MEDIA_NHA_09

| ID number   | UC10_POST_MEDIA_NHA_09                                         |
| ----------- | -------------------------------------------------------------- |
| Name        | Lên lịch bài đăng cho ngày mai – lưu scheduledAt vào DB       |
| Component   | Post Creator / Scheduling / Facebook                           |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/post_creator.spec.js`                           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC10, UC13                                                     |

## 1. Prerequisites
- Mock Facebook Social Account đã được seed vào DB.

## 2. Test Data
| Parameter | Value |
|-----------|-------|
| Platform | FACEBOOK |
| Caption | `Mocha E2E Scheduled Post - Created at {timestamp}` |
| Scheduled At | Ngày mai lúc 12:00 |

## 3. Step-by-Step Procedure
1. Seed mock FACEBOOK social account.
2. Vào `/planner/calendar`, click **Create Post**.
3. Chọn platform **Facebook**, nhập caption duy nhất.
4. Mở publish menu → chọn **Schedule**.
5. Nhập ngày mai 12:00 vào `[data-testid="post-scheduled-date-input"]` qua `executeScript`.
6. Click **Submit**.
7. Kiểm tra bài xuất hiện trên `/planner/list`.
8. Truy vấn DB: xác nhận `scheduledAt` không null, sau đó xóa dọn dẹp.

## 4. Expected Result
- Bài đăng hiển thị trên List UI với status SCHEDULED.
- DB có `scheduledAt` đúng ngày mai 12:00, khác `null`.
