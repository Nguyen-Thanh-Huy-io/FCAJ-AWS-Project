const youtubeService = require('../src/services/youtube.service');
const googleOAuthService = require('../src/services/google-oauth.service');
const socialAccountRepository = require('../src/repositories/social-account.repository');
const { google } = require('googleapis');

jest.mock('googleapis');
jest.mock('../src/services/google-oauth.service');
jest.mock('../src/repositories/social-account.repository');

describe('YouTubeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getChannelInfo', () => {
    it('should fetch channel info correctly', async () => {
      const mockChannel = {
        id: 'UC123',
        snippet: {
          title: 'Test Channel',
          customUrl: '@test',
          thumbnails: { default: { url: 'http://pic.jpg' } },
          country: 'VN',
          defaultLanguage: 'vi'
        },
        statistics: {
          subscriberCount: '1000',
          videoCount: '50',
          viewCount: '5000'
        }
      };

      const mockList = jest.fn().mockResolvedValue({
        data: { items: [mockChannel] }
      });

      google.youtube.mockReturnValue({
        channels: { list: mockList }
      });

      const result = await youtubeService.getChannelInfo({});

      expect(result.channelId).toBe('UC123');
      expect(result.displayName).toBe('Test Channel');
      expect(result.statistics.subscriberCount).toBe('1000');
    });

    it('should throw error if no channel found', async () => {
      google.youtube.mockReturnValue({
        channels: {
          list: jest.fn().mockResolvedValue({ data: { items: [] } })
        }
      });

      await expect(youtubeService.getChannelInfo({})).rejects.toThrow('No YouTube channel found for this account');
    });
  });

  describe('connectChannel', () => {
    it('should exchange code and upsert account', async () => {
      const mockTokens = { access_token: 'abc', refresh_token: 'def' };
      const mockChannelData = { channelId: 'UC123', statistics: {}, snippet: {} };
      
      googleOAuthService.getTokens.mockResolvedValue(mockTokens);
      googleOAuthService.getClient.mockReturnValue({});
      
      const getChannelInfoSpy = jest.spyOn(youtubeService, 'getChannelInfo').mockResolvedValue(mockChannelData);
      socialAccountRepository.upsertYouTubeAccount.mockResolvedValue({ id: 'sa1' });

      const result = await youtubeService.connectChannel('brand1', 'code123');

      expect(googleOAuthService.getTokens).toHaveBeenCalledWith('code123');
      expect(socialAccountRepository.upsertYouTubeAccount).toHaveBeenCalledWith('brand1', mockChannelData, mockTokens);
      expect(result.id).toBe('sa1');
      
      getChannelInfoSpy.mockRestore();
    });
  });
});
