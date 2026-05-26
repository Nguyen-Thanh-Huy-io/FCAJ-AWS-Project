const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const tiktokService = require('../src/services/social/tiktok');

async function main() {
  const account = await prisma.socialAccount.findFirst({
    where: { platform: 'TIKTOK' }
  });

  if (!account) {
    console.log('No TikTok account found in database to test.');
    return;
  }

  console.log(`Testing with Brand ID: ${account.brandId}, Platform Account: ${account.username}`);
  try {
    const data = await tiktokService.getPublishedVideos(account.brandId, 0, 5);
    console.log('TIKTOK PUBLISHED VIDEOS RESULT:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching published videos:', error.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
