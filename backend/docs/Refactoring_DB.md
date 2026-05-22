# Refactoring_DB

# Refactoring_DB

## Mục tiêu

Tài liệu này mô tả trạng thái hiện tại của database schema (tập trung vào cấu trúc, các model chính và đánh giá thiết kế theo các nguyên tắc SOLID), đưa ra nhận xét về tính bền vững, hướng phát triển và khuyến nghị bảo trì.

## Hiện trạng ngắn gọn

- Schema chính: `prisma/schema.prisma` — multi-tenant theo `Brand` với ~40 models (User, UserAccount, Brand, Team, Post, Livestream, SocialAccount, Analytics, UnifiedInbox, SupportTicket, MediaLibrary, Report, SmartLink, ...).
- Delete strategy: hybrid — `deletedAt` (soft delete) trên core entities; `onDelete: Cascade` cho dữ liệu phụ; `onDelete: Restrict` cho quan hệ owner/creator.
- Quan hệ: nhiều `relationName` đã đặt để tránh ambiguous relations; `Brand.subscriptionId` có `@unique`.

## Tóm tắt model chính (sơ lược từng "class")

- `User`: core identity/auth (id, email, passwordHash, role, isActive, lastLoginAt aggregated, avatarUrl, timestamps).
- `UserAccount`: per-provider account (provider, providerId, passwordHash optional, twoFactorEnabled, lastLoginAt per-account, timestamps).
- `UserSettings`: per-user preferences (language, timezone) — kept minimal.
- `Brand`: tenant unit, chứa liên kết tới subscription, teams, social accounts, posts, analytics, unified inbox, media, reports, smart links.
- `Team`: membership per brand (role, invitedBy, status).
- `Post` / `Livestream`: content entities, creator relation (Restrict), brand-scoped and cascade-deleted with brand.
- `SocialAccount` / platform-specific models: external platform connection + analytics relations.
- `Analytics` / `SocialAnalytics` / `AdAnalytics`: fetched metrics (append-only style), brand-scoped.
- `UnifiedInbox` / `InboxItem`: messaging/engagement items; assignedUser/repliedBy relations to `User` with explicit relation names.
- `SupportTicket` / `TicketMessage`: support system models with agent assignment.
- `MediaLibrary`: brand media with `uploadedBy` relation to `User`.
- `Report`, `SmartLink`, `LinkItem`, `HashtagTracker`, etc.: feature-specific domain models.

## Đánh giá theo SOLID (áp dụng cho schema & domain design)

- SRP (Single Responsibility):
  - Good: `User` vs `UserAccount` separation gives clear responsibilities (identity vs provider). `UserSettings` isolates preferences. This reduces blast radius khi thay đổi phần preferences hoặc provider logic.
  - Note: very small tables (if only 1 field) may be over-splitting — we consolidated `avatarUrl` into `User` to avoid that.

- ISP (Interface Segregation):
  - Good: consumers can `include` only `settings` or `accounts` as needed. Reduces over-fetch.

- OCP (Open/Closed):
  - Partial: schema changes still require migrations; however separation reduces frequency of touching core `User` when adding preferences.

- LSP / DIP (Liskov / Dependency Inversion):
  - More about service layer: ensure repositories/services depend on abstractions rather than direct schema shape to ease refactors.

## Thiết kế — đã tốt chưa?

- Strengths:
  - Clear multi-tenant border (`Brand`) and consistent `brandId` relations.
  - `UserAccount` allows multi-provider auth cleanly.
  - Hybrid delete strategy balances auditability and cleanup.
  - Explicit relationNames remove ambiguous Prisma errors.

- Weaknesses / Risks:
  - Potential over-normalization for tiny tables (which we fixed for profile).
  - If business requires heavy per-user preferences, `UserSettings` may grow — consider JSON column or separate preferences table per domain.
  - Need clear conventions: where to store `lastLoginAt` (we keep aggregated on `User` + per-account on `UserAccount`). Enforce via services.

## Hướng phát triển (ngắn → dài hạn)

- Short-term (0–3 months):
  - Apply migration for current schema changes and backfill critical fields if needed.
  - Update backend services to read/write moved fields via repository methods.
  - Add automated tests (unit + integration) for auth flows and pricing features.

- Mid-term (3–12 months):
  - Add indexing and query optimization for heavy-read tables (analytics, media).
  - Add archiving pipeline for analytics/media (cold storage or data-warehouse).
  - Introduce Prisma repository layer or adapters to isolate callers from schema shape.

- Long-term (12+ months):
  - Scale analytics to specialized store (clickhouse/bigquery) when volume grows.
  - Consider read-replicas / partitioning for large tables.
  - Formalize tenant isolation and compliance (audits, data retention policies).

## Bảo trì và vận hành

- Migrations: always create migration + backfill script + rollback plan. Run on staging with production-like data first.
- Backups: daily backups + point-in-time recovery; test restores periodically.
- Monitoring: slow query logs, table growth metrics, index usage, replication lag.
- Testing: integration tests against ephemeral DB, schema migration tests.
- Documentation: keep `docs/Refactoring_DB.md` and changelog updated per migration.

## Khuyến nghị cụ thể ngay bây giờ

1. Create and apply migration for the recent schema changes (`user-account-2fa-lastlogin`).
2. Search-and-update backend references where fields moved (`avatarUrl`, `twoFactorEnabled`, `lastLoginAt`).
3. Add a repository/service adapter for `User` operations to centralize aggregated logic (e.g., `getEffectiveLastLogin(userId)`).
4. Add simple Prisma middleware or repository helpers to enforce `deletedAt: null` filtering for public queries.

---

Thao tác tiếp theo tôi có thể làm cho bạn: (A) tạo migration + backfill, (B) tự động sửa code references và chạy test, (C) thêm repository adapters + tests. Chọn một phương án để tôi bắt đầu.

## Next steps tôi có thể làm ngay

- Tự động tìm và sửa references trong backend (tìm `user.profile`, `user.twoFactorEnabled`, `user.lastLoginAt` và thay thế) — tôi có thể thực hiện và tạo PR/gói patch.
- Tạo migration SQL bằng `prisma migrate` và chạy lên DB dev.
- Chạy test suite, đọc lỗi cụ thể, và fix code/test.

---

Nếu bạn muốn, tôi sẽ bắt đầu tự động sửa các references trong backend ngay bây giờ và sau đó chạy `npm test` để liệt kê lỗi chi tiết. Bạn muốn tôi thực hiện bước đó không?
