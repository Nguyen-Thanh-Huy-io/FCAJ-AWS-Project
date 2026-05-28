const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const account = await prisma.socialAccount.findFirst({
    where: { platform: 'FACEBOOK', platformAccountId: '1167642223093040' }
  });
  
  if (!account) {
    console.error('Account not found');
    process.exit(1);
  }

  const pageId = account.platformAccountId;
  const pageAccessToken = account.accessToken;
  const since = Math.floor(new Date('2026-05-06T00:00:00Z').getTime() / 1000);
  const until = Math.floor(new Date('2026-05-12T00:00:00Z').getTime() / 1000);

  const metrics = [
    'page_views_total',
    'page_impressions_unique',
    'page_daily_follows_unique',
    'page_post_engagements'
  ];

  console.log(`Querying Facebook insights for page ${pageId} from 2026-05-06 to 2026-05-12...`);
  
  const url = `https://graph.facebook.com/v25.0/${pageId}/insights?metric=${metrics.join(',')}&period=day&since=${since}&until=${until}&access_token=${pageAccessToken}`;
  
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error('API Error:', data.error);
  } else {
    console.log('API Result:');
    (data.data || []).forEach(item => {
      console.log(`\nMetric: ${item.name} (${item.title})`);
      item.values.forEach(val => {
        // Adjust timezone to match local date
        const d = new Date(val.end_time);
        d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
        const dateStr = d.toISOString().split('T')[0];
        console.log(`  Date: ${dateStr} (end_time: ${val.end_time}) -> Value: ${val.value}`);
      });
    });
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
