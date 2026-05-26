const tiktokService = require('../src/services/social/tiktok');
const { PLATFORMS } = require('../src/utils/constants');

// Manual mock socialAccountRepository
const socialAccountRepository = require('../src/repositories/social/social-account.repository');

async function test() {
  const brandId = 'test-brand';
  const socialAccountId = 'test-account';
  
  const mockAccount = {
    id: socialAccountId,
    brandId,
    platform: PLATFORMS.TIKTOK,
    platformAccountId: 'tiktok-user-123',
    username: 'testuser',
    displayName: 'Test User',
    profilePictureUrl: 'http://pic.jpg',
    accessToken: 'access',
    refreshToken: 'refresh',
    tikTokAccount: {
      followersCount: 100,
      followingCount: 50,
      likesCount: 500,
      videoCount: 10
    }
  };

  // Override repository methods for testing
  socialAccountRepository.findById = async () => mockAccount;
  socialAccountRepository.upsertTikTokAccount = async (b, data, t) => {
    console.log('Upserting TikTok Account with data summary:');
    console.log('- Followers:', data.followersCount);
    console.log('- Analytics Summary:', JSON.stringify(data.analytics.summary, null, 2));
    console.log('- Sample growth data (first entry):', JSON.stringify(data.analytics.growth[0], null, 2));
    return { id: socialAccountId };
  };

  console.log('Testing TikTok syncChannelMetrics...');
  const result = await tiktokService.syncChannelMetrics(socialAccountId, '2026-05-01', '2026-05-26');
  console.log('Result:', result);
}

test().catch(console.error);
