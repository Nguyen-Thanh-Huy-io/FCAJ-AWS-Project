# 📋 Tài Liệu Nhiệm Vụ: Tích Hợp Tìm Kiếm & Lọc Dữ Liệu Server-Side

Tài liệu này mô tả chi tiết nhiệm vụ chuyển đổi cơ chế tìm kiếm, lọc và phân trang từ xử lý cục bộ tại Client (Client-side mock) sang xử lý động tại Server (Server-side dynamic query) truy vấn cơ sở dữ liệu MySQL thông qua Prisma ORM.

---

## 🎯 Mục Tiêu Nhiệm Vụ

Chuyển đổi các trang đang sử dụng dữ liệu giả (Mock Data) và lọc Client-side sang dữ liệu thật từ Database bằng cách xây dựng API động, tuân thủ mô hình kiến trúc **Controller → Service → Repository** ở Backend và tích hợp các custom hooks `useFilters`/`useDebounce` ở Frontend.

---

## 🏗️ Phân Tích Hiện Trạng Đã Có (Pre-requisites)

Hiện tại, dự án đã có sẵn các cấu trúc nền tảng sau:
*   **Frontend**: 
    *   Custom hooks quản lý bộ lọc qua URL: [useFilters.js](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/hooks/useFilters.js).
    *   Custom hooks chống spam API: [useDebounce.js](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/hooks/useDebounce.js).
    *   UI và logic lọc Client-side cơ bản tại các trang: [AuditLog.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/admin/AuditLog.jsx), [ContentPlanner.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/workspace/ContentPlanner.jsx), [MediaLibrary.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/workspace/MediaLibrary.jsx), [StreamHistory.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/workspace/StreamHistory.jsx).
*   **Backend**:
    *   Cấu hình database Prisma tại [schema.prisma](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/backend/prisma/schema.prisma) đã định nghĩa đầy đủ các bảng cần thiết (`Post`, `Livestream`, `AuditLog`, `MediaLibrary`).
    *   Mẫu kiến trúc Controller $\rightarrow$ Service $\rightarrow$ Repository đã chạy ổn định cho các module Auth, Profile và Pricing.

---

## 📋 Chi Tiết Nhiệm Vụ Cần Triển Khai (To-do List)

Dưới đây là quy trình 4 bước triển khai chi tiết cho mỗi module (Lấy module **System Audit Log - `/admin/audit`** làm MVP đầu tiên):

### Bước 1: Tối ưu hóa Database Schema (Prisma)
Đảm bảo tất cả các cột thường xuyên lọc hoặc sắp xếp được đánh chỉ mục (`@@index`) để tránh quét toàn bộ bảng (Table Scan) khi dữ liệu lớn.
*   **File cần sửa**: [schema.prisma](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/backend/prisma/schema.prisma)
*   **Cần kiểm tra/thêm**:
    *   Model `AuditLog`: Đã có `@@index([brandId])`, `@@index([userId])`. Cần thêm `@@index([targetType])` (vì ta lọc category theo `targetType`) và cân nhắc thêm `@@index([createdAt])` vì thường xuyên dùng để sắp xếp log mới nhất.
    *   Model `Post`: Cần kiểm tra đã có `@@index([status])`, `@@index([brandId])`, `@@index([createdAt])`.
*   **Chạy lệnh migration & generate client** (sau khi cập nhật schema):
    ```bash
    npx prisma migrate dev --name optimize_search_indexes
    npx prisma generate
    ```
    > [!IMPORTANT]
    > Đừng quên sau khi sửa `@@index` trong `schema.prisma` và chạy migration, bạn cần chạy `npx prisma generate` để cập nhật lại Type Definition cho Prisma Client, giúp VS Code gợi ý code (Intellisense) chính xác hơn.

---

### Bước 2: Triển khai các lớp Backend (Kiến trúc SOLID)

Thực hiện viết code Backend theo mô hình phân lớp tuần tự:

