const postRepository = require('../repositories/post.repository');

const ALLOWED_SORT_FIELDS = ['createdAt', 'scheduledAt', 'publishedAt', 'title', 'status'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

class PostService {
  /**
   * Get filtered posts with pagination
   * @param {Object} queryParams - Raw query parameters
   * @param {string} brandId - Scoped brand ID
   * @returns {Promise<Object>} { data, meta }
   */
  async getPosts(queryParams, brandId) {
    const {
      search,
      platform,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    // 1. Sanitize & Validate Pagination
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    // 2. Validate Sorting
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

    // 3. Build Dynamic Where Conditions
    const where = { brandId };

    // Text search (Title or Caption)
    if (search && search.trim()) {
      const searchKey = search.trim();
      where.OR = [
        { title: { contains: searchKey } },
        { caption: { contains: searchKey } }
      ];
    }

    // Platform filter
    if (platform && platform !== 'All Platforms') {
      where.targetPlatforms = { contains: platform };
    }

    // Status filter
    if (status && status !== 'All') {
      where.status = status.toUpperCase(); // Ensure uppercase for enum matching
    }

    // Date range filter (usually for scheduledAt or createdAt)
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

    // 4. Fetch posts and count
    const { posts, total } = await postRepository.findManyAndCount(where, {
      skip,
      take: safeLimit,
      orderBy: { [safeSortBy]: safeSortOrder }
    });

    // 5. Format response
    return {
      data: posts.map(p => ({
        id: p.id,
        title: p.title,
        caption: p.caption,
        status: p.status.toLowerCase(),
        platforms: p.targetPlatforms ? p.targetPlatforms.split(',').map(plt => plt.trim()) : [],
        scheduledAt: p.scheduledAt,
        publishedAt: p.publishedAt,
        createdAt: p.createdAt,
        creator: p.creator?.name || 'Unknown',
        thumbnail: p.mediaThumbnailUrls ? p.mediaThumbnailUrls.split(',')[0] : null
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

module.exports = new PostService();
