/**
 * Seed Livestreams - Idempotent
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Livestreams...');
  const { testUser } = context.users;
  const { testBrand } = context.brands;

  await prisma.livestream.upsert({
    where: { id: 'livestream_test_1' },
    update: {
      title: 'Livestream hỏi đáp giải pháp PubliCast',
      description: 'Buổi giao lưu trực tiếp giải đáp mọi thắc mắc của người dùng về việc tự động hóa kế hoạch bài đăng.',
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), durationMinutes: 60,
      status: 'SCHEDULED', streamKey: 'live_test_key_123', rtmpUrl: 'rtmp://live.publicast.com/app',
      targetPlatforms: 'YOUTUBE,FACEBOOK', streamQuality: 'HD_720P'
    },
    create: {
      id: 'livestream_test_1', brandId: testBrand.id, createdByUserId: testUser.id,
      title: 'Livestream hỏi đáp giải pháp PubliCast',
      description: 'Buổi giao lưu trực tiếp giải đáp mọi thắc mắc của người dùng về việc tự động hóa kế hoạch bài đăng.',
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), durationMinutes: 60,
      status: 'SCHEDULED', streamKey: 'live_test_key_123', rtmpUrl: 'rtmp://live.publicast.com/app',
      targetPlatforms: 'YOUTUBE,FACEBOOK', streamQuality: 'HD_720P'
    }
  });
};
