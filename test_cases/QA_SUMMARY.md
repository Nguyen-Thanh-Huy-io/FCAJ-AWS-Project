# 📊 Tổng hợp Test Cases & Bug Reports – PubliCast QA

> **Tester:** Nhã | **Cập nhật:** 28/06/2026 | **Branch:** `bugfix/PC-56-active-brand-overflow`

---

## 1. Tổng quan số lượng

| Module | TC | Bug Report | Use Case liên kết |
|--------|:--:|:----------:|-------------------|
| **Brand** | 5 | 1 | UC05 |
| **Team** | 15 | 2 | UC01, UC02, UC05, UC06, UC07, UC20 |
| **Autolists** | 4 | 1 | UC12 |
| **Analytics** | 4 | 1 | UC01, UC02, UC05, UC16, UC17, UC18 |
| **Dashboard** | 5 | 1 | UC05, UC16, UC17, UC18 |
| **Post-Media** | 6 | 1 | UC08, UC10, UC13 |
| **TỔNG** | **39** | **7** | |

---

## 2. Chi tiết từng module

### 🏷️ Brand – UC05 (Quản lý Thương hiệu) – 5 TC

| File | Mô tả | Loại |
|------|-------|------|
| `UC05_BRAND_NHA_01.md` | Hiển thị trang Brand Settings | Smoke test |
| `UC05_BRAND_NHA_02.md` | Tạo Brand mới thành công | Happy path |
| `UC05_BRAND_NHA_04.md` | Chuyển đổi Active Brand | Happy path |
| `UC05_BRAND_NHA_08.md` | Cập nhật tên Brand thành công | Happy path |
| `UC05_BRAND_NHA_09.md` | Nút Save disabled khi tên không đổi | **Bug PC-51** |

**Bug:** `BUG_UC05_BRAND_NHA_09_PC51_UPDATE_DISABLED_COMPARE.md` → ⚠️ OPEN

---

### 👥 Team – UC06 + UC07 (Đội ngũ & Phân quyền Custom Role) – 15 TC

| File | Mã TC gốc | Use Case | Mô tả | Loại |
|------|-----------|----------|-------|------|
| `UC01_UC02_UC05_TEAM_NHA_01.md` | TC_TEAM_01 | UC01,02,05 | Đăng ký Owner & Onboarding | Setup |
| `UC06_TEAM_NHA_02.md` | TC_TEAM_02 | UC06 | Validate email khi mời thành viên | **Bug PC-55** |
| `UC06_TEAM_NHA_04.md` | TC_TEAM_04 | UC06 | Kiểm tra quyền mời thành viên | Security |
| `UC06_TEAM_NHA_07.md` | TC_TEAM_07 | UC06 | Quy trình chấp nhận lời mời & kích hoạt | Happy path |
| `UC06_UC20_TEAM_NHA_09.md` | TC_TEAM_09 | UC06,20 | Tìm kiếm & lọc thành viên | **Bug PC-55** |
| `UC07_TEAM_NHA_05_A.md` | TC_TEAM_05 | UC07 | Tạo Custom Role thành công với tên hợp lệ | Happy path |
| `UC07_TEAM_NHA_05_B.md` | TC_TEAM_05 | UC07 | Validation tạo vai trò (Tên rỗng, quá dài) | Validation |
| `UC07_TEAM_NHA_08_A.md` | TC_TEAM_08 | UC07 | Kiểm chứng phân quyền Custom Role hạn chế | Security |
| `UC07_TEAM_NHA_08_C.md` | TC_TEAM_08_C | UC07 | Phân quyền VIEW_ANALYTICS báo cáo API/UI | **Bug PC-54** |
| `UC07_TEAM_NHA_08_D.md` | TC_TEAM_08_D | UC07 | Phân quyền MANAGE_TEAM (Mời được, cấm tạo) | Security |
| `UC07_TEAM_NHA_08_F.md` | TC_TEAM_08_F | UC07 | Phân quyền MANAGE_ROLES (Tạo role, cấm mời) | Security |
| `UC07_TEAM_NHA_08_G.md` | TC_TEAM_08_G | UC07 | Phân quyền APPROVE_POSTS & DELETE_POSTS | Security |
| `UC07_TEAM_NHA_08_H.md` | TC_TEAM_08_H | UC07 | Phân quyền CREATE_POSTS & PUBLISH_POSTS | Security |
| `UC07_TEAM_NHA_09_A.md` | TC_TEAM_09 | UC07 | Chặn xóa vai trò tùy chỉnh đang hoạt động | Validation |
| `UC07_TEAM_NHA_09_B.md` | TC_TEAM_09 | UC07 | Xóa vai trò tùy chỉnh sau khi đã thu hồi gán | Happy path |

**Bugs:**
- `BUG_UC07_TEAM_NHA_08_C_PC54_API_SOCIAL_METRICS_BYPASS.md` → ⚠️ OPEN
- `BUG_UC06_UC07_TEAM_NHA_02_09_PC55_INVITE_FILTER_ROLE_BUGS.md` → ✅ RESOLVED

---

### ⚙️ Autolists – UC12 (Lập lịch Tự động) – 4 TC

