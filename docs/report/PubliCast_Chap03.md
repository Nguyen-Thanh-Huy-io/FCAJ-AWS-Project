# 3. KẾ HOẠCH KIỂM THỬ HỆ THỐNG

## 3.1. TỔNG QUAN
### 3.1.1. Mục đích
Tài liệu này mô tả kế hoạch kiểm thử cho hệ thống **PubliCast – Phiên bản 1.0**. 

Trong tài liệu này sẽ chỉ rõ mục tiêu, chiến lược, phương thức, kế hoạch, tiến độ và toàn bộ nội dung cần thiết cho hoạt động kiểm thử phần mềm nhằm đảm bảo hệ thống hoạt động ổn định, bảo mật và đáp ứng đầy đủ các nghiệp vụ quản lý mạng xã hội đa nền tảng.

### 3.1.2. Phạm vi
Việc kiểm thử được chia thành các giai đoạn chính bao gồm:
*   **Integration Test (Kiểm thử tích hợp):** Kiểm tra sự tương tác giữa các module (Auth, Workspace, Social API, Media).
*   **System Test (Kiểm thử hệ thống):** Kiểm tra toàn bộ luồng nghiệp vụ từ khi đăng bài đến khi xuất bản thành công trên MXH.
*   **Acceptance Test (Kiểm thử chấp nhận):** Kiểm tra mức độ đáp ứng yêu cầu người dùng và trải nghiệm UI/UX.

### 3.1.3. Giới thiệu về hệ thống được kiểm thử
#### 3.1.3.1. Tổng quan về hệ thống
PubliCast là nền tảng B2B SaaS hỗ trợ các doanh nghiệp quản lý tập trung việc xuất bản nội dung, tương tác khách hàng và phân tích hiệu suất trên nhiều mạng xã hội (Facebook, YouTube, TikTok, v.v.). Hệ thống giúp tối ưu hóa quy trình làm việc thông qua trợ lý AI và cơ chế lập lịch tự động.

#### 3.1.3.2. Các chức năng xây dựng hệ thống
*   **Xác thực:** Đăng ký/Đăng nhập (Local & Social OAuth), xác thực OTP qua Email.
*   **Quản lý Brand:** Cơ chế Multi-tenant quản lý đa không gian làm việc.
*   **Đội ngũ & Phân quyền:** Mời thành viên, cấu hình Custom Roles và gán Permission chi tiết.
*   **Thư viện Media:** Quản lý ảnh/video qua Cloudinary, tích hợp Google Drive.
*   **Xuất bản nội dung:** Soạn thảo bài đăng đa nền tảng, AI Assistant (Caption/Hashtag), Quản lý Livestream RTMP.
*   **Lập lịch:** Hàng đợi AutoLists tự động xuất bản (sử dụng BullMQ).
*   **Quy trình Phê duyệt:** Luồng Approval bài viết giữa nhân viên và quản lý.
*   **Hòm thư hợp nhất:** Unified Inbox gom tin nhắn/bình luận đa kênh, gán nhãn và phân công xử lý.
*   **Thống kê & Báo cáo:** Dashboard Analytics (Reach, Engagement), Theo dõi đối thủ, Xuất báo cáo PDF/CSV định kỳ.
*   **Thanh toán:** Quản lý gói cước (Plans) và hóa đơn qua Stripe.

### 3.1.4. Trọng tâm nhiệm vụ kiểm thử
*   Ưu tiên kiểm thử tính chính xác của việc xuất bản bài đăng lên các API mạng xã hội (Facebook, TikTok, YouTube).
*   Kiểm tra tính bảo mật của luồng OAuth và lưu trữ Token mã hóa.
*   Kiểm tra khả năng chịu tải của hàng đợi AutoLists khi có lượng lớn bài đăng được lên lịch đồng thời.

## 3.2. CHIẾN LƯỢC
### 3.2.1. Các kiểu kiểm thử
Dự án PubliCast sử dụng các kiểu kiểm thử chính:
*   **Data and Database Integrity Testing:** Kiểm thử tính toàn vẹn dữ liệu (Prisma/MySQL).
*   **Functional Testing:** Kiểm thử chức năng theo Đặc tả Use Case.
*   **Security and Access Control Testing:** Kiểm thử bảo mật OAuth, JWT và phân quyền Role-based.
*   **API Testing:** Kiểm tra các Endpoint kết nối với bên thứ 3 (FB/Google/TikTok).
*   **User Interface Testing:** Kiểm thử giao diện React (Responsive, Framer Motion).
*   **Performance & Load Testing:** Kiểm thử hiệu năng hệ thống khi đồng bộ dữ liệu Analytics lớn.

### 3.2.2. Giai đoạn kiểm thử
*   **Giai đoạn Integration Test:** Tester thực hiện kiểm thử độc lập các API Backend và quá trình tích hợp với Frontend. Tập trung vào tính toàn vẹn dữ liệu và logic phân quyền.
*   **Giai đoạn System Test:** Tiến hành kiểm thử toàn trình (End-to-End). Kiểm tra chu trình nghiệp vụ (Business Cycle Logic), khả năng chịu tải của BullMQ, tính bảo mật và khả năng phục hồi sau lỗi kết nối API.

