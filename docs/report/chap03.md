1.TỔNG QUAN
1.1Mục đích
Tài liệu này được viết ra nhằm mô tả kế hoạch kiểm thử hệ thống Quản lý Đăng ký tài sản Nhà nước – phiên bản 3.0

Trong tài liệu này sẽ chỉ rõ mục tiêu, chiến lược, phương thức, kế hoạch, tiến độ và toàn bộ nội dung cần thiết cho hoạt động kiểm thử phần mềm dự án.
1.2 Phạm vi
Việc kiểm thử chia thành các giai đoạn khác nhau bao gồm:
+Integration Test (Kiểm thử tích hợp)
+System Test (Kiểm thử hệ thống)
+Acceptance Test (Kiểm thử chấp nhận)
1.3Giới thiệu về hệ thống được kiểm thử
1.3.1 Tổng quan về hệ thống
Hệ thống quản lý Đăng ký tài sản – Phiên bản 3.0 được xây dựng nhằm hỗ trợ một cách tốt nhất vào công tác quản lý đăng ký tài sản Nhà nước của các đơn vị sử dụng. Đồng thời cung cấp cho người quản lý có thể thực hiện công tác thống kê báo cáo một cách hiệu quả nhất về thông tin cũng như hiện trạng sử dụnng tài sản của các đơn vị trong toàn quốc.

1.3.2Các chức năng xây dựng và nâng cấp hệ thống
In phiếu xác nhận thông tài sản.
Sửa danh mục đơn vị.
Sửa danh mục địa bàn.
Bổ sung chức năng quản lý danh mục chức danh.
Bổ sung chức năng quản lý danh mục dòng xe.
Bổ sung chức năng quản lý danh mục dự án.
Bổ sung danh mục phân vùng kinh tế.
Bổ sung danh mục khấu hao.
Bổ sung danh mục loại tài sản.
In báo cáo theo địa bàn phân vùng kinh tế:
Báo cáo tổng hợp.
Báo cáo chi tiết.
Báo cáo tra cứu.
Bổ sung tính năng thực hiện báo cáo điện tử:
Quản lý báo cáo.
Duyệt báo cáo.
Gửi báo cáo lên cấp trên.
Bổ sung một số chức năng để Phần mềm có thể tham gia trực tiếp một số nghiệp vụ liên quan đến quản lý tài sản:
Bổ sung tính năng in biên bản điều chuyển, thanh lý.
Bổ sung tính năng điều chuyển một phần tài sản.
Chỉnh sửa các form nhập số dư đầu, tăng giảm tài sản đáp ứng bài toán khấu hao và các yêu cầu nâng cấp:
Nhập số dư đầu/ Tăng mới trụ sở làm việc.
Tăng mới nhà.
Nhập số dư đầu/ Tăng mới oto.
Nhập số dư đầu/ Tăng mới tài sản khác.
Tăng nguyên giá.
Giảm nguyên giá.
Thay đổi hiện trạng sử dụng.
Giảm số lượng.
Bổ sung thêm các biểu mẫu báo cáo khác phục vụ công tác quản lý công sản
Mẫu biểu Danh mục tài sản nhà nước đề nghị xử lý.
Tổng hợp TSNN tại các cơ quan, tổ chức, đơn vị.
TSNN tại các cơ quan, tổ chức, đơn vị phân theo lĩnh vực hoạt động.
Tổng hợp giá trị TSNN chia theo nhóm cơ quan, tổ chức, đơn vị.
Mở rộng phạm vi Phần mềm để quản lý tài sản nhà nước của các dự án sử dụng vốn nhà nước.
Tăng mới tài sản khác dưới 500 triệu.
Biên bản kiểm kê tài sản của dự án kết thúc: mẫu 01/TSDA theo thông tư 87/2010/TT-BTC.
Biên bản tiếp nhận tài sản do phía nước ngoài chuyển giao cho chính phủ Việt Nam: mẫu 03/TSDA theo thông tư 87/2010/TT-BTC.
Tổng hợp kết quả xử lý tài sản không còn sử dụng được hoặc không cần sử dụng trong quá trình thực hiện dự án: mẫu 05/TSDA theo thông tư 87/2010/TT-BTC.
Biên bản kiểm kê dự án kết thúc.
Báo cáo tài sản nhà nước của đơn vị trực tiếp sử dụng (dành cho dự án).
Báo cáo hiện trạng sử dụng nhà, đất của đơn vị trực tiếp sử dụng (dành cho dự án).
Báo cáo tổng hợp tăng giảm tài sản dự án vốn nhà nước.
1.3.3Đặc điểm quá trình phát triển hệ thống
Là hệ thống được nâng cấp và xây dựng thêm các tính năng mới từ hệ thống Quản lý Đăng ký tài sản phiên bản 2.0.
1.3.4Trọng tâm nhiệm vụ kiểm thử
Ưu tiên test các chức năng nâng cấp và các chức năng có quan hệ ràng buộc.
2.CHIẾN LƯỢC
2.1Các kiểu kiểm thử
Trong dự án này sẽ sử dụng các kiểu kiểm thử chính:
+Kiểm thử về tính toàn vẹn dữ liệu và CSDL (Data and Database Integrity Testing)
+Kiểm thử về chức năng (Functional Testing)
+Kiểm thử về chu trình nghiệp vụ (Business Cycle Testing)
+Kiểm thử về giao diện người dùng (User Interface Testing)
+Kiểm thử về hiệu suất (Performance Testing)
+Kiểm thử về khả năng chịu tải (Load Testing)
+Kiểm thử về khả năng chịu áp lực (Stress Testing)
+Kiểm thử về bảo mật và kiểm soát truy cập (Security and Access Control)
+Kiểm thử về khả năng chịu lỗi và phục hổi (Failover and Recovery Testing)
2.2Giai đoạn kiểm thử
Quá trình kiểm thử dự án chia thành các giai đoạn: Integration Test, System Test và Acceptance Test.

