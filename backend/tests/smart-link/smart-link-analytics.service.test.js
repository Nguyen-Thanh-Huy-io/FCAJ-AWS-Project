const smartLinkAnalyticsService = require('../../src/services/workspace/smart-link-analytics.service');
const smartLinkRepository = require('../../src/repositories/workspace/smart-link.repository');
const linkItemRepository = require('../../src/repositories/workspace/link-item.repository');

jest.mock('../../src/repositories/workspace/smart-link.repository', () => ({
  incrementTotalClicks: jest.fn(),
  incrementPageView: jest.fn(),
  upsertDailyPageView: jest.fn()
}));

jest.mock('../../src/repositories/workspace/link-item.repository', () => ({
  findById: jest.fn(),
  incrementClicks: jest.fn(),
  upsertDailyClick: jest.fn(),
  findDailyMetricsBySmartLink: jest.fn()
}));

describe('SmartLinkAnalyticsService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SL_UT_001 - trackLinkClick (Success with metric fallback)', () => {
    it('should increment clicks and still return the link when daily metric write fails', async () => {
      const link = { id: 'link-1', smartLinkId: 'smart-1', clicks: 4 };
      linkItemRepository.findById.mockResolvedValue(link);
      linkItemRepository.incrementClicks.mockResolvedValue({ ...link, clicks: 5 });
      smartLinkRepository.incrementTotalClicks.mockResolvedValue({ id: 'smart-1' });
      linkItemRepository.upsertDailyClick.mockRejectedValue(new Error('metric store unavailable'));

      const result = await smartLinkAnalyticsService.trackLinkClick('link-1', '127.0.0.1', 'jest');

      expect(result.clicks).toBe(5);
      expect(linkItemRepository.findById).toHaveBeenCalledWith('link-1');
      expect(linkItemRepository.incrementClicks).toHaveBeenCalledWith('link-1');
      expect(smartLinkRepository.incrementTotalClicks).toHaveBeenCalledWith('smart-1');
      expect(linkItemRepository.upsertDailyClick).toHaveBeenCalledWith('link-1', 'smart-1', expect.any(Date));
    });
  });

  describe('SL_UT_002 - trackLinkClick (Missing link)', () => {
    it('should throw a 404 error when the link item does not exist', async () => {
      linkItemRepository.findById.mockResolvedValue(null);

      await expect(
        smartLinkAnalyticsService.trackLinkClick('missing-link', '127.0.0.1', 'jest')
      ).rejects.toMatchObject({
        message: 'Link Item not found',
        statusCode: 404
      });

      expect(linkItemRepository.incrementClicks).not.toHaveBeenCalled();
      expect(smartLinkRepository.incrementTotalClicks).not.toHaveBeenCalled();
      expect(linkItemRepository.upsertDailyClick).not.toHaveBeenCalled();
    });
  });
});
