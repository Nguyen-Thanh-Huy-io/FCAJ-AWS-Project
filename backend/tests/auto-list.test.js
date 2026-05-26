const { IntervalScheduleStrategy, SpecificTimesScheduleStrategy } = require('../src/utils/scheduler-strategies');
const autoListService = require('../src/services/workspace/auto-list.service');
const autoListRepository = require('../src/repositories/workspace/auto-list.repository');
const prisma = require('../src/config/prisma');

jest.mock('../src/repositories/workspace/auto-list.repository', () => ({
  findById: jest.fn()
}));

jest.mock('../src/config/prisma', () => ({
  autoList: {
    update: jest.fn()
  },
  post: {
    update: jest.fn()
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
      
      // Slot 1: Friday 22:00 + 2h = Saturday 00:00 (Saturday is NOT active day -> skipped)
      // The generator keeps adding 120 mins until Monday.
      // Saturday has 24h, Sunday has 24h.
      // Total skip from Sat 00:00 to Monday 00:00.
      // First active slot in future on Monday will be Monday 2026-05-25
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
      
      // Slot 1: Wed 18:00 (Wed 09:00 is in the past)
      expect(slots[0].toLocaleTimeString('en-US', { hour12: false })).toBe('18:00:00');
      expect(slots[0].getDay()).toBe(3); // Wednesday
      
      // Slot 2: Fri 09:00 (Friday is next active day)
      expect(slots[1].toLocaleTimeString('en-US', { hour12: false })).toBe('09:00:00');
      expect(slots[1].getDay()).toBe(5); // Friday
      
      // Slot 3: Fri 18:00
      expect(slots[2].toLocaleTimeString('en-US', { hour12: false })).toBe('18:00:00');
      expect(slots[2].getDay()).toBe(5); // Friday
    });
  });

  describe('AutoListService.recalculateQueueSchedules', () => {
    it('should retrieve unpublished posts and save calculated schedule dates', async () => {
      const mockAutoList = {
        id: 'list-123',
        name: 'Weekly Queue',
        scheduleType: 'INTERVAL',
        intervalMinutes: 60,
        activeDays: 'Mo,Tu,We,Th,Fr,Sa,Su',
        isActive: true,
        posts: [
          { id: 'post-1', status: 'PUBLISHED', scheduledAt: null },
          { id: 'post-2', status: 'DRAFT', scheduledAt: null },
          { id: 'post-3', status: 'SCHEDULED', scheduledAt: null }
        ]
      };

      autoListRepository.findById.mockResolvedValue(mockAutoList);
      prisma.autoList.update.mockResolvedValue({});
      prisma.post.update.mockResolvedValue({});

      await autoListService.recalculateQueueSchedules('list-123');

      // Should update AutoList stats: total: 3, published: 1
      expect(prisma.autoList.update).toHaveBeenCalledWith({
        where: { id: 'list-123' },
        data: { totalPostsCount: 3, publishedPostsCount: 1 }
      });

      // Should calculate dates and update 2 unpublished posts
      expect(prisma.post.update).toHaveBeenCalledTimes(2);
      expect(prisma.post.update).toHaveBeenNthCalledWith(1, {
        where: { id: 'post-2' },
        data: {
          scheduledAt: expect.any(Date),
          status: 'SCHEDULED'
        }
      });
    });
  });
});
