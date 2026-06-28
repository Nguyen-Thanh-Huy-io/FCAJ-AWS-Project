# Test Case: UC08_POST_MEDIA_NHA_10

| ID number   | UC08_POST_MEDIA_NHA_10                                         |
| ----------- | -------------------------------------------------------------- |
| Name        | Upload ảnh từ máy – hiển thị preview trên Facebook Post        |
| Component   | Post Creator / Media Upload / Facebook                         |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/post_creator.spec.js`                           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC08, UC10                                                     |

## 1. Prerequisites
- Mock Facebook Social Account đã được seed vào DB.
- File ảnh test tồn tại tại `test_selenium/test_assets/sample_image.png`.

## 2. Test Data
| Parameter | Value |
|-----------|-------|
| Platform | FACEBOOK |
| File | `test_assets/sample_image.png` |

## 3. Step-by-Step Procedure
1. Seed mock FACEBOOK social account.
2. Vào `/planner/calendar`, click **Create Post**.
3. Chọn platform **Facebook**.
4. Gửi đường dẫn tuyệt đối ảnh vào `[data-testid="post-file-input"]` qua `sendKeys`.
5. Chờ React render xong preview.
6. Xác nhận `[data-testid="post-image-preview"]` xuất hiện trên giao diện.
7. Đóng modal.

## 4. Expected Result
- Ảnh preview hiển thị trong Post Creator sau khi upload.
- Phần tử `post-image-preview` tồn tại trên DOM.
