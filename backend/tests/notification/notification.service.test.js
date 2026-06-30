const notificationService = require('../../src/services/core/notification.service');
const notificationRepository = require('../../src/repositories/core/notification.repository');
const brandRepository = require('../../src/repositories/workspace/brand.repository');

jest.mock('../../src/repositories/core/notification.repository', () => ({
  create: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  findManyAndCount: jest.fn(),
  count: jest.fn()
}));

jest.mock('../../src/repositories/workspace/brand.repository', () => ({
  userCanAccessBrand: jest.fn()
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('markAsRead', () => {
    it('scopes update by notification id and authenticated user', async () => {
      notificationRepository.markAsRead.mockResolvedValue({ count: 1 });

      await notificationService.markAsRead('notif-1', 'user-1', null, 'USER');

      expect(notificationRepository.markAsRead).toHaveBeenCalledWith({
        id: 'notif-1',
        OR: [
          { userId: 'user-1' },
          { isGlobal: true }
        ]
      }, 'user-1');
    });

    it('checks brand access before marking brand notifications as read', async () => {
      brandRepository.userCanAccessBrand.mockResolvedValue(true);
      notificationRepository.markAsRead.mockResolvedValue({ count: 1 });

      await notificationService.markAsRead('notif-1', 'user-1', 'brand-1', 'USER');

      expect(brandRepository.userCanAccessBrand).toHaveBeenCalledWith('user-1', 'brand-1');
      expect(notificationRepository.markAsRead).toHaveBeenCalledWith({
        id: 'notif-1',
        OR: [
          { userId: 'user-1' },
          { brandId: 'brand-1' },
          { isGlobal: true }
        ]
      }, 'user-1');
    });

    it('rejects brand notification access when user is not a brand member', async () => {
      brandRepository.userCanAccessBrand.mockResolvedValue(false);

      await expect(notificationService.markAsRead('notif-1', 'user-1', 'brand-1', 'USER'))
        .rejects.toThrow('Access denied for this brand');

      expect(notificationRepository.markAsRead).not.toHaveBeenCalled();
    });

    it('returns not found when scoped update does not match any notification', async () => {
      notificationRepository.markAsRead.mockResolvedValue({ count: 0 });

      await expect(notificationService.markAsRead('missing-id', 'user-1', null, 'USER'))
        .rejects.toThrow('Notification not found or access denied');
    });
  });

  describe('create', () => {
    it('creates and formats a valid notification', async () => {
      notificationRepository.create.mockResolvedValue({
        id: 'notif-1',
        userId: 'user-1',
        brandId: null,
        title: 'Post published',
        message: 'Your post was published successfully',
        type: 'content',
        isRead: false,
        isGlobal: false,
        actionUrl: '/planner',
        createdAt: new Date(),
        readReceipts: []
      });

      const result = await notificationService.create({
        userId: 'user-1',
        title: ' Post published ',
        message: ' Your post was published successfully ',
        type: 'content',
        actionUrl: '/planner'
      });

      expect(notificationRepository.create).toHaveBeenCalledWith({
        userId: 'user-1',
        brandId: null,
        title: 'Post published',
        message: 'Your post was published successfully',
        type: 'content',
        isGlobal: false,
        actionUrl: '/planner'
      });
      expect(result).toMatchObject({
        id: 'notif-1',
        title: 'Post published',
        desc: 'Your post was published successfully',
        category: 'content'
      });
    });

    it('allows only admin users to create global notifications via actor context', async () => {
      await expect(notificationService.create({
        title: 'System maintenance',
        message: 'Maintenance tonight',
        isGlobal: true
      }, { userId: 'owner-1', role: 'OWNER' })).rejects.toThrow('Only admin can create global notifications');

      expect(notificationRepository.create).not.toHaveBeenCalled();
    });

    it('requires non-admin users to create only brand-scoped notifications', async () => {
      await expect(notificationService.create({
        userId: 'user-2',
        title: 'Direct notice',
        message: 'Owner should not create direct user-only notification'
      }, { userId: 'owner-1', role: 'OWNER' })).rejects.toThrow('Non-admin users can only create brand-scoped notifications');

      expect(notificationRepository.create).not.toHaveBeenCalled();
    });

    it('checks brand access for non-admin notification creation', async () => {
      brandRepository.userCanAccessBrand.mockResolvedValue(false);

      await expect(notificationService.create({
        brandId: 'brand-1',
        title: 'Brand notice',
        message: 'Only brand members can create this'
      }, { userId: 'owner-1', role: 'OWNER' })).rejects.toThrow('Access denied for this brand');

      expect(notificationRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getNotifications', () => {
    it('filters unread notifications using read receipts for the current user', async () => {
      notificationRepository.findManyAndCount.mockResolvedValue({
        notifications: [],
        total: 0
      });
      notificationRepository.count.mockResolvedValue(0);

      await notificationService.getNotifications({ isRead: 'false' }, 'user-1', null, 'USER');

      expect(notificationRepository.findManyAndCount).toHaveBeenCalledWith({
        AND: [
          {
            OR: [
              { userId: 'user-1' },
              { isGlobal: true }
            ]
          },
          { isRead: false },
          { readReceipts: { none: { userId: 'user-1' } } }
        ]
      }, { skip: 0, take: 50 }, 'user-1');
    });

    it('formats a notification as read when the current user has a read receipt', async () => {
      const createdAt = new Date();
      notificationRepository.findManyAndCount.mockResolvedValue({
        notifications: [{
          id: 'notif-1',
          title: 'Brand notice',
          message: 'Visible to brand',
          type: 'system',
          isRead: false,
          actionUrl: null,
          createdAt,
          readReceipts: [{ id: 'receipt-1', readAt: createdAt }]
        }],
        total: 1
      });
      notificationRepository.count.mockResolvedValue(0);

      const result = await notificationService.getNotifications({}, 'user-1', null, 'USER');

      expect(result.data[0].isRead).toBe(true);
    });
  });
});
