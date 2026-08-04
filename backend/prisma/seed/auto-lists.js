/**
 * Seed AutoLists - Idempotent
 *
 * AutoList không có unique constraint ngoài id.
 * Dùng id cố định để upsert an toàn.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding AutoLists...');
  const { brand1, testBrand } = context.brands;

  async function upsertAutoList({ id, data }) {
    return prisma.autoList.upsert({
      where: { id },
      update: data,
      create: { id, ...data }
    });
  }

  await upsertAutoList({
    id: 'autolist_tuyen_dung',
    data: {
      brandId: brand1.id, name: 'Danh sách bài đăng tuyển dụng',
      sourceType: 'MANUAL', targetPlatforms: 'LINKEDIN,FACEBOOK',
      scheduleType: 'INTERVAL', intervalMinutes: 120, activeDays: 'MON,WED,FRI',
      isActive: true, loopEnabled: true
    }
  });

  await upsertAutoList({
    id: 'autolist_rss_news',
    data: {
      brandId: brand1.id, name: 'RSS News Feed',
      sourceType: 'RSS_FEED', rssUrl: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
      targetPlatforms: 'FACEBOOK,TELEGRAM', scheduleType: 'SPECIFIC_TIMES',
      specificTimes: '09:00,15:00,21:00', activeDays: 'MON,TUE,WED,THU,FRI,SAT,SUN',
      isActive: true
    }
  });

  const testAutoList = await upsertAutoList({
    id: 'autolist_test_tech',
    data: {
      brandId: testBrand.id, name: 'Hàng đợi bài viết kỹ thuật công nghệ',
      sourceType: 'MANUAL', targetPlatforms: 'FACEBOOK,LINKEDIN',
      scheduleType: 'INTERVAL', intervalMinutes: 180, activeDays: 'MON,TUE,WED,THU,FRI',
      isActive: true, loopEnabled: false
    }
  });

  context.autoLists = { testAutoList };
};
