const mediaLibraryRepository = require('../repositories/media-library.repository');

const ALLOWED_SORT_FIELDS = ['createdAt', 'filename', 'sizeBytes'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

class MediaLibraryService {
  /**
   * Get filtered media files
   */
  async getMediaFiles(queryParams, brandId) {
    const {
      search,
      type,
      used,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    // 1. Sanitize
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (safePage - 1) * safeLimit;
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

    // 2. Build Where
    const where = { brandId }; // Scoped to brand

    if (search && search.trim()) {
      where.filename = { contains: search.trim() };
    }

    if (type && type !== 'All') {
      // Input: Images, Videos, GIFs -> Enum matching or contains
      const typeMap = {
        'Images': 'image',
        'Videos': 'video',
        'GIFs': 'gif'
      };
      const mimePrefix = typeMap[type] || type.toLowerCase();
      where.mimeType = { contains: mimePrefix };
    }

    if (used !== undefined && used !== '') {
      where.isUsed = used === 'true';
    }

    // 3. Fetch
    const { files, total } = await mediaLibraryRepository.findManyAndCount(where, {
      skip,
      take: safeLimit,
      orderBy: { [safeSortBy]: safeSortOrder }
    });

    // 4. Format
    return {
      data: files.map(f => ({
        id: f.id,
        name: f.filename,
        type: this.getShortType(f.mimeType),
        size: this.formatBytes(f.sizeBytes),
        dim: f.width && f.height ? `${f.width}×${f.height}` : '—',
        date: new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        used: f.isUsed,
        url: f.storageUrl,
        thumbnail: f.thumbnailUrl,
        aspect: f.aspectRatio || '1/1',
        emoji: this.getEmoji(f.mimeType),
        duration: f.durationSeconds ? this.formatDuration(f.durationSeconds) : null
      })),
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  getShortType(mime) {
    if (mime.includes('image')) return 'image';
    if (mime.includes('video')) return 'video';
    if (mime.includes('gif')) return 'gif';
    return 'file';
  }

  getEmoji(mime) {
    if (mime.includes('video')) return '🎬';
    if (mime.includes('gif')) return '🎞️';
    return '🖼️';
  }

  formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}

module.exports = new MediaLibraryService();
