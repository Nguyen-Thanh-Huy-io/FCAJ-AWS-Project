jest.mock('../src/config/prisma', () => {
  const mockBrand = { findFirst: jest.fn() };
  const mockSocialAccount = { findFirst: jest.fn(), update: jest.fn() };
  const mockAnalytics = { updateMany: jest.fn() };
  const mockTransaction = jest.fn((callback) => callback({
    brand: mockBrand,
    socialAccount: mockSocialAccount,
    analytics: mockAnalytics,
    $transaction: mockTransaction
  }));
  return {
    brand: mockBrand,
    socialAccount: mockSocialAccount,
    analytics: mockAnalytics,
    $transaction: mockTransaction
  };
});

const prisma = require('../src/config/prisma');
const { ConnectionConflictGuard, ConnectionConflictError } = require('../src/services/social/connection-conflict.guard');

describe('ConnectionConflictGuard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateConflict', () => {
    it('should return no conflict if brand has no active social connection for channel', async () => {
      prisma.brand.findFirst.mockResolvedValue({ id: 'brand1', ownerId: 'user1' });
      prisma.socialAccount.findFirst.mockResolvedValue(null);

      const result = await ConnectionConflictGuard.validateConflict('brand1', 'YOUTUBE', 'channel123');

      expect(result.conflict).toBe(false);
      expect(prisma.brand.findFirst).toHaveBeenCalledWith({
        where: { id: 'brand1', deletedAt: null }
      });
      expect(prisma.socialAccount.findFirst).toHaveBeenCalledWith({
        where: {
          platform: 'YOUTUBE',
          platformAccountId: 'channel123',
          isConnected: true
        },
        include: {
          brand: true
        }
      });
    });

    it('should return no conflict if the connection belongs to the target brand itself (reconnect case)', async () => {
      prisma.brand.findFirst.mockResolvedValue({ id: 'brand1', ownerId: 'user1' });
      prisma.socialAccount.findFirst.mockResolvedValue({
        id: 'sa1',
        brandId: 'brand1',
        brand: { id: 'brand1', ownerId: 'user1' }
      });

      const result = await ConnectionConflictGuard.validateConflict('brand1', 'YOUTUBE', 'channel123');

      expect(result.conflict).toBe(false);
    });

    it('should return SAME_OWNER conflict if the channel belongs to another brand owned by the same user', async () => {
      prisma.brand.findFirst.mockResolvedValue({ id: 'brand1', ownerId: 'user1' });
      prisma.socialAccount.findFirst.mockResolvedValue({
        id: 'sa1',
        brandId: 'brand2',
        brand: { id: 'brand2', ownerId: 'user1', name: 'Brand 2' }
      });

      const result = await ConnectionConflictGuard.validateConflict('brand1', 'YOUTUBE', 'channel123');

      expect(result.conflict).toBe(true);
      expect(result.type).toBe('SAME_OWNER');
      expect(result.existingAccount.brand.name).toBe('Brand 2');
    });

    it('should return DIFFERENT_OWNER conflict if the channel belongs to a brand owned by a different user', async () => {
      prisma.brand.findFirst.mockResolvedValue({ id: 'brand1', ownerId: 'user1' });
      prisma.socialAccount.findFirst.mockResolvedValue({
        id: 'sa1',
        brandId: 'brand3',
        brand: { id: 'brand3', ownerId: 'user2', name: 'Brand 3' }
      });

      const result = await ConnectionConflictGuard.validateConflict('brand1', 'YOUTUBE', 'channel123');

      expect(result.conflict).toBe(true);
      expect(result.type).toBe('DIFFERENT_OWNER');
    });

    it('should throw an error if target brand is not found', async () => {
      prisma.brand.findFirst.mockResolvedValue(null);

      await expect(
        ConnectionConflictGuard.validateConflict('brand1', 'YOUTUBE', 'channel123')
      ).rejects.toThrow('Target brand not found or has been deleted');
    });
  });

  describe('reassignAccount', () => {
    it('should update social account and analytics brandId inside a transaction', async () => {
      const mockTargetBrand = { id: 'brand2', ownerId: 'user1' };
      const mockExistingAccount = {
        id: 'sa1',
        brandId: 'brand1',
        brand: { id: 'brand1', ownerId: 'user1' }
      };

      prisma.brand.findFirst.mockResolvedValue(mockTargetBrand);
      prisma.socialAccount.findFirst.mockResolvedValue(mockExistingAccount);
      prisma.socialAccount.update.mockResolvedValue({});
      prisma.analytics.updateMany.mockResolvedValue({});

      await ConnectionConflictGuard.reassignAccount('YOUTUBE', 'channel123', 'brand2');

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.socialAccount.update).toHaveBeenCalledWith({
        where: { id: 'sa1' },
        data: {
          brandId: 'brand2',
          updatedAt: expect.any(Date)
        }
      });
      expect(prisma.analytics.updateMany).toHaveBeenCalledWith({
        where: { socialAccountId: 'sa1' },
        data: {
          brandId: 'brand2'
        }
      });
    });

    it('should throw an error if target brand owner does not match existing account brand owner', async () => {
      const mockTargetBrand = { id: 'brand2', ownerId: 'user1' };
      const mockExistingAccount = {
        id: 'sa1',
        brandId: 'brand3',
        brand: { id: 'brand3', ownerId: 'user2' }
      };

      prisma.brand.findFirst.mockResolvedValue(mockTargetBrand);
      prisma.socialAccount.findFirst.mockResolvedValue(mockExistingAccount);

      await expect(
        ConnectionConflictGuard.reassignAccount('YOUTUBE', 'channel123', 'brand2')
      ).rejects.toThrow('Unauthorized reassignment: Brands belong to different owners');
    });
  });
});
