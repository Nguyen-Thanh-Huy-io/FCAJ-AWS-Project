# 📋 Tài Liệu Nhiệm Vụ: Tích Hợp Tìm Kiếm & Lọc Dữ Liệu Server-Side

Tài liệu này mô tả chi tiết nhiệm vụ chuyển đổi cơ chế tìm kiếm, lọc và phân trang từ xử lý cục bộ tại Client (Client-side mock) sang xử lý động tại Server (Server-side dynamic query) nhằm truy vấn cơ sở dữ liệu MySQL thông qua Prisma ORM.

---

## 🎯 Mục Tiêu Nhiệm Vụ

Chuyển đổi các trang đang sử dụng dữ liệu giả (Mock Data) và cơ chế lọc Client-side sang dữ liệu thực tế từ Database. Điều này được thực hiện bằng cách xây dựng API động, tuân thủ mô hình kiến trúc **Controller → Service → Repository** ở Backend và tích hợp các hook tùy chỉnh (custom hooks) `useFilters`/`useDebounce` ở Frontend.

---

## 🏗️ Phân Tích Hiện Trạng (Pre-requisites)

Hiện tại, dự án đã xây dựng sẵn các cấu trúc nền tảng sau:
*   **Frontend**: 
    *   Hook tùy chỉnh quản lý bộ lọc qua URL: [useFilters.js](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/hooks/useFilters.js).
    *   Hook tùy chỉnh chống spam gọi API: [useDebounce.js](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/hooks/useDebounce.js).
    *   Giao diện người dùng (UI) và logic lọc Client-side cơ bản tại các trang: [AuditLog.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/admin/AuditLog.jsx), [ContentPlanner.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/workspace/ContentPlanner.jsx), [MediaLibrary.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/workspace/MediaLibrary.jsx), [StreamHistory.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/workspace/StreamHistory.jsx).
*   **Backend**:
    *   Cấu hình cơ sở dữ liệu Prisma tại [schema.prisma](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/backend/prisma/schema.prisma) đã định nghĩa đầy đủ các bảng cần thiết (`Post`, `Livestream`, `AuditLog`, `MediaLibrary`).
    *   Mẫu kiến trúc Controller $\rightarrow$ Service $\rightarrow$ Repository đang vận hành ổn định cho các mô-đun Auth, Profile và Pricing.

---

## 📋 Chi Tiết Nhiệm Vụ Cần Triển Khai (To-do List)

Dưới đây là quy trình 4 bước triển khai chi tiết cho từng mô-đun (lấy mô-đun **System Audit Log - `/admin/audit`** làm MVP đầu tiên):

### Bước 1: Tối ưu hóa Database Schema (Prisma)
Đảm bảo tất cả các cột thường xuyên được dùng để lọc hoặc sắp xếp đều được đánh chỉ mục (`@@index`) để tránh việc quét toàn bộ bảng (Table Scan) khi lượng dữ liệu lớn.
*   **Tệp cần chỉnh sửa**: [schema.prisma](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/backend/prisma/schema.prisma)
*   **Các mục cần kiểm tra và bổ sung**:
    *   Mô hình (Model) `AuditLog`: Đã có `@@index([brandId])`, `@@index([userId])`. Cần thêm `@@index([targetType])` (do lọc danh mục theo `targetType`) và cân nhắc thêm `@@index([createdAt])` vì trường này thường xuyên được sử dụng để sắp xếp các bản ghi mới nhất.
    *   Mô hình `Post`: Cần kiểm tra để đảm bảo đã có các chỉ mục `@@index([status])`, `@@index([brandId])`, `@@index([createdAt])`.
*   **Chạy lệnh di trú cơ sở dữ liệu (migration) và cập nhật Prisma client** (sau khi cập nhật schema):
    ```bash
    npx prisma migrate dev --name optimize_search_indexes
    npx prisma generate
    ```
    > [!IMPORTANT]
    > Sau khi chỉnh sửa `@@index` trong `schema.prisma` và chạy di trú (migration), bắt buộc phải chạy lệnh `npx prisma generate` để cập nhật lại định nghĩa kiểu dữ liệu (Type Definition) cho Prisma Client. Điều này giúp tính năng gợi ý mã nguồn (Intellisense) của VS Code hoạt động chính xác.

