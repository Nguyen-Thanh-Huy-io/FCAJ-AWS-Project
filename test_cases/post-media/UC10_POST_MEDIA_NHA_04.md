# Test Case: UC10_POST_MEDIA_NHA_04

| ID number   | UC10_POST_MEDIA_NHA_04                                         |
| ----------- | -------------------------------------------------------------- |
| Name        | Tạo bài đăng nháp Facebook – lưu vào DB và hiển thị List UI   |
| Component   | Post Creator / Planner / Facebook                              |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/post_creator.spec.js`                           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC10                                                           |

## 1. Prerequisites
- Đã đăng nhập với tài khoản admin.
- Mock Facebook Social Account đã được seed vào DB.

## 2. Test Data
| Parameter | Value |
|-----------|-------|
| Platform | FACEBOOK |
| Caption | `Mocha E2E Test Post - Facebook Draft - Created at {timestamp}` |
| Publish Option | Draft |

## 3. Step-by-Step Procedure
1. Seed mock FACEBOOK social account.
2. Vào `/planner/calendar`, click **Create Post**.
3. Nhập caption duy nhất có timestamp.
4. Đảm bảo chọn platform **Facebook**.
5. Mở publish menu → chọn **Draft**.
6. Click **Save**.
7. Điều hướng tới `/planner/list`, xác nhận caption xuất hiện trên UI.
8. Truy vấn DB kiểm tra bản ghi tồn tại, sau đó xóa dọn dẹp.

## 4. Expected Result
- Bài đăng hiển thị trên List UI với đúng caption.
- DB có bản ghi với `caption` khớp và `status = DRAFT`.
