const auditLogRepository = require('../../repositories/admin/audit-log.repository');

const ALLOWED_SORT_FIELDS = ['createdAt', 'action', 'targetType'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

class AuditLogService {
  /**
   * Get filtered audit logs with pagination metadata
   * @param {Object} queryParams - Raw query parameters
   * @returns {Promise<Object>} { data, meta }
   */
  async getAuditLogs(queryParams) {
    const {
      search,
      category, // maps to targetType (e.g. Content, Team, Security, Billing, Data, Stream)
      status,
      startDate,
      endDate,
      page = 1,
      limit = 5, // Default matching UI limit
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    // 1. Sanitize & Validate Pagination
    const safePage = Math.max(1, parseInt(page) || 1);
    // Enforce safeLimit >= 1 to prevent take: 0 in Prisma which returns an empty array
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 5));
    const skip = (safePage - 1) * safeLimit;

    // 2. Validate Sorting
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

    // 3. Build Dynamic Where Conditions
    const where = {};

    // Text search (Action, IP, target ID, user name)
    if (search && search.trim()) {
      const searchKey = search.trim();
      where.OR = [
        { action: { contains: searchKey } },
        { ipAddress: { contains: searchKey } },
        { targetId: { contains: searchKey } },
        { user: { name: { contains: searchKey } } }
      ];
    }

    // Category / TargetType / Action Prefix filter
    if (category && category !== 'All') {
      if (category.startsWith('AUTH_') || category.startsWith('PLAN_')) {
        where.action = { startsWith: category };
      } else {
        where.targetType = category;
      }
    }

    // Status filter (e.g. success, failed, matched with details status)
    if (status && status !== 'All') {
      where.details = { contains: status };
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          where.createdAt.gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          where.createdAt.lte = end;
        }
      }
    }

    // 4. Fetch logs and count
    const { logs, total } = await auditLogRepository.findManyAndCount(where, {
      skip,
      take: safeLimit,
      orderBy: { [safeSortBy]: safeSortOrder }
    });

    // 5. Format response with pagination metadata
    return {
      data: logs.map(log => ({
        id: log.id,
        createdAt: log.createdAt,
        actor: log.user?.name || 'System',
        role: log.user?.role || 'Root',
        action: log.action,
        category: log.targetType,
        target: log.targetId || '—',
        ip: log.ipAddress || '—',
        status: log.details || 'success',
        time: new Date(log.createdAt).toLocaleTimeString('vi-VN', { hour12: false })
      })),
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
