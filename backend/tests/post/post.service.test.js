const postService = require('../../src/services/workspace/post.service');
const postRepository = require('../../src/repositories/workspace/post.repository');
const authorizationFacade = require('../../src/services/auth/authorization.facade');
const approvalWorkflowService = require('../../src/services/workspace/approval-workflow.service');
const { upsertPublishJob, removePublishJob } = require('../../src/queues/publish.queue');
const { POST_STATUS } = require('../../src/utils/constants');

jest.mock('../../src/repositories/workspace/post.repository', () => ({
  findManyAndCount: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  findManyByIdsAndBrand: jest.fn(),
  updateMany: jest.fn(),
  deleteMany: jest.fn()
}));

jest.mock('../../src/services/auth/authorization.facade', () => ({
  hasPermission: jest.fn()
}));

jest.mock('../../src/services/workspace/approval-workflow.service', () => ({
  createWorkflowRequest: jest.fn()
}));

jest.mock('../../src/queues/publish.queue', () => ({
  upsertPublishJob: jest.fn(),
  removePublishJob: jest.fn()
}));

describe('PostService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPostData = {
    id: 'post-123',
    title: 'Học lập trình NodeJS',
    caption: 'NodeJS cơ bản đến nâng cao cùng PubliCast',
    status: 'DRAFT',
    targetPlatforms: 'FACEBOOK,YOUTUBE',
    mediaUrls: 'https://cloudinary.com/image1.png',
    mediaThumbnailUrls: 'https://cloudinary.com/image1_thumb.png',
    scheduledAt: null,
    publishedAt: null,
    createdAt: new Date(),
    deletedAt: null,
    creator: { name: 'Thanh Nha' },
    altText: 'NodeJS tutorial banner'
  };

  describe('POST_001 - getPosts (Pagination, Sorting & Filters)', () => {
    it('should query repository with mapped filters and pagination parameters', async () => {
      postRepository.findManyAndCount.mockResolvedValue({
        posts: [mockPostData],
        total: 1
      });

      const queryParams = { page: 2, limit: 5, sortBy: 'scheduledAt', sortOrder: 'asc' };
      const brandId = 'brand-abc';
      const result = await postService.getPosts(queryParams, brandId);

      expect(result.data).toHaveLength(1);
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
      expect(result.meta.totalPages).toBe(1);
      expect(postRepository.findManyAndCount).toHaveBeenCalledWith(
        expect.any(Object),
        {
          skip: 5,
          take: 5,
          orderBy: { scheduledAt: 'asc' }
        }
      );
    });
  });

  describe('POST_002 - createPost (DRAFT status)', () => {
    it('should save post directly as DRAFT without permission checking', async () => {
      const newPostInput = {
        title: 'New Draft Post',
        caption: 'Draft caption',
        status: 'DRAFT',
        targetPlatforms: ['FACEBOOK']
      };

      postRepository.create.mockResolvedValue({
        ...mockPostData,
        title: 'New Draft Post',
        caption: 'Draft caption',
        status: 'DRAFT',
        targetPlatforms: 'FACEBOOK'
      });

      const result = await postService.createPost(newPostInput, 'user-111', 'brand-abc');

      expect(result.status).toBe('draft');
      expect(postRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Draft Post',
        status: 'DRAFT',
        targetPlatforms: 'FACEBOOK'
      }));
      expect(authorizationFacade.hasPermission).not.toHaveBeenCalled();
      expect(approvalWorkflowService.createWorkflowRequest).not.toHaveBeenCalled();
    });
  });

  describe('POST_003 - createPost (PENDING_APPROVAL fallback)', () => {
    it('should force status to PENDING_APPROVAL and initiate workflow request if user lacks permission', async () => {
      const schedulePostInput = {
        title: 'Direct Schedule Post',
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
        reviewerIds: ['reviewer-999'],
        requesterNote: 'Phê duyệt gấp bài viết'
      };

      authorizationFacade.hasPermission.mockResolvedValue(false); // User lacks permission
      postRepository.create.mockResolvedValue({
        ...mockPostData,
        title: 'Direct Schedule Post',
        status: 'PENDING_APPROVAL'
      });

      const result = await postService.createPost(schedulePostInput, 'user-111', 'brand-abc');

      expect(result.status).toBe('pending_approval');
      expect(authorizationFacade.hasPermission).toHaveBeenCalledWith('user-111', 'brand-abc', 'APPROVE_POSTS');
      expect(approvalWorkflowService.createWorkflowRequest).toHaveBeenCalledWith(
        'post-123',
        'user-111',
        'brand-abc',
        ['reviewer-999'],
        'AT_LEAST_ONE',
        'Phê duyệt gấp bài viết'
      );
      expect(upsertPublishJob).not.toHaveBeenCalled();
    });
  });

  describe('POST_004 - createPost (SCHEDULED success)', () => {
    it('should allow SCHEDULED status and register BullMQ job if user has permission', async () => {
      const scheduleTime = new Date(Date.now() + 3600000);
      const schedulePostInput = {
        title: 'Authorized Schedule Post',
        status: 'SCHEDULED',
        scheduledAt: scheduleTime.toISOString()
      };

      authorizationFacade.hasPermission.mockResolvedValue(true); // Authorized
      postRepository.create.mockResolvedValue({
        ...mockPostData,
        id: 'post-999',
        title: 'Authorized Schedule Post',
        status: 'SCHEDULED',
        scheduledAt: scheduleTime
      });

      const result = await postService.createPost(schedulePostInput, 'user-111', 'brand-abc');

      expect(result.status).toBe('scheduled');
      expect(authorizationFacade.hasPermission).toHaveBeenCalledWith('user-111', 'brand-abc', 'APPROVE_POSTS');
      expect(upsertPublishJob).toHaveBeenCalledWith('post-999', scheduleTime);
      expect(approvalWorkflowService.createWorkflowRequest).not.toHaveBeenCalled();
    });
  });

  describe('POST_005 - updatePost (General Update)', () => {
    it('should update draft post content successfully', async () => {
      postRepository.findById.mockResolvedValue({
        id: 'post-123',
        brandId: 'brand-abc',
        status: 'DRAFT'
      });

      postRepository.update.mockResolvedValue({
        ...mockPostData,
        title: 'Updated Title'
      });

      const result = await postService.updatePost('post-123', { title: 'Updated Title' }, 'brand-abc', 'user-111');

      expect(result.title).toBe('Updated Title');
      expect(postRepository.update).toHaveBeenCalledWith('post-123', expect.objectContaining({
        title: 'Updated Title'
      }));
    });
  });

  describe('POST_006 - updatePost (Error handling)', () => {
    it('should throw error when trying to update an already published post', async () => {
      postRepository.findById.mockResolvedValue({
        id: 'post-123',
        brandId: 'brand-abc',
        status: 'PUBLISHED' // Already published
      });

      await expect(
        postService.updatePost('post-123', { title: 'Updated Title' }, 'brand-abc', 'user-111')
      ).rejects.toThrow('Cannot update an already published post');

      expect(postRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('POST_007 - Bulk Operations', () => {
    it('should support bulk approval', async () => {
      postRepository.findManyByIdsAndBrand.mockResolvedValue([
        { id: 'post-1', status: 'PENDING_APPROVAL' },
        { id: 'post-2', status: 'DRAFT' },
        { id: 'post-3', status: 'PENDING_APPROVAL' }
      ]);

      const count = await postService.bulkApprove(['post-1', 'post-2', 'post-3'], 'brand-abc');

      expect(count).toBe(2); // Only posts in PENDING_APPROVAL are approved
      expect(postRepository.updateStatus).toHaveBeenCalledTimes(2);
    });

    it('should support bulk delete', async () => {
      postRepository.findManyByIdsAndBrand.mockResolvedValue([
        { id: 'post-1', autoListId: 'autolist-99' }
      ]);
      postRepository.updateMany.mockResolvedValue({ count: 3 });

      const count = await postService.bulkDelete(['post-1', 'post-2', 'post-3'], 'brand-abc');

      expect(count).toBe(3);
      expect(postRepository.updateMany).toHaveBeenCalledWith(
        { id: { in: ['post-1', 'post-2', 'post-3'] }, brandId: 'brand-abc' },
        expect.objectContaining({ isDeleted: true })
      );
    });
  });
});
