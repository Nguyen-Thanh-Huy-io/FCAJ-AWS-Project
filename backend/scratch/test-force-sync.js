const socialService = require('../src/services/social/social.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brandId = '665783e4-f300-4fdd-892f-96e60176358e';
  
  console.log(`Starting force sync for brand ${brandId}...`);
  const startDate = '2026-05-14';
  const endDate = '2026-06-13';

  // Force sync
  const results = await socialService.getAggregatedMetrics(brandId, startDate, endDate, true);
  console.log('Force sync returned results. Count:', results.length);
  
  // Query DB to see what is stored in socialAnalytics
  const fbAccount = results.find(r => r.platform === 'FACEBOOK');
  if (fbAccount) {
    console.log('Facebook Account display name:', fbAccount.displayName);
    const dbAnalytics = await prisma.socialAnalytics.findFirst({
      where: {
        analytics: {
          socialAccountId: fbAccount.id
        }
      },
      orderBy: {
        analytics: {
          fetchedAt: 'desc'
        }
      }
    });

    if (dbAnalytics) {
      console.log('Saved Facebook analytics in DB:');
      console.log(`- Followers Total: ${dbAnalytics.followersTotal}`);
      console.log(`- Impressions: ${dbAnalytics.impressions}`);
      console.log(`- Reach: ${dbAnalytics.reach}`);
      const raw = JSON.parse(dbAnalytics.audienceDemographicsJson);
      console.log('- Summary in JSON:', raw.summary);
    } else {
      console.log('No analytics found in DB for this Facebook account.');
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
