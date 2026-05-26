const mediaLibraryRepository = require('../../repositories/workspace/media-library.repository');
const QueryPipeline = require('../../core/query-pipeline/query.pipeline');
const MediaLibrarySearchFilter = require('./media-library/filters/search.filter');
const MediaLibraryTypeFilter = require('./media-library/filters/type.filter');
const MediaLibraryUsedFilter = require('./media-library/filters/used.filter');

const ALLOWED_SORT_FIELDS = ['createdAt', 'filename', 'sizeBytes'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

class MediaLibraryService {
  constructor() {
    this.queryPipeline = new QueryPipeline([
      new MediaLibrarySearchFilter(),
      new MediaLibraryTypeFilter(),
      new MediaLibraryUsedFilter()
    ]);
  }

  /**
   * Get filtered media files
   */
  async getMediaFiles(queryParams, brandId) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;
    const { skip, take } = this._getPagination(page, limit);
    const order = this._getSortOrder(sortBy, sortOrder);

    const where = this.queryPipeline.apply({ brandId }, queryParams);
    const { files, total } = await mediaLibraryRepository.findManyAndCount(where, { skip, take, orderBy: order });

    return {
      data: files.map(f => this._formatMediaFile(f)),
      meta: { total, page: Math.max(1, parseInt(page) || 1), limit: take, totalPages: Math.ceil(total / take) }
    };
  }

  /**
   * Upload and save media file info
   */
  async uploadFile(file, brandId, userId) {
    const storageUrl = `/uploads/${file.filename}`;

    const media = await mediaLibraryRepository.create({
      brandId,
      uploadedByUserId: userId,
      filename: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageUrl,
      mediaId: file.filename.split('.')[0], // Unique ID from filename
      uploadedAt: new Date()
    });

    return this._formatMediaFile(media);
  }

  /**
   * Delete media file and physical file
   */
  async deleteMedia(id, brandId) {
    const media = await mediaLibraryRepository.findById(id);
    if (!media || media.brandId !== brandId) {
      throw new Error('Media file not found');
    }

    // Delete from DB
    await mediaLibraryRepository.delete(id);

    // Delete physical file
    const fs = require('fs');
    const path = require('path');
    const localPath = path.join(process.cwd(), media.storageUrl.startsWith('/') ? media.storageUrl.substring(1) : media.storageUrl);

    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    return { success: true };
  }

  // ============= Private Helper Methods =============

  _getPagination(page, limit) {
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return { skip: (safePage - 1) * safeLimit, take: safeLimit };
  }

  _getSortOrder(sortBy, sortOrder) {
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';
    return { [safeSortBy]: safeSortOrder };
  }

  _formatMediaFile(f) {
    return {
      id: f.id,
      name: f.filename,
      type: this._getShortType(f.mimeType),
      size: this._formatBytes(f.sizeBytes),
      dim: f.width && f.height ? `${f.width}×${f.height}` : '—',
      date: new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      used: f.isUsed,
      url: f.storageUrl,
      thumbnail: f.thumbnailUrl,
      aspect: f.aspectRatio || '1/1',
      emoji: this._getEmoji(f.mimeType),
      duration: f.durationSeconds ? this._formatDuration(f.durationSeconds) : null
    };
  }

  _getShortType(mime) {
    if (mime.includes('image')) return 'image';
    if (mime.includes('video')) return 'video';
    if (mime.includes('gif')) return 'gif';
    return 'file';
  }

  _getEmoji(mime) {
    if (mime.includes('video')) return '🎬';
    if (mime.includes('gif')) return '🎞️';
    return '🖼️';
  }

  _formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  _formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}

module.exports = new MediaLibraryService();
