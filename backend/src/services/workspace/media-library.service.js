const mediaLibraryRepository = require('../../repositories/workspace/media-library.repository');
const QueryPipeline = require('../../core/query-pipeline/query.pipeline');
const MediaLibrarySearchFilter = require('./media-library/filters/search.filter');
const MediaLibraryTypeFilter = require('./media-library/filters/type.filter');
const MediaLibraryUsedFilter = require('./media-library/filters/used.filter');
const MediaLibraryFolderFilter = require('./media-library/filters/folder.filter');
const storageService = require('../storage');
const path = require('path');
const crypto = require('crypto');

const ALLOWED_SORT_FIELDS = ['createdAt', 'filename', 'sizeBytes'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

class MediaLibraryService {
  constructor() {
    this.queryPipeline = new QueryPipeline([
      new MediaLibrarySearchFilter(),
      new MediaLibraryTypeFilter(),
      new MediaLibraryUsedFilter(),
      new MediaLibraryFolderFilter()
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
   * Upload and save media file info.
   * File is uploaded to storage (S3 or local) via StorageService.
   */
  async uploadFile(file, brandId, userId, folderId = null) {
    const s3Key = this._buildStorageKey(brandId, file.mimetype, file.originalname);

    const { url } = await storageService.upload(file.buffer, s3Key, file.mimetype);

    const media = await mediaLibraryRepository.create({
      brandId,
      uploadedByUserId: userId,
      filename: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageUrl: url,
      mediaId: s3Key,  // Store the S3 key for deletion
      folderId: folderId || null,
      uploadedAt: new Date()
    });

    return this._formatMediaFile(media);
  }

  /**
   * Delete media file from database and storage
   */
  async deleteMedia(id, brandId) {
    const media = await mediaLibraryRepository.findById(id);
    if (!media || media.brandId !== brandId) {
      throw new Error('Media file not found');
    }

    // Delete from DB
    await mediaLibraryRepository.delete(id);

    // Delete from storage using the stored key
    try {
      await storageService.delete(media.mediaId);
    } catch (err) {
      console.error(`[MediaLibrary] Storage deletion failed for ${media.mediaId}:`, err.message);
    }

    return { success: true };
  }

  // ============= Private Helper Methods =============

  /**
   * Build a storage key following the folder structure:
   *   media/{brandId}/images/  (for image/*)
   *   media/{brandId}/videos/  (for video/*)
   *   media/{brandId}/documents/  (for PDF, etc.)
   * 
   * Generates unique filenames while preserving extensions.
   */
  _buildStorageKey(brandId, mimeType, originalName) {
    const ext = path.extname(originalName).toLowerCase();
    const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const safeName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 50);

    let subfolder = 'documents';
    if (mimeType.startsWith('image/')) {
      subfolder = 'images';
    } else if (mimeType.startsWith('video/') || mimeType === 'application/x-matroska') {
      subfolder = 'videos';
    }

    return `media/${brandId}/${subfolder}/${uniqueId}-${safeName}${ext}`;
  }

  _getResourceType(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'raw';
  }

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
    const thumbnail = f.thumbnailUrl || f.storageUrl;

    return {
      id: f.id,
      name: f.filename,
      type: this._getShortType(f.mimeType),
      size: this._formatBytes(f.sizeBytes),
      dim: f.width && f.height ? `${f.width}×${f.height}` : '—',
      date: new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      used: f.isUsed,
      url: f.storageUrl,
      thumbnail: thumbnail,
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
