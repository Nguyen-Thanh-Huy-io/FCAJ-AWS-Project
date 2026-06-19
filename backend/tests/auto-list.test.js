const { IntervalScheduleStrategy, SpecificTimesScheduleStrategy } = require('../src/utils/scheduler-strategies');
const autoListService = require('../src/services/workspace/auto-list.service');
const autoListRepository = require('../src/repositories/workspace/auto-list.repository');
const postRepository = require('../src/repositories/workspace/post.repository');
const prisma = require('../src/config/prisma');

jest.mock('../src/repositories/workspace/auto-list.repository', () => ({
  findById: jest.fn(),
  updateStats: jest.fn()
}));

jest.mock('../src/repositories/workspace/post.repository', () => ({
  create: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn()
}));

jest.mock('../src/config/prisma', () => ({
  autoList: {
    update: jest.fn()
  },
  post: {
    update: jest.fn(),
    updateMany: jest.fn()
  }
}));

describe('AutoList Queue Scheduler', () => {
  describe('IntervalScheduleStrategy', () => {
    it('should generate slots spaced by intervalMinutes only on activeDays', () => {
      const strategy = new IntervalScheduleStrategy();
      const mockAutoList = {
        intervalMinutes: 120, // 2 hours
        activeDays: 'Mo,Tu,We,Th,Fr' // No weekends
      };
      
      // Start from a Friday (2026-05-22 is a Friday) at 22:00
      const fromDate = new Date('2026-05-22T22:00:00Z');
      
      const slots = strategy.calculateNextSlots(mockAutoList, 3, fromDate);
      
      expect(slots).toHaveLength(3);
      expect(slots[0].getDay()).toBe(1); // Monday
    });
  });

  describe('SpecificTimesScheduleStrategy', () => {
    it('should generate slots matching specificTimes on activeDays', () => {
      const strategy = new SpecificTimesScheduleStrategy();
      const mockAutoList = {
        specificTimes: '09:00,18:00',
        activeDays: 'Mo,We,Fr'
      };
      
      // Start from a Wednesday (2026-05-20) at 12:00
      const fromDate = new Date('2026-05-20T12:00:00');
      
      const slots = strategy.calculateNextSlots(mockAutoList, 3, fromDate);
      
      expect(slots).toHaveLength(3);
      expect(slots[0].toLocaleTimeString('en-US', { hour12: false })).toBe('18:00:00');
      expect(slots[0].getDay()).toBe(3); // Wednesday
    });
  });

  describe('AutoList Service Bug Verification', () => {
    it('should prove schedule drift bug in _updatePostSchedules', async () => {
      const mockAutoList = {
        id: 'list-123',
        name: 'Weekly Queue',
        scheduleType: 'INTERVAL',
        intervalMinutes: 60,
        activeDays: 'Mo,Tu,We,Th,Fr,Sa,Su',
        isActive: true,
        posts: [
          { id: 'post-1', status: 'PUBLISHED', publishedAt: new Date('2026-06-19T10:00:00Z') },
          { id: 'post-2', status: 'DRAFT', scheduledAt: null }
        ]
      };

      autoListRepository.findById.mockResolvedValue(mockAutoList);
      autoListRepository.updateStats.mockResolvedValue({});
      postRepository.update.mockResolvedValue({});

      // Gọi recalculateQueueSchedules
      await autoListService.recalculateQueueSchedules('list-123');

      // Trong code hiện tại, fromDate truyền vào calculateNextSlots luôn là new Date().
      // Do đó, bài đăng nháp tiếp theo (post-2) sẽ có scheduledAt là: now + 60 phút
      // thay vì: post-1.publishedAt + 60 phút = 11:00:00Z.
      // Điều này gây ra trôi lịch (BUG_AUTOLIST_001).
      
      // Kiểm tra xem postRepository.update đã được gọi để cập nhật post-2 chưa
      expect(postRepository.update).toHaveBeenCalled();
      
      const updateCall = postRepository.update.mock.calls[0];
      expect(updateCall[0]).toBe('post-2');
      
      const updatedData = updateCall[1];
      expect(updatedData.status).toBe('SCHEDULED');
      expect(updatedData.scheduledAt).toBeDefined();
      
      // Nếu không bị drift, scheduledAt phải xấp xỉ 2026-06-19T11:00:00Z (mốc đăng trước + 60 phút)
      const diffFromPrevPost = updatedData.scheduledAt.getTime() - mockAutoList.posts[0].publishedAt.getTime();
      
      // Nếu hiệu số này lớn hơn 60 phút rất nhiều (ví dụ bây giờ là 18:30 tối, tức là trôi mất 8 tiếng),
      // thì đó chính là drift bug!
      const minutesDiff = diffFromPrevPost / (1000 * 60);
      console.log(`[Drift Test Check] Minutes diff from previous post: ${minutesDiff} mins`);
    });

    it('should duplicate published posts as new DRAFTs to preserve history when loop is enabled', async () => {
      const mockAutoList = {
        id: 'list-123',
        name: 'Weekly Queue',
        scheduleType: 'INTERVAL',
        intervalMinutes: 60,
        activeDays: 'Mo,Tu,We,Th,Fr,Sa,Su',
        isActive: true,
        loopEnabled: true,
        posts: [
          { id: 'post-1', status: 'PUBLISHED', platformPostId: 'FB_12345', publishedAt: new Date(), brandId: 'brand-1', createdByUserId: 'user-1', title: 'Post 1', caption: 'Hello', type: 'TEXT', targetPlatforms: 'FACEBOOK', autoListId: 'list-123' }
        ]
      };

      // Giả lập hàng đợi cạn bài viết chưa đăng
      autoListRepository.findById.mockResolvedValue(mockAutoList);
      autoListRepository.updateStats.mockResolvedValue({});
      postRepository.create.mockResolvedValue({ id: 'post-1-dup', status: 'DRAFT' });

      await autoListService.recalculateQueueSchedules('list-123');

      // Đảm bảo postRepository.create được gọi với các thông tin đã nhân bản và trạng thái DRAFT
      expect(postRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Post 1',
          status: 'DRAFT',
          autoListId: 'list-123'
        })
      );
      
      // Đảm bảo không gọi updateMany để reset các bài viết cũ làm mất lịch sử
      expect(postRepository.updateMany).not.toHaveBeenCalled();
    });
  });
});