### 3.2.3. Công cụ kiểm thử
| Mục đích | Tên công cụ | Nhà cung cấp |
| --- | --- | --- |
| Thiết kế TestCase | Excel / Google Sheets | Microsoft / Google |
| Lập Test Plan & Báo cáo | Word / Markdown | Microsoft |
| Kiểm thử API | Postman / Insomnia | Postman |
| Automated Validation (BE) | Jest & Supertest | Open Source |
| UI Validation | Selenium / Playwright | Open Source |
| Theo dõi lỗi | GitHub Issues | GitHub |

## 3.3. TÀI NGUYÊN
### 3.3.1. Nguồn lực
| Vai trò | Trách nhiệm |
| --- | --- |
| **Test Leader** | Lập kế hoạch, chiến lược; Giám sát tiến độ; Đánh giá chất lượng sản phẩm (Test Result Report). |
| **Tester** | Thiết kế Test Case, Test Data; Thực hiện kiểm thử thủ công và tự động; Tổng hợp báo cáo lỗi. |

### 3.3.2. Môi trường kiểm thử
| STT | Tên | Thông số | Ghi chú |
| --- | --- | --- | --- |
| 1 | Server Staging | Node.js Runtime, MySQL Docker | Môi trường thử nghiệm |
| 2 | CSDL | MySQL 8.0, Redis 7.0 | Lưu trữ và Caching |
| 3 | Client | Chrome, Firefox, Safari | Kiểm thử trình duyệt |

## 3.4. TEST MILESTONES
| Đầu mục công việc | Nỗ lực (manday) | Ngày bắt đầu | Ngày kết thúc |
| --- | --- | --- | --- |
| Viết Test Case chi tiết | 7 | 18/06/2026 | 25/06/2026 |
| Kiểm thử Xác thực & OAuth | 3 | 26/06/2026 | 28/06/2026 |
| Kiểm thử Workspace & Phân quyền | 4 | 29/06/2026 | 02/07/2026 |
| Kiểm thử Xuất bản & AutoLists | 8 | 03/07/2026 | 12/07/2026 |
| Kiểm thử Unified Inbox & Webhook | 5 | 13/07/2026 | 18/07/2026 |
| Kiểm thử Analytics & Báo cáo | 6 | 19/07/2026 | 25/07/2026 |
| Kiểm thử Bảo mật & Thanh toán | 4 | 26/07/2026 | 30/07/2026 |
| Tổng hợp & Viết báo cáo cuối | 3 | 01/08/2026 | 03/08/2026 |

## 3.5. CÁC TÀI LIỆU, BÁO CÁO KIỂM THỬ CẦN CÓ
| Tên tài liệu | Mục đích | Người thực hiện |
| --- | --- | --- |
| **Test Plan** | Đưa ra chiến lược và nội dung thực hiện. | Test Leader |
| **TestCase & Data** | Mô tả các bước và dữ liệu kiểm thử cho từng UC. | Tester |
| **Bug Report** | Danh sách lỗi và trạng thái sửa lỗi. | Tester |
| **Evaluation Report** | Báo cáo tổng hợp chất lượng hệ thống cuối kỳ. | Test Leader |

## 3.6. ĐÁNH GIÁ RỦI RO VÀ HƯỚNG XỬ LÝ
### 3.6.1. Rủi ro về kết nối Mạng xã hội (API)
*   **Vấn đề:** Các nền tảng (Facebook, YouTube, TikTok) thay đổi chính sách API hoặc thu hồi quyền truy cập làm gián đoạn tính năng kết nối và xuất bản nội dung.
*   **Giải pháp:** Triển khai hệ thống giám sát và cảnh báo lỗi API tự động qua Email/Telegram; định kỳ cập nhật mã nguồn theo tài liệu kỹ thuật mới nhất từ các nền tảng.

### 3.6.2. Hiệu năng hệ thống khi xử lý hàng đợi
*   **Vấn đề:** Lượng bài đăng AutoList đổ về quá lớn vào khung giờ cao điểm gây quá tải máy chủ và nghẽn hệ thống hàng đợi (BullMQ/Redis).
*   **Giải pháp:** Áp dụng cơ chế giới hạn tần suất (Rate Limit) cho việc xuất bản; cấu hình khả năng tự động mở rộng máy chủ (Scaling) và tối ưu hóa logic xử lý của worker.

### 3.6.3. An toàn và bảo mật dữ liệu khách hàng
*   **Vấn đề:** Nguy cơ lộ lọt Access Token dẫn đến việc tài khoản mạng xã hội của khách hàng bị chiếm quyền điều khiển trái phép.
*   **Giải pháp:** Thực hiện mã hóa Access Token ngay tại tầng cơ sở dữ liệu; sử dụng giao thức bảo mật và thiết lập nhật ký truy cập (Access Log) để phát hiện và ngăn chặn các hành vi bất thường.

### 3.6.4. Tốc độ truy vấn dữ liệu Analytics
*   **Vấn đề:** Khối lượng dữ liệu thống kê (Analytics) tích lũy quá lớn gây chậm trễ cho các thao tác truy vấn và hiển thị biểu đồ trên giao diện Dashboard.
*   **Giải pháp:** Sử dụng các bảng tổng hợp dữ liệu (Aggregation tables) và triển khai cơ chế lưu trữ dữ liệu lịch sử (Archive) để tối ưu hóa tốc độ phản hồi của hệ thống.
