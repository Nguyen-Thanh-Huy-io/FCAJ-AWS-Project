const prisma = require('./src/config/prisma');

async function main() {
  console.log('--- DIAGNOSTIC DB FOR YOUTUBE ---');
  
  const accounts = await prisma.socialAccount.findMany({
    where: { platform: 'YOUTUBE' },
    include: {
      youtubeChannel: true,
      analytics: {
        orderBy: { fetchedAt: 'desc' },
        take: 1,
        include: {
          socialAnalytics: true
        }
      }
    }
  });

  for (const acc of accounts) {
    console.log(`- Account ID: ${acc.id}, Platform: ${acc.platform}`);
    if (acc.analytics.length > 0) {
      const sa = acc.analytics[0].socialAnalytics;
      console.log(`  SocialAnalytics ID:`, sa?.id);
      console.log(`  audienceDemographicsJson:`, sa?.audienceDemographicsJson);
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

main().catch(err => {
  console.error(err);
  process.exit(1);
});
