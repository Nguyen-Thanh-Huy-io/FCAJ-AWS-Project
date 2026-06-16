const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const socialService = require('../src/services/social/social.service');
const facebookService = require('../src/services/social/facebook');
const youtubeService = require('../src/services/social/youtube');
const tiktokService = require('../src/services/social/tiktok');

async function main() {
  console.log('Finding user and brand...');
  const user = await prisma.user.findUnique({
    where: { email: 'vothanhnha26@gmail.com' }
  });
  if (!user) {
    console.error('User vothanhnha26@gmail.com not found.');
    process.exit(1);
  }

  const brand = await prisma.brand.findFirst({
    where: { ownerId: user.id }
  });
  if (!brand) {
    console.error('Brand not found for user.');
    process.exit(1);
  }

  console.log(`Testing with Brand ID: ${brand.id}`);
  
  // 1. Check connected accounts
  const accounts = await prisma.socialAccount.findMany({
    where: { brandId: brand.id }
  });
  console.log('Connected Social Accounts:', accounts.map(a => ({ id: a.id, platform: a.platform, username: a.username, token: a.accessToken })));

  // 2. Test Aggregated Metrics Sync (Facebook/Tiktok/Youtube)
  console.log('\n--- Syncing Aggregated Metrics ---');
  const syncResult = await socialService.getAggregatedMetrics(brand.id, '2026-05-14', '2026-06-13', true);
  console.log('Sync Result Platforms:', syncResult.map(r => ({ platform: r.platform, displayName: r.displayName })));
  
  // 3. Test Facebook Published Posts
  console.log('\n--- Facebook Published Posts ---');
  try {
    const fbPosts = await facebookService.getPublishedVideos(brand.id, null, 5);
    console.log(`Facebook Posts Count: ${fbPosts.data?.length || 0}`);
    if (fbPosts.data?.length > 0) {
      console.log('Sample FB Post:', fbPosts.data[0]);
    }
  } catch (err) {
    console.error('Error fetching Facebook posts:', err.message);
  }

  // 4. Test YouTube Published Videos
  console.log('\n--- YouTube Published Videos ---');
  try {
    // Ensure a mock youtube account exists for this test
    let ytAccount = await prisma.socialAccount.findFirst({
      where: { brandId: brand.id, platform: 'YOUTUBE' }
    });
    if (!ytAccount) {
      ytAccount = await prisma.socialAccount.create({
        data: {
          brandId: brand.id,
          platform: 'YOUTUBE',
          platformAccountId: 'yt-channel-123',
          username: 'publicast_yt',
          displayName: 'PubliCast Team YouTube',
          accessToken: 'mock-access-token-yt',
          scopes: 'youtube.readonly',
          connectedAt: new Date()
        }
      });
      console.log('Created mock YouTube account for test.');
    }
    
    const ytVideos = await youtubeService.getPublishedVideos(brand.id, null, 5);
    console.log(`YouTube Videos Count: ${ytVideos.videos?.length || 0}`);
    if (ytVideos.videos?.length > 0) {
      console.log('Sample YouTube Video:', ytVideos.videos[0]);
    }
  } catch (err) {
    console.error('Error fetching YouTube videos:', err.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