---

### Bước 2: Triển khai các lớp Backend (Kiến trúc SOLID)

Viết mã nguồn Backend theo mô hình phân lớp tuần tự:

#### 1. Tạo lớp Repository (Data Access Layer)
Lớp này chịu trách nhiệm giao tiếp trực tiếp với Prisma Client. Cần thực hiện đồng thời 2 truy vấn: lấy dữ liệu phân trang và đếm tổng số bản ghi khớp với bộ lọc (để phục vụ việc phân trang phía Frontend).
*   **Tệp cần tạo**: `backend/src/repositories/audit-log.repository.js`
*   **Mẫu triển khai**:
    ```javascript
    const prisma = require('../config/prisma');

    class AuditLogRepository {
      async findManyAndCount(where, options = {}) {
        const { skip = 0, take = 50, orderBy = { createdAt: 'desc' } } = options;
        
        // Chạy song song để tối ưu hóa hiệu năng
        const [logs, total] = await Promise.all([
          prisma.auditLog.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
              user: { select: { id: true, name: true, avatarUrl: true, role: true } }
            }
          }),
          prisma.auditLog.count({ where })
        ]);
        
        return { logs, total };
      }
    }

    module.exports = new AuditLogRepository();
    ```

#### 2. Tạo lớp Service (Business Logic & Sanitization)
Lớp này xử lý các tham số nhận được từ chuỗi truy vấn (query string), gán giá trị mặc định, xác thực kiểu dữ liệu (tránh lỗi Prisma bị sập do sai kiểu dữ liệu) và xây dựng điều kiện `where` động.
*   **Tệp cần tạo**: `backend/src/services/audit-log.service.js`
*   **Mẫu triển khai**:
    ```javascript
    const auditLogRepository = require('../repositories/audit-log.repository');
    
    const ALLOWED_SORT_FIELDS = ['createdAt', 'action', 'targetType'];
    const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

    class AuditLogService {
      async getAuditLogs(queryParams) {
        const {
          search,
          category, // Tương ứng với trường targetType
          status,
          startDate,
          endDate,
          page = 1,
          limit = 10,
          sortBy = 'createdAt',
          sortOrder = 'desc'
        } = queryParams;

        // 1. Chuẩn hóa & Xác thực tham số phân trang
        const safePage = Math.max(1, parseInt(page) || 1);
        // Đảm bảo safeLimit luôn >= 1 và <= 100 để tránh lỗi Prisma take: 0 gây ra kết quả rỗng ngoài ý muốn
        const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const skip = (safePage - 1) * safeLimit;

        // 2. Xác thực cấu hình sắp xếp
        const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
        const safeSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

        // 3. Xây dựng đối tượng Where động cho Prisma
        const where = {};

        // Tìm kiếm toàn văn (Mặc định không phân biệt chữ hoa/thường trong MySQL)
        if (search && search.trim()) {
          const searchKey = search.trim();
          where.OR = [
            { action: { contains: searchKey } },
            { ipAddress: { contains: searchKey } },
            { targetId: { contains: searchKey } },
            { user: { name: { contains: searchKey } } }
          ];
        }

        // Lọc khớp chính xác hoặc lọc theo tiền tố (Exact Match / Prefix Match)
        if (category && category !== 'All') {
          // Lọc theo nhóm hành động nếu danh mục thuộc về tiền tố action (ví dụ: AUTH_ hoặc PLAN_)
          if (category.startsWith('AUTH_') || category.startsWith('PLAN_')) {
            where.action = { startsWith: category };
          } else {
            where.targetType = category;
          }
        }

        if (status && status !== 'All') {
          // Ví dụ: Lọc nhật ký ghi nhận thành công hoặc thất bại
          where.details = { contains: status };
        }

        // Lọc theo khoảng thời gian
        if (startDate || endDate) {
          where.createdAt = {};
          if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) where.createdAt.gte = start;
          }
          if (endDate) {
            const end = new Date(endDate);
            if (!isNaN(end.getTime())) where.createdAt.lte = end;
          }
        }

        // 4. Thực hiện truy vấn cơ sở dữ liệu
        const { logs, total } = await auditLogRepository.findManyAndCount(where, {
          skip,
          take: safeLimit,
          orderBy: { [safeSortBy]: safeSortOrder }
        });

        return {
          data: logs,
          meta: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit)
          }
        };
      }
    }

    module.exports = new AuditLogService();
    ```

