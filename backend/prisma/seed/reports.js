/**
 * Seed Reports - Idempotent
 *
 * Report không có unique constraint ngoài id.
 * Dùng id cố định để upsert an toàn.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Reports...');
  const { customerUser, testUser } = context.users;
  const { brand1, testBrand } = context.brands;

  async function upsertReport({ id, data }) {
    return prisma.report.upsert({
      where: { id },
      update: data,
      create: { id, ...data }
    });
  }

  await upsertReport({
    id: 'report_social_q2',
    data: {
      brandId: brand1.id, createdByUserId: customerUser.id,
      title: 'Báo cáo hiệu quả Social Media Q2',
      description: 'Đánh giá chỉ số tương tác và phát triển thương hiệu trên các kênh Social.',
      dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), dateTo: new Date(),
      includedPlatforms: 'FACEBOOK,INSTAGRAM,YOUTUBE', includedSections: 'OVERVIEW,AUDIENCE,POSTS',
      format: 'PDF', isWhiteLabel: true, brandColorHex: '#4F46E5', createdAt: new Date()
    }
  });

  await upsertReport({
    id: 'report_test_weekly',
    data: {
      brandId: testBrand.id, createdByUserId: testUser.id,
      title: 'Báo cáo tuần - Trong Phuc Brand',
      description: 'Thống kê tương tác định kỳ mỗi tuần.',
      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), dateTo: new Date(),
      includedPlatforms: 'FACEBOOK', includedSections: 'OVERVIEW,POSTS',
      format: 'PDF', createdAt: new Date()
    }
  });
};
