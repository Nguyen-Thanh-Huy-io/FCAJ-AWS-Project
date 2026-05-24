const postRepository = require('../../repositories/workspace/post.repository');
const socialPlatformFactory = require('../social/social-platform.factory');
const { POST_STATUS } = require('../../utils/constants');

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
      data: posts.map(p => {
        let options = {};
        if (p.metadata) {
          try {
            options = JSON.parse(p.metadata);
          } catch (e) {
            console.error('Failed to parse options JSON:', e.message);
          }
        }
        return {
          id: p.id,
          title: p.title,
          caption: p.caption,
          status: p.status.toLowerCase(),
          platforms: p.targetPlatforms ? p.targetPlatforms.split(',').map(plt => plt.trim()) : [],
          scheduledAt: p.scheduledAt,
          publishedAt: p.publishedAt,
          createdAt: p.createdAt,
          creator: p.creator?.name || 'Unknown',
          thumbnail: p.mediaThumbnailUrls ? p.mediaThumbnailUrls.split(',')[0] : null,
          mediaUrls: p.mediaUrls ? p.mediaUrls.split(',').map(m => m.trim()) : [],
          options
        };
      }),
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  /**
   * Create a new post
   * @param {Object} postData - Post details
   * @param {string} userId - ID of user creating the post
   * @param {string} brandId - Scoped brand ID
   * @returns {Promise<Object>} Created post
   */
  async createPost(postData, userId, brandId) {
    const {
      title,
      caption,
      type = 'VIDEO',
      status = POST_STATUS.DRAFT,
      targetPlatforms = [],
      mediaUrls = [],
      mediaThumbnailUrls = [],
      scheduledAt,
      options = {}
    } = postData;

    // Build creation object
    const data = {
      brandId,
      createdByUserId: userId,
      title: title || 'Untitled Post',
      caption,
      type,
      status: status.toUpperCase(),
      targetPlatforms: targetPlatforms.join(','),
      mediaUrls: mediaUrls.join(','),
      mediaThumbnailUrls: mediaThumbnailUrls.join(','),
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      firstComment: options.firstComment || null,
      metadata: options ? JSON.stringify(options) : null
    };

    const post = await postRepository.create(data);

    if (data.status === POST_STATUS.PUBLISHED) {
      try {
        await this.publishToPlatforms(post.id, postData.options);
      } catch (err) {
        console.error('Publishing error inside createPost:', err.message);
      }
    }

    let parsedOptions = {};
    if (post.metadata) {
      try {
        parsedOptions = JSON.parse(post.metadata);
      } catch (e) {}
    }

    return {
      ...post,
      options: parsedOptions
    };
  }

  /**
   * Đồng bộ xuất bản bài đăng lên các nền tảng xã hội
   * @param {string} postId 
   * @param {Object} postDataOptions Các tùy chọn riêng tư, comment,...
   */
  async publishToPlatforms(postId, postDataOptions = {}) {
    const post = await postRepository.findById(postId);
    if (!post) throw new Error('Post not found');

    const platforms = post.targetPlatforms ? post.targetPlatforms.split(',').map(p => p.trim()) : [];

    // Parse options from metadata if postDataOptions is not provided or empty
    let options = postDataOptions;
    if ((!options || Object.keys(options).length === 0) && post.metadata) {
      try {
        options = JSON.parse(post.metadata);
      } catch (e) {
        console.error('Failed to parse options in publishToPlatforms:', e.message);
      }
    }

    for (const platform of platforms) {
      try {
        const service = socialPlatformFactory.getService(platform);
        
        // Kiểm tra xem Service có hỗ trợ hàm publishPost hay không (Duck Typing - ISP)
        if (service && typeof service.publishPost === 'function') {
          const result = await service.publishPost(post.brandId, {
            title: post.title,
            caption: post.caption,
            mediaUrls: post.mediaUrls,
            options: options
          });

          await postRepository.update(post.id, {
            status: POST_STATUS.PUBLISHED,
            platformPostId: result.platformVideoId,
            publishedAt: result.publishedAt
          });
        }
      } catch (error) {
        console.error(`Failed to publish post ${post.id} to ${platform}:`, error.message);
        await postRepository.update(post.id, {
          status: 'FAILED',
          failureReason: `Failed to publish to ${platform}: ${error.message}`
        });
        throw error;
      }
    }
  }

  /**
   * Update an existing post
   * @param {string} id - ID of the post to update
   * @param {Object} postData - Updated post details
   * @param {string} brandId - Scoped brand ID
   * @returns {Promise<Object>} Updated post
   */
  async updatePost(id, postData, brandId) {
    const post = await postRepository.findById(id);
    if (!post || post.brandId !== brandId) {
      throw new Error('Post not found or unauthorized');
    }

    if (post.status === POST_STATUS.PUBLISHED) {
      throw new Error('Cannot update an already published post');
    }

    const {
      title,
      caption,
      type,
      status,
      targetPlatforms,
      mediaUrls,
      mediaThumbnailUrls,
      scheduledAt
    } = postData;

    const data = {};
    if (title !== undefined) data.title = title || 'Untitled Post';
    if (caption !== undefined) data.caption = caption;
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status.toUpperCase();
    if (targetPlatforms !== undefined) data.targetPlatforms = targetPlatforms.join(',');
    if (mediaUrls !== undefined) data.mediaUrls = mediaUrls.join(',');
    if (mediaThumbnailUrls !== undefined) data.mediaThumbnailUrls = mediaThumbnailUrls.join(',');
    if (scheduledAt !== undefined) data.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (postData.options !== undefined) {
      data.metadata = JSON.stringify(postData.options);
      data.firstComment = postData.options.firstComment || null;
    }

    const updatedPost = await postRepository.update(id, data);

    if (data.status === POST_STATUS.PUBLISHED) {
      try {
        await this.publishToPlatforms(updatedPost.id, postData.options);
      } catch (err) {
        console.error('Publishing error inside updatePost:', err.message);
      }
    }

    let parsedOptions = {};
    if (updatedPost.metadata) {
      try {
        parsedOptions = JSON.parse(updatedPost.metadata);
      } catch (e) {}
    }

    return {
      ...updatedPost,
      options: parsedOptions
    };
  }
}

module.exports = new PostService();