#### 3. Tạo lớp Controller & Cấu hình Routes
*   **Controller (`backend/src/controllers/audit-log.controller.js`)**: Tiếp nhận `req.query`, chuyển tiếp dữ liệu đến lớp Service xử lý và gửi phản hồi về phía Client.
*   **Route (`backend/src/routes/audit-log.routes.js`)**: Đăng ký endpoint GET `/api/admin/audit-logs` đi kèm các middleware xác thực quyền truy cập của admin (`verifyAuth` & `verifyAdmin`).
    > [!WARNING]
    > **Lưu ý về Bảo mật & Phân quyền:** Phải đảm bảo áp dụng middleware `verifyAdmin` để ngăn chặn việc người dùng thông thường dò tìm URL API nhằm trích xuất nhật ký của toàn bộ hệ thống.
*   **Tích hợp vào ứng dụng (`backend/src/app.js`)**: Import và liên kết router mới vào ứng dụng Express.

---

### Bước 3: Tích hợp và gọi API tại Frontend (React)

Thay thế cơ chế lọc Client-side dựa trên dữ liệu tĩnh trước đây bằng cách gọi API động từ Backend qua `useEffect`, lắng nghe sự thay đổi của các tham số tìm kiếm trên URL (URL Search Params).

*   **Tệp cần chỉnh sửa**: [AuditLog.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/admin/AuditLog.jsx)
*   **Các đầu việc cần thực hiện**:
    1. Import dịch vụ gọi API (ví dụ: `apiService`).
    2. Khai báo state lưu trữ dữ liệu từ API: `const [data, setData] = useState({ data: [], meta: {} });` và state quản lý trạng thái tải dữ liệu (loading).
    3. Lấy chuỗi tham số tìm kiếm `searchParamsString` từ hook `useFilters`.
    4. Viết `useEffect` để tự động gọi API lấy dữ liệu mới mỗi khi `searchParamsString` thay đổi.
    5. Thay thế nguồn dữ liệu hiển thị `paginatedEntries` bằng `data.data`.
    6. Thay thế logic tính toán tổng số trang tĩnh bằng siêu dữ liệu (metadata) trả về từ API (`data.meta.totalPages`).

