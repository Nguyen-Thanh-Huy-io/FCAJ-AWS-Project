const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const smartLinkId = '2f491119-3436-4ad6-9f38-c81df916089b';
  const sl = await prisma.smartLink.findUnique({
    where: { id: smartLinkId }
  });
  console.log("SmartLink total clicks:", sl.totalClicks);
  console.log("SmartLink unique visitors:", sl.uniqueVisitors);

  const daily = await prisma.smartLinkDailyMetric.findMany({
    where: { smartLinkId }
  });
  console.log("Daily Metrics:", daily.map(d => ({ date: d.date.toISOString().slice(0,10), pageViews: d.pageViews, unique: d.uniqueVisitors })));

  const linkItems = await prisma.linkItem.findMany({
    where: { smartLinkId }
  });
  console.log("LinkItems:");
  for (const item of linkItems) {
    const itemDaily = await prisma.linkItemDailyMetric.findMany({
      where: { linkItemId: item.id }
    });
    console.log(`- Item ${item.title} (ID: ${item.id}): clicks=${item.clicks || 0}, daily clicks=${itemDaily.map(d => `${d.date.toISOString().slice(0,10)}:${d.clicks}`).join(', ')}`);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
