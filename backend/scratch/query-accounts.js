const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const analytics = await prisma.socialAnalytics.findMany({
    where: {
      analytics: {
        socialAccount: {
          platform: 'FACEBOOK'
        }
      }
    },
    include: {
      analytics: {
        include: {
          socialAccount: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 1
  });
  
  if (analytics.length === 0) {
    console.log('No Facebook analytics records found.');
  } else {
    const record = analytics[0];
    const rawData = JSON.parse(record.audienceDemographicsJson);
    console.log('Total days in growth array:', rawData.growth.length);
    const nonZeroDays = rawData.growth.filter(d => d.views > 0 || d.reactions > 0);
    console.log('Number of days with views/reactions > 0:', nonZeroDays.length);
    console.log('Non-zero days:', nonZeroDays);
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