| File | Mô tả | Loại |
|------|-------|------|
| `UC12_AUTOLISTS_NHA_01.md` | Tạo AutoList mới (Interval) | Happy path |
| `UC12_AUTOLISTS_NHA_03.md` | Thêm bài vào hàng đợi | Happy path |
| `UC12_AUTOLISTS_NHA_06.md` | Chứng minh lỗi Schedule Drift | **Bug AUTOLIST_001** |
| `UC12_AUTOLISTS_NHA_07.md` | Xác minh fix Schedule Drift | Regression |

**Bug:** `BUG_UC12_AUTOLISTS_NHA_06_07_SCHEDULE_DRIFT.md` → ✅ RESOLVED

---

### 📈 Analytics – UC16/17/18 (YouTube Dashboard) – 4 TC

| File | Mô tả | Loại |
|------|-------|------|
| `UC01_UC02_UC05_ANALYTICS_NHA_00.md` | Setup & Onboarding | Setup |
| `UC16_ANALYTICS_NHA_01_02.md` | Seed DB & kiểm tra Overview Tab | Happy path |
| `UC17_ANALYTICS_NHA_07_08.md` | Tab Competitors | **Bug PC-53** |
| `UC18_ANALYTICS_NHA_09_10.md` | Xuất báo cáo CSV | Happy path |

**Bug:** `BUG_UC17_ANALYTICS_NHA_07_08_PC53_COMPETITORS_ACTION_COLUMN_OVERFLOW.md` → ⚠️ OPEN

---

### 🖥️ Dashboard – UC16/17/18 (General + Facebook) – 5 TC

| File | Mô tả | Loại |
|------|-------|------|
| `UC16_DASHBOARD_NHA_01_02.md` | Điều hướng & Stat Cards | Smoke test |
| `UC05_UC16_DASHBOARD_NHA_10.md` | Tràn chữ Active Brand widget | **Bug PC-56** |
| `UC16_DASHBOARD_NHA_FB_01_03.md` | Facebook Overview + Date Filter | Happy path |
| `UC17_DASHBOARD_NHA_FB_09_10.md` | Facebook Competitors: Thêm & Xóa | Happy path |
| `UC18_DASHBOARD_NHA_FB_12_13.md` | Facebook Export báo cáo CSV | Happy path |

**Bug:** `BUG_UC05_UC16_DASHBOARD_NHA_10_PC56_ACTIVE_BRAND_OVERFLOW.md` → ⚠️ OPEN

---

### 🖼️ Post-Media – UC08 + UC10 + UC13 (Media, Soạn thảo & Lên lịch) – 6 TC

| File | Mã TC gốc | Mô tả | Loại |
|------|-----------|-------|------|
| `UC10_POST_MEDIA_NHA_01.md` | TC_POST_01 | Mở và đóng Post Creator Modal | Smoke test |
| `UC10_POST_MEDIA_NHA_04.md` | TC_POST_04 | Tạo bài nháp Facebook, lưu DB + hiển thị List UI | Happy path |
| `UC10_POST_MEDIA_NHA_07.md` | TC_POST_07 | YouTube chặn Submit khi thiếu video | Validation |
| `UC10_POST_MEDIA_NHA_09.md` | TC_POST_09 | Lên lịch bài ngày mai, lưu `scheduledAt` vào DB | Happy path |
| `UC08_POST_MEDIA_NHA_10.md` | TC_POST_10 | Upload ảnh local → hiển thị preview Facebook | Happy path |
| `UC08_UC10_POST_MEDIA_NHA_POST_UI_029.md` | TC_POST_11 | Backend crash khi upload video không hợp lệ | **Bug PC-57 Critical** |

**Bug:** `BUG_UC08_UC10_POST_MEDIA_NHA_POST_UI_029_PC57_BACKEND_CRASH_INVALID_VIDEO.md` → ✅ RESOLVED

---

## 3. Bảng trạng thái Bug Reports

| Bug File | Jira | TC gốc | Trạng thái |
|----------|------|--------|-----------|
| `BUG_UC05_BRAND_NHA_09_PC51_...` | PC-51 | UC05_BRAND_NHA_09 | ⚠️ OPEN |
| `BUG_UC17_ANALYTICS_NHA_07_08_PC53_...` | PC-53 | UC17_ANALYTICS_NHA_07_08 | ⚠️ OPEN |
| `BUG_UC07_TEAM_NHA_08_C_PC54_...` | PC-54 | UC07_TEAM_NHA_08_C | ⚠️ OPEN |
| `BUG_UC06_UC07_TEAM_NHA_02_09_PC55_...` | PC-55 | UC06_TEAM_NHA_02 ~ _09 | ✅ RESOLVED |
| `BUG_UC05_UC16_DASHBOARD_NHA_10_PC56_...` | PC-56 | UC05_UC16_DASHBOARD_NHA_10 | ⚠️ OPEN |
| `BUG_UC08_UC10_POST_MEDIA_NHA_POST_UI_029_PC57_...` | PC-57 | UC08_UC10_POST_MEDIA_NHA_POST_UI_029 | ✅ RESOLVED |
| `BUG_UC12_AUTOLISTS_NHA_06_07_...` | AUTOLIST_001 | UC12_AUTOLISTS_NHA_06 & 07 | ✅ RESOLVED |
