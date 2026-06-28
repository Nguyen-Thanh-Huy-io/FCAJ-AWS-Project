# Test Case: UC10_POST_MEDIA_NHA_01

| ID number   | UC10_POST_MEDIA_NHA_01                                         |
| ----------- | -------------------------------------------------------------- |
| Name        | Mở và đóng Post Creator Modal                                  |
| Component   | Post Creator / Planner                                         |
| Status      | Pass                                                           |
| Execution   | Automated (Selenium)                                           |
| Test File   | `test_selenium/post_creator.spec.js`                           |
| Created By  | Nhã                                                            |
| Tester      | Nhã                                                            |
| Use Case ID | UC10                                                           |

## 1. Prerequisites
- Đã đăng nhập với tài khoản admin.
- Đã seed ít nhất 1 Social Account (FACEBOOK) vào DB.

## 2. Test Data
| Parameter | Value |
|-----------|-------|
| Platform seed | FACEBOOK |
| URL | `/planner/calendar` |

## 3. Step-by-Step Procedure
1. Seed mock Facebook social account vào DB.
2. Điều hướng tới `/planner/calendar`.
3. Click nút `[data-testid="planner-create-post-btn"]`.
4. Chờ modal Post Creator xuất hiện, xác nhận `[data-testid="post-caption-input"]` tồn tại.
5. Click nút **Close** để đóng modal.
6. Xác nhận `post-caption-input` biến mất khỏi DOM.

## 4. Expected Result
- Modal Post Creator mở thành công, hiển thị caption input.
- Sau khi đóng, modal biến mất hoàn toàn khỏi giao diện (số phần tử = 0).
