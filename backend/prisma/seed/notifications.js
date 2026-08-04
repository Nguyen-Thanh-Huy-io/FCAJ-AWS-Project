/**
 * Seed Notifications - Idempotent
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Notifications...');
  const { testUser } = context.users;
  const { testBrand } = context.brands;

  for (let i = 0; i < 10; i++) {
    const category = ['stream', 'content', 'team', 'platform', 'system'][i % 5];
    const isGlobal = i === 9;
    const daysAgo = Math.floor(i / 2);
    const notificationId = `noti_test_${i}`;

    const createdNotification = await prisma.systemNotification.upsert({
      where: { id: notificationId },
      update: {
        title: `Thông báo thử nghiệm #${i + 1} (${category})`,
        message: `Nội dung chi tiết của thông báo thử nghiệm hệ thống #${i + 1}.`,
        type: category,
        brandId: isGlobal ? null : testBrand.id, userId: isGlobal ? null : testUser.id, isGlobal
      },
      create: {
        id: notificationId,
        title: `Thông báo thử nghiệm #${i + 1} (${category})`,
        message: `Nội dung chi tiết của thông báo thử nghiệm hệ thống #${i + 1}.`,
        type: category,
        brandId: isGlobal ? null : testBrand.id, userId: isGlobal ? null : testUser.id, isGlobal,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * daysAgo)
      }
    });

    if (i % 2 === 0) {
      await prisma.notificationReadReceipt.upsert({
        where: { notificationId_userId: { notificationId: createdNotification.id, userId: testUser.id } },
        update: { readAt: new Date() },
        create: { notificationId: createdNotification.id, userId: testUser.id, readAt: new Date() }
      });
    }
  }
};
