Câu 5: **Vẽ lại đồ thị và kiểm thử đời sống của từng biến xem có bất thường không**

| **Kịch bản \\ Biến** | **id** | **postData** | **brandId** | **userId** | **post** | **data** | **isDirectPublishing** | **hasApprovePermission** | **updatedPost** | **statusChangedToPublished** |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| \[1\]→\[2\]→\[4\] | ~duk | ~dk | ~dk | ~dk | ~duk | ~k | ~k | ~k | ~k | ~k |
| \[1\]→\[2\]→\[3\]→\[4\] | ~duk | ~dk | ~duk | ~dk | ~duuk | ~k | ~k | ~k | ~k | ~k |
| \[1\]→\[2\]→\[3\]→\[5\]→\[6\] | ~duk | ~dk | ~duk | ~dk | ~duuuk | ~k | ~k | ~k | ~k | ~k |
| \[1\]→\[2\]→\[3\]→\[5\]→\[7\]→\[8\]→\[9\]→\[10\]→\[11\]→\[12\]→\[13\]→\[14\]→\[15\]→\[16\]→\[22\]→\[23\]→\[24\] | ~duuk | ~duuuuk | ~duuuk | ~duuk | ~duuuk | ~duuduk | ~duk | ~duk | ~duuuuk | ~duk |
| \[1\]→\[2\]→\[3\]→\[5\]→\[7\]→\[8\]→\[9\]→\[10\]→\[11\]→\[13\]→\[14\]→\[15\]→\[16\]→\[22\]→\[23\]→\[24\] | ~duuk | ~duuuuk | ~duuuk | ~duuk | ~duuuk | ~duuuk | ~duk | ~duk | ~duuuuk | ~duk |
| \[1\]→\[2\]→\[3\]→\[5\]→\[7\]→\[8\]→\[9\]→\[12\]→\[13\]→\[14\]→\[17\]→\[22\]→\[23\]→\[24\] | ~duuk | ~duuuk | ~duk | ~dk | ~duuuk | ~duuk | ~duk | ~k | ~duuuk | ~duk |
| \[1\]→\[2\]→\[3\]→\[5\]→\[7\]→\[8\]→\[9\]→\[12\]→\[13\]→\[14\]→\[17\]→\[18\]→\[21\]→\[22\]→\[23\]→\[24\] | ~duuk | ~duuuk | ~duk | ~dk | ~duuuk | ~duuk | ~duk | ~k | ~duuuuuk | ~duk |
| \[1\]→\[2\]→\[3\]→\[5\]→\[7\]→\[8\]→\[9\]→\[12\]→\[13\]→\[14\]→\[17\]→\[18\]→\[19\]→\[21\]→\[22\]→\[23\]→\[24\] | ~duuk | ~duuuk | ~duk | ~dk | ~duuuk | ~duuk | ~duk | ~k | ~duuuuuuk | ~duk |
| \[1\]→\[2\]→\[3\]→\[5\]→\[7\]→\[8\]→\[9\]→\[12\]→\[13\]→\[14\]→\[17\]→\[18\]→\[19\]→\[20\]→\[22\]→\[23\]→\[24\] | ~duuk | ~duuuk | ~duk | ~dk | ~duuuk | ~duuk | ~duk | ~k | ~duuuuuuk | ~duk |
| \[1\]→\[2\]→\[3\]→\[5\]→\[7\]→\[8\]→\[9\]→\[10\]→\[12\]→\[13\]→\[14\]→\[17\]→\[21\]→\[22\]→\[23\]→\[24\] | ~duuk | ~duuuk | ~duuuk | ~duuk | ~duuuk | ~duuduk | ~duk | ~duk | ~duuuuuk | ~duk |
| **Kết luận** | **Bình thường** | **Bình thường** | **Bình thường** | **Bình thường** | **Bình thường** | **Bình thường** | **Bình thường** | **Bình thường** | **Bình thường** | **Bình thường** |

---

### Ghi chú phân tích:
1. **Bất thường dòng dữ liệu `~dk` (Define-Kill)**:
   - Các biến tham số đầu vào (`postData`, `userId`, `brandId`) xuất hiện trạng thái `~dk` ở các kịch bản lỗi 1, 2, 3.
   - Đây là hiện tượng **bất thường có chủ ý** khi hàm thực hiện ném lỗi sớm (early exit/validation throw) để bảo vệ hệ thống trước khi các biến này được sử dụng. Điều này hoàn toàn bình thường và an toàn.
2. **Không có bất thường `dd` (Define-Define) hay `ur` (Use-before-Define)**:
   - Biến `data` được gán lại ở nút `[12]` (trạng thái `~duuduk`) nhưng giữa 2 lần định nghĩa đã có bước sử dụng ở nút `[8]` và `[9]`, do đó hoàn toàn hợp lệ.
