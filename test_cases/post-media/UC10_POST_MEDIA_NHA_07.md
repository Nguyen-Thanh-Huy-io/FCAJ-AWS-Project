# Test Case: UC10_POST_MEDIA_NHA_07

| ID number   | UC10_POST_MEDIA_NHA_07                                         |
| ----------- | -------------------------------------------------------------- |
| Name        | Validation – YouTube không cho Submit khi chưa đính kèm video |
| Component   | Post Creator / Validation / YouTube                            |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/post_creator.spec.js`                           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC10                                                           |

## 1. Prerequisites
- Mock YouTube Social Account đã được seed vào DB.

## 2. Test Data
| Parameter | Value |
|-----------|-------|
| Platform | YOUTUBE |
| Caption | `Testing YouTube validation without video attachment.` |
| Media | Không đính kèm |

## 3. Step-by-Step Procedure
1. Seed mock YOUTUBE social account.
2. Vào `/planner/calendar`, click **Create Post**.
3. Chọn platform **YouTube**.
4. Nhập caption, **không** đính kèm video.
5. Click nút **Submit/Save**.
6. Xác nhận modal **vẫn còn hiển thị** (không bị đóng).

## 4. Expected Result
- Hệ thống chặn submit, modal Post Creator không đóng.
- `post-caption-input` vẫn hiện diện trên DOM (số phần tử > 0).