Trong giai đoạn Integration Test, Tester sẽ tiến hành thực hiện kiểm thử độc lập từng module nhỏ của hệ thống, và quá trình tích hợp dần từng module để tạo thành hệ thống hoàn chỉnh. Các kiểu kiểm thử sẽ áp dụng trong giai đoạn này bao gồm: Kiểm thử về giao diện người dùng (User Interface Testing), Kiểm thử về chức năng (Functional Testing), Kiểm thử tính toàn vẹn về dữ liệu và CSDL (Data and Database Integrity Testing).

Sau khi các module của hệ thống được tích hợp sẽ tiến hành giai đoạn System test. Trong giai đoạn này sẽ tiến hành các kiểu kiểm thử: Kiểm thử tính toàn vẹn về dữ liệu và CSDL (Data and Database Integrity Testing), Kiểm thử về chu trình nghiệp vụ (Business Cycle Logic), Kiểm thử về hiệu suất (Performance Testing), Kiểm thử về khả năng chịu tải (Load Testing), Kiểm thử về khả năng chịu áp lực (Stress Testing), Kiểm thử về tính bảo mật và khả năng kiểm soát truy cập (Security And Access Control Testing), Kiểm thử về khả năng chịu lỗi và phục hồi (Failover and Recovery Testing), Kiểm thử về cấu hình (Configuration Test).
2.3Công cụ kiểm thử

Mục đích Tên công cụ Nhà cung cấp Phiên bản
Thiết kế TestCase và lập Test Report Excel Microsoft 2007
Lập Test Plan Word Microsoft 2007
Ghi nhận và thông báo lỗi TFS Microsoft 2010
Performance, Load, Stress Testing
Test Security

3.TÀI NGUYÊN
3.1Nguồn lực
Vai trò Số lượng Trách nhiệm
Nguyễn Diệu Linh (Test Leader), Đặng Thị Yến (Tester) 2 Quản lý chung nhóm kiểm thử trong dự án.

- Lập kế hoạch và định nghĩa các chiến lược kiểm thử
- Xác định trọng tâm nhiệm vụ kiểm thử.
- Tổng hợp và lập các báo cáo
- Theo dõi và giám sát việc test từ Tester
- Đánh giá mức độ hiệu quả của quá trình kiểm thử (Evaluation Summary Report).
- Đánh giá chất lượng sản phẩm (Test Result Report)
  Đặng Thị Yến (Tester) 4 Thực hiện các kiểm thử.