**Ví dụ về cấu trúc useEffect gọi API:**
```javascript
const { filters, updateFilters, clearFilters, searchParamsString } = useFilters({
  search: "",
  category: "All",
  status: "",
  page: "1"
});

const [logData, setLogData] = useState({ data: [], meta: {} });
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/admin/audit-logs?${searchParamsString}`);
      setLogData(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  fetchLogs();
}, [searchParamsString]); // Kích hoạt gọi lại API khi các tham số trên URL thay đổi
```

---

## 🔍 Bước 4: Triển khai Tìm kiếm Toàn cục (Universal Topbar Search) từ Database

Để xây dựng tính năng tìm kiếm động trực tiếp từ cơ sở dữ liệu trên thanh tìm kiếm của giao diện `Topbar.jsx`, chúng ta cần triển khai mô-đun tìm kiếm tích hợp:

### 1. Xây dựng API Endpoint ở Backend
*   **Mục tiêu**: Tạo endpoint `GET /api/search?q=query` trả về kết quả tổng hợp từ Database.
*   **Tệp cần tạo/chỉnh sửa**:
    *   Route: `backend/src/routes/search.routes.js`
    *   Controller: `backend/src/controllers/search.controller.js`
    *   Service: `backend/src/services/search.service.js`
*   **Logic xử lý**: Thực hiện tìm kiếm song song (`Promise.all`) trên các mô hình `User`, `Brand` và `AuditLog` (hoặc các mô hình bài đăng `Post` / `Livestream` sau này) bằng Prisma Client.

### 2. Tích hợp phía Frontend (Sử dụng Debounced API Call)
*   **Tệp cần chỉnh sửa**: [Topbar.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/layout/Topbar.jsx)
*   **Logic xử lý**:
    *   Sử dụng kỹ thuật trì hoãn xử lý (Debounce) với thời gian chờ 300ms thông qua `setTimeout` trong `useEffect` để tránh việc gửi liên tục các yêu cầu truy vấn đến Database khi người dùng đang nhập từ khóa.
    *   Hiển thị trạng thái tải dữ liệu (loading state) trong lúc chờ phản hồi từ API.
    *   Hiển thị dữ liệu động trả về từ Database lên danh sách kết quả tìm kiếm thả xuống (dropdown) thay thế cho mảng dữ liệu tĩnh trước đó.

---

## 🧪 Kế Hoạch Xác Minh & Kiểm Thử (Verification Plan)

Sau khi hoàn tất quá trình triển khai, cần thực hiện kiểm thử toàn bộ các kịch bản sau:

### 1. Kiểm thử chức năng (Functional Testing)
*   **Tìm kiếm trì hoãn (Debounced Search)**: Nhập từ khóa tìm kiếm vào ô input và kiểm tra xem API chỉ được gọi **sau khi người dùng ngừng gõ phím ít nhất 300ms**.
*   **Lọc kết hợp nhiều điều kiện**: Lọc đồng thời theo Danh mục = "Security" + Trạng thái = "failed" + nhập từ khóa IP cần tìm kiếm. Đảm bảo URL thay đổi đúng định dạng và kết quả trả về chính xác.
*   **Đồng bộ phân trang**: Click chọn "Next Page" và kiểm tra xem URL có chuyển đổi thành `?page=2` đồng thời danh sách hiển thị có cập nhật dữ liệu mới tương ứng hay không.

### 2. Kiểm thử bảo mật & Kiểm thử biên (Boundary & Security Testing)
*   **Phòng chống lỗi SQL Injection**: Nhập các ký tự đặc biệt như `' OR '1'='1` vào ô tìm kiếm, đảm bảo Prisma xử lý an toàn dưới dạng chuỗi thông thường và không gây sập (crash) hệ thống.
*   **Xử lý tham số không hợp lệ**: Thay đổi thủ công trên thanh địa chỉ URL các tham số thành `page=abc` hoặc `limit=999999`. Kiểm tra xem Backend có tự động chuyển đổi các giá trị này về cấu hình an toàn mặc định (`page=1`, `limit=10`) hay không.

---

## 📅 Lộ Trình Ưu Tiên Thực Hiện (Roadmap)

| Thứ tự | Mô-đun / Trang | Trạng thái hiện tại | Mức độ ưu tiên |
| :--- | :--- | :--- | :--- |
| **1** | **System Audit Log** | Đã hoàn thành 100% (Backend + Frontend) | 🔴 Cao (Đã tích hợp dữ liệu thực tế) |
| **2** | **Universal Search (Topbar)** | 🟡 Sắp triển khai (Đang thiết kế) | 🔴 Cao (Tìm kiếm động từ cơ sở dữ liệu) |
| **3** | **Stream History** | ⚪ Chưa triển khai | 🔴 Cao (Tích hợp lịch sử luồng phát trực tiếp) |
| **4** | **Content Planner** | ⚪ Chưa triển khai | 🟡 Trung bình (Trang tính năng cốt lõi của hệ thống) |
| **5** | **Media Library** | ⚪ Chưa triển khai | 🟡 Trung bình (Chuyển đổi sang API để lưu trữ tệp tin) |
| **6** | **Team Management** | ⚪ Chưa triển khai | 🟢 Thấp (Có thể tiếp tục dùng Client-side nếu số lượng thành viên ít) |
