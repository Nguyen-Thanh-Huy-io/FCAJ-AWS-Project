const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const socialService = require('../src/services/social/social.service');

async function main() {
  const brandId = '7a3999f9-e8c4-4a0e-bfb1-078dc04fe74e';
  const accounts = await prisma.socialAccount.findMany({
    where: { brandId }
  });
  console.log('CONNECTED ACCOUNTS:', accounts.map(a => ({ id: a.id, platform: a.platform, username: a.username })));

  const result = await socialService.getAggregatedMetrics(brandId, '2026-02-01', '2026-05-26');
  console.log('AGGREGATED METRICS PLATFORMS:', result.map(r => r.platform));
  const tiktokResult = result.find(r => r.platform === 'TIKTOK');
  if (tiktokResult) {
    console.log('TIKTOK RESULT KEYS:', Object.keys(tiktokResult));
    console.log('TIKTOK RESULT ANALYTICS LENGTH:', tiktokResult.analytics?.length);
    if (tiktokResult.analytics?.length > 0) {
      console.log('TIKTOK RESULT ANALYTICS[0] keys:', Object.keys(tiktokResult.analytics[0]));
      console.log('TIKTOK RESULT ANALYTICS[0] socialAnalytics exists:', !!tiktokResult.analytics[0].socialAnalytics);
      const socialAnalyticsObj = tiktokResult.analytics[0].socialAnalytics;
      if (socialAnalyticsObj) {
        console.log('AUDIENCE DEMOGRAPHICS JSON PREVIEW:', socialAnalyticsObj.audienceDemographicsJson?.slice(0, 1000));
      }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
