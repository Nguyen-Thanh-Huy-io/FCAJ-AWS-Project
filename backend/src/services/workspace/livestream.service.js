const livestreamRepository = require('../../repositories/workspace/livestream.repository');

const ALLOWED_SORT_FIELDS = ['scheduledAt', 'title', 'peakViewers', 'totalViews', 'durationMinutes'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

class LivestreamService {
  /**
   * Get filtered stream history with pagination
   * @param {Object} queryParams - Raw query parameters
   * @param {string} brandId - Scoped brand ID
   * @returns {Promise<Object>} { data, meta }
   */
  async getStreamHistory(queryParams, brandId) {
    const {
      search,
      platform,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'scheduledAt',
      sortOrder = 'desc'
    } = queryParams;

    // 1. Sanitize & Validate Pagination
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    // 2. Validate Sorting
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'scheduledAt';
    const safeSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

    // 3. Build Dynamic Where Conditions
    const where = { brandId };

    // Text search (Title or Description)
    if (search && search.trim()) {
      const searchKey = search.trim();
      where.OR = [
        { title: { contains: searchKey } },
        { description: { contains: searchKey } }
      ];
    }

    // Platform filter (stored as comma-separated or JSON string in targetPlatforms)
    if (platform && platform !== 'All Platforms') {
      where.targetPlatforms = { contains: platform };
    }

    // Status filter
    if (status && status !== 'All Statuses') {
      where.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          where.scheduledAt.gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          where.scheduledAt.lte = end;
        }
      }
    }

    // 4. Fetch streams and count
    const { streams, total } = await livestreamRepository.findManyAndCount(where, {
      skip,
      take: safeLimit,
      orderBy: { [safeSortBy]: safeSortOrder }
    });

    // 5. Format response
    return {
      data: streams.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        thumbnail: s.thumbnailUrl,
        date: new Date(s.scheduledAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' }),
        start: new Date(s.scheduledAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration: this.formatDuration(s.durationMinutes),
        platforms: s.targetPlatforms ? s.targetPlatforms.split(',').map(p => p.trim()) : [],
        peak: s.peakViewers,
        views: s.totalViews,
        status: s.status.toLowerCase(),
        creator: s.creator?.name || 'Unknown'
      })),
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  /**
   * Helper to format minutes into "1h 24m" style
   */
  formatDuration(mins) {
    if (!mins) return '0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }
}

module.exports = new LivestreamService();
