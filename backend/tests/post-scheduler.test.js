const postSchedulerService = require('../src/services/workspace/post-scheduler.service');
const postService = require('../src/services/workspace/post.service');
const prisma = require('../src/config/prisma');
const redisClient = require('../src/config/redis');
const { POST_STATUS } = require('../src/utils/constants');

jest.mock('../src/config/prisma', () => ({
  post: {
    findMany: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('../src/config/redis', () => ({
  set: jest.fn(),
  del: jest.fn()
}));

jest.mock('../src/services/workspace/post.service', () => ({
  publishToPlatforms: jest.fn()
}));

describe('PostSchedulerService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAndPublishScheduledPosts', () => {
    it('should query scheduled posts, acquire lock, call publishToPlatforms, and release lock', async () => {
      const mockPost = {
        id: 'post1',
        title: 'Test Scheduled Post',
        status: POST_STATUS.SCHEDULED,
        scheduledAt: new Date(Date.now() - 5000) // 5s ago
      };

      prisma.post.findMany.mockResolvedValue([mockPost]);
      redisClient.set.mockResolvedValue('OK'); // Lock acquired successfully
      postService.publishToPlatforms.mockResolvedValue({});
      redisClient.del.mockResolvedValue(1);

      await postSchedulerService.checkAndPublishScheduledPosts();

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: {
          status: POST_STATUS.SCHEDULED,
          scheduledAt: {
            lte: expect.any(Date)
          }
        },
        orderBy: {
          scheduledAt: 'asc'
        }
      });

      expect(redisClient.set).toHaveBeenCalledWith('post:lock:post1', 'true', { NX: true, EX: 300 });
      expect(postService.publishToPlatforms).toHaveBeenCalledWith('post1');
      expect(redisClient.del).toHaveBeenCalledWith('post:lock:post1');
    });

    it('should skip publishing if the post lock cannot be acquired', async () => {
      const mockPost = {
        id: 'post2',
        title: 'Test Locked Post',
        status: POST_STATUS.SCHEDULED,
        scheduledAt: new Date(Date.now() - 5000)
      };

      prisma.post.findMany.mockResolvedValue([mockPost]);
      redisClient.set.mockResolvedValue(null); // Lock already held

      await postSchedulerService.checkAndPublishScheduledPosts();

      expect(redisClient.set).toHaveBeenCalledWith('post:lock:post2', 'true', { NX: true, EX: 300 });
      expect(postService.publishToPlatforms).not.toHaveBeenCalled();
      expect(redisClient.del).not.toHaveBeenCalled(); // No release of lock we don't own
    });

    it('should catch error, update post status to FAILED, and still release lock on publish error', async () => {
      const mockPost = {
        id: 'post3',
        title: 'Test Failed Post',
        status: POST_STATUS.SCHEDULED,
        scheduledAt: new Date(Date.now() - 5000)
      };

      prisma.post.findMany.mockResolvedValue([mockPost]);
      redisClient.set.mockResolvedValue('OK');
      postService.publishToPlatforms.mockRejectedValue(new Error('API quota exceeded'));
      prisma.post.update.mockResolvedValue({});

      await postSchedulerService.checkAndPublishScheduledPosts();

      expect(postService.publishToPlatforms).toHaveBeenCalledWith('post3');
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 'post3' },
        data: {
          status: POST_STATUS.FAILED,
          failureReason: 'API quota exceeded'
        }
      });
      expect(redisClient.del).toHaveBeenCalledWith('post:lock:post3');
    });
  });
});