- Lập tài liệu Test Case, Test Data, Test Script (trong trường hợp kiểm thử tự động)
- Thực hiện các kiểm thử
- Tổng hợp báo cáo lỗi.
  3.2Môi trường kiểm thử
  STT Tên Thông số Ghi chú
  1 Server192.168.55.28
  2 Client 192.168.57.80
  4.TEST MILESTONES
  Đầu mục công việc Nỗ lực
  (manday/ man hours) Ngày bắt đầu (dd/mm/yyyy) Ngày kết thúc
  (dd/mm/yyyy) Nhân lực
  Viết testcase 6 days 4/1/2013 4/8/2013
  Thực hiện Test 45 days 4/9/2013 6/4/2013
  In phiếu xác nhận thông tin 3 days 4/9/2013 4/11/2013
  Danh mục đơn vị 1 day 4/11/2013 4/11/2013
  Danh mục địa bàn 5 hrs 4/12/2013 4/12/2013
  Chức danh 5 hrs 4/12/2013 4/12/2013
  Dòng xe 4 hrs 4/13/2013 4/13/2013
  Dự án 4 hrs 4/15/2013 4/15/2013
  Phân vùng kinh tế 4 hrs 4/15/2013 4/15/2013
  Khấu hao 4 hrs 4/16/2013 4/16/2013
  Loại tài sản 4 hrs 4/16/2013 4/16/2013
  In báo cáo theo địa bàn phân vùng kinh tế 11.5 days 4/17/2013 5/1/2013
  Báo cáo điện tử 5 days 5/2/2013 5/8/2013
  In biên bản điều chuyển, thanh lý 2 days 5/9/2013 5/10/2013
  Điều chuyển một phần tài sản 3 days 5/11/2013 5/15/2013
  Form nhập liệu Nhập số dư đầu, tăng giảm tài sản để đáp ứng bài toán tình hao mòn và khấu hao 5 days 5/16/2013 5/22/2013
  Báo cáo phục vụ công tác quản lý công sản 3.5 days 5/23/2013 5/27/2013
  Mẫu biểu Danh mục tài sản nhà nước đề nghị xử lý 1 day 5/23/2013 5/23/2013
  Tổng hợp TSNN tại các cơ quan, tổ chức, đơn vị. 1 day 5/24/2013 5/24/2013
  TSNN tại các cơ quan, tổ chức, đơn vị phân theo lĩnh vực hoạt động. 4 hrs 5/25/2013 5/25/2013
  Tổng hợp giá trị TSNN chia theo nhóm cơ quan, tổ chức, đơn vị. 1 day 5/27/2013 5/27/2013
  Mở rộng phạm vi phần mềm 6.5 days 5/28/2013 6/4/2013
  Tăng mới tài sản khác dưới 500 triệu. 3 days 5/28/2013 5/30/2013
  Biên bản kiểm kê tài sản của dự án kết thúc: mẫu 01/TSDA theo thông tư 87/2010/TT-BTC 4 hrs 5/31/2013 5/31/2013
  Biên bản tiếp nhận tài sản do phía nước ngoài chuyển giao cho chính phủ Việt Nam: mẫu 03/TSDA theo thông tư 87/2010/TT-BTC 4 hrs 5/31/2013 5/31/2013
  Tổng hợp kết quả xử lý tài sản không còn sử dụng được hoặc không cần sử dụng trong quá trình thực hiện dự án: mẫu 05/TSDA theo thông tư 87/2010/TT-BTC 4 hrs 6/1/2013 6/1/2013
  Biên bản kiểm kê dự án kết thúc 4 hrs 6/3/2013 6/3/2013
  Báo cáo tài sản nhà nước của đơn vị trực tiếp sử dụng (dành cho dự án). 4 hrs 6/3/2013 6/3/2013
  Báo cáo hiện trạng sử dụng nhà, đất của đơn vị trực tiếp sử dụng (dành cho dự án). 4 hrs 6/4/2013 6/4/2013
  Báo cáo tổng hợp tăng giảm tài sản dự án vốn nhà nước 4 hrs 6/4/2013 6/4/2013
  5.CÁC TÀI LIỆU, BÁO CÁO KIỂM THỬ CẦN CÓ
  Trong dự án, các tài liệu và báo cáo kiểm thử cần có bao gồm:

Tên tài liệu Mục đích Người thực hiện
Kế hoạch kiểm thử (Test Plan) Đưa ra kế hoạch, chiến lược và các nội dung sẽ thực hiện để kiểm thử trong dự án Test Leader
Thiết kế TestCase và TestData Mô tả các TestCase và TestData cho từng chức năng của hệ thống Tester và Test Leader
Kết quả từng lần Kết quả từng lần được cập nhật trên sheet Kết quả test của file TestCase. Tester
Báo cáo tổng hợp Báo cáo tổng hợp kết quả test cho toàn hệ thống Test Leader
6.ĐÁNH GIÁ RỦI RO
6.1Sửa lỗi
Rủi ro: Lỗi phát sinh từ chức năng trên phiên bản cũ và do dữ liệu cũ gây ra.
Giải pháp: Retesr lại chức năng cũ và Chuẩn hóa lại dữ liệu cũ.
6.2Môi trường kiểm thử
Rủi ro: Server chưa đáp ứng được hệ thống.
Giải pháp: Cần nâng cấp server.
6.3Nhân sự
Rủi ro: Số lượng nhân sự mới, ít chưa có nhiều kinh nghiệm với hệ thống.
Giải pháp: Nhân sự test cần tự tìm hiểu và trao đổi với đội dự án.
6.4Công cụ kiểm thử
Rủi ro:
Giải pháp: .
6.5Thời gian
Rủi ro:
Giải pháp:
