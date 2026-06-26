# Bài tập: Kiểm thử hộp trắng

## Chức năng và Mục đích của đoạn code

Hàm `updatePost(id, postData, brandId, userId)` trong `PostService` đảm nhận vai trò cập nhật thông tin bài đăng trong hệ thống PubliCast. Chức năng chính bao gồm:
1. **Kiểm tra tính hợp lệ và phân quyền:** Xác thực bài viết có tồn tại và thuộc sở hữu của thương hiệu (`brandId`) hiện hành hay không. Ngăn chặn việc sửa đổi các bài viết đã xuất bản (`PUBLISHED`).
2. **Xử lý cơ chế xuất bản trực tiếp (Direct Publishing):** Nếu bài đăng được lưu ở trạng thái xuất bản ngay hoặc lên lịch, hệ thống sẽ xác minh xem người dùng có quyền `APPROVE_POSTS` không. Nếu không, bài viết sẽ bị buộc chuyển sang trạng thái chờ phê duyệt (`PENDING_APPROVAL`).
3. **Đồng bộ hóa hàng đợi (Queue Sync):** Đăng ký, cập nhật hoặc gỡ bỏ các tác vụ lên lịch đăng bài trên BullMQ (`upsertPublishJob`/`removePublishJob`) dựa trên trạng thái lên lịch (`SCHEDULED`) của bài viết.
4. **Khởi chạy luồng duyệt (Approval Workflow):** Tự động tạo yêu cầu duyệt bài viết mới nếu trạng thái chuyển đổi thành `PENDING_APPROVAL`.

---

## 1. Xác định các node và vẽ đồ thị dòng điều khiển (cơ bản)

```javascript
async updatePost(id, postData, brandId, userId) {
  const post = await postRepository.findById(id); [1]

  if (!post [2] || post.brandId !== brandId [3]) { 
    throw new Error('Post not found or unauthorized'); [4]
  }

  if (post.status === POST_STATUS.PUBLISHED [5]) { 
    throw new Error('Cannot update an already published post'); [6]
  }

  const data = this._prepareUpdateData(postData); [7]

  const isDirectPublishing = data.status && 
    [POST_STATUS.SCHEDULED, POST_STATUS.APPROVED, POST_STATUS.PUBLISHED].includes(data.status); [8]

  if (isDirectPublishing [9]) { 
    const hasApprovePermission = await authorizationFacade.hasPermission(userId, brandId, 'APPROVE_POSTS'); [10]
    
    if (!hasApprovePermission [11]) { 
      data.status = POST_STATUS.PENDING_APPROVAL; [12]
    }
  }

  const updatedPost = await postRepository.update(id, data); [13]

  if (updatedPost.status === POST_STATUS.PENDING_APPROVAL [14]) { 
    await removePublishJob(updatedPost.id); [15]

    await approvalWorkflowService.createWorkflowRequest( [16]
      updatedPost.id,
      userId,
      brandId,
      postData.reviewerIds || [],
      postData.approvalPolicy || 'AT_LEAST_ONE',
      postData.requesterNote || 'Vui lòng phê duyệt bài viết sau khi cập nhật.'
    );
  } else {
    if (!updatedPost.autoListId [17]) { 
      if (updatedPost.status === POST_STATUS.SCHEDULED [18] && updatedPost.scheduledAt [19]) { 
        await upsertPublishJob(updatedPost.id, updatedPost.scheduledAt); [20]
      } else {
        await removePublishJob(updatedPost.id); [21]
      }
    }
  }

  const statusChangedToPublished = postData.status?.toUpperCase() === POST_STATUS.PUBLISHED; [22]

  eventEmitter.emit(EVENTS.POST.UPDATED, { post: updatedPost, options: postData.options, statusChangedToPublished }); [23]

  return this._formatPostResponse(updatedPost); [24]
}
```

---

## 2. Tính số test case ít nhất có thể bao phủ 100% các nhánh

Đồ thị dòng điều khiển có 9 nút quyết định nhị phân (gồm các biểu thức so sánh logic thành phần của `if` phức hợp):
- Nút `[2]`: `!post`
- Nút `[3]`: `post.brandId !== brandId`
- Nút `[5]`: `post.status === POST_STATUS.PUBLISHED`
- Nút `[9]`: `isDirectPublishing`
- Nút `[11]`: `!hasApprovePermission`
- Nút `[14]`: `updatedPost.status === POST_STATUS.PENDING_APPROVAL`
- Nút `[17]`: `!updatedPost.autoListId`
- Nút `[18]`: `updatedPost.status === POST_STATUS.SCHEDULED`
- Nút `[19]`: `updatedPost.scheduledAt`

Tính độ phức tạp Cyclomatic của đồ thị theo số nút quyết định:
> **V(G) = 9 + 1 = 10**

Vậy có ít nhất là **10 test case** để bao phủ 100% các nhánh.

---

## 3. Cho ví dụ bộ test case đối với mỗi nhánh

* **Test case cho đường 1:** `1 -> 2 -> 4`
  - Value(id, brandId): `id` không tồn tại trong DB.
  - Kết quả kỳ vọng: Throw Error `Post not found or unauthorized`

* **Test case cho đường 2:** `1 -> 2 -> 3 -> 4`
  - Value(id, brandId): `id` hợp lệ nhưng `post.brandId` khác `brandId` truyền vào.
  - Kết quả kỳ vọng: Throw Error `Post not found or unauthorized`

* **Test case cho đường 3:** `1 -> 2 -> 3 -> 5 -> 6`
  - Value(id, brandId, status): `id` và `brandId` khớp, nhưng status của bài viết là `PUBLISHED`.
  - Kết quả kỳ vọng: Throw Error `Cannot update an already published post`

* **Test case cho đường 4:** `1 -> 2 -> 3 -> 5 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 22 -> 23 -> 24`
  - Scenario: User không có quyền tự duyệt chỉnh trạng thái thành `SCHEDULED`. Trạng thái của bài bị ép về `PENDING_APPROVAL` và tạo Workflow Request mới.
  - Value(postData): `status = 'SCHEDULED'`, `userId` không có quyền `APPROVE_POSTS`.
  - Kết quả kỳ vọng: Trạng thái trả về là `pending_approval`, kích hoạt `removePublishJob` và tạo workflow mới.

* **Test case cho đường 5:** `1 -> 2 -> 3 -> 5 -> 7 -> 8 -> 9 -> 10 -> 11 -> 13 -> 14 -> 15 -> 16 -> 22 -> 23 -> 24`
  - Scenario: User có quyền phê duyệt chỉnh trạng thái trực tiếp sang `PENDING_APPROVAL`.
  - Value(postData): `status = 'PENDING_APPROVAL'`, `userId` có quyền `APPROVE_POSTS`.
  - Kết quả kỳ vọng: Chạy trực tiếp qua nhánh cập nhật workflow mà không cần qua bước ép status.

* **Test case cho đường 6:** `1 -> 2 -> 3 -> 5 -> 7 -> 8 -> 9 -> 12 -> 13 -> 14 -> 17 -> 22 -> 23 -> 24`
  - Scenario: Bài viết được sửa nội dung nhưng thuộc chiến dịch AutoList (không đụng tới BullMQ lẻ).
  - Value(postData): `status = 'DRAFT'`, bài viết có `autoListId` (ví dụ: `100`).
  - Kết quả kỳ vọng: Cập nhật thành công, không gọi BullMQ, không tạo workflow.

* **Test case cho đường 7:** `1 -> 2 -> 3 -> 5 -> 7 -> 8 -> 9 -> 12 -> 13 -> 14 -> 17 -> 18 -> 21 -> 22 -> 23 -> 24`
  - Scenario: Cập nhật bài viết ngoài AutoList sang trạng thái `DRAFT` (hoặc status khác `SCHEDULED`).
  - Value(postData): `status = 'DRAFT'`, bài viết không thuộc AutoList (`autoListId = null`).
  - Kết quả kỳ vọng: Cập nhật thành công, hủy bỏ các schedule cũ nếu có qua `removePublishJob`.

* **Test case cho đường 8:** `1 -> 2 -> 3 -> 5 -> 7 -> 8 -> 9 -> 12 -> 13 -> 14 -> 17 -> 18 -> 19 -> 21 -> 22 -> 23 -> 24`
  - Scenario: Cập nhật bài viết sang trạng thái `SCHEDULED` nhưng thiếu thời gian lên lịch `scheduledAt`.
  - Value(postData): `status = 'SCHEDULED'`, `scheduledAt = null`.
  - Kết quả kỳ vọng: Hủy bỏ schedule cũ, không kích hoạt đăng ký job mới.

* **Test case cho đường 9:** `1 -> 2 -> 3 -> 5 -> 7 -> 8 -> 9 -> 12 -> 13 -> 14 -> 17 -> 18 -> 19 -> 20 -> 22 -> 23 -> 24`
  - Scenario: Cập nhật bài viết ngoài AutoList sang trạng thái `SCHEDULED` và có lịch cụ thể.
  - Value(postData): `status = 'SCHEDULED'`, `scheduledAt = '2026-12-12T08:00:00'`.
  - Kết quả kỳ vọng: Đăng ký thành công queue đăng bài mới với BullMQ qua `upsertPublishJob`.

* **Test case cho đường 10:** `1 -> 2 -> 3 -> 5 -> 7 -> 8 -> 9 -> 10 -> 12 -> 13 -> 14 -> 17 -> 21 -> 22 -> 23 -> 24`
  - Scenario: Bài viết cập nhật trực tiếp bởi Admin sang trạng thái `APPROVED` (không qua PENDING_APPROVAL).
  - Value(postData): `status = 'APPROVED'`, `userId` là Admin.
  - Kết quả kỳ vọng: Cập nhật trực tiếp sang `APPROVED`, không chạy qua nhánh `15 -> 16`.