#### 1. Tạo Repository Layer (Data Access)
Lớp này chỉ giao tiếp trực tiếp với Prisma Client. Phải thực hiện 2 câu lệnh song song: lấy dữ liệu phân trang và đếm tổng số bản ghi khớp bộ lọc (để phục vụ phân trang ở FE).
*   **File cần tạo**: `backend/src/repositories/audit-log.repository.js`
*   **Mẫu triển khai**:
    ```javascript
    const prisma = require('../config/prisma');

    class AuditLogRepository {
      async findManyAndCount(where, options = {}) {
        const { skip = 0, take = 50, orderBy = { createdAt: 'desc' } } = options;
        
        // Chạy song song tối ưu hiệu năng
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

#### 2. Tạo Service Layer (Business Logic & Sanitization)
Lớp này thực hiện phân tích các tham số từ query string, gán giá trị mặc định, validate kiểu dữ liệu (tránh lỗi Prisma crash do sai kiểu dữ liệu), và xây dựng điều kiện `where` động.
*   **File cần tạo**: `backend/src/services/audit-log.service.js`
*   **Mẫu triển khai**:
    ```javascript
    const auditLogRepository = require('../repositories/audit-log.repository');
    
    const ALLOWED_SORT_FIELDS = ['createdAt', 'action', 'targetType'];
    const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

    class AuditLogService {
      async getAuditLogs(queryParams) {
        const {
          search,
          category, // tương ứng với targetType
          status,
          startDate,
          endDate,
          page = 1,
          limit = 10,
          sortBy = 'createdAt',
          sortOrder = 'desc'
        } = queryParams;

        // 1. Sanitize & Validate phân trang
        const safePage = Math.max(1, parseInt(page) || 1);
        // Đảm bảo safeLimit luôn >= 1 (tránh safeLimit = 0 làm Prisma take: 0 gây ra kết quả rỗng không mong muốn) và <= 100
        const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const skip = (safePage - 1) * safeLimit;

        // 2. Validate Sắp xếp
        const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
        const safeSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

        // 3. Xây dựng Object Where động cho Prisma
        const where = {};

        // Tìm kiếm toàn văn (Case-insensitive mặc định của MySQL)
        if (search && search.trim()) {
          const searchKey = search.trim();
          where.OR = [
            { action: { contains: searchKey } },
            { ipAddress: { contains: searchKey } },
            { targetId: { contains: searchKey } },
            { user: { name: { contains: searchKey } } }
          ];
        }

        // Lọc chính xác (Exact Match / Prefix Match)
        if (category && category !== 'All') {
          // Lọc theo nhóm action nếu category thuộc về tiền tố action (ví dụ: AUTH_ hoặc PLAN_)
          if (category.startsWith('AUTH_') || category.startsWith('PLAN_')) {
            where.action = { startsWith: category };
          } else {
            where.targetType = category;
          }
        }

        if (status && status !== 'All') {
          // Ví dụ: log thành công hoặc thất bại
          where.details = { contains: status };
        }

        // Điều kiện 4: Lọc theo khoảng thời gian
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

        // 4. Truy vấn database
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

#### 3. Tạo Controller Layer & Cấu hình Routes
*   **Controller (`backend/src/controllers/audit-log.controller.js`)**: Nhận `req.query`, truyền vào Service và gửi trả response.
*   **Route (`backend/src/routes/audit-log.routes.js`)**: Đăng ký endpoint GET `/api/admin/audit-logs` với middleware kiểm tra quyền admin (`verifyAuth` & `verifyAdmin`).
    > [!WARNING]
    > **Lưu ý về Phân quyền (Security):** Cần đảm bảo Middleware `verifyAdmin` được áp dụng để người dùng thông thường không thể đoán được URL API và lấy toàn bộ nhật ký hệ thống.
*   **App mount (`backend/src/app.js`)**: Import và gắn router mới vào ứng dụng Express.

---

### Bước 3: Tích hợp và gọi API tại Frontend (React)

Thay thế việc lọc Client-side hiện tại trên mảng cứng bằng việc gọi API Backend động thông qua `useEffect` bắt sự thay đổi của URL Search Params.

*   **File cần sửa**: [AuditLog.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/pages/admin/AuditLog.jsx)
*   **Các đầu việc cần sửa**:
    1.  Import service gọi API (ví dụ: `apiService`).
    2.  Khai báo state lưu dữ liệu API: `const [data, setData] = useState({ data: [], meta: {} });` và state loading.
    3.  Lấy thêm biến `searchParamsString` từ hook `useFilters`.
    4.  Viết `useEffect` để fetch dữ liệu mới mỗi khi `searchParamsString` thay đổi.
    5.  Thay thế biến dữ liệu hiển thị `paginatedEntries` bằng `data.data`.
    6.  Thay thế tính toán số trang cứng bằng dữ liệu trả về từ API metadata (`data.meta.totalPages`).

**Ví dụ cấu trúc useEffect gọi API:**
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
}, [searchParamsString]); // Kích hoạt chạy lại khi URL Params thay đổi
```

---

## 🔍 Bước 4: Triển khai Tìm kiếm Toàn cục (Universal Topbar Search) từ Database

Để giải quyết vấn đề tìm kiếm động từ database trực tiếp trên thanh tìm kiếm của `Topbar.jsx`, chúng ta bổ sung module tìm kiếm tích hợp:

### 1. Backend API Endpoint
*   **Mục tiêu**: Tạo endpoint `GET /api/search?q=query` trả về danh sách kết quả tổng hợp từ Database.
*   **File cần tạo/sửa**:
    *   Route: `backend/src/routes/search.routes.js`
    *   Controller: `backend/src/controllers/search.controller.js`
    *   Service: `backend/src/services/search.service.js`
*   **Logic**: Thực hiện tìm kiếm song song (`Promise.all`) trên các model `User`, `Brand` và `AuditLog` (hoặc các bài viết `Post` / `Livestream` sau này) bằng Prisma Client.

### 2. Frontend Integration (Debounced API Call)
*   **File cần sửa**: [Topbar.jsx](file:///d:/UTE/Cong_Nghe_Phan_Mem_Moi/Project/PubliCast/frontend/src/layout/Topbar.jsx)
*   **Logic**:
    *   Sử dụng bộ đếm `setTimeout` 300ms trong `useEffect` (Debounce) để tránh spam request lên database khi người dùng đang nhập phím.
    *   Hiển thị loading state khi đang fetch dữ liệu.
    *   Đổ kết quả động từ Database vào dropdown thay thế cho mảng cứng.

---

## 🧪 Kế Hoạch Xác Minh & Kiểm Thử (Verification Plan)

Sau khi triển khai xong, cần kiểm tra đầy đủ các kịch bản sau:

### 1. Kiểm thử chức năng (Functional Testing)
*   **Tìm kiếm debounced**: Nhập từ khóa tìm kiếm vào ô input, kiểm tra xem API chỉ được gọi **sau khi người dùng ngừng gõ 300ms**.
*   **Lọc đa điều kiện phối hợp**: Lọc theo Category = "Security" + Status = "failed" + nhập IP tìm kiếm, đảm bảo URL thay đổi đúng định dạng và kết quả trả về đúng.
*   **Phân trang đồng bộ**: Click nút "Next Page", kiểm tra xem URL có chuyển sang `?page=2` và danh sách hiển thị dữ liệu mới tương ứng không.

### 2. Kiểm thử bảo mật & Biên (Boundary & Security Testing)
*   **SQL Injection Prevention**: Nhập các ký tự đặc biệt như `' OR '1'='1` vào ô tìm kiếm, đảm bảo Prisma xử lý an toàn dưới dạng chuỗi thường và không crash hệ thống.
*   **Tham số không hợp lệ**: Nhập thủ công lên URL tham số `page=abc` hoặc `limit=999999`, kiểm tra xem Backend có tự động đưa về giá trị an toàn mặc định (`page=1`, `limit=10`) không.

---

## 📅 Lộ Trình Ưu Tiên Thực Hiện (Roadmap)

| Thứ tự triển khai | Module / Trang | Trạng thái hiện tại | Phân cấp ưu tiên |
| :--- | :--- | :--- | :--- |
| **1** | **System Audit Log** |  Đã hoàn thành 100% (Backend + Frontend) | 🔴 Cao (Đã đưa lên dữ liệu thật) |
| **2** | **Universal Search (Topbar)** | 🟡 Sắp triển khai (Đang thiết kế) | 🔴 Cao (Tìm kiếm động từ database) |
| **3** | **Stream History** | ⚪ Chưa triển khai | 🔴 Cao (Phục vụ hiển thị lịch sử stream thật) |
| **4** | **Content Planner** | ⚪ Chưa triển khai | 🟡 Trung bình (Trang tính năng cốt lõi của hệ thống) |
| **5** | **Media Library** | ⚪ Chưa triển khai | 🟡 Trung bình (Chuyển đổi sang API để lưu trữ file) |
| **6** | **Team Management** | ⚪ Chưa triển khai | 🟢 Thấp (Có thể tiếp tục dùng Client-side nếu team ít) |
