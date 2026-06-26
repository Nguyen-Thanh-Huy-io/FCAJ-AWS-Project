/**
 * Test Suite: POST Social Update/Delete Features
 * Tests: updatePost (PUBLISHED) + bulkDelete (deleteFromSocials)
 * Pattern: Strategy (mocking factory) + Isolation (no real DB/API calls)
 */
const postService = require('../../src/services/workspace/post.service');
const postRepository = require('../../src/repositories/workspace/post.repository');
const brandRepository = require('../../src/repositories/workspace/brand.repository');
const authorizationFacade = require('../../src/services/auth/authorization.facade');
const { PLATFORMS, POST_STATUS } = require('../../src/utils/constants');
const { eventEmitter, EVENTS } = require('../../src/events/event-emitter');

// --- Mock all external dependencies ---
jest.mock('../../src/repositories/workspace/post.repository', () => ({
  findById: jest.fn(),
  update: jest.fn(),
  findManyByIdsAndBrand: jest.fn(),
  updateMany: jest.fn(),
  create: jest.fn(),
  findManyAndCount: jest.fn(),
  updateStatus: jest.fn(),
  deleteMany: jest.fn(),
  countActivePostsThisMonth: jest.fn()
}));

jest.mock('../../src/repositories/workspace/brand.repository', () => ({
  findBrandWithSubscription: jest.fn()
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

// Mock the social platform factory
const mockFacebookService = {
  updatePublishedPost: jest.fn(),
  deletePost: jest.fn()
};
const mockDiscordService = {
  updatePublishedPost: jest.fn(),
  deletePost: jest.fn()
};
const mockYoutubeService = {
  deletePost: jest.fn()
};

jest.mock('../../src/services/social/social-platform.factory', () => ({
  getService: jest.fn()
}));
const socialPlatformFactory = require('../../src/services/social/social-platform.factory');

// --- Test Data ---
const BRAND_ID = 'brand-abc';
const USER_ID = 'user-111';
const POST_ID = 'post-published-123';

const publishedFacebookPost = {
  id: POST_ID,
  brandId: BRAND_ID,
  status: POST_STATUS.PUBLISHED,
  targetPlatforms: `${PLATFORMS.FACEBOOK}`,
  platformPostId: 'fb_post_xyz_987',
  title: 'Post đã xuất bản trên Facebook',
  caption: 'Nội dung gốc',
  creator: { name: 'Test User' }
};

const publishedDiscordPost = {
  id: POST_ID,
  brandId: BRAND_ID,
  status: POST_STATUS.PUBLISHED,
  targetPlatforms: `${PLATFORMS.DISCORD}`,
  platformPostId: 'webhook_msg_id_456',
  title: 'Post đã xuất bản trên Discord',
  caption: 'Discord original message',
  creator: { name: 'Test User' }
};

const publishedYoutubePost = {
  id: 'post-youtube-999',
  brandId: BRAND_ID,
  status: POST_STATUS.PUBLISHED,
  targetPlatforms: `${PLATFORMS.YOUTUBE}`,
  platformPostId: 'yt_video_abc123',
  title: 'Video YouTube đã xuất bản',
  caption: '',
  creator: { name: 'Test User' }
};

// =============================================================================
describe('POST_SOCIAL - updatePost trên nền tảng đã xuất bản (PUBLISHED)', () => {
  beforeEach(() => {
    brandRepository.findBrandWithSubscription.mockResolvedValue(null);
    postRepository.countActivePostsThisMonth.mockResolvedValue(0);
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  describe('POST_SOCIAL_001 - updatePost trên Facebook (PUBLISHED)', () => {
    it('should call facebookService.updatePublishedPost and then update DB', async () => {
      postRepository.findById.mockResolvedValue(publishedFacebookPost);
      socialPlatformFactory.getService.mockReturnValue(mockFacebookService);
      mockFacebookService.updatePublishedPost.mockResolvedValue({ success: true });
      authorizationFacade.hasPermission.mockResolvedValue(true);
      postRepository.update.mockResolvedValue({
        ...publishedFacebookPost,
        caption: 'Nội dung đã cập nhật'
      });

      const result = await postService.updatePost(
        POST_ID,
        { caption: 'Nội dung đã cập nhật' },
        BRAND_ID,
        USER_ID
      );

      expect(socialPlatformFactory.getService).toHaveBeenCalledWith(PLATFORMS.FACEBOOK);
      expect(mockFacebookService.updatePublishedPost).toHaveBeenCalledWith(
        BRAND_ID,
        'fb_post_xyz_987',
        expect.objectContaining({ caption: 'Nội dung đã cập nhật' })
      );
      expect(postRepository.update).toHaveBeenCalled();
    });

    it('should still update DB even if Facebook API call fails (graceful degradation)', async () => {
      postRepository.findById.mockResolvedValue(publishedFacebookPost);
      socialPlatformFactory.getService.mockReturnValue(mockFacebookService);
      // Simulate Facebook API failure
      mockFacebookService.updatePublishedPost.mockRejectedValue(new Error('Facebook API error'));
      authorizationFacade.hasPermission.mockResolvedValue(true);
      postRepository.update.mockResolvedValue({ ...publishedFacebookPost, caption: 'Updated despite failure' });

      // Should NOT throw - error is caught internally and logged
      await expect(
        postService.updatePost(POST_ID, { caption: 'Updated despite failure' }, BRAND_ID, USER_ID)
      ).resolves.toBeDefined();

      expect(postRepository.update).toHaveBeenCalled();
    });

    it('should emit POST.UPDATED with statusChangedToPublished = false if post was already PUBLISHED', async () => {
      postRepository.findById.mockResolvedValue(publishedFacebookPost);
      socialPlatformFactory.getService.mockReturnValue(mockFacebookService);
      mockFacebookService.updatePublishedPost.mockResolvedValue({ success: true });
      authorizationFacade.hasPermission.mockResolvedValue(true);
      postRepository.update.mockResolvedValue({
        ...publishedFacebookPost,
        caption: 'Nội dung đã cập nhật'
      });

      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      await postService.updatePost(
        POST_ID,
        { caption: 'Nội dung đã cập nhật', status: 'PUBLISHED' },
        BRAND_ID,
        USER_ID
      );

      expect(emitSpy).toHaveBeenCalledWith(
        EVENTS.POST.UPDATED,
        expect.objectContaining({
          statusChangedToPublished: false
        })
      );

      emitSpy.mockRestore();
    });
  });

  // -------------------------------------------------------------------------
  describe('POST_SOCIAL_002 - updatePost trên Discord (PUBLISHED)', () => {
    it('should call discordService.updatePublishedPost and then update DB', async () => {
      postRepository.findById.mockResolvedValue(publishedDiscordPost);
      socialPlatformFactory.getService.mockReturnValue(mockDiscordService);
      mockDiscordService.updatePublishedPost.mockResolvedValue({ success: true });
      authorizationFacade.hasPermission.mockResolvedValue(true);
      postRepository.update.mockResolvedValue({
        ...publishedDiscordPost,
        caption: 'Discord updated content'
      });

      await postService.updatePost(
        POST_ID,
        { caption: 'Discord updated content' },
        BRAND_ID,
        USER_ID
      );

      expect(socialPlatformFactory.getService).toHaveBeenCalledWith(PLATFORMS.DISCORD);
      expect(mockDiscordService.updatePublishedPost).toHaveBeenCalledWith(
        BRAND_ID,
        'webhook_msg_id_456',
        expect.objectContaining({ caption: 'Discord updated content' })
      );
      expect(postRepository.update).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  describe('POST_SOCIAL_003 - updatePost trên YouTube (PUBLISHED)', () => {
    it('should throw error because YouTube does not support content update via API', async () => {
      const youtubePublishedPost = {
        ...publishedYoutubePost,
        // YouTube không có hasFacebook || hasDiscord nên sẽ throw
      };
      postRepository.findById.mockResolvedValue(youtubePublishedPost);

      await expect(
        postService.updatePost('post-youtube-999', { caption: 'New caption' }, BRAND_ID, USER_ID)
      ).rejects.toThrow('Cannot update an already published post for this platform');

      expect(postRepository.update).not.toHaveBeenCalled();
    });
  });
});

// =============================================================================
describe('POST_SOCIAL - bulkDelete với deleteFromSocials = true', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  describe('POST_SOCIAL_004 - bulkDelete xóa bài Facebook trên platform', () => {
    it('should call facebookService.deletePost for each published Facebook post', async () => {
      const posts = [
        { id: 'post-1', status: POST_STATUS.PUBLISHED, targetPlatforms: PLATFORMS.FACEBOOK, platformPostId: 'fb_111', autoListId: null },
        { id: 'post-2', status: POST_STATUS.DRAFT, targetPlatforms: PLATFORMS.FACEBOOK, platformPostId: null, autoListId: null }
      ];
      postRepository.findManyByIdsAndBrand.mockResolvedValue(posts);
      socialPlatformFactory.getService.mockReturnValue(mockFacebookService);
      mockFacebookService.deletePost.mockResolvedValue({ success: true });
      postRepository.updateMany.mockResolvedValue({ count: 2 });

      await postService.bulkDelete(['post-1', 'post-2'], BRAND_ID, true);

      // Chỉ post-1 có status PUBLISHED và có platformPostId mới được gọi xóa
      expect(socialPlatformFactory.getService).toHaveBeenCalledWith(PLATFORMS.FACEBOOK);
      expect(mockFacebookService.deletePost).toHaveBeenCalledTimes(1);
      expect(mockFacebookService.deletePost).toHaveBeenCalledWith(BRAND_ID, 'fb_111');
      // Cả 2 bài đều bị xóa mềm trong DB
      expect(postRepository.updateMany).toHaveBeenCalledWith(
        { id: { in: ['post-1', 'post-2'] }, brandId: BRAND_ID },
        expect.objectContaining({ isDeleted: true })
      );
    });
  });

  // -------------------------------------------------------------------------
  describe('POST_SOCIAL_005 - bulkDelete xóa bài YouTube trên platform', () => {
    it('should call youtubeService.deletePost for published YouTube post', async () => {
      const posts = [
        { id: 'post-yt-1', status: POST_STATUS.PUBLISHED, targetPlatforms: PLATFORMS.YOUTUBE, platformPostId: 'yt_video_xyz', autoListId: null }
      ];
      postRepository.findManyByIdsAndBrand.mockResolvedValue(posts);
      socialPlatformFactory.getService.mockReturnValue(mockYoutubeService);
      mockYoutubeService.deletePost.mockResolvedValue({ success: true });
      postRepository.updateMany.mockResolvedValue({ count: 1 });

      await postService.bulkDelete(['post-yt-1'], BRAND_ID, true);

      expect(socialPlatformFactory.getService).toHaveBeenCalledWith(PLATFORMS.YOUTUBE);
      expect(mockYoutubeService.deletePost).toHaveBeenCalledWith(BRAND_ID, 'yt_video_xyz');
      expect(postRepository.updateMany).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  describe('POST_SOCIAL_006 - bulkDelete không xóa trên platform khi deleteFromSocials = false', () => {
    it('should NOT call any social service when deleteFromSocials is false', async () => {
      const posts = [
        { id: 'post-1', status: POST_STATUS.PUBLISHED, targetPlatforms: PLATFORMS.FACEBOOK, platformPostId: 'fb_111', autoListId: null }
      ];
      postRepository.findManyByIdsAndBrand.mockResolvedValue(posts);
      postRepository.updateMany.mockResolvedValue({ count: 1 });

      // deleteFromSocials = false (default)
      await postService.bulkDelete(['post-1'], BRAND_ID, false);

      expect(socialPlatformFactory.getService).not.toHaveBeenCalled();
      expect(postRepository.updateMany).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  describe('POST_SOCIAL_007 - bulkDelete tiếp tục xóa DB nếu social API thất bại', () => {
    it('should still soft-delete DB records even when Discord API throws', async () => {
      const posts = [
        { id: 'post-discord-1', status: POST_STATUS.PUBLISHED, targetPlatforms: PLATFORMS.DISCORD, platformPostId: 'discord_msg_789', autoListId: null }
      ];
      postRepository.findManyByIdsAndBrand.mockResolvedValue(posts);
      socialPlatformFactory.getService.mockReturnValue(mockDiscordService);
      // Discord API fails
      mockDiscordService.deletePost.mockRejectedValue(new Error('Discord webhook error'));
      postRepository.updateMany.mockResolvedValue({ count: 1 });

      // Should not throw - error is caught internally
      const count = await postService.bulkDelete(['post-discord-1'], BRAND_ID, true);

      expect(count).toBe(1);
      expect(postRepository.updateMany).toHaveBeenCalledWith(
        { id: { in: ['post-discord-1'] }, brandId: BRAND_ID },
        expect.objectContaining({ isDeleted: true })
      );
    });
  });
});
